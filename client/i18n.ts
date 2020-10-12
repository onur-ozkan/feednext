import NextI18Next from "next-i18next";

const NextI18NextInstance = new NextI18Next({
    defaultLanguage: "en",
    defaultNS: "loginPage",
    otherLanguages: ["tr"],
    localePath: typeof window === "undefined" ? "public/locales" : "locales"
})

export const { appWithTranslation, withTranslation } = NextI18NextInstance

export default NextI18NextInstance;