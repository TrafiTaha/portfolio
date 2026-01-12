"use client";

import { useState, useRef, useEffect } from "react";
import { Terminal, Send } from "lucide-react";

const SUCCESS_ANIMATION_DELAY = 1500;

export default function ContactTerminal() {
    const [history, setHistory] = useState<string[]>([
        "Last login: " + new Date().toUTCString() + " on ttys001",
        "Type 'contact --send' to initialize secure connection.",
    ]);
    const [input, setInput] = useState("");
    const [step, setStep] = useState<"IDLE" | "NAME" | "EMAIL" | "MESSAGE" | "SENDING">("IDLE");
    const [formData, setFormData] = useState({ name: "", email: "", message: "" });
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [history]);

    const addToHistory = (line: string) => {
        setHistory((prev) => [...prev, line]);
    };

    const handleCommand = (e: React.FormEvent) => {
        e.preventDefault();
        const cleanInput = input.trim();
        if (!cleanInput) return;

        addToHistory(`> ${cleanInput}`);
        setInput("");

        if (step === "IDLE") {
            if (cleanInput === "contact --send") {
                addToHistory("Initializing Secure Handshake...");
                setTimeout(() => {
                    addToHistory("Enter your IDENTITY (Name):");
                    setStep("NAME");
                }, 500);
            } else {
                addToHistory(`Command not found: ${cleanInput}`);
            }
        } else if (step === "NAME") {
            setFormData(prev => ({ ...prev, name: cleanInput }));
            addToHistory("Identity Verified.");
            addToHistory("Enter Transmission Frequency (Email):");
            setStep("EMAIL");
        } else if (step === "EMAIL") {
            setFormData(prev => ({ ...prev, email: cleanInput }));
            addToHistory("Frequency Locked.");
            addToHistory("Enter Data Payload (Message):");
            setStep("MESSAGE");
        } else if (step === "MESSAGE") {
            setFormData(prev => ({ ...prev, message: cleanInput }));
            addToHistory("Encrypting payload...");
            setStep("SENDING");

            // Simulate sending
            setTimeout(() => {
                addToHistory("Uploading packet to server [====================] 100%");
                addToHistory("SUCCESS: Data Packet Sent Successfully.");
                addToHistory("Redirecting to secure channel (LinkedIn)...");

                setTimeout(() => {
                    window.open("https://www.linkedin.com/in/taha-ben-romdhane-765b09371", "_blank");
                    addToHistory("Session terminated.");
                    setStep("IDLE");
                    setFormData({ name: "", email: "", message: "" });
                    addToHistory("Type 'contact --send' to start new session.");
                }, 1000);
            }, SUCCESS_ANIMATION_DELAY);
        }
    };

    return (
        <div className="font-mono text-sm h-full flex flex-col bg-black p-4 rounded-lg overflow-hidden border border-white/10 shadow-inner">
            <div className="flex-1 overflow-y-auto space-y-1 mb-2 scrollbar-hide" ref={scrollRef}>
                {history.map((line, i) => (
                    <div key={i} className={`${line.startsWith(">") ? "text-cyan-400" : line.includes("SUCCESS") ? "text-green-400" : "text-gray-300"}`}>
                        {line}
                    </div>
                ))}
                {step === "SENDING" && (
                    <div className="text-yellow-400 animate-pulse">Transmission in progress...</div>
                )}
            </div>

            <form onSubmit={handleCommand} className="flex items-center gap-2 border-t border-white/10 pt-2">
                <span className="text-green-500">➜</span>
                <span className="text-cyan-400">~</span>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="bg-transparent border-none outline-none text-white flex-1 focus:ring-0 placeholder:text-gray-700"
                    placeholder={step === "IDLE" ? "Type command..." : "Enter data..."}
                    autoFocus
                    disabled={step === "SENDING"}
                />
            </form>
        </div>
    );
}
