import { makeObservable, observable, action, runInAction } from "mobx";
import { apiClient } from "./ApiClient";


export class ApiStore<T> {
    data?: T;
    loading = false;
    loadTime?: number; // <-- время загрузки

    endpoint: string;
    defaultBody?: any;

    constructor(endpoint: string, defaultBody?: any) {
        this.endpoint = endpoint;
        this.defaultBody = defaultBody;

        makeObservable(this, {
            data: observable,
            loading: observable,
            loadTime: observable,
            load: action.bound,
        });
    }

    async load(body?: any) {
        this.loading = true;
        this.loadTime = undefined;

        const start = performance.now(); // <-- старт таймера

        const merged = {
            ...(this.defaultBody || {}),
            ...(body || {})
        };

        const res = await apiClient.send<T>(this.endpoint, merged);

        const end = performance.now();   // <-- конец таймера
        const elapsed = (end - start) / 1000;

        runInAction(() => {
            this.loading = false;

            // только если успешный ответ — записываем данные и время
            if (!res.json || res.json.ok === false) return;

            this.data = res.json.data as T;
            this.loadTime = elapsed;
        });
    }
}




// export class ApiStore<T> {
//     data?: T;
//     loading = false;

//     endpoint: string;
//     defaultBody?: any;

//     constructor(endpoint: string, defaultBody?: any) {
//         this.endpoint = endpoint;
//         this.defaultBody = defaultBody;

//         makeObservable(this, {
//             data: observable,
//             loading: observable,
//             load: action.bound,
//         });
//     }

//     async load(body?: any) {
//         this.loading = true;

//         const merged = {
//             ...(this.defaultBody || {}),
//             ...(body || {})
//         };

//         const res = await apiClient.send<T>(this.endpoint, merged);

//         runInAction(() => {
//             this.loading = false;

//             // Ошибка уже в errorBuffer — здесь просто выходим
//             if (!res.json || res.json.ok === false) return;

//             // Успех → сохраняем data
//             this.data = res.json.data as T;
//         });
//     }
// }
