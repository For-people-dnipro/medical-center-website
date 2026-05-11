type ContactPayload = {
  name?: unknown;
  phone?: unknown;
  email?: unknown;
  branch?: unknown;
  diagnostic?: unknown;
  checkupName?: unknown;
  message?: unknown;
  formType?: unknown;
  details?: unknown;
  consent?: unknown;
  company?: unknown;
  turnstileToken?: unknown;
};

const RESEND_API_URL = 'https://api.resend.com/emails';
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 5;
const requestBuckets = new Map<string, number[]>();

function toText(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function isTrue(value: unknown) {
  return value === true || value === 'true' || value === 1 || value === '1';
}

function getClientIp(ctx: any) {
  const forwardedFor = toText(ctx.request.headers['x-forwarded-for']);
  if (forwardedFor) {
    return forwardedFor.split(',')[0]?.trim() || 'unknown';
  }

  return (
    toText(ctx.request.ip) ||
    toText(ctx.req?.socket?.remoteAddress) ||
    'unknown'
  );
}

function consumeRateLimit(key: string) {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;
  const recentRequests = (requestBuckets.get(key) || []).filter(
    (timestamp) => timestamp >= windowStart,
  );

  if (recentRequests.length >= MAX_REQUESTS_PER_WINDOW) {
    requestBuckets.set(key, recentRequests);
    return false;
  }

  recentRequests.push(now);
  requestBuckets.set(key, recentRequests);
  return true;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function buildEmailHtml(payload: ContactPayload) {
  const lines = [
    ['Форма', toText(payload.formType)],
    ['Імʼя', toText(payload.name)],
    ['Телефон', toText(payload.phone)],
    ['Email', toText(payload.email)],
    ['Філія', toText(payload.branch)],
    ['Діагностика', toText(payload.diagnostic)],
    ['Назва CHECK-UP', toText(payload.checkupName)],
    ['Повідомлення', toText(payload.message)],
  ].filter(([, value]) => Boolean(value));

  const rows = lines
    .map(
      ([label, value]) =>
        `<tr><td style="padding:8px 12px;border:1px solid #d9e2ec;font-weight:600;">${escapeHtml(
          label,
        )}</td><td style="padding:8px 12px;border:1px solid #d9e2ec;">${escapeHtml(
          value,
        )}</td></tr>`,
    )
    .join('');

  return `<!doctype html>
<html lang="uk">
  <body style="margin:0;padding:24px;background:#f5f7fa;color:#102a43;font-family:Arial,sans-serif;">
    <div style="max-width:720px;margin:0 auto;background:#ffffff;border-radius:12px;padding:24px;">
      <h1 style="margin:0 0 20px;font-size:24px;">Нова заявка з сайту</h1>
      <table style="width:100%;border-collapse:collapse;border-spacing:0;">${rows}</table>
      <p style="margin:20px 0 0;color:#486581;font-size:14px;white-space:pre-line;">${escapeHtml(
        toText(payload.details),
      )}</p>
    </div>
  </body>
</html>`;
}

function validatePayload(payload: ContactPayload) {
  const errors: string[] = [];
  const formType = toText(payload.formType);
  const name = toText(payload.name);
  const phone = toText(payload.phone);
  const message = toText(payload.message);
  const email = toText(payload.email);
  const branch = toText(payload.branch);
  const diagnostic = toText(payload.diagnostic);
  const checkupName = toText(payload.checkupName);
  const consent = isTrue(payload.consent);

  if (!formType) errors.push('formType is required');
  if (!name) errors.push('name is required');
  if (!phone) errors.push('phone is required');
  if (!message) errors.push('message is required');
  if (!branch) errors.push('branch is required');
  if (!consent) errors.push('consent is required');

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('email is invalid');
  }

  if (diagnostic && diagnostic.length > 200) {
    errors.push('diagnostic is too long');
  }

  if (checkupName && checkupName.length > 200) {
    errors.push('checkupName is too long');
  }

  if (name.length > 120 || phone.length > 40 || message.length > 5000) {
    errors.push('payload exceeds allowed length');
  }

  return errors;
}

async function verifyTurnstileToken(secretKey: string, token: string, ip: string) {
  const response = await fetch(
    'https://challenges.cloudflare.com/turnstile/v0/siteverify',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        secret: secretKey,
        response: token,
        remoteip: ip,
      }),
    },
  );

  if (!response.ok) {
    return false;
  }

  const result = (await response.json()) as { success?: boolean };
  return result?.success === true;
}

async function sendViaResend(payload: ContactPayload) {
  const apiKey = toText(process.env.RESEND_API_KEY);
  const from = toText(process.env.RESEND_FROM_EMAIL);
  const to = toText(process.env.RESEND_TO_EMAIL);
  const replyTo = toText(process.env.RESEND_REPLY_TO_EMAIL);

  if (!apiKey || !from || !to) {
    throw new Error('EMAIL_PROVIDER_NOT_CONFIGURED');
  }

  const subjectBase = toText(payload.formType) || 'Нова заявка';
  const name = toText(payload.name);
  const subject = name ? `${subjectBase}: ${name}` : subjectBase;

  const response = await fetch(RESEND_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: replyTo || undefined,
      subject,
      html: buildEmailHtml(payload),
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`EMAIL_PROVIDER_ERROR:${response.status}:${errorText}`);
  }
}

export default {
  async submit(ctx: any) {
    const payload = (ctx.request.body || {}) as ContactPayload;
    const ip = getClientIp(ctx);

    if (toText(payload.company)) {
      ctx.body = { ok: true };
      return;
    }

    if (!consumeRateLimit(ip)) {
      ctx.status = 429;
      ctx.body = {
        error: 'TOO_MANY_REQUESTS',
        message: 'Забагато запитів. Спробуйте пізніше.',
      };
      return;
    }

    const validationErrors = validatePayload(payload);
    if (validationErrors.length > 0) {
      ctx.status = 400;
      ctx.body = {
        error: 'VALIDATION_ERROR',
        details: validationErrors,
      };
      return;
    }

    const turnstileSecret = toText(process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY);
    const turnstileToken = toText(payload.turnstileToken);

    if (turnstileSecret) {
      if (!turnstileToken) {
        ctx.status = 400;
        ctx.body = {
          error: 'CAPTCHA_REQUIRED',
          message: 'Потрібне підтвердження CAPTCHA.',
        };
        return;
      }

      const isCaptchaValid = await verifyTurnstileToken(
        turnstileSecret,
        turnstileToken,
        ip,
      );

      if (!isCaptchaValid) {
        ctx.status = 400;
        ctx.body = {
          error: 'CAPTCHA_INVALID',
          message: 'Не вдалося перевірити CAPTCHA.',
        };
        return;
      }
    }

    try {
      await sendViaResend(payload);
    } catch (error) {
      strapi.log.error('Failed to send contact submission', error);
      const rawMessage = error instanceof Error ? error.message : String(error);

      if (rawMessage.includes('EMAIL_PROVIDER_NOT_CONFIGURED')) {
        ctx.status = 500;
        ctx.body = {
          error: 'EMAIL_PROVIDER_NOT_CONFIGURED',
          message: 'Не налаштовано Resend API на сервері.',
        };
        return;
      }

      ctx.status = 502;
      ctx.body = {
        error: 'DELIVERY_FAILED',
        message: rawMessage.includes('EMAIL_PROVIDER_ERROR:403')
          ? 'Resend відхилив запит. Перевірте домен відправника та API key.'
          : rawMessage.includes('EMAIL_PROVIDER_ERROR:422')
            ? 'Resend не прийняв email. Перевірте адресу відправника та отримувача.'
            : 'Не вдалося надіслати повідомлення. Спробуйте пізніше.',
      };
      return;
    }

    strapi.log.info(
      `[contact-submission] form="${toText(payload.formType)}" ip="${ip}" branch="${toText(payload.branch)}"`,
    );

    ctx.body = { ok: true };
  },
};
