import { Fragment } from "react";
import { resolveMedia } from "../../api/newsApi";
import { getResponsiveImageProps } from "../../api/foundation";
import { renderPlainTextBlocks } from "../../lib/safeRichText";
import "./NewsContentRenderer.css";

function withTextMarks(text, node, keyPrefix) {
    let result = text;

    if (node.bold) {
        result = <strong key={`${keyPrefix}-bold`}>{result}</strong>;
    }

    if (node.italic) {
        result = <em key={`${keyPrefix}-italic`}>{result}</em>;
    }

    if (node.underline) {
        result = <u key={`${keyPrefix}-underline`}>{result}</u>;
    }

    if (node.strikethrough) {
        result = <s key={`${keyPrefix}-strikethrough`}>{result}</s>;
    }

    if (node.code) {
        result = <code key={`${keyPrefix}-code`}>{result}</code>;
    }

    return result;
}

function renderInlineNodes(nodes, keyPrefix = "inline") {
    if (!Array.isArray(nodes)) return null;

    return nodes.map((node, index) =>
        renderInlineNode(node, `${keyPrefix}-${index}`),
    );
}

function renderInlineNode(node, key) {
    if (!node) return null;

    if (typeof node === "string") {
        return <Fragment key={key}>{node}</Fragment>;
    }

    if (typeof node.text === "string") {
        return (
            <Fragment key={key}>
                {withTextMarks(node.text, node, key)}
            </Fragment>
        );
    }

    const children = Array.isArray(node.children) ? node.children : [];

    if (node.type === "link" || node.url || node.href) {
        const href = node.url || node.href || "#";
        const isExternal = /^https?:\/\//i.test(href);

        return (
            <a
                key={key}
                href={href}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
            >
                {renderInlineNodes(children, `${key}-child`)}
            </a>
        );
    }

    if (children.length > 0) {
        return (
            <Fragment key={key}>
                {renderInlineNodes(children, `${key}-child`)}
            </Fragment>
        );
    }

    return null;
}

function renderListItems(items, keyPrefix) {
    if (!Array.isArray(items)) return null;

    return items.map((item, index) => {
        const children = Array.isArray(item?.children)
            ? item.children
            : item
              ? [item]
              : [];

        return (
            <li key={`${keyPrefix}-${index}`}>
                {renderInlineNodes(children, `${keyPrefix}-${index}`)}
            </li>
        );
    });
}

function renderBodyNode(node, key) {
    if (!node || typeof node !== "object") return null;

    if (node.type === "heading") {
        const level = Number(node.level);
        const safeLevel =
            Number.isFinite(level) && level >= 2 && level <= 6 ? level : 2;
        const Tag = `h${safeLevel}`;

        return (
            <Tag key={key}>
                {renderInlineNodes(node.children, `${key}-heading`)}
            </Tag>
        );
    }

    if (node.type === "paragraph") {
        return (
            <p key={key}>{renderInlineNodes(node.children, `${key}-paragraph`)}</p>
        );
    }

    if (node.type === "list") {
        const ListTag =
            node.format === "ordered" || node.ordered ? "ol" : "ul";

        return (
            <ListTag key={key}>
                {renderListItems(node.children, `${key}-list`)}
            </ListTag>
        );
    }

    if (node.type === "quote") {
        return (
            <blockquote key={key}>
                {renderInlineNodes(node.children, `${key}-quote`)}
            </blockquote>
        );
    }

    if (node.type === "image") {
        const image = resolveMedia(node.image || node);
        const imageProps = getResponsiveImageProps(node.image || node, {
            sizes: "(max-width: 768px) 100vw, 960px",
        });
        if (!image?.url || !imageProps?.src) return null;

        return (
            <figure className="news-content__figure" key={key}>
                <img
                    src={imageProps.src}
                    srcSet={imageProps.srcSet}
                    sizes={imageProps.sizes}
                    alt={image.alt}
                    width={imageProps.width}
                    height={imageProps.height}
                    loading="lazy"
                    decoding="async"
                />
                {node.caption || image.caption ? (
                    <figcaption>{node.caption || image.caption}</figcaption>
                ) : null}
            </figure>
        );
    }

    if (Array.isArray(node.children) && node.children.length) {
        return <p key={key}>{renderInlineNodes(node.children, `${key}-text`)}</p>;
    }

    return null;
}

function renderTextBlockBody(body, keyPrefix) {
    if (typeof body === "string") {
        return renderPlainTextBlocks(body, (block, index) => (
            <p key={`${keyPrefix}-plain-${index}`}>{block}</p>
        ));
    }

    const nodes = Array.isArray(body)
        ? body
        : Array.isArray(body?.blocks)
          ? body.blocks
          : [];

    return nodes.map((node, index) =>
        renderBodyNode(node, `${keyPrefix}-${index}`),
    );
}

function renderDynamicZoneItem(entry, index) {
    const source = entry?.attributes ?? entry ?? {};
    const componentName = source.__component || source.component || "";

    if (componentName.includes("text-block")) {
        return (
            <section className="news-content__text-block" key={`text-${index}`}>
                {renderTextBlockBody(source.body, `text-${index}`)}
            </section>
        );
    }

    if (componentName.includes("image-block")) {
        const image = resolveMedia(source.image);
        const imageProps = getResponsiveImageProps(source.image, {
            sizes: "(max-width: 768px) 100vw, 960px",
        });
        if (!image?.url || !imageProps?.src) return null;

        return (
            <figure className="news-content__figure" key={`image-${index}`}>
                <img
                    src={imageProps.src}
                    srcSet={imageProps.srcSet}
                    sizes={imageProps.sizes}
                    alt={source.alt || image.alt}
                    width={imageProps.width}
                    height={imageProps.height}
                    loading="lazy"
                    decoding="async"
                />
                {source.caption || image.caption ? (
                    <figcaption>{source.caption || image.caption}</figcaption>
                ) : null}
            </figure>
        );
    }

    if (componentName.includes("highlight-block")) {
        return (
            <div className="news-content__highlight" key={`highlight-${index}`}>
                {source.text}
            </div>
        );
    }

    if (componentName.includes("quote-block")) {
        return (
            <blockquote className="news-content__quote-block" key={`quote-${index}`}>
                <p>{source.quote}</p>
                {source.author ? <cite>{source.author}</cite> : null}
            </blockquote>
        );
    }

    if (source.body || source.text || source.quote) {
        return (
            <section className="news-content__text-block" key={`fallback-${index}`}>
                {source.body ? renderTextBlockBody(source.body, `fallback-${index}`) : null}
                {source.text ? <p>{source.text}</p> : null}
                {source.quote ? <blockquote>{source.quote}</blockquote> : null}
            </section>
        );
    }

    return null;
}

function isStrapiBlocksArray(content) {
    return (
        Array.isArray(content) &&
        content.length > 0 &&
        content.every((item) => {
            if (!item || typeof item !== "object" || Array.isArray(item)) {
                return false;
            }

            if (item.__component || item.component) return false;

            return typeof item.type === "string" || Array.isArray(item.children);
        })
    );
}

export default function NewsContentRenderer({ content }) {
    if (!content) return null;

    if (typeof content === "string") {
        return (
            <div className="news-content">
                <section className="news-content__text-block">
                    {renderTextBlockBody(content, "html")}
                </section>
            </div>
        );
    }

    if (Array.isArray(content)) {
        if (isStrapiBlocksArray(content)) {
            return (
                <div className="news-content">
                    <section className="news-content__text-block">
                        {renderTextBlockBody(content, "blocks-array")}
                    </section>
                </div>
            );
        }

        return (
            <div className="news-content">
                {content.map((entry, index) =>
                    renderDynamicZoneItem(entry, index),
                )}
            </div>
        );
    }

    return (
        <div className="news-content">
            <section className="news-content__text-block">
                {renderTextBlockBody(content, "object")}
            </section>
        </div>
    );
}
