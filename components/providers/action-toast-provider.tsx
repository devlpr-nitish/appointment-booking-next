"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { ActionToast } from "@/components/ui/action-toast";

interface ToastData {
    id: string;
    title: string;
    description: string;
    amount?: number;
    categoryName?: string;
    onAccept?: () => void;
    onDecline?: () => void;
    type: "request" | "offer";
    autoCloseMs?: number;
}

interface ActionToastContextType {
    showToast: (data: ToastData) => void;
    dismissToast: (id: string) => void;
}

const ActionToastContext = createContext<ActionToastContextType | null>(null);

export function useActionToast() {
    const context = useContext(ActionToastContext);
    if (!context) {
        throw new Error("useActionToast must be used within ActionToastProvider");
    }
    return context;
}

export function ActionToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<ToastData[]>([]);

    const showToast = useCallback((data: ToastData) => {
        setToasts((prev) => [...prev, data]);
    }, []);

    const dismissToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    return (
        <ActionToastContext.Provider value={{ showToast, dismissToast }}>
            {children}
            <div className="fixed top-4 right-4 z-50 flex flex-col gap-4 max-w-md">
                {toasts.map((toast) => (
                    <ActionToast
                        key={toast.id}
                        {...toast}
                        onDismiss={() => dismissToast(toast.id)}
                    />
                ))}
            </div>
        </ActionToastContext.Provider>
    );
}
