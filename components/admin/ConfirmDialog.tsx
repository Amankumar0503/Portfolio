"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type ConfirmOptions = {
  title: string;
  message: string;
  confirmLabel?: string;
};

type ConfirmFn = (options: ConfirmOptions) => Promise<boolean>;

const ConfirmContext = createContext<ConfirmFn | null>(null);

export function useConfirm() {
  const confirm = useContext(ConfirmContext);
  if (!confirm) {
    throw new Error("useConfirm must be used within ConfirmProvider");
  }
  return confirm;
}

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const [visible, setVisible] = useState(false);
  const [resolver, setResolver] = useState<((value: boolean) => void) | null>(
    null
  );

  useEffect(() => {
    if (!options) return;
    const frame = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(frame);
  }, [options]);

  const confirm = useCallback((next: ConfirmOptions) => {
    setOptions(next);
    return new Promise<boolean>((resolve) => {
      setResolver(() => resolve);
    });
  }, []);

  const close = (value: boolean) => {
    setVisible(false);
    window.setTimeout(() => {
      resolver?.(value);
      setResolver(null);
      setOptions(null);
    }, 180);
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {options && (
        <div className={`dialog-backdrop fixed inset-0 z-[80] flex items-end justify-center bg-black/50 p-4 transition-opacity duration-200 sm:items-center ${visible ? "opacity-100" : "opacity-0"}`}>
          <div className={`dialog-panel admin-panel w-full max-w-md p-6 shadow-2xl transition-all duration-200 ${visible ? "translate-y-0 scale-100" : "translate-y-3 scale-95"}`}>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
              {options.title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              {options.message}
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" className="admin-btn-ghost" onClick={() => close(false)}>
                Cancel
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700"
                onClick={() => close(true)}
              >
                {options.confirmLabel || "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}
