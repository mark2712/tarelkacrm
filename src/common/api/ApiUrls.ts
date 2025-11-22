"use client";

// const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://waygo.webtm.ru";
const baseUrl = "https://waygo.webtm.ru";

export const apiUrls = {
    GOOGLE_GET_CONTACTS: `${baseUrl}/PeopleService_json.php`,
    TRANSFER_GET_LEADS: `${baseUrl}/transfer/leads.php`,
} as const;

export default apiUrls;