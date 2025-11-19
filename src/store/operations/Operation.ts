import { makeObservable, observable, action } from "mobx";


export class Operation<TData, TOptions = void> {
    id: string;
    label: string;
    enabled = true;

    options!: TOptions;
    OptionsComponent?: React.FC<{ option: TOptions }>;

    data: TData[] = [];

    constructor(id: string, label?: string, OptionsComponent?: any) {
        this.id = id;
        this.label = label ?? id;
        this.OptionsComponent = OptionsComponent;

        makeObservable(this, {
            enabled: observable,
            options: observable,
            data: observable.shallow,
            setEnabled: action,
            setOptions: action,
            apply: action, // по желанию
        });
    }

    setEnabled(v: boolean) {
        this.enabled = v;
    }

    setOptions(o: TOptions) {
        this.options = o;
    }

    serialize() {
        return {
            enabled: this.enabled,
            options: this.options,
        };
    }

    deserialize(json: any) {
        if (!json) return;
        this.enabled = json.enabled ?? this.enabled;
        this.options = json.options ?? this.options;
    }

    apply(): TData[] {
        return this.data;
    }
}



// export class Operation<TData, TOptions = void> {
//     id: string;
//     label: string;
//     enabled: boolean = true;

//     options!: TOptions;
//     OptionsComponent?: React.FC<{ option: TOptions }>;

//     data: TData[] = [];

//     constructor(id: string, label?: string, OptionsComponent?: any) {
//         this.id = id;
//         this.label = label ?? id;
//         this.OptionsComponent = OptionsComponent;

//         makeObservable(this, {
//             enabled: observable,
//             options: observable,
//             data: observable,
//             setEnabled: action,
//             setOptions: action,
//             apply: action, // можно оставить как action или убрать — по желанию
//         });
//     }

//     setEnabled(v: boolean) {
//         this.enabled = v;
//     }

//     setOptions(o: TOptions) {
//         this.options = o;
//     }

//     apply(): TData[] {
//         return this.data;
//     }
// }