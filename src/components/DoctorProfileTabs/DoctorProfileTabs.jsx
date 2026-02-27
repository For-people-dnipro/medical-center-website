import { useEffect, useMemo, useState } from "react";
import useTabsUnderline from "../../hooks/useTabsUnderline";
import NewsContentRenderer from "../NewsContentRenderer/NewsContentRenderer";
import "./DoctorProfileTabs.css";

function isObject(value) {
    return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function isBlocksLikeArray(value) {
    if (!Array.isArray(value) || value.length === 0) return false;
    const first = value[0];
    return Boolean(
        first &&
            typeof first === "object" &&
            (first.type || first.__component || first.component),
    );
}

function getRepeatableItemTitle(item) {
    if (!isObject(item)) return "";
    return (
        item.title ||
        item.name ||
        item.heading ||
        item.label ||
        item.subtitle ||
        ""
    );
}

function getRepeatableItemText(item) {
    if (!isObject(item)) return "";
    return item.body || item.text || item.description || item.content || "";
}

function renderRepeatableItemValue(value, keyPrefix) {
    if (!value) return null;

    if (typeof value === "string") {
        return <p key={`${keyPrefix}-p`}>{value}</p>;
    }

    if (Array.isArray(value)) {
        const stringItems = value.filter((entry) => typeof entry === "string");
        if (stringItems.length === value.length) {
            return (
                <ul key={`${keyPrefix}-ul`}>
                    {stringItems.map((item) => (
                        <li key={`${keyPrefix}-${item}`}>{item}</li>
                    ))}
                </ul>
            );
        }
    }

    if (isObject(value)) {
        return (
            <div className="doctor-profile-tabs__repeatable-json" key={keyPrefix}>
                {Object.entries(value).map(([key, nestedValue]) => (
                    <div key={`${keyPrefix}-${key}`}>
                        <strong>{key}:</strong> {String(nestedValue)}
                    </div>
                ))}
            </div>
        );
    }

    return <p key={`${keyPrefix}-fallback`}>{String(value)}</p>;
}

function renderRepeatableContent(items) {
    if (!Array.isArray(items) || items.length === 0) return null;

    return (
        <div className="doctor-profile-tabs__repeatable-list">
            {items.map((item, index) => {
                if (!isObject(item)) {
                    return (
                        <div
                            className="doctor-profile-tabs__repeatable-item"
                            key={`repeat-${index}`}
                        >
                            {renderRepeatableItemValue(item, `repeat-${index}`)}
                        </div>
                    );
                }

                const source = item.attributes || item;
                const title = getRepeatableItemTitle(source);
                const text = getRepeatableItemText(source);
                const extraEntries = Object.entries(source).filter(([key]) => {
                    return ![
                        "id",
                        "__component",
                        "component",
                        "title",
                        "name",
                        "heading",
                        "label",
                        "subtitle",
                        "body",
                        "text",
                        "description",
                        "content",
                        "createdAt",
                        "updatedAt",
                        "publishedAt",
                    ].includes(key);
                });

                return (
                    <div
                        className="doctor-profile-tabs__repeatable-item"
                        key={`repeat-${source.id || index}`}
                    >
                        {title ? (
                            <h3 className="doctor-profile-tabs__repeatable-title">
                                {title}
                            </h3>
                        ) : null}

                        {text ? (
                            typeof text === "string" && /<\/?[a-z][\s\S]*>/i.test(text) ? (
                                <div
                                    className="doctor-profile-tabs__repeatable-html"
                                    dangerouslySetInnerHTML={{ __html: text }}
                                />
                            ) : (
                                <p>{text}</p>
                            )
                        ) : null}

                        {extraEntries.map(([key, value]) => {
                            if (
                                value === null ||
                                value === undefined ||
                                value === ""
                            ) {
                                return null;
                            }

                            return (
                                <div
                                    className="doctor-profile-tabs__repeatable-extra"
                                    key={`repeat-${source.id || index}-${key}`}
                                >
                                    <strong>{key}:</strong>{" "}
                                    {renderRepeatableItemValue(
                                        value,
                                        `repeat-${source.id || index}-${key}`,
                                    )}
                                </div>
                            );
                        })}
                    </div>
                );
            })}
        </div>
    );
}

export default function DoctorProfileTabs({
    tabs = [],
    initialTabKey = "",
    className = "",
}) {
    const availableTabs = useMemo(
        () => tabs.filter((tab) => tab && tab.key),
        [tabs],
    );
    const availableTabKeys = useMemo(
        () => availableTabs.map((tab) => tab.key),
        [availableTabs],
    );
    const firstTabKey = availableTabKeys[0] || "";
    const requestedKey =
        initialTabKey && availableTabKeys.includes(initialTabKey)
            ? initialTabKey
            : firstTabKey;
    const [activeKey, setActiveKey] = useState(requestedKey);
    const { tabListRef, setTabRef } = useTabsUnderline({
        activeKey,
        tabKeys: availableTabKeys,
    });

    useEffect(() => {
        if (!availableTabKeys.includes(activeKey)) {
            setActiveKey(requestedKey);
        }
    }, [activeKey, availableTabKeys, requestedKey]);

    if (availableTabs.length === 0) return null;

    const activeTab =
        availableTabs.find((tab) => tab.key === activeKey) || availableTabs[0];
    const rootClassName = ["doctor-profile-tabs", className]
        .filter(Boolean)
        .join(" ");

    return (
        <section className={rootClassName}>
            <div
                className="doctor-profile-tabs__tablist"
                role="tablist"
                ref={tabListRef}
            >
                {availableTabs.map((tab) => (
                    <button
                        key={tab.key}
                        id={`doctor-profile-tab-${tab.key}`}
                        type="button"
                        role="tab"
                        aria-selected={activeTab.key === tab.key}
                        aria-controls={`doctor-profile-panel-${tab.key}`}
                        className={`doctor-profile-tabs__tab ${
                            activeTab.key === tab.key ? "is-active" : ""
                        }`}
                        onClick={() => setActiveKey(tab.key)}
                        ref={setTabRef(tab.key)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div
                key={activeTab.key}
                className="doctor-profile-tabs__panel"
                role="tabpanel"
                id={`doctor-profile-panel-${activeTab.key}`}
                aria-labelledby={`doctor-profile-tab-${activeTab.key}`}
            >
                {activeTab.content ? (
                    <div className="doctor-profile-tabs__content">
                        {Array.isArray(activeTab.content) &&
                        !isBlocksLikeArray(activeTab.content)
                            ? renderRepeatableContent(activeTab.content)
                            : (
                                  <NewsContentRenderer content={activeTab.content} />
                              )}
                    </div>
                ) : (
                    <p className="doctor-profile-tabs__empty">
                        {activeTab.emptyText ||
                            "Інформацію буде додано незабаром."}
                    </p>
                )}
            </div>
        </section>
    );
}
