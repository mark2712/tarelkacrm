"use client";

import apiUrls, { apiTokens } from "@/common/api/ApiUrls";
import { ApiStore } from "@/common/api/ApiStore";


export function getToken(token: string = "") {
    if (typeof window !== "undefined") {
        token = localStorage[apiTokens.SOUNDPROOFING_API_TOKEN.key] ? localStorage[apiTokens.SOUNDPROOFING_API_TOKEN.key] : token;
    }
    return token;
}

export function getUrlDates() {
    if (typeof window === "undefined") return { date1: "", date2: "" };

    const params = new URLSearchParams(window.location.search);

    return {
        date1: params.get("date1") || "",
        date2: params.get("date2") || "",
    };
}

export type SoundproofingRawLead = {
    id: number | string;
    created_at: string;
    user_name: string | null;
    phone: string | null;
    message: string | null;
    other_data: string | null;
    ip: string | null;
    geo: string | null;
    geo_id: string | null;
    section_name: string | null;
    block_name: string | null;
    action_name: string | null;
    isMob: string | null;
    ym_uid: string | null;
    ym_counter: string | null;
    url: string | null;
    spam1: string | null;
    first_referer: string | null;
    first_page: string | null;
};

export const soundproofingStoreApi = new ApiStore<SoundproofingRawLead[]>(
    apiUrls.SOUNDPROOFING_GET_LEADS,
    { token: getToken(), ...getUrlDates() }
);
export default soundproofingStoreApi;
