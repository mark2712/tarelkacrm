import { Operation } from "@/components/common/Table/Operations/store/Operation";
import { Contact } from "../store/GoogleTableStore";
import { CheckboxCards, Flex, Separator, Switch, Text } from "@radix-ui/themes";
import operationCSS from "@/components/common/Table/Operations/operation.module.css";
import { observer } from "mobx-react-lite";


export interface ContactLabelOptions {
    invert: boolean;
    noLabel: boolean;
    labels: Record<string, boolean>;
}

export class LabelsFilter extends Operation<Contact, ContactLabelOptions> {
    constructor() {
        super("LabelsFilter", "Фильтр по меткам", FilterByContactLabelsOptions);
        this.options = {
            invert: false,
            noLabel: false,
            labels: {}
        };
    }

    override apply() {
        const { invert, noLabel, labels = {} } = this.options;

        const enabledLabels = Object.keys(labels)
            .filter(k => labels[k]);

        // если ничего не выбрано (ни меток, ни "без ярлыка") — не фильтруем
        if (!invert && !noLabel && !enabledLabels.length) {
            return this.data;
        }

        return this.data.filter(contact => {
            const hasLabels = Boolean(contact.labels?.trim());
            const contactLabels = hasLabels
                ? contact.labels.split(",").map(x => x.trim())
                : [];

            const matchLabel = enabledLabels.length > 0
                ? enabledLabels.some(l => contactLabels.includes(l))
                : false;

            const matchNoLabel = noLabel && !hasLabels;

            // Основная логика: либо контакт имеет выбранную метку, либо не имеет меток и выбран "без ярлыка"
            let matches = matchLabel || matchNoLabel;

            // Инверсия: если выбрана, то исключаем совпадающие контакты
            if (invert) {
                matches = !matches;
            }

            return matches;
        });
    }
}

export const FilterByContactLabelsOptions = observer(
    ({ operation }: { operation: Operation<Contact, ContactLabelOptions> }) => {
        const { invert, noLabel, labels = {} } = operation.options;

        // Извлекаем все уникальные метки из данных
        const allLabels = Array.from(
            new Set(
                operation.data.flatMap(c =>
                    c.labels?.trim()
                        ? c.labels.split(",")
                            .map(x => x.trim())
                            .filter(x => x)
                        : []
                )
            )
        ).sort();

        // Формируем массив выбранных значений
        const getValue = () => {
            const arr: string[] = [];

            if (invert) arr.push("__invert__");
            if (noLabel) arr.push("__noLabel__");

            Object.entries(labels).forEach(([k, v]) => {
                if (v) arr.push(k);
            });

            return arr;
        };

        return (
            <Flex gap="3" className={operationCSS.FlexOptions}>
                <CheckboxCards.Root
                    value={getValue()}
                    onValueChange={(values) => {
                        // Определяем специальные флаги
                        const isInvert = values.includes("__invert__");
                        const isNoLabel = values.includes("__noLabel__");

                        // Создаем новый объект для меток
                        const newLabels: Record<string, boolean> = {};

                        // Устанавливаем значения для всех существующих меток
                        allLabels.forEach(label => {
                            newLabels[label] = values.includes(label);
                        });

                        operation.setOptions({
                            invert: isInvert,
                            noLabel: isNoLabel,
                            labels: newLabels
                        });
                    }}
                    size="2"
                    className={operationCSS.CheckboxCard}
                >
                    <Flex align="center" gap="4">
                        {/* Специальные чекбоксы */}
                        <Flex justify="start" align="center" mb="2">
                            {/* Переключение операции */}
                            <Switch
                                size="3"
                                checked={invert}
                                onCheckedChange={(v) =>
                                    operation.setOptions({
                                        invert: Boolean(v),
                                        noLabel: operation.options.noLabel,
                                        labels: operation.options.labels
                                    })
                                }
                                className={operationCSS.Switch}
                            />
                            <Text size="2">Исключать <br/> выбранное</Text>
                        </Flex>
                        {/* <CheckboxCards.Item value="__invert__">Исключать выбранное</CheckboxCards.Item> */}
                        <Separator orientation="vertical" />
                        <CheckboxCards.Item value="__noLabel__">Без ярлыка</CheckboxCards.Item>

                        {/* Список меток */}
                        {allLabels.map(label => (
                            <CheckboxCards.Item key={label} value={label}>{label}</CheckboxCards.Item>
                        ))}

                        {/* Сообщение если нет меток */}
                        {allLabels.length === 0 && (
                            <Text size="2" color="gray" style={{ fontStyle: "italic", padding: "8px" }}>В данных нет меток</Text>
                        )}
                    </Flex>
                </CheckboxCards.Root>
            </Flex >
        );
    }
);