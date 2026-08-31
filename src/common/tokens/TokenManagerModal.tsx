"use client";

import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Dialog, Flex, IconButton, Text, Box } from "@radix-ui/themes";
import { LockClosedIcon, Cross2Icon } from "@radix-ui/react-icons";
import { TokenForm } from "./TokenForm";
import tokenStore from "./TokenStore";

export interface TokenManagerModalProps {
    /** Если true, отображать плавающую кнопку в углу экрана (по умолчанию false) */
    showFloatingButton?: boolean;
    /** Произвольный триггер для открытия модалки */
    trigger?: React.ReactNode;
}

export const TokenManagerModal = observer(({
    showFloatingButton = false,
    trigger,
}: TokenManagerModalProps) => {
    const [open, setOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        tokenStore.loadAll();
    }, []);

    const savedCount = mounted ? tokenStore.savedCount : 0;

    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            {/* Пользовательский триггер */}
            {trigger ? (
                <Dialog.Trigger>{trigger}</Dialog.Trigger>
            ) : showFloatingButton ? (
                <div style={{ position: "fixed", top: "12px", right: "16px", zIndex: 40 }}>
                    <Dialog.Trigger>
                        <button
                            type="button"
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "6px",
                                padding: "6px 12px",
                                borderRadius: "9999px",
                                backgroundColor: "var(--color-panel-solid)",
                                border: "1px solid var(--gray-6)",
                                color: "var(--gray-12)",
                                fontSize: "12px",
                                fontWeight: 500,
                                cursor: "pointer",
                                boxShadow: "var(--shadow-1)",
                            }}
                            title="Управление API-токенами"
                        >
                            <LockClosedIcon width="14" height="14" style={{ color: "var(--blue-9)" }} />
                            <span>Ключи API</span>
                            {mounted && (
                                <span
                                    style={{
                                        fontSize: "10px",
                                        fontWeight: "bold",
                                        padding: "1px 6px",
                                        borderRadius: "9999px",
                                        backgroundColor: savedCount > 0 ? "var(--green-4)" : "var(--gray-4)",
                                        color: savedCount > 0 ? "var(--green-11)" : "var(--gray-11)",
                                    }}
                                >
                                    {savedCount}
                                </span>
                            )}
                        </button>
                    </Dialog.Trigger>
                </div>
            ) : null}

            {/* Контент модального окна Radix Themes */}
            <Dialog.Content style={{ maxWidth: 520, padding: "24px" }}>
                <Flex justify="between" align="center" mb="3">
                    <Flex align="center" gap="2">
                        <LockClosedIcon width="18" height="18" style={{ color: "var(--blue-9)" }} />
                        <Dialog.Title style={{ margin: 0, fontSize: "18px" }}>
                            Управление API-токенами
                        </Dialog.Title>
                    </Flex>
                    <Dialog.Close>
                        <IconButton size="1" variant="ghost" color="gray" style={{ cursor: "pointer" }}>
                            <Cross2Icon width="16" height="16" />
                        </IconButton>
                    </Dialog.Close>
                </Flex>

                <Dialog.Description size="2" color="gray" style={{ marginBottom: "16px" }}>
                    Ключи сохраняются в localStorage браузера и используются CRM для авторизации запросов к API.
                </Dialog.Description>

                <TokenForm onSaved={() => {}} />
            </Dialog.Content>
        </Dialog.Root>
    );
});

export default TokenManagerModal;
