import { Operation } from "@/components/Table/Operations/store/Operation";
import { TLead } from "../store/TransferTableStore";
import { CheckboxCards } from "@radix-ui/themes";
import operationCSS from "@/components/Table/Operations/operation.module.css";
import { observer } from "mobx-react-lite";


export interface ICreateTransportOptions {
    avtobus: boolean;
    mikroavtobus: boolean;
    miniven: boolean;
    unknown: boolean;
}

export class CreateTransport extends Operation<TLead, ICreateTransportOptions> {
    constructor() {
        super("CreateTransport", "Фильтр по транспорту", CreateTransportOptions);

        this.options = {
            avtobus: true,
            mikroavtobus: true,
            miniven: true,
            unknown: true
        };
    }

    override apply() {
        const { avtobus, mikroavtobus, miniven, unknown } = this.options;

        return this.data.filter(x => {
            const tr = x.transport;

            if (tr === "Микроавтобусы") return mikroavtobus;
            if (tr === "Автобусы") return avtobus;
            if (tr === "Минивэны") return miniven;

            // transport == undefined
            return unknown;
        });
    }
}


export const CreateTransportOptions = observer(
    ({ operation }: { operation: Operation<TLead, ICreateTransportOptions> }) => {
        const { avtobus, mikroavtobus, miniven, unknown } = operation.options;

        const getValue = () => {
            const arr: string[] = [];
            if (avtobus) arr.push("avtobus");
            if (mikroavtobus) arr.push("mikroavtobus");
            if (miniven) arr.push("miniven");
            if (unknown) arr.push("unknown");
            return arr;
        };

        return (
            <CheckboxCards.Root
                value={getValue()}
                onValueChange={(values) => {
                    operation.setOptions({
                        avtobus: values.includes("avtobus"),
                        mikroavtobus: values.includes("mikroavtobus"),
                        miniven: values.includes("miniven"),
                        unknown: values.includes("unknown")
                    });
                }}
                size="2"
                className={operationCSS.CheckboxCard}
            >
                <CheckboxCards.Item value="avtobus">Автобусы</CheckboxCards.Item>
                <CheckboxCards.Item value="mikroavtobus">Микроавтобусы</CheckboxCards.Item>
                <CheckboxCards.Item value="miniven">Минивэны</CheckboxCards.Item>
                <CheckboxCards.Item value="unknown">Не указан</CheckboxCards.Item>
            </CheckboxCards.Root>
        );
    }
);