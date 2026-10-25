"use client";

import { action, reaction } from "mobx";
import { OperationsController } from "@/components/common/Table/Operations/store/OperationsController";
import { Operation } from "@/components/common/Table/Operations/store/Operation";
import { ISaveProvider } from "@/common/saveData/ISaveProvider";
import { SaveProvider } from "@/common/saveData/SaveProvider";

import flowersStoreApi, { FlowersRawOrder, FlowersOrderItemRaw } from "./FlowersStoreApi";
import { TCustomerCellData } from "../cells/CellCustomer";
import { TRecipientCellData } from "../cells/CellRecipient";
import { TDeliveryCellData } from "../cells/CellDelivery";
import { TPaymentCellData } from "../cells/CellPayment";
import { TPriceCellData } from "../cells/CellPrice";
import { TFlagsCellData } from "../cells/CellFlags";

import { StatusFilter } from "../operations/StatusFilter";
import { PaymentFilter } from "../operations/PaymentFilter";
import { DeliveryTypeFilter } from "../operations/DeliveryTypeFilter";
import { SearchFilter } from "../operations/SearchFilter";

export interface TFlowersOrder {
    id: string;
    orderNumber: string;
    date: string;
    status: string;

    // Customer
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    customerCell: TCustomerCellData;

    // Recipient
    isRecipientOther: boolean;
    recipientName: string;
    recipientPhone: string;
    isAnonymous: boolean;
    recipientCell: TRecipientCellData;

    // Delivery
    deliveryType: string;
    deliveryAddress: string;
    deliveryDate: string;
    deliveryTimeSlot: string;
    deliveryCell: TDeliveryCellData;

    // Card
    cardText: string;

    // Flags & Notes
    callBeforeDelivery: boolean;
    photoBeforeDelivery: boolean;
    customerNotes: string;
    adminNotes: string;
    flagsCell: TFlagsCellData;
    flagsSummary: string;

    // Financials
    itemsTotal: number;
    deliveryPrice: number;
    discountPrice: number;
    promoCode: string;
    totalPrice: number;
    priceCell: TPriceCellData;

    // Payment
    paymentMethod: string;
    paymentStatus: string;
    paidAt: string;
    paymentCell: TPaymentCellData;

    // Items
    items: FlowersOrderItemRaw[];
    itemsSummary: string;

    // Meta & search
    searchIndex: string;
    raw: FlowersRawOrder;
}

export class FlowersTableStore extends OperationsController<TFlowersOrder> {
    constructor(saveProvider: ISaveProvider, operations: Operation<TFlowersOrder, any>[] = []) {
        super(saveProvider, operations);

        reaction(
            () => flowersStoreApi.data,
            (value) => {
                const rawList: FlowersRawOrder[] = Array.isArray(value)
                    ? value
                    : (value && (value as any).items && Array.isArray((value as any).items)
                        ? (value as any).items
                        : []);
                this.sourceTable = this.parseAndMapOrders(rawList);
            }
        );
    }

    @action
    private parseAndMapOrders(orders: FlowersRawOrder[]): TFlowersOrder[] {
        return orders.map((order) => this.parseAndMapOrder(order)).filter(Boolean) as TFlowersOrder[];
    }

    @action
    private parseAndMapOrder(raw: FlowersRawOrder): TFlowersOrder | null {
        try {
            let items: FlowersOrderItemRaw[] = [];
            if (Array.isArray(raw.items)) {
                items = raw.items;
            } else if (raw.items_json) {
                try {
                    items = JSON.parse(raw.items_json);
                } catch {
                    items = [];
                }
            }

            const itemsSummary = items
                .map((it) => `${it.name || "Товар"} (×${it.quantity || 1})`)
                .join(", ");

            const isRecipientOther = Boolean(
                raw.is_recipient_other === 1 ||
                raw.is_recipient_other === true ||
                raw.is_recipient_other === "1"
            );

            const isAnonymous = Boolean(
                raw.is_anonymous === 1 ||
                raw.is_anonymous === true ||
                raw.is_anonymous === "1"
            );

            const callBeforeDelivery = Boolean(
                raw.call_before_delivery === 1 ||
                raw.call_before_delivery === true ||
                raw.call_before_delivery === "1"
            );

            const photoBeforeDelivery = Boolean(
                raw.photo_before_delivery === 1 ||
                raw.photo_before_delivery === true ||
                raw.photo_before_delivery === "1"
            );

            const flagsList: string[] = [];
            if (photoBeforeDelivery) flagsList.push("Фото до отправки");
            if (callBeforeDelivery) flagsList.push("Звонок перед выездом");
            if (isAnonymous) flagsList.push("Анонимно");

            const totalPrice = Number(raw.total_price || 0);
            const itemsTotal = Number(raw.items_total || 0);
            const deliveryPrice = Number(raw.delivery_price || 0);
            const discountPrice = Number(raw.discount_price || 0);

            const customerCell: TCustomerCellData = {
                name: raw.customer_name || "",
                phone: raw.customer_phone || "",
                email: raw.customer_email || undefined,
            };

            const recipientCell: TRecipientCellData = {
                isRecipientOther,
                name: raw.recipient_name || undefined,
                phone: raw.recipient_phone || undefined,
                isAnonymous,
            };

            const addressParts = [
                raw.delivery_city,
                raw.delivery_street,
                raw.delivery_house ? `д. ${raw.delivery_house}` : null,
                raw.delivery_apartment ? `кв./оф. ${raw.delivery_apartment}` : null,
                raw.delivery_entrance ? `подъезд ${raw.delivery_entrance}` : null,
                raw.delivery_floor ? `этаж ${raw.delivery_floor}` : null,
                raw.delivery_intercom ? `домофон ${raw.delivery_intercom}` : null,
            ].filter(Boolean);

            const deliveryAddress = raw.delivery_address || addressParts.join(", ") || "";
            const orderNumber = raw.order_number || (raw.id ? `№${raw.id}` : "");

            const deliveryCell: TDeliveryCellData = {
                type: raw.delivery_type || "courier",
                address: deliveryAddress || undefined,
                date: raw.delivery_date || undefined,
                timeSlot: raw.delivery_time_slot || undefined,
            };

            const paymentCell: TPaymentCellData = {
                status: raw.payment_status || "pending",
                method: raw.payment_method || "online",
                paidAt: raw.paid_at || undefined,
            };

            const priceCell: TPriceCellData = {
                total: totalPrice,
                itemsTotal,
                delivery: deliveryPrice,
                discount: discountPrice,
                promoCode: raw.promo_code || undefined,
            };

            const flagsCell: TFlagsCellData = {
                callBeforeDelivery,
                photoBeforeDelivery,
                isAnonymous,
                customerNotes: raw.customer_notes || undefined,
                adminNotes: raw.admin_notes || undefined,
            };

            const searchIndex = [
                raw.id,
                raw.order_number,
                raw.customer_name,
                raw.customer_phone,
                raw.customer_email,
                raw.recipient_name,
                raw.recipient_phone,
                deliveryAddress,
                raw.card_text,
                raw.customer_notes,
                raw.admin_notes,
                itemsSummary,
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            return {
                id: String(raw.id || ""),
                orderNumber: orderNumber || String(raw.id || ""),
                date: raw.created_at || "",
                status: raw.status || "new",

                customerName: raw.customer_name || "",
                customerPhone: raw.customer_phone || "",
                customerEmail: raw.customer_email || "",
                customerCell,

                isRecipientOther,
                recipientName: raw.recipient_name || "",
                recipientPhone: raw.recipient_phone || "",
                isAnonymous,
                recipientCell,

                deliveryType: raw.delivery_type || "courier",
                deliveryAddress: deliveryAddress,
                deliveryDate: raw.delivery_date || "",
                deliveryTimeSlot: raw.delivery_time_slot || "",
                deliveryCell,

                cardText: raw.card_text || "",

                callBeforeDelivery,
                photoBeforeDelivery,
                customerNotes: raw.customer_notes || "",
                adminNotes: raw.admin_notes || "",
                flagsCell,
                flagsSummary: flagsList.join(", "),

                itemsTotal,
                deliveryPrice,
                discountPrice,
                promoCode: raw.promo_code || "",
                totalPrice,
                priceCell,

                paymentMethod: raw.payment_method || "online",
                paymentStatus: raw.payment_status || "pending",
                paidAt: raw.paid_at || "",
                paymentCell,

                items,
                itemsSummary,

                searchIndex,
                raw,
            };
        } catch (error) {
            console.error("Error mapping flowers order:", error, raw);
            return null;
        }
    }
}

export const flowersTableStore = new FlowersTableStore(
    new SaveProvider("FlowersOrderOperationStore"),
    [
        new StatusFilter(),
        new PaymentFilter(),
        new DeliveryTypeFilter(),
        new SearchFilter(),
    ]
);

export default flowersTableStore;
