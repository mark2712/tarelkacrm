import { IDataOperation } from "@/store/operations/Operation";

export const normalizePhone = <T extends { phone?: string }>(): IDataOperation<T> => ({
    id: "normalize-phone",
    label: "Приведение телефона к формату",
    enabled: true,
    config: { type: "none" },
    apply(data) {
        return data.map(x => ({
            ...x,
            phone: x.phone ? x.phone.replace(/\D/g, "") : x.phone,
        }));
    }
});
