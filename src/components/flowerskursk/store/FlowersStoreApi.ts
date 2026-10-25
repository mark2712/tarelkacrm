"use client";

import apiUrls, { apiTokens } from "@/common/api/ApiUrls";
import { ApiStore } from "@/common/api/ApiStore";

export function getToken(token: string = ""): string {
    if (typeof window !== "undefined") {
        token = localStorage[apiTokens.FLOWERS_API_TOKEN.key]
            ? localStorage[apiTokens.FLOWERS_API_TOKEN.key]
            : token;
    }
    return token;
}

export function getUrlDates() {
    if (typeof window === "undefined") return { date1: "", date2: "" };

    const params = new URLSearchParams(window.location.search);

    return {
        date1: params.get("date1") || "",
        date2: params.get("date2") || "",
    };
}

export interface FlowersOrderItemRaw {
    id?: number | string;
    name?: string;
    slug?: string;
    price?: number | string;
    quantity?: number | string;
    total?: number | string;
    image?: string;
    image_url?: string;
    attributes?: Record<string, any>;
}

export interface FlowersRawOrder {
    id: number | string;
    order_number?: string | null;
    status: string;

    // Customer
    customer_name: string;
    customer_phone: string;
    customer_email?: string | null;

    // Recipient & Delivery
    is_recipient_other?: number | boolean | string | null;
    recipient_name?: string | null;
    recipient_phone?: string | null;
    delivery_type: string;
    delivery_city?: string | null;
    delivery_street?: string | null;
    delivery_house?: string | null;
    delivery_apartment?: string | null;
    delivery_entrance?: string | null;
    delivery_floor?: string | null;
    delivery_intercom?: string | null;
    delivery_address?: string | null;
    delivery_date?: string | null;
    delivery_time_slot?: string | null;
    card_text?: string | null;
    is_anonymous?: number | boolean | string | null;
    call_before_delivery?: number | boolean | string | null;
    photo_before_delivery?: number | boolean | string | null;
    customer_notes?: string | null;
    admin_notes?: string | null;

    // Financials
    items_total?: number | string | null;
    delivery_price?: number | string | null;
    discount_price?: number | string | null;
    promo_code?: string | null;
    total_price: number | string;

    // Payment
    payment_method: string;
    payment_status: string;
    payment_id?: string | null;
    paid_at?: string | null;

    // Items
    items?: FlowersOrderItemRaw[] | null;
    items_json?: string | null;

    // Meta
    ip_address?: string | null;
    user_agent?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
}

export const flowersStoreApi = new ApiStore<FlowersRawOrder[]>(
    apiUrls.FLOWERS_GET_ORDERS,
    { token: getToken(), ...getUrlDates() }
);

export default flowersStoreApi;
