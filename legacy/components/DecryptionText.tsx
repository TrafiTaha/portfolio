"use client";

import { useState, useEffect, useCallback } from "react";

interface DecryptionTextProps {
    text: string;
    className?: string;
    delay?: number;
    speed?: number;
}

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";

export default function DecryptionText({ text, className, delay = 0, speed = 50 }: DecryptionTextProps) {
    const [displayText, setDisplayText] = useState("");
    const [isAnimating, setIsAnimating] = useState(false);

    const animate = useCallback(() => {
        setIsAnimating(true);
        let iteration = 0;
        const interval = setInterval(() => {
            setDisplayText(prev =>
                text.split("")
                    .map((char, index) => {
                        if (index < iteration) {
                            return text[index];
                        }
                        return CHARS[Math.floor(Math.random() * CHARS.length)];
                    })
                    .join("")
            );

            if (iteration >= text.length) {
                clearInterval(interval);
                setIsAnimating(false);
            }

            iteration += 1 / 3;
        }, speed);

        return () => clearInterval(interval);
    }, [text, speed]);

    useEffect(() => {
        const timeout = setTimeout(animate, delay);
        return () => clearTimeout(timeout);
    }, [animate, delay]);

    return (
        <span className={className}>
            {displayText || " "}
        </span>
    );
}
