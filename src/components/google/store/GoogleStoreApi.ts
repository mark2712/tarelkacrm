import { makeAutoObservable, runInAction } from "mobx";
import apiUrls from "@/common/api/ApiUrls";
import { ApiStore } from "@/common/api/ApiStore";


export type GooglePerson = {
    ageRange: any;
    etag: string;
    resourceName: string;
    metadata: any;
    names?: any[];
    photos?: any[];
    phoneNumbers?: any[];
    emailAddresses?: any[];
    organizations?: any[];
    biographies?: any[];
    addresses?: any[];
    nicknames?: any[];
    birthdays?: any[];
    genders?: any[];
    relations?: any[];
    events?: any[];
    urls?: any[];
    userDefined?: any[];
    memberships?: any[];
};


class GoogleStoreApi {
    contacts = new ApiStore<GooglePerson[]>(apiUrls.GOOGLE_GET_CONTACTS, {});

    constructor() {
        makeAutoObservable(this);
    }
}

export const googleStoreApi = new GoogleStoreApi();
export default googleStoreApi;







// class GoogleStoreApi {
//     contacts: GooglePerson[] = [];
//     loading = false;

//     constructor() {
//         makeAutoObservable(this);
//     }

//     async load() {
//         this.changeLoadStatus(true);
//         try {
//             const res = await fetch("https://waygo.webtm.ru/crm/Google/api1.php");
//             const data: GooglePerson[] = await res.json();

//             runInAction(() => {
//                 this.contacts = data;
//             });
//         } catch (e) {
//             console.error("Failed to load contacts", e);
//         }
//         this.changeLoadStatus(false);
//     }

//     changeLoadStatus(status: boolean) {
//         runInAction(() => {
//             this.loading = status;
//         });
//     }
// }

// get contacts() {
//     return this._contacts;
// }

// set contacts(val) {
//     this._contacts = val;
// }
// contacts = observable.array<GooglePerson>([]);
// this.contacts.replace(data);