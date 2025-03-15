"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Home() {
    const [filters, setFilters] = useState<string[]>([]);
    const [darkMode, setDarkMode] = useState(false); // Ensure SSR consistency
    const [hydrated, setHydrated] = useState(false); // Ensure proper hydration

    useEffect(() => {
        // Prevent hydration mismatches
        setHydrated(true);
        setDarkMode(true); // Default to dark mode after hydration
    }, []);

    const addFilter = (filter: string) => {
        if (filter) setFilters([...filters, filter]);
    };

    const removeFilter = (index: number) => {
        setFilters(filters.filter((_, i) => i !== index));
    };

    const toggleDarkMode = () => {
        setDarkMode((prev) => !prev);
    };

    return (
        <div className={`${hydrated ? "opacity-100" : "opacity-0"} ${darkMode ? "bg-black text-white" : "bg-white text-black"} relative min-h-screen flex flex-col items-center overflow-hidden transition-all duration-300`}>
            {/* Inline Styles for Background & Stars */}
            <style jsx>{`
                @keyframes starAnimation {
                    0% { opacity: 0; transform: translateY(0) translateX(0); }
                    100% { opacity: 1; transform: translateY(100vh) translateX(30vw); }
                }

                .space-background {
                    background: radial-gradient(circle, rgba(20, 20, 40, 0.8) 10%, black 90%);
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    z-index: -1;
                    transition: background 0.3s ease-in-out;
                }

                .shooting-stars {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    overflow: hidden;
                    z-index: -1;
                }

                .shooting-star {
                    position: absolute;
                    width: 2px;
                    height: 80px;
                    background: white;
                    opacity: 0.7;
                    filter: blur(1px);
                    top: -20px;
                    left: 50%;
                    animation: starAnimation 4s linear infinite;
                }
            `}</style>

            {/* Space Background & Shooting Stars */}
            {hydrated && (
                <>
                    <div className={`absolute inset-0 z-0 ${darkMode ? "space-background" : ""}`}></div>
                    <div className="absolute inset-0 z-0 shooting-stars">
                        <div className="shooting-star"></div>
                        <div className="shooting-star"></div>
                        <div className="shooting-star"></div>
                    </div>
                </>
            )}

            {/* Navigation Bar */}
            <nav className="relative z-10 w-full flex justify-between items-center py-4 px-6 bg-gray-900/80 backdrop-blur-md border-b border-blue-500">
                <h1 className="text-xl font-semibold tracking-wide text-blue-400">Stellar Tracer</h1>
                <div className="space-x-6 flex items-center">
                    <Link href="/" className="hover:text-blue-300">Home</Link>
                    <Link href="/about" className="hover:text-blue-300">About</Link>
                    <Link href="/tool-usage" className="hover:text-blue-300">Tool Usage</Link>
                    {/* Dark Mode Toggle */}
                    <button
                        className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-all"
                        onClick={toggleDarkMode}
                    >
                        {darkMode ? "Light Mode ☀️" : "Dark Mode 🌙"}
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="relative z-10 text-center my-8">
                <h2 className="text-5xl font-extrabold text-blue-400 drop-shadow-lg">Welcome to Stellar Tracer!</h2>
                <p className="text-lg text-gray-300 mt-3">Trace the orbits of tidal tail stars in open clusters.</p>
            </header>

            {/* Query Input Section */}
            <section className="relative z-10 bg-gray-900/80 p-6 rounded-lg w-full max-w-3xl shadow-xl backdrop-blur-md border border-blue-500">
                <h3 className="text-lg font-semibold text-blue-300 mb-4">Enter your GAIA ADQL Query:</h3>
                <div className="grid grid-cols-2 gap-4">
                    {["RA", "DEC", "μ*", "RV", "pmra", "pmddec", "Start Epoch", "End Epoch"].map((label) => (
                        <input
                            key={label}
                            type="text"
                            placeholder={label}
                            className="bg-gray-800 text-white placeholder-gray-400 border border-blue-400 focus:ring-blue-500 p-2 rounded-md w-full"
                        />
                    ))}
                </div>
            </section>

            {/* Filters Section */}
            <section className="relative z-10 bg-gray-900/80 p-6 rounded-lg w-full max-w-3xl shadow-xl mt-6 backdrop-blur-md border border-blue-500">
                <h3 className="text-lg font-semibold text-blue-300 mb-4">Choose your Filters:</h3>
                <div className="flex space-x-4">
                    <select className="border border-blue-400 bg-gray-800 text-white p-2 rounded-md" onChange={(e) => addFilter(e.target.value)}>
                        <option value="">Select a filter...</option>
                        <option value="dropNa()">dropNa()</option>
                        <option value="pmra_error<0.1">pmra_error &lt; 0.1</option>
                        <option value="ruwe<1.5">ruwe &lt; 1.4</option>
                    </select>
                    <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">Add Filter</button>
                </div>

                {/* Filter List */}
                <div className="mt-4 space-y-2">
                    {filters.map((filter, index) => (
                        <div key={index} className="flex justify-between items-center bg-gray-800 p-2 rounded-md border border-blue-400">
                            <span>{filter}</span>
                            <button className="text-red-400 hover:text-red-600" onClick={() => removeFilter(index)}>Remove</button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 text-center text-gray-400 mt-10">
                <p>© 2025 Stellar Tracer. All rights reserved.</p>
            </footer>
        </div>
    );
}