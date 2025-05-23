// src/lib/utils.ts
export function cn(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(" ");
}

export const getLanguageId = (language: string): number | null => {
  const LanguageMap = {
    JAVA: 62,
    PYTHON: 71,
    JAVASCRIPT: 63,
    SQL: 82,
  };
  const upperLang = language.toUpperCase() as keyof typeof LanguageMap;
  return LanguageMap[upperLang] || null;
};
