import { makeAutoObservable, observable, reaction } from "mobx";
import { transferStoreApi, TransferZakaz } from "@/components/transfer/store/TransferStoreApi";


export interface TransferLeadData {
    name1: string;
    phone: string;
    comment: string;
    section: string;
    form: string;
    url: string;
    ip: string;
    calc_all: string;
    geo: string;
    transport: string;
    first_referrer: string;
    first_page: string;
}

export interface ProcessedLead {
    phone: string;
    name1: string;
    comment: string;
    section: string;
    form: string;
    url: string;
    ip: string;
    geo: string;
    transport: string;
    first_referrer: string;
    firstPage: string;
    calc_all: string;
    all_data: string;
    sourse: string;
}


export class TransferTableStore {
    tableLeads = observable.array<ProcessedLead>([]);

    constructor() {
        makeAutoObservable(this, {
            tableLeads: observable,
        });

        // Реакция на изменение transferStoreApi.leads.data
        reaction(
            () => transferStoreApi.leads.data,
            (leads) => {
                if (leads) {
                    const processedLeads = leads.map(lead => this.parseAndMapLead(lead));
                    this.tableLeads.replace(processedLeads.filter(Boolean) as ProcessedLead[]);
                }
            },
            { fireImmediately: true }
        );
    }

    private parseAndMapLead(lead: TransferZakaz): ProcessedLead | null {
        try {
            const parsedData: TransferLeadData = JSON.parse(lead.all_data);

            return {
                phone: lead.phone,
                name1: lead.name1,
                comment: parsedData.comment || "",
                section: parsedData.section || "",
                form: parsedData.form || "",
                url: parsedData.url || "",
                ip: parsedData.ip || "",
                geo: parsedData.geo || "",
                transport: parsedData.transport || "",
                first_referrer: parsedData.first_referrer || "",
                firstPage: parsedData.first_page || "",
                calc_all: parsedData.calc_all || "",
                all_data: lead.all_data,
                sourse: "",
            };
        } catch (error) {
            console.error('Error parsing lead all_data:', error, lead);
            return null; // или можно вернуть fallback объект
        }
    }
}

export const transferTableStore = new TransferTableStore();




// // Расширенный тип с распарсенными данными
// export type TransferZakazParsed = Omit<TransferZakaz, 'all_data'> & {
//     all_data: TransferLeadData;
//     all_data_raw: string; // сохраняем оригинальную строку на всякий случай
// };

// Дополнительные методы если нужны
// getLeadsBySection(section: string): ProcessedLead[] {
//     return this.tableLeads.filter(lead => lead.section === section);
// }

// getLeadsByGeo(geo: string): ProcessedLead[] {
//     return this.tableLeads.filter(lead => lead.geo === geo);
// }


