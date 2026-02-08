import {
    useCallback,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from "react";
import "./SectionTypes.css";

const TABS = [
    { key: "lab", labelLines: ["Лабораторні", "дослідження"] },
    { key: "uzd", labelLines: ["УЗД", "діагностика"] },
    { key: "func", labelLines: ["Функціональна", "діагностика"] },
];

const DATA = {
    lab: {
        description:
            "Лабораторна діагностика допомагає оцінити стан організму за показниками крові, сечі та інших біоматеріалів. Це швидкий і точний спосіб виявити запалення, інфекції, гормональні порушення або дефіцити. У нашому центрі приймаються всі види лабораторних аналізів через партнерську лабораторію. Ми забезпечуємо повний спектр досліджень — від базових профілактичних аналізів до розширених панелей для контролю здоров’я або уточнення діагнозу.",
        leftTitle: "Для чого потрібні лабораторні дослідження?",
        leftItems: [
            "Для профілактики — щоб переконатися, що всі показники в нормі",
            "Для контролю лікування — щоб відстежити динаміку відновлення",
            "Для підтвердження діагнозу або уточнення стану організму",
            "Для комплексних Check-up програм, які допомагають побачити повну картину",
        ],

        rightTitle: "Які лабораторні дослідження ми проводимо?",
        rightItems: [
            "Загальні аналізи: кров, сеча, кал",
            "Біохімічні дослідження: глюкоза, холестерин, печінкові та ниркові показники",
            "Гормональні дослідження: щитоподібна залоза, статеві гормони, наднирники",
            "Імунологічні та інфекційні тести: антитіла, вірусні маркери, алергопанелі",
            "Мікробіологічні дослідження: мазки, посіви, визначення чутливості до антибіотиків",
            "Онкомаркери та спеціальні аналізи — за призначенням лікаря",
        ],
        note: "Для декларантів: пацієнти, які підписали декларацію з сімейним лікарем нашої клініки, можуть пройти базові лабораторні дослідження безкоштовно відповідно до переліку НСЗУ. Адміністратор підкаже, які аналізи входять до безоплатного пакета.",
    },

    uzd: {
        description:
            " Ультразвукове дослідження допомагає побачити, як працюють ваші внутрішні органи, без жодного втручання чи болю. Це один із найточніших і найкомфортніших способів перевірити стан здоров’я, який підходить і дорослим, і дітям.",
        leftTitle: "Коли варто зробити УЗД?",
        leftItems: [
            "для профілактичного огляду, щоб переконатися, що все гаразд",
            "при болях у животі, відчутті важкості, зміні апетиту",
            "при підозрі на гормональні чи ендокринні порушення",
            "під час вагітності або планування",
            "для контролю результатів лікування",
        ],
        rightTitle: "Які обстеження ми проводимо?",
        rightItems: [
            "УЗД органів черевної порожнини",
            "УЗД органів заочеревинного простору (нирки, сечовий міхур)",
            "УЗД щитоподібної залози",
            "УЗД мʼяких тканин та лімфатичних вузлів",
            "Гінекологічне УЗД",
        ],
        note: "Для декларантів окремі види УЗД можуть бути безкоштовними відповідно до переліку послуг НСЗУ. Деталі можна уточнити у адміністратора клініки. За потреби лікар допоможе визначити необхідне обстеження.",
    },

    func: {
        description:
            "ЕКГ — це швидке та безпечне обстеження, яке показує, як працює ваше серце. Процедура триває кілька хвилин, але може вчасно підказати лікарю про зміни, які ще не відчуваються.",
        leftTitle: "Що показує ЕКГ",
        leftItems: [
            "роботу серцевого м’яза",
            "частоту та ритм серцевих скорочень",
            "наявність порушень провідності",
            "Спіроознаки перенавантаження або ішемії",
        ],

        rightTitle: "Коли варто зробити ЕКГ",
        rightItems: [
            "якщо ви відчуваєте біль або тиск у грудях",
            "якщо маєте підвищений артеріальний тиск",
            "при серцебитті, перебоях або задишці",
            "при частій втомі, запамороченні або стресі",
            "для профілактики — під час щорічного огляду або перед фізичними навантаженнями",
        ],
        note: "Після обстеження лікар-терапевт пояснить результати простою та зрозумілою мовою і, за потреби, порадить подальші кроки або додаткові обстеження. Для пацієнтів, які підписали декларацію з сімейним лікарем, базове ЕКГ входить до переліку безкоштовних послуг, передбачених НСЗУ. Актуальні умови та деталі можна уточнити у адміністратора клініки.",
    },
};

export default function SectionTypes() {
    const [active, setActive] = useState("uzd");
    const content = DATA[active];
    const tabsRef = useRef(null);
    const tabRefs = useRef({});

    const setTabRef = useCallback(
        (key) => (el) => {
            if (el) {
                tabRefs.current[key] = el;
            }
        },
        [],
    );

    const updateUnderline = useCallback(() => {
        const container = tabsRef.current;
        const activeEl = tabRefs.current[active];
        if (!container || !activeEl) return;

        const containerRect = container.getBoundingClientRect();
        const activeRect = activeEl.getBoundingClientRect();
        const left = activeRect.left - containerRect.left;
        const width = activeRect.width;

        container.style.setProperty("--underline-left", `${left}px`);
        container.style.setProperty("--underline-width", `${width}px`);

        const buttons = Object.values(tabRefs.current).filter(Boolean);
        if (buttons.length > 0) {
            const firstTop = buttons[0].offsetTop;
            const isWrapped = buttons.some(
                (button) => button.offsetTop !== firstTop,
            );
            container.classList.toggle("is-wrapped", isWrapped);
        }
    }, [active]);

    useLayoutEffect(() => {
        const frame = requestAnimationFrame(updateUnderline);
        return () => cancelAnimationFrame(frame);
    }, [updateUnderline]);

    useEffect(() => {
        window.addEventListener("resize", updateUnderline);
        return () => window.removeEventListener("resize", updateUnderline);
    }, [updateUnderline]);

    return (
        <section className="section-types">
            <div className="section-types__inner">
                <h2 className="section-types__title">
                    ВИДИ ДІАГНОСТИЧНИХ ДОСЛІДЖЕНЬ
                </h2>

                <div
                    className="section-types__tabs"
                    role="tablist"
                    ref={tabsRef}
                >
                    {TABS.map((tab) => (
                        <button
                            key={tab.key}
                            type="button"
                            className={`section-types__tab ${
                                active === tab.key ? "active" : ""
                            }`}
                            onClick={() => setActive(tab.key)}
                            role="tab"
                            aria-selected={active === tab.key}
                            ref={setTabRef(tab.key)}
                        >
                            {tab.labelLines.map((line, index) => (
                                <span
                                    key={`${tab.key}-${line}`}
                                    className="section-types__tab-line"
                                >
                                    {line}
                                    {index < tab.labelLines.length - 1
                                        ? " "
                                        : ""}
                                </span>
                            ))}
                        </button>
                    ))}
                </div>

                <div className="section-types__content" key={active}>
                    <p className="section-types__description">
                        {content.description}
                    </p>

                    <div className="section-types__grid">
                        <div className="section-types__col">
                            <h3 className="section-types__col-title">
                                {content.leftTitle}
                            </h3>
                            <ul className="section-types__list">
                                {content.leftItems.map((item, i) => (
                                    <li key={i}>{item}</li>
                                ))}
                            </ul>
                        </div>

                        <div className="section-types__col">
                            <h3 className="section-types__col-title">
                                {content.rightTitle}
                            </h3>
                            <ul className="section-types__list">
                                {content.rightItems.map((item, i) => (
                                    <li key={i}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <p className="section-types__note">{content.note}</p>
                </div>
            </div>
        </section>
    );
}
