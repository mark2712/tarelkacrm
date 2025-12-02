"use client";

import { observer } from "mobx-react-lite";
import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { errorBuffer, ErrorData } from "@/common/api/ErrorBufferStore";

export const ErrorPopup = observer(() => {
    if (errorBuffer.errors.length === 0) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
            {errorBuffer.errors.map((error) => (
                <ErrorItem
                    key={error.id}
                    error={error}
                    onClose={() => error.id && errorBuffer.remove(error.id)}
                />
            ))}
        </div>
    );
});

const ErrorItem = ({ error, onClose }: { error: ErrorData; onClose: () => void }) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <Dialog.Root open={expanded} onOpenChange={setExpanded}>
            <div className="bg-red-600 text-white rounded shadow-lg p-3 cursor-pointer hover:shadow-xl transition-all">
                <div className="flex justify-between items-center">
                    <span className="font-bold">Ошибка {error.status == 200 ? error.message : error.status}</span>
                    <div className="flex gap-2">
                        <button
                            className="font-bold px-2 py-1 rounded hover:bg-red-500"
                            onClick={(e) => {
                                e.stopPropagation();
                                onClose();
                            }}
                        >
                            ×
                        </button>
                        <button
                            className="font-bold px-2 py-1 rounded hover:bg-red-500"
                            onClick={(e) => {
                                e.stopPropagation();
                                setExpanded(!expanded);
                            }}
                        >
                            {expanded ? "Свернуть" : "Развернуть"}
                        </button>
                    </div>
                </div>
                {expanded && (
                    <div
                        className="mt-2 text-sm max-h-60 overflow-auto bg-red-50 text-red-900 p-2 rounded"
                        dangerouslySetInnerHTML={{ __html: error.rawHtml }}
                    />
                )}
            </div>
        </Dialog.Root>
    );
};