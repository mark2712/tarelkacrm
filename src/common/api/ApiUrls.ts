"use client";

// const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://waygo.webtm.ru";
const baseUrl = "https://waygo.webtm.ru";

export const apiUrls = {
    GOOGLE_GET_CONTACTS_OLD: `${baseUrl}/PeopleService_json.php`,
    GOOGLE_GET_CONTACTS: `${baseUrl}/api/google_api/PeopleService_json.php`,
    TRANSFER_GET_LEADS: `${baseUrl}/transfer/leads.php`,
    SOUNDPROOFING_GET_LEADS: `https://msss.ru/soundproofing/php/api/table/`,
} as const;

export interface ApiTokenInfo {
    key: string;
    label: string;
    description: string;
}

export const apiTokens = {
    SOUNDPROOFING_API_TOKEN: {
        key: "SOUNDPROOFING_API_TOKEN",
        label: "Soundproofing API Token",
        description: "Токен для доступа к API заявок звукоизоляции (msss.ru)",
    },
    TRANSFER_API_TOKEN: {
        key: "TRANSFER_API_TOKEN",
        label: "Transfer API Token",
        description: "Токен для доступа к API заявок трансфера (waygo.webtm.ru)",
    },
} as const;

export type ApiTokenKey = keyof typeof apiTokens;

export default apiUrls;