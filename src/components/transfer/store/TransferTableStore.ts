"use client";

import { action, reaction, toJS } from "mobx";
import { OperationsController } from "@/components/common/Table/Operations/store/OperationsController";
import { Operation } from "@/components/common/Table/Operations/store/Operation";

import { ISaveProvider } from "@/common/saveData/ISaveProvider";
import { SaveProvider } from "@/common/saveData/SaveProvider";

import { DeleteTestNames } from "../operations/DeleteTestNames";
import { PeopleFilter } from "../operations/peopleFilter";
import transferStoreApi, { TransferZakaz } from "./TransferStoreApi";
import { TransportNormalizer } from "../operations/TransportNormalizer";
import { CreateTransport } from "../operations/CreateTransport";
import { SourceFilter } from "../operations/SourceFilter";



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

export interface TLead {
    date: string;
    phone: string;
    name1: string;
    comment: string;
    section: string;
    form: string;
    url: string;
    ip: string;
    geo: string;
    transport: string;
    firstReferrer: string;
    firstPage: string;
    calc_all: string;
    all_data: string;
    sourse: string;
}


// применяет фильтры
export class TransferTableStore extends OperationsController<TLead> {
    constructor(saveProvider: ISaveProvider, operations: Operation<TLead, any>[] = []) {
        super(saveProvider, operations);

        reaction(() => transferStoreApi.data, (value, previousValue, reaction) => {
            // this.sourceTable = value;
            this.sourceTable = this.parseAndMapLeadAll(value || [])
        });
    }

    @action
    private parseAndMapLeadAll(leads: TransferZakaz[]) {
        return leads.map(lead => this.parseAndMapLead(lead)).filter(Boolean) as TLead[];
    }

    @action
    private parseAndMapLead(lead: TransferZakaz): TLead | null {
        // console.log("TransferTableStore parseAndMapLead");
        try {
            const parsedData: TransferLeadData = JSON.parse(lead.all_data);

            return {
                date: lead.date_creation_db,
                phone: lead.phone,
                name1: lead.name1,
                comment: parsedData.comment || "",
                section: parsedData.section || "",
                form: parsedData.form || "",
                url: parsedData.url || "",
                ip: parsedData.ip || "",
                geo: parsedData.geo || "",
                transport: parsedData.transport || "",
                firstReferrer: parsedData.first_referrer || "",
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

export const transferTableStore = new TransferTableStore(
    new SaveProvider("TransferOperationStore"),
    [
        new DeleteTestNames(),
        new TransportNormalizer(),
        new CreateTransport(),
        new PeopleFilter(),
        new SourceFilter(),
    ]
);
export default transferTableStore;

