"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

function randomHex(length: number = 8): string {
    if (length < 1) throw new Error("Length must be at least 1");
    const hex = [...Array(length)]
        .map(() => Math.floor(Math.random() * 16).toString(16))
        .join("");
    return `0x${hex}`;
}

function incrementHex(hex: string): string {
    if (!/^0x[0-9a-fA-F]+$/.test(hex)) {
        throw new Error("Invalid hexadecimal number format");
    }
    const num = BigInt(hex);
    const incremented = num + BigInt(1);
    const hexBody = hex.slice(2); // Remove "0x"
    const incrementedHex = incremented.toString(16).padStart(hexBody.length, "0");
    return `0x${incrementedHex}`;
}

export default function Page() {
    const [divs, setDivs] = useState<string[]>([]);
    const [totalCapacity, setTotalCapacity] = useState<number>(4);
    const [count, setCount] = useState<number>(0);
    const [autoAdjust, setAutoAdjust] = useState<boolean>(false);

    const incrementer = () => {
        if (autoAdjust) {
            if ((count === totalCapacity) && (totalCapacity < 16)) {
                setTotalCapacity((prev) => prev * 2)
            }

            if (count < 16) {
                setDivs((prev) => {
                    // 0x6d0ae09b
                    // const newHex = prev.length === 0 ? randomHex() : incrementHex(prev[prev.length - 1]);
                    const newHex = prev.length === 0 ? "0x6d0ae09b" : incrementHex(prev[prev.length - 1]);
                    return [...prev, newHex];
                });
                setCount((prev) => prev + 1);
            }
        } else {
            if (count !== totalCapacity) {
                setDivs((prev) => {
                    // const newHex = prev.length === 0 ? randomHex() : incrementHex(prev[prev.length - 1]);
                    const newHex = prev.length === 0 ? "0x6d0ae09b" : incrementHex(prev[prev.length - 1]);
                    return [...prev, newHex];
                });
                setCount((prev) => prev + 1);
            }
        }
    };

    const decrementer = () => {
        if (count > 0) {
            setDivs((prev) => prev.slice(0, -1));
            setCount((prev) => prev - 1);
        }
    };

    return (
        <main className="h-screen w-screen flex flex-col justify-start items-start">
            <button onClick={incrementer}>PUSH</button>
            <button onClick={decrementer} disabled={divs.length === 0}>
                POP
            </button>
            <button onClick={() => setAutoAdjust(!autoAdjust)}>TOGGLE RESIZE {autoAdjust ? "ON" : "OFF"}</button>
            <div className="flex flex-grow items-start justify-between flex-col">
                <div>
                    <h1>CAPACITY: {totalCapacity}</h1>
                    <h1>COUNT: {count}</h1>
                </div>
                <div className="relative m-96">
                    <div className="flex flex-col-reverse absolute bottom-0 left-0">
                    {[...Array(totalCapacity)].map((_, index) => (
                            <div
                                key={`empty-${index}`}
                                className={`bg-neutral-50 opacity-50 w-32 flex items-center justify-center px-2 pt-1 border-2 border-r-neutral-900 border-l-neutral-900 border-t-neutral-900 ${index === 0 ? "rounded-b-md border-b-neutral-900" : ""} ${index === totalCapacity - 1 ? "rounded-t-md" : ""}`}
                            >
                                SLOT {index+1}
                            </div>
                        ))}
                    </div>
                    <div className="flex flex-col-reverse absolute bottom-0 left-0">
                        <AnimatePresence>
                            {divs.map((hex, index) => (
                                <motion.div
                                    key={hex} // Use hex as key for uniqueness
                                    initial={{ opacity: 0, filter: "blur(20px)", x: -100 }}
                                    animate={{ opacity: 1, filter: "blur(0px)", x: 0 }}
                                    exit={{ opacity: 0, filter: "blur(20px)", x: -100 }}
                                    transition={{
                                        duration: 0.4,
                                        scale: { type: "spring", visualDuration: 0.4, bounce: 0.5 },
                                    }}
                                    className={`bg-neutral-50 w-32 flex items-center justify-center px-2 pt-1 border-2 border-r-neutral-900 border-l-neutral-900 border-t-neutral-900 ${index === 0 ? "rounded-b-md border-b-neutral-900" : ""} ${index === divs.length - 1 ? "rounded-t-md" : ""}`}
                                >
                                    {hex}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </main>
    );
}
