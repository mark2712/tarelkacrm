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

export const googleStoreApi = new ApiStore<GooglePerson[]>(apiUrls.GOOGLE_GET_CONTACTS, {
    'PHPSESSID': '1047d2f5a1df680ba48c90b186a680f3',
    // 'session_token': '4f9612473df0addae8c2c12f992a0968',
    'session_token': 'eedc076c0a0cbfed33b3bc210f64cb11',
});
export default googleStoreApi;

