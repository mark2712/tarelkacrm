"use client";

import { errorBuffer } from "./ErrorBufferStore";


export interface ApiResponseJson<T> {
    ok: boolean;
    data?: T | null;
    error?: {
        code: string | number;
        message: string;
        fields?: string[];
        meta?: any;
    } | null;
    // optional extra fields (trace_id, meta, pagination) - игнорируются в проверке
    [k: string]: any;
}

export interface ApiResponse<T> {
    ok: boolean;              // fetch-level ok (network/HTTP)
    status: number;
    json?: ApiResponseJson<T>;
    rawText: string;
    error?: string;           // ошибка уровня fetch/json/validation
    headers: Record<string, string>;
}


export class ApiClient {
    private buildHeaders(): HeadersInit {
        return { "Content-Type": "application/json" };
    }

    private buildBody(body?: any) {
        return JSON.stringify(body ?? {});
    }

    private isValidEnvelope<T>(obj: any): obj is ApiResponseJson<T> {
        // базовые проверки:
        if (obj == null || typeof obj !== "object") return false;
        if (typeof obj.ok !== "boolean") return false;

        // если ok === true, data может быть любым (включая null), но поле должно существовать или отсутствовать — допускаем оба варианта
        if (obj.ok === true) {
            // допустим: { ok: true, data: ... } или { ok: true } (data optional)
            return true;
        }

        // если ok === false, ожидаем object error с code + message
        if (obj.ok === false) {
            if (!obj.error || typeof obj.error !== "object") return false;
            if (!("code" in obj.error)) return false;
            if (!("message" in obj.error)) return false;
            return true;
        }

        return false; // на всякий
    }

    async send<T>(path: string, body?: any): Promise<ApiResponse<T>> {
        let response: Response;

        try {
            response = await fetch(path, {
                method: "POST",
                headers: this.buildHeaders(),
                body: this.buildBody(body),
            });
        } catch (e: any) {
            const msg = "Network error: " + (e?.message ?? String(e));
            errorBuffer.push({
                message: msg,
                status: 0,
                rawHtml: msg,
                timestamp: Date.now()
            });

            return {
                ok: false,
                status: 0,
                rawText: "",
                error: msg,
                headers: {}
            };
        }

        const rawText = await response.text();

        const headers: Record<string, string> = {};
        response.headers.forEach((v, k) => headers[k] = v);

        // Попытка распарсить JSON
        let parsed: any;
        try {
            parsed = rawText.length ? JSON.parse(rawText) : undefined;
        } catch {
            errorBuffer.push({
                message: `Invalid JSON (${response.status})`,
                status: response.status,
                rawHtml: rawText,
                timestamp: Date.now()
            });

            return {
                ok: false,
                status: response.status,
                rawText,
                error: "Invalid JSON",
                headers
            };
        }

        // Проверка корректности конверта (envelope)
        if (!this.isValidEnvelope<T>(parsed)) {
            // Неподходящая структура — логим и пушим в буфер
            errorBuffer.push({
                message: `Invalid API envelope structure`,
                status: response.status,
                rawHtml: rawText,
                timestamp: Date.now()
            });

            return {
                ok: false,
                status: response.status,
                rawText,
                error: "Invalid API envelope",
                headers
            };
        }

        // Если пришёл HTTP-статус не ok (на уровне протокола)
        if (!response.ok) {
            // всё ещё логируем — потому что прокси/edge могли вернуть 500 с телом с корректной структурой
            errorBuffer.push({
                message: `HTTP ${response.status}: ${response.statusText}`,
                status: response.status,
                rawHtml: rawText,
                timestamp: Date.now()
            });
        }

        // Если API вернул ok: false — пушим в errorBuffer (бизнес-ошибка)
        if (parsed.ok === false) {
            const err = parsed.error;
            errorBuffer.push({
                message: `${err?.code ?? "API_ERROR"}: ${err?.message ?? "No message"}`,
                status: response.status,
                rawHtml: rawText,
                timestamp: Date.now()
            });
        }

        // Всё ок — возвращаем объект с распарсенным json
        return {
            ok: response.ok,
            status: response.status,
            json: parsed as ApiResponseJson<T>,
            rawText,
            headers
        };
    }
}

export const apiClient = new ApiClient();







// interface ApiResponse<T> {
//     ok: boolean;
//     status: number;
//     json?: T;
//     text?: string;
//     rawHtml?: string;
//     error?: string;
//     headers?: Record<string, string>;
// }


// export class ApiClient {
//     private buildBody(body?: any) {
//         const finalBody = { ...body };
//         return JSON.stringify(finalBody);
//     }

//     private buildHeaders(): HeadersInit {
//         const headers: HeadersInit = { "Content-Type": "application/json" };
//         return headers;
//     }

//     async send<T>(path: string, body?: any): Promise<ApiResponse<T>> {
//         let response: Response;

//         try {
//             response = await fetch(path, {
//                 method: "POST",
//                 headers: this.buildHeaders(),
//                 body: this.buildBody(body),
//             });
//         } catch (e: any) {
//             const errorMsg = "Fetch error: " + e.message;

//             errorBuffer.push({
//                 message: errorMsg,
//                 status: 0,
//                 rawHtml: errorMsg,
//                 timestamp: Date.now()
//             });

//             return {
//                 ok: false,
//                 status: 0,
//                 rawHtml: errorMsg,
//                 error: e.message,
//             };
//         }

//         const rawText = await response.text();

//         const headers: Record<string, string> = {};
//         response.headers.forEach((v, k) => headers[k] = v);

//         if (!response.ok) {
//             errorBuffer.push({
//                 message: `HTTP ${response.status}: ${response.statusText}`,
//                 status: response.status,
//                 rawHtml: rawText,
//                 timestamp: Date.now()
//             });

//             return {
//                 ok: false,
//                 status: response.status,
//                 rawHtml: rawText,
//                 text: rawText,
//                 error: `HTTP ${response.status}`,
//                 headers
//             };
//         }

//         try {
//             const json = JSON.parse(rawText);
//             return {
//                 ok: true,
//                 status: response.status,
//                 json,
//                 text: rawText,
//                 rawHtml: rawText,
//                 headers
//             };
//         } catch {
//             errorBuffer.push({
//                 message: "Invalid JSON response",
//                 status: response.status,
//                 rawHtml: rawText,
//                 timestamp: Date.now()
//             });

//             return {
//                 ok: false,
//                 status: response.status,
//                 rawHtml: rawText,
//                 text: rawText,
//                 error: "Invalid JSON",
//                 headers
//             };
//         }
//     }
// }

// export const apiClient = new ApiClient();







// async send<T>(path: string, body?: any): Promise<ApiResponse<T>> {
//     let response: Response;
//     let rawText = "";

//     try {
//         response = await fetch(path, {
//             method: "POST",
//             headers: this.buildHeaders(),
//             body: this.buildBody(body),
//         });

//         rawText = await response.text();

//         // Пытаемся распарсить JSON даже если !response.ok
//         let json: T | undefined;
//         try {
//             json = JSON.parse(rawText);
//         } catch (e) {
//             // Если JSON невалидный
//             errorBuffer.push({
//                 message: "Invalid JSON response",
//                 status: response.status,
//                 rawHtml: rawText,
//                 timestamp: Date.now(),
//             });
//             return { ok: false, status: response.status, text: rawText, error: "Invalid JSON" };
//         }

//         // Добавляем в буфер только если HTTP ошибка
//         if (!response.ok) {
//             errorBuffer.push({
//                 message: `HTTP ${response.status}: ${response.statusText}`,
//                 status: response.status,
//                 rawHtml: rawText,
//                 timestamp: Date.now(),
//             });
//         }

//         return { ok: response.ok, status: response.status, json, text: rawText };
//     } catch (e: any) {
//         const errorMsg = "Fetch error: " + e.message;
//         errorBuffer.push({
//             message: errorMsg,
//             status: 0,
//             rawHtml: errorMsg,
//             timestamp: Date.now(),
//         });
//         return { ok: false, status: 0, error: e.message };
//     }
// }