"use client";

// const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://waygo.webtm.ru";
const baseUrl = "https://msss.ru/crm";

export const apiUrls = {
    // GOOGLE_GET_CONTACTS_OLD: `${baseUrl}/PeopleService_json.php`,
    GOOGLE_GET_CONTACTS: `${baseUrl}/api/google_api/PeopleService_json.php`,
    TRANSFER_GET_LEADS: `${baseUrl}/php/transfer/api/table/`,
    SOUNDPROOFING_GET_LEADS: `${baseUrl}/php/soundproofing/api/table/`,
    FLOWERS_GET_ORDERS: `${baseUrl}/php/flowers/api/table/`,
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
    FLOWERS_API_TOKEN: {
        key: "FLOWERS_API_TOKEN",
        label: "Flowers API Token",
        description: "Токен для доступа к API заказов цветов (flowerskursk.ru)",
    },
} as const;

export type ApiTokenKey = keyof typeof apiTokens;

export default apiUrls;
