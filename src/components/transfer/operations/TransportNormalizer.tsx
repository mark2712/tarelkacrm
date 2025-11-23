import { Operation } from "@/components/Table/Operations/store/Operation";
import { TLead } from "../store/TransferTableStore";


// Определить транспорт по URL
export class TransportNormalizer extends Operation<TLead, {}> {
    constructor() {
        super("TransportNormalizer", "Определить транспорт", null);
        this.options = {}; // нет опций
    }

    override apply() {
        return this.data.map(x => {
            const url = (x.url ?? "").toLowerCase();

            let transport: string = "";

            if (url.includes("mikroavtobus")) transport = "Микроавтобусы";
            else if (url.includes("miniven")) transport = "Минивэны";
            else if (url.includes("avtobus")) transport = "Автобусы";

            return {
                ...x,
                transport,
            };
        });
    }
}