import { type Language } from "@/i18n/translations";

export const getDateLocale = (language: Language): string => {
  return language === "pt" ? "pt-BR" : "en-US";
};

export const formatDate = (
  date: Date | string,
  language: Language,
  options?: Intl.DateTimeFormatOptions
): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const locale = getDateLocale(language);
  return dateObj.toLocaleDateString(locale, options);
};

export const formatTime = (
  date: Date | string,
  language: Language,
  options?: Intl.DateTimeFormatOptions
): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const locale = getDateLocale(language);
  return dateObj.toLocaleTimeString(locale, options);
};

export const formatDateTime = (
  date: Date | string,
  language: Language,
  dateOptions?: Intl.DateTimeFormatOptions,
  timeOptions?: Intl.DateTimeFormatOptions
): string => {
  const formattedDate = formatDate(date, language, dateOptions);
  const formattedTime = formatTime(date, language, timeOptions);
  return `${formattedDate} ${formattedTime}`;
};
