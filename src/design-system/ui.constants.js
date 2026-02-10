/**
 * Centralized UI Design System (used-values-only)
 * ------------------------------------------------
 * Contains only values already present in this project.
 */

const deepFreeze = (value) => {
    if (value && typeof value === "object" && !Object.isFrozen(value)) {
        Object.values(value).forEach(deepFreeze);
        Object.freeze(value);
    }

    return value;
};

export const UI = deepFreeze({
    typography: {
        fontFamily: {
            base: '"Montserrat", sans-serif',
            heading: '"Montserrat", sans-serif',
        },
        fontWeight: {
            regular: 400,
            medium: 500,
            semibold: 600,
            bold: 700,
        },
        lineHeight: {
            tight: 1,
            compact: 1.1,
            snug: 1.2,
            normal: 1.3,
            relaxed: 1.4,
            body: 1.5,
            roomy: 1.6,
            loose: 1.7,
        },
        letterSpacing: {
            tight: "0.02em",
            wide: "0.04em",
        },
        fontSize: {
            xxs: "10px",
            xs: "11px",
            sm: "12px",
            smPlus: "13px",
            mdMinus: "13.5px",
            md: "14px",
            base: "15px",
            lg: "16px",
            xl: "18px",
            x2l: "20px",
            x3l: "21px",
            x4l: "22px",
            x5l: "24px",
            x6l: "26px",
            x7l: "28px",
            x8l: "32px",
            x9l: "42px",
            x10l: "44px",
            display: "56px",
        },
        textStyle: {
            h1: {
                fontSize: "42px",
                fontWeight: 700,
                lineHeight: 1.2,
                letterSpacing: "0.02em",
            },
            h2: {
                fontSize: "32px",
                fontWeight: 600,
                lineHeight: 1.2,
                letterSpacing: "0.02em",
            },
            h3: {
                fontSize: "28px",
                fontWeight: 600,
                lineHeight: 1.3,
                letterSpacing: "0.02em",
            },
            body: {
                fontSize: "16px",
                fontWeight: 400,
                lineHeight: 1.5,
            },
            bodyStrong: {
                fontSize: "16px",
                fontWeight: 500,
                lineHeight: 1.5,
            },
            small: {
                fontSize: "14px",
                fontWeight: 400,
                lineHeight: 1.4,
            },
            caption: {
                fontSize: "12px",
                fontWeight: 400,
                lineHeight: 1.3,
            },
        },
    },

    colors: {
        palette: {
            black: "#000",
            blackFull: "#000000",
            white: "#fff",
            whiteFull: "#ffffff",

            tealPrimary: "#008b96",
            tealStrong: "#0c8a87",
            tealSecondary: "#0aa2a6",
            tealAccent: "#2aa6b8",
            tealSupport: "#238f9c",
            tealMuted: "#3c8f98",
            tealSoft: "#b6dfe3",

            purple: "#7a3889",
            purpleStrong: "#652f6b",

            neutral900: "#1a1a1a",
            neutral850: "#222",
            neutral800: "#111",
            neutral700: "#444",
            neutral650: "#555",
            neutral600: "#5f6b72",
            neutral500: "#6b6b6b",
            neutral450: "#7f7f7f",
            neutral400: "#888",
            neutral350: "#98a2a8",
            neutral300: "#b9bec7",
            neutral250: "#c2c9ce",
            neutral220: "#cfd6df",
            neutral200: "#dbdde4",
            neutral170: "#e0e0e0",
            neutral160: "#e6e6e6",
            neutral150: "#e6e9ec",
            neutral140: "#e6eaf0",
            neutral120: "#ededed",
            neutral50: "#fdfdfd",

            mintSoft: "#dff0f0",
        },

        semantic: {
            primary: "#008b96",
            secondary: "#7a3889",
            accent: "#0aa2a6",

            textPrimary: "#000000",
            textHeading: "#1a1a1a",
            textBody: "#5f6b72",
            textMuted: "#7f7f7f",
            textPlaceholder: "#98a2a8",
            textDisabled: "#b9bec7",
            textInverse: "#ffffff",

            bgPage: "#fdfdfd",
            bgSurface: "#ffffff",
            bgSubtle: "#e6e9ec",
            bgMuted: "#e6e6e6",
            bgFooter: "#dff0f0",

            borderDefault: "#e6eaf0",
            borderMuted: "#cfd6df",
            borderSubtle: "#e0e0e0",
            borderSoft: "#ededed",
            borderAccent: "#2aa6b8",
        },

        rgba: {
            overlay: "rgba(0, 0, 0, 0.45)",
            shadowSoft: "rgba(0, 0, 0, 0.06)",
            shadowBase: "rgba(0, 0, 0, 0.08)",
            shadowStrong: "rgba(0, 0, 0, 0.12)",
            shadowHover: "rgba(0, 0, 0, 0.15)",
            shadowModal: "rgba(0, 0, 0, 0.2)",
            shadowGlass: "rgba(0, 0, 0, 0.25)",
            shadowTeal: "rgba(29, 155, 166, 0.15)",
            shadowCard: "rgba(13, 38, 48, 0.08)",
            transparentWhite: "rgba(255, 255, 255, 0)",
        },
    },

    spacing: {
        x0: "0px",
        x1: "1px",
        x2: "2px",
        x3: "3px",
        x4: "4px",
        x5: "5px",
        x6: "6px",
        x8: "8px",
        x10: "10px",
        x12: "12px",
        x14: "14px",
        x15: "15px",
        x16: "16px",
        x18: "18px",
        x20: "20px",
        x22: "22px",
        x24: "24px",
        x25: "25px",
        x26: "26px",
        x28: "28px",
        x30: "30px",
        x32: "32px",
        x35: "35px",
        x40: "40px",
        x45: "45px",
        x48: "48px",
        x50: "50px",
        x55: "55px",
        x56: "56px",
        x60: "60px",
        x70: "70px",
        x80: "80px",
        x90: "90px",
        x100: "100px",
        x104: "104px",
    },

    radius: {
        none: "0px",
        xs: "3px",
        sm: "4px",
        md: "6px",
        lg: "8px",
        xl: "10px",
        x2l: "14px",
        x3l: "16px",
        x4l: "18px",
        x5l: "20px",
        x6l: "22px",
        x7l: "24px",
        x8l: "26px",
        x9l: "28px",
        x10l: "30px",
        x11l: "40px",
        round: "50%",
        pill: "999px",
    },

    borderWidth: {
        none: "0px",
        thin: "1px",
        regular: "2px",
        strong: "3px",
    },

    shadow: {
        sm: "0 2px 6px rgba(0, 0, 0, 0.12)",
        md: "0 4px 18px rgba(0, 0, 0, 0.06)",
        lg: "0 5px 14px rgba(0, 0, 0, 0.15)",
        xl: "0 6px 22px rgba(0, 0, 0, 0.12)",
        x2l: "0 8px 20px rgba(0, 0, 0, 0.06)",
        x3l: "0 10px 26px rgba(0, 0, 0, 0.08)",
        x4l: "0 10px 28px rgba(0, 0, 0, 0.08)",
        x5l: "0 12px 30px rgba(0, 0, 0, 0.08)",
        x6l: "0 14px 36px rgba(0, 0, 0, 0.08)",
        x7l: "0 14px 40px rgba(0, 0, 0, 0.08)",
        x8l: "0 20px 60px rgba(0, 0, 0, 0.08)",
        overlay: "0 20px 60px rgba(0, 0, 0, 0.2)",
        drawer: "-4px 0 24px rgba(0, 0, 0, 0.12)",
    },

    zIndex: {
        base: 1,
        sticky: 200,
        header: 1100,
        overlay: 1200,
        drawer: 1300,
        floating: 1400,
        top: 1500,
        modal: 9999,
    },

    breakpoints: {
        xxs: "360px",
        xs: "430px",
        sm: "480px",
        md: "576px",
        lg: "768px",
        xl: "900px",
        x2l: "1080px",
        x3l: "1200px",
        x4l: "1244px",
        x5l: "1306px",
    },

    layout: {
        maxPageWidth: "1200px",
        maxContentWidth: "1080px",
        maxMobileMenuWidth: "420px",
        maxPopupWidth: "320px",
        headerHeight: "104px",
        inputHeight: "44px",
        buttonHeight: "44px",
        iconSize: "40px",
    },

    motion: {
        duration: {
            fast: "0.2s",
            normal: "0.25s",
            medium: "0.3s",
            slow: "0.35s",
            slower: "0.45s",
            delay: "0.06s",
        },
        easing: {
            default: "ease",
            emphasized: "cubic-bezier(0.22, 1, 0.36, 1)",
            smooth: "cubic-bezier(0.25, 0.1, 0.25, 1)",
        },
        transform: {
            hoverLift: "translateY(-2px)",
            hoverSlideX: "translateX(4px)",
            rotateQuarter: "rotate(90deg)",
            rotateHalf: "rotate(180deg)",
        },
    },
});

export default UI;
