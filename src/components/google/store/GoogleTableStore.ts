import { action, reaction } from "mobx";
import { googleStoreApi, GooglePerson } from "@/components/google/store/GoogleStoreApi";
import { OperationsController } from "@/components/common/Table/Operations/store/OperationsController";
import { ISaveProvider } from "@/common/saveData/ISaveProvider";
import { Operation } from "@/components/common/Table/Operations/store/Operation";
import { SaveProvider } from "@/common/saveData/SaveProvider";


export interface Contact {
    name: string;
    email: string;
    phone: string;
    organization: string;
    note: string;
    address: string;
    nickname: string;
    birthday: string;
    gender: string;
    photo: string;
    relation: string;
    event: string;
    url: string;
    userDefined: string;
    labels: string;

    etag: string;
    resourceName: string;
}


class GoogleTableStore extends OperationsController<Contact> {
    constructor(saveProvider: ISaveProvider, operations: Operation<Contact, any>[] = []) {
        super(saveProvider, operations);

        reaction(() => googleStoreApi.data, (value, previousValue, reaction) => {
            this.sourceTable = this.mapToTextAll(value || [])
        });
    }

    @action
    private mapToTextAll(contacts: GooglePerson[]): Contact[] {
        return contacts.map((value) => { return this.mapToText(value) });
    }

    @action
    private mapToText(p: GooglePerson): Contact {

        const nameObj = p.names?.[0];
        const firstName = nameObj?.givenName ?? "";
        const middleName = nameObj?.middleName ?? "";
        const lastName = nameObj?.familyName ?? "";

        const name = [firstName, middleName, lastName].filter(Boolean).join(" ");

        const email = p.emailAddresses?.map(e => e.value).join(", ") ?? "";
        const phone = p.phoneNumbers?.map(ph => ph.value).join(", ") ?? "";

        const organization = p.organizations
            ?.map(o => `${o.name ?? ""} (${o.title ?? ""})`.replace(/\(\)/, "").trim())
            .join(", ") ?? "";

        const note = p.biographies?.map(b => b.value).join(" | ") ?? "";
        const address = p.addresses?.map(a => a.formattedValue).join(" | ") ?? "";
        const nickname = p.nicknames?.map(n => n.value).join(", ") ?? "";

        const birthday = p.birthdays
            ?.map(b => {
                const d = b.date;
                if (!d) return "";
                const y = d.year ?? 0;
                const m = d.month ?? 0;
                const day = d.day ?? 0;
                return `${y}-${String(m).padStart(2, "0")}-${String(day).padStart(2, "0")}`
                    .replace(/^0+-0+-0+$/, "");
            })
            .filter(Boolean)
            .join(", ") ?? "";

        const gender = p.genders?.map(g => g.value.charAt(0).toUpperCase() + g.value.slice(1)).join(", ") ?? "";

        const photo = p.photos?.map(ph => ph.url).join(" | ") ?? "";

        const relation = p.relations
            ?.map(r => {
                const type = r.type ?? "";
                const person = r.person as any;
                let displayName = "";
                if (person && typeof person === "object" && "displayName" in person) {
                    displayName = person.displayName;
                } else if (typeof person === "string") {
                    displayName = person;
                }
                return (type + (displayName ? ` (${displayName})` : "")).trim();
            })
            .join(", ") ?? "";

        const event = p.events
            ?.map(e => {
                const d = e.date;
                const dateString = d ? ` (${d.year}-${d.month}-${d.day})` : "";
                return (e.type ?? "") + dateString;
            })
            .join(", ") ?? "";

        const url = p.urls?.map(u => u.value).join(", ") ?? "";
        const userDefined = p.userDefined?.map(u => `${u.key}: ${u.value}`).join(", ") ?? "";

        // группы
        const labels = p.memberships
            ?.map(m => {
                const id = m.contactGroupMembership?.contactGroupId;
                if (id === "starred") return "⭐Избранное";
                if (id && id !== "myContacts") return id; // Имя группы можно подставить из внешнего словаря, как в PHP
                return "";
            })
            .filter(Boolean)
            .join(", ") ?? "";

        return {
            name,
            email,
            phone,
            organization,
            note,
            address,
            nickname,
            birthday,
            gender,
            photo,
            relation,
            event,
            url,
            userDefined,
            labels,

            etag: p.etag ?? "",
            resourceName: p.resourceName ?? "",
        };
    }
}

export const googleTableStore = new GoogleTableStore(
    new SaveProvider("GoogleContactsOperationStore"),
    []
);



// private mapToText(p: GooglePerson): Contact {
//     return {
//         names: p.names?.map((n: any) => n.displayName).join(", ") ?? "",
//         emails: p.emailAddresses?.map((e: any) => e.value).join(", ") ?? "",
//         phones: p.phoneNumbers?.map((ph: any) => ph.value).join(", ") ?? "",
//         genders: p.genders?.map((g: any) => g.value).join(", ") ?? "",
//         photos: p.photos?.[0]?.url ?? "",
//     };
// }

// export interface Contact {
//     names: string;
//     emails: string;
//     phones: string;
//     genders: string;
//     photos: string;
// }

// export interface Contact {
//     names: string;
//     emails: string;
//     phones: string;
//     genders: string;
//     photos: string;

//     addresses: string;
//     organizations: string;
//     biographies: string;
//     nicknames: string;
//     birthdays: string;
//     relations: string;
//     events: string;
//     urls: string;
//     userDefined: string;
//     memberships: string;

//     ageRange: string;
//     resourceName: string;
//     etag: string;
// }