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

export const googleStoreApi = new ApiStore<GooglePerson[]>(apiUrls.GOOGLE_GET_CONTACTS, {});
export default googleStoreApi;

