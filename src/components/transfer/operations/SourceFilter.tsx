import { Operation } from "@/components/Table/Operations/store/Operation";
import { TLead } from "../store/TransferTableStore";
import { observer } from "mobx-react-lite";
import { CheckboxCards } from "@radix-ui/themes";
import operationCSS from "@/components/Table/Operations/operation.module.css";


export interface ISourceFilterOptions {
    showYandex: boolean;
    showSeo: boolean;
}

export class SourceFilter extends Operation<TLead, ISourceFilterOptions> {
    constructor() {
        super("SourceFilter", "Источник", SourceFilterOptions);

        this.options = {
            showYandex: true,
            showSeo: true,
        };
    }

    override apply() {
        const { showYandex, showSeo } = this.options;

        return this.data
            .map(x => {
                const fp = (x.firstPage ?? "").toLowerCase();
                const fr = (x.firstReferrer ?? "").toLowerCase();
                const url = (x.url ?? "").toLowerCase();

                const hasUtm =
                    fp.includes("utm_") ||
                    fr.includes("utm_") ||
                    url.includes("utm_");

                const sourse = hasUtm ? "yandex" : "seo";

                return { ...x, sourse };
            })
            .filter(x => {
                if (x.sourse === "yandex" && !showYandex) return false;
                if (x.sourse === "seo" && !showSeo) return false;
                return true;
            });
    }
}

export const SourceFilterOptions = observer(
    ({ operation }: { operation: Operation<TLead, ISourceFilterOptions> }) => {
        const { showYandex, showSeo } = operation.options;

        return (
            <CheckboxCards.Root
                value={[
                    ...(showYandex ? ["yandex"] : []),
                    ...(showSeo ? ["seo"] : []),
                ]}
                onValueChange={(values) => {
                    operation.setOptions({
                        showYandex: values.includes("yandex"),
                        showSeo: values.includes("seo"),
                    });
                }}
                size="2"
                className={operationCSS.CheckboxCard}
            >
                <CheckboxCards.Item value="yandex">
                    Yandex
                </CheckboxCards.Item>

                <CheckboxCards.Item value="seo">
                    SEO
                </CheckboxCards.Item>
            </CheckboxCards.Root>
        );
    }
);

// export class SourceFilter extends Operation<TLead, {}> {
//     constructor() {
//         super("SourceFilter", "Определение источника (utm → yandex / seo)");
//         this.options = {}; // нет опций
//     }

//     override apply() {
//         return this.data.map(x => {
//             const fp = (x.firstPage ?? "").toLowerCase();
//             const fr = (x.firstReferrer ?? "").toLowerCase();
//             const url = (x.url ?? "").toLowerCase();

//             const hasUtm =
//                 fp.includes("utm_") ||
//                 fr.includes("utm_") ||
//                 url.includes("utm_");

//             return {
//                 ...x,
//                 sourse: hasUtm ? "yandex" : "seo",
//             };
//         });
//     }
// }