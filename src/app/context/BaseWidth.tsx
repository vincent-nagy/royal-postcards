"use client"

import React, { Dispatch, SetStateAction, createContext, useContext, useState } from "react";

type BaseWidthState = {
    baseWidth: number;
    setBaseWidth(baseWidth: number): void;
}

const Context = createContext<BaseWidthState | null>(null);

export function BaseWidthProvider({ children }: { children: React.ReactNode }) {
    const [baseWidth, setBaseWidth] = useState(10);
    return (
        <Context.Provider value={{ baseWidth, setBaseWidth }}>{children}</Context.Provider>
    );
}

export function useBaseWidthContext(): BaseWidthState {
    const context = useContext(Context);

    if (!context) {
        throw new Error("Please use ThemeProvider in parent component");
    }

    return context;
}

export default useBaseWidthContext;