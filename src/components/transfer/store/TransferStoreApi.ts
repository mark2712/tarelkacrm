"use client";

import { computed, makeObservable, observable } from "mobx";
import apiUrls from "@/common/api/ApiUrls";
import { ApiStore } from "@/common/api/ApiStore";


export function getToken(token: string = "") {
    if (typeof window !== "undefined") {
        token = localStorage["TRANSFER_API_TOKEN"] ? localStorage["TRANSFER_API_TOKEN"] : token;
    }
    return token;
}


export type TransferZakaz = {
    phone: string;
    name1: string;
    all_data: string;
    date_creation: string;
};


// получить сырые данные с сервера 
export const transferStoreApi = new ApiStore<TransferZakaz[]>(apiUrls.TRANSFER_GET_LEADS, { token: getToken() });
export default transferStoreApi;




// export type TransferZakaz = {
//     phone: string;
//     name1: string;
//     email: string;
//     comment: string;
//     id__handlers: string;
//     all_data: string;
// };

