"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface KineticTextProps {
    text: string;
    className?: string;
}

export default function KineticText({ text, className }: KineticTextProps) {
    const [isHovered, setIsHovered] = useState(false);

    const letters = text.split("");

    return (
        <motion.span
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`inline-block cursor-pointer ${className}`}
        >
            {letters.map((letter, i) => (
                <motion.span
                    key={i}
                    animate={isHovered ? {
                        y: [0, -10, 0, 10, 0],
                        x: [0, Math.random() * 4 - 2, 0],
                        filter: ["blur(0px)", "blur(2px)", "blur(0px)"],
                    } : {
                        y: 0,
                        x: 0,
                        filter: "blur(0px)"
                    }}
                    transition={{
                        duration: 0.4,
                        delay: i * 0.02,
                        repeat: isHovered ? Infinity : 0,
                        repeatType: "mirror"
                    }}
                    className="inline-block"
                >
                    {letter === " " ? "\u00A0" : letter}
                </motion.span>
            ))}
        </motion.span>
    );
}
