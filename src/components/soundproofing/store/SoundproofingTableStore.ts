"use client";

import { action, reaction } from "mobx";
import { OperationsController } from "@/components/common/Table/Operations/store/OperationsController";
import { Operation } from "@/components/common/Table/Operations/store/Operation";

import { ISaveProvider } from "@/common/saveData/ISaveProvider";
import { SaveProvider } from "@/common/saveData/SaveProvider";

import soundproofingStoreApi, { SoundproofingRawLead } from "./SoundproofingStoreApi";

export interface TSoundproofingLead {
    id: string;
    date: string;
    name: string;
    phone: string;
    message: string;
    section: string;
    block: string;
    action: string;
    geo: string;
    geoId: string;
    isMob: string;
    url: string;
    firstReferrer: string;
    firstPage: string;
    ymUid: string;
    ymCounter: string;
    otherData: string;
    ip: string;
    raw: SoundproofingRawLead;
}

export class SoundproofingTableStore extends OperationsController<TSoundproofingLead> {
    constructor(saveProvider: ISaveProvider, operations: Operation<TSoundproofingLead, any>[] = []) {
        super(saveProvider, operations);

        reaction(() => soundproofingStoreApi.data, (value) => {
            this.sourceTable = this.parseAndMapLeads(value || []);
        });
    }

    @action
    private parseAndMapLeads(leads: SoundproofingRawLead[]) {
        return leads.map(lead => this.parseAndMapLead(lead)).filter(Boolean) as TSoundproofingLead[];
    }

    @action
    private parseAndMapLead(lead: SoundproofingRawLead): TSoundproofingLead | null {
        try {
            return {
                id: String(lead.id || ""),
                date: lead.created_at || "",
                name: lead.user_name || "",
                phone: lead.phone || "",
                message: lead.message || "",
                section: lead.section_name || "",
                block: lead.block_name || "",
                action: lead.action_name || "",
                geo: lead.geo || "",
                geoId: lead.geo_id || "",
                isMob: lead.isMob || "",
                url: lead.url || "",
                firstReferrer: lead.first_referer || "",
                firstPage: lead.first_page || "",
                ymUid: lead.ym_uid || "",
                ymCounter: lead.ym_counter || "",
                otherData: lead.other_data || "",
                ip: lead.ip || "",
                raw: lead,
            };
        } catch (error) {
            console.error("Error mapping soundproofing lead:", error, lead);
            return null;
        }
    }
}

export const soundproofingTableStore = new SoundproofingTableStore(
    new SaveProvider("SoundproofingOperationStore"),
    []
);
export default soundproofingTableStore;
