import { makeAutoObservable, runInAction } from "mobx";
import apiUrls from "@/store/api/ApiUrls";
import { ApiStore } from "@/store/api/ApiStore";


const token = process.env.API_TOKEN;


export type TransferZakaz = {
    phone: string;
    name1: string;
    all_data: string;
};


class TransferStoreApi {
    leads = new ApiStore<TransferZakaz[]>(apiUrls.TRANSFER_GET_LEADS, { token });

    constructor() {
        makeAutoObservable(this);
    }
}

export const transferStoreApi = new TransferStoreApi();
export default transferStoreApi;


// export type TransferZakaz = {
//     phone: string;
//     name1: string;
//     email: string;
//     comment: string;
//     id__handlers: string;
//     all_data: string;
// };