function toText(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function buildFullName(data: Record<string, unknown> | undefined) {
  if (!data) return '';

  const surname = toText(data.surname);
  const name = toText(data.name);

  if (!surname || !name) return '';

  return [surname, name].join(' ').replace(/\s+/g, ' ').trim();
}

function syncDoctorPositions(data: Record<string, unknown> | undefined) {
  if (!data) return;

  const positionLong = toText(data.positionLong);
  const legacyPosition = toText(data.position);

  if (positionLong) {
    data.position = positionLong;
    return;
  }

  if (legacyPosition) {
    data.positionLong = legacyPosition;
  }
}

function syncDoctorFullName(event: { params?: { data?: Record<string, unknown> } }) {
  const data = event?.params?.data;
  if (!data) return;

  syncDoctorPositions(data);

  const fullName = buildFullName(data);
  if (!fullName) return;

  data.fullName = fullName;
}

export default {
  beforeCreate(event: { params?: { data?: Record<string, unknown> } }) {
    syncDoctorFullName(event);
  },

  beforeUpdate(event: { params?: { data?: Record<string, unknown> } }) {
    syncDoctorFullName(event);
  },
};
