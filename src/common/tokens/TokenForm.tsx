"use client";

import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import tokenStore, { TokenItem } from "./TokenStore";
import { apiTokens, ApiTokenInfo } from "@/common/api/ApiUrls";
import {
    Flex,
    Box,
    Text,
    TextField,
    Button,
    Badge,
    Separator,
    Callout,
    Checkbox,
    Card,
    IconButton,
    Select,
} from "@radix-ui/themes";
import {
    LockClosedIcon,
    EyeOpenIcon,
    EyeNoneIcon,
    CheckIcon,
    TrashIcon,
    CopyIcon,
    Pencil1Icon,
    InfoCircledIcon,
    Cross2Icon,
} from "@radix-ui/react-icons";

export interface TokenFormProps {
    onSaved?: (key: string) => void;
}

export const TokenForm = observer(({ onSaved }: TokenFormProps) => {
    const [selectedKey, setSelectedKey] = useState<string>(apiTokens.SOUNDPROOFING_API_TOKEN.key);
    const [tokenValue, setTokenValue] = useState<string>("");
    const [showDropdown, setShowDropdown] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [visibleValues, setVisibleValues] = useState<Record<string, boolean>>({});
    const [feedback, setFeedback] = useState<{ type: "success" | "info" | "error"; text: string } | null>(null);

    // При первой загрузке или смене ключа подтягиваем значение, если оно сохранено
    useEffect(() => {
        if (selectedKey && tokenStore.hasToken(selectedKey)) {
            setTokenValue(tokenStore.getToken(selectedKey));
        }
    }, [selectedKey]);

    const handleSelectDropdown = (val: string) => {
        setSelectedKey(val);
        if (tokenStore.hasToken(val)) {
            setTokenValue(tokenStore.getToken(val));
            setFeedback({
                type: "info",
                text: `Загружен ключ "${val}"`,
            });
        } else {
            setTokenValue("");
            setFeedback(null);
        }
    };

    const handleEditItem = (item: TokenItem) => {
        setSelectedKey(item.key);
        setTokenValue(item.value);
        setFeedback({
            type: "info",
            text: `Ключ "${item.key}" загружен в форму`,
        });
    };

    const handleSave = (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        const key = selectedKey.trim();
        if (!key) {
            setFeedback({ type: "error", text: "Укажите название ключа (логин)" });
            return;
        }

        tokenStore.setToken(key, tokenValue);
        setFeedback({
            type: "success",
            text: `Ключ "${key}" успешно сохранен в localStorage`,
        });

        if (onSaved) onSaved(key);
    };

    const handleDeleteItem = (key: string) => {
        tokenStore.deleteToken(key);
        if (selectedKey === key) {
            setTokenValue("");
        }
        setFeedback({
            type: "info",
            text: `Ключ "${key}" удален из localStorage`,
        });
    };

    const handleCopy = (val: string, key: string) => {
        navigator.clipboard.writeText(val);
        setFeedback({
            type: "success",
            text: `Значение "${key}" скопировано в буфер`,
        });
    };

    const toggleShowRowValue = (key: string) => {
        setVisibleValues((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const savedItems = tokenStore.savedTokenItems;
    const predefinedTokens = Object.values(apiTokens);
    const currentTokenDef = predefinedTokens.find((t) => t.key === selectedKey);

    return (
        <Flex direction="column" gap="4" style={{ width: "100%" }}>
            {/* Сообщение обратной связи */}
            {feedback && (
                <Callout.Root
                    color={feedback.type === "success" ? "green" : feedback.type === "error" ? "red" : "blue"}
                    size="1"
                >
                    <Callout.Icon>
                        {feedback.type === "success" ? <CheckIcon /> : <InfoCircledIcon />}
                    </Callout.Icon>
                    <Flex justify="between" align="center" style={{ width: "100%" }}>
                        <Callout.Text>{feedback.text}</Callout.Text>
                        <IconButton
                            size="1"
                            variant="ghost"
                            color="gray"
                            onClick={() => setFeedback(null)}
                            style={{ cursor: "pointer" }}
                        >
                            <Cross2Icon width="12" height="12" />
                        </IconButton>
                    </Flex>
                </Callout.Root>
            )}

            {/* Форма ввода (Card) */}
            <Card style={{ padding: "16px", backgroundColor: "var(--gray-2)" }}>
                <form onSubmit={handleSave}>
                    <Flex direction="column" gap="3">
                        {/* 1. Название ключа */}
                        <Box>
                            <Flex justify="between" align="center" mb="2">
                                <Text as="label" size="2" weight="bold" style={{ color: "var(--gray-12)" }}>
                                    1. Название ключа (логин):
                                </Text>

                                {/* Галочка: Показать названия */}
                                <Flex align="center" gap="2">
                                    <Checkbox
                                        id="show-predefined-names"
                                        checked={showDropdown}
                                        onCheckedChange={(checked) => {
                                            const isChecked = Boolean(checked);
                                            setShowDropdown(isChecked);
                                            if (isChecked && !predefinedTokens.some((t) => t.key === selectedKey)) {
                                                handleSelectDropdown(predefinedTokens[0].key);
                                            }
                                        }}
                                    />
                                    <Text
                                        as="label"
                                        htmlFor="show-predefined-names"
                                        size="2"
                                        style={{ cursor: "pointer", userSelect: "none" }}
                                    >
                                        Показать названия
                                    </Text>
                                </Flex>
                            </Flex>

                            {/* Поле ввода или выпадающий список */}
                            {showDropdown ? (
                                <Select.Root value={selectedKey} onValueChange={handleSelectDropdown} size="2">
                                    <Select.Trigger style={{ width: "100%", cursor: "pointer" }} />
                                    <Select.Content position="popper">
                                        <Select.Group>
                                            <Select.Label>Системные ключи API</Select.Label>
                                            {predefinedTokens.map((item) => {
                                                const hasVal = tokenStore.hasToken(item.key);
                                                return (
                                                    <Select.Item key={item.key} value={item.key} style={{ cursor: "pointer" }}>
                                                        <Flex align="center" gap="2">
                                                            <Text style={{ fontFamily: "monospace" }}>{item.key}</Text>
                                                            {hasVal && (
                                                                <Badge color="green" size="1">
                                                                    Сохранен
                                                                </Badge>
                                                            )}
                                                        </Flex>
                                                    </Select.Item>
                                                );
                                            })}
                                        </Select.Group>
                                    </Select.Content>
                                </Select.Root>
                            ) : (
                                <TextField.Root
                                    placeholder="Введите название ключа (например, SOUNDPROOFING_API_TOKEN)"
                                    value={selectedKey}
                                    onChange={(e) => setSelectedKey(e.target.value)}
                                    size="2"
                                    style={{ fontFamily: "monospace" }}
                                >
                                    <TextField.Slot>
                                        <LockClosedIcon height="16" width="16" />
                                    </TextField.Slot>
                                </TextField.Root>
                            )}

                            {currentTokenDef && (
                                <Text size="1" color="gray" style={{ marginTop: "4px", display: "block" }}>
                                    {currentTokenDef.description}
                                </Text>
                            )}
                        </Box>

                        {/* 2. Ключ (пароль / токен) */}
                        <Box>
                            <Text as="label" size="2" weight="bold" style={{ color: "var(--gray-12)", marginBottom: "6px", display: "block" }}>
                                2. Ключ (пароль / значение):
                            </Text>

                            <TextField.Root
                                type={showPassword ? "text" : "password"}
                                placeholder="Введите или вставьте значение ключа..."
                                value={tokenValue}
                                onChange={(e) => setTokenValue(e.target.value)}
                                size="2"
                                style={{ fontFamily: "monospace" }}
                            >
                                <TextField.Slot>
                                    <LockClosedIcon height="16" width="16" />
                                </TextField.Slot>
                                <TextField.Slot>
                                    <IconButton
                                        type="button"
                                        size="1"
                                        variant="ghost"
                                        color="gray"
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={{ cursor: "pointer" }}
                                        title={showPassword ? "Скрыть" : "Показать"}
                                    >
                                        {showPassword ? (
                                            <EyeNoneIcon width="14" height="14" />
                                        ) : (
                                            <EyeOpenIcon width="14" height="14" />
                                        )}
                                    </IconButton>
                                </TextField.Slot>
                            </TextField.Root>
                        </Box>

                        {/* Кнопка Сохранить */}
                        <Flex justify="end" pt="2">
                            <Button type="submit" size="2" color="blue" style={{ cursor: "pointer" }}>
                                <CheckIcon width="16" height="16" />
                                Сохранить
                            </Button>
                        </Flex>
                    </Flex>
                </form>
            </Card>

            <Separator size="4" />

            {/* Список сохраненных ключей в localStorage */}
            <Box>
                <Flex justify="between" align="center" mb="2">
                    <Text size="2" weight="bold" style={{ color: "var(--gray-12)" }}>
                        Сохраненные ключи в localStorage
                    </Text>
                    <Badge color={savedItems.length > 0 ? "green" : "gray"} size="1">
                        {savedItems.length}
                    </Badge>
                </Flex>

                {savedItems.length === 0 ? (
                    <Card style={{ padding: "20px", textAlign: "center", backgroundColor: "var(--gray-1)" }}>
                        <Text size="2" color="gray">
                            Нет сохраненных ключей в localStorage
                        </Text>
                    </Card>
                ) : (
                    <Flex direction="column" gap="2" style={{ maxHeight: "220px", overflowY: "auto" }}>
                        {savedItems.map((item) => {
                            const isVisible = Boolean(visibleValues[item.key]);
                            const isSelected = selectedKey === item.key;

                            return (
                                <Card
                                    key={item.key}
                                    variant={isSelected ? "classic" : "surface"}
                                    style={{
                                        padding: "10px 12px",
                                        borderColor: isSelected ? "var(--blue-9)" : undefined,
                                        backgroundColor: isSelected ? "var(--blue-2)" : undefined,
                                    }}
                                >
                                    <Flex justify="between" align="center" gap="2">
                                        <Box style={{ minWidth: 0, flex: 1 }}>
                                            <Flex align="center" gap="2" style={{ marginBottom: "2px" }}>
                                                <Text size="2" weight="bold" style={{ fontFamily: "monospace" }}>
                                                    {item.key}
                                                </Text>
                                                {item.isPredefined ? (
                                                    <Badge color="blue" size="1">
                                                        Системный
                                                    </Badge>
                                                ) : (
                                                    <Badge color="purple" size="1">
                                                        Свой
                                                    </Badge>
                                                )}
                                            </Flex>

                                            <Flex align="center" gap="2">
                                                <Text size="1" color="gray" style={{ fontFamily: "monospace" }}>
                                                    {isVisible
                                                        ? item.value || "<пустая строка>"
                                                        : item.value.length > 8
                                                        ? `••••••••${item.value.slice(-4)}`
                                                        : item.value.length > 0
                                                        ? "••••••••"
                                                        : "<пустая строка>"}
                                                </Text>
                                                <IconButton
                                                    type="button"
                                                    size="1"
                                                    variant="ghost"
                                                    color="gray"
                                                    onClick={() => toggleShowRowValue(item.key)}
                                                    style={{ cursor: "pointer" }}
                                                    title={isVisible ? "Скрыть" : "Показать"}
                                                >
                                                    {isVisible ? (
                                                        <EyeNoneIcon width="12" height="12" />
                                                    ) : (
                                                        <EyeOpenIcon width="12" height="12" />
                                                    )}
                                                </IconButton>
                                            </Flex>
                                        </Box>

                                        {/* Кнопки действий над ключом */}
                                        <Flex align="center" gap="2">
                                            <Button
                                                type="button"
                                                size="1"
                                                variant={isSelected ? "solid" : "soft"}
                                                color="blue"
                                                onClick={() => handleEditItem(item)}
                                                style={{ cursor: "pointer" }}
                                                title="Заполнить в форму"
                                            >
                                                <Pencil1Icon width="12" height="12" />
                                                {isSelected ? "В форме" : "Выбрать"}
                                            </Button>

                                            <IconButton
                                                type="button"
                                                size="1"
                                                variant="soft"
                                                color="gray"
                                                onClick={() => handleCopy(item.value, item.key)}
                                                style={{ cursor: "pointer" }}
                                                title="Копировать значение"
                                            >
                                                <CopyIcon width="12" height="12" />
                                            </IconButton>

                                            <IconButton
                                                type="button"
                                                size="1"
                                                variant="soft"
                                                color="red"
                                                onClick={() => handleDeleteItem(item.key)}
                                                style={{ cursor: "pointer" }}
                                                title="Удалить ключ"
                                            >
                                                <TrashIcon width="12" height="12" />
                                            </IconButton>
                                        </Flex>
                                    </Flex>
                                </Card>
                            );
                        })}
                    </Flex>
                )}
            </Box>
        </Flex>
    );
});

export default TokenForm;
