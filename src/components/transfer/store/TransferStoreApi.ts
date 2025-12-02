"use client";

import apiUrls from "@/common/api/ApiUrls";
import { ApiStore } from "@/common/api/ApiStore";


export function getToken(token: string = "") {
    if (typeof window !== "undefined") {
        token = localStorage["TRANSFER_API_TOKEN"] ? localStorage["TRANSFER_API_TOKEN"] : token;
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


export type TransferZakaz = {
    phone: string;
    name1: string;
    all_data: string;
    date_creation_db: string;
};


// получить сырые данные с сервера 
export const transferStoreApi = new ApiStore<TransferZakaz[]>(apiUrls.TRANSFER_GET_LEADS, { token: getToken(), ...getUrlDates() });
export default transferStoreApi;




// export type TransferZakaz = {
//     phone: string;
//     name1: string;
//     email: string;
//     comment: string;
//     id__handlers: string;
//     all_data: string;
//     date_creation: string;
// };

