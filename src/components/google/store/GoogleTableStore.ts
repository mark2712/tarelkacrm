import { makeAutoObservable, observable, reaction } from "mobx";
import { googleStoreApi, GooglePerson } from "@/components/google/store/GoogleStoreApi";

export interface Contact {
    names: string;
    emails: string;
    phones: string;
    genders: string;
    photos: string;
}

class GoogleTableStore {
    tableContacts = observable.array<Contact>([]);

    constructor() {
        makeAutoObservable(this, {
            tableContacts: observable,
        });

        // реакция на изменение googleStore.contacts.data
        reaction(
            () => googleStoreApi.contacts.data,
            (contacts) => {
                if (contacts) {
                    this.tableContacts.replace(contacts.map((e) => { return this.mapToText(e) }));
                }
            },
            { fireImmediately: true }
        );
    }

    private mapToText(p: GooglePerson): Contact {
        return {
            names: p.names?.map((n: any) => n.displayName).join(", ") ?? "",
            emails: p.emailAddresses?.map((e: any) => e.value).join(", ") ?? "",
            phones: p.phoneNumbers?.map((ph: any) => ph.value).join(", ") ?? "",
            genders: p.genders?.map((g: any) => g.value).join(", ") ?? "",
            photos: p.photos?.[0]?.url ?? "",
        };
    }
}

export const googleTableStore = new GoogleTableStore();
