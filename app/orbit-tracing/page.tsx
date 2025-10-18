"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function OrbitTracePage() {
    const [timePeriod, setTimePeriod] = useState("");
    const [loading, setLoading] = useState(false);
    const [showImage, setShowImage] = useState(false);

    const handleTraceOrbit = () => {
        setLoading(true);
        setShowImage(false);

        // Simulate a 5-second loading time before displaying the image
        setTimeout(() => {
            setLoading(false);
            setShowImage(true);
        }, 5000);
    };

    return (
        <div className="bg-black text-white min-h-screen flex flex-col items-center p-8">
            {/* Navigation Bar */}
            <nav className="relative w-full flex justify-between items-center py-4 px-6 bg-gray-900/80 backdrop-blur-md border-b border-blue-500">
                <h1 className="text-xl font-semibold tracking-wide text-blue-400">Stellar Tracer</h1>
                <div className="space-x-6 flex items-center">
                    <Link href="/" className="hover:text-blue-300">Home</Link>
                    <Link href="/orbit-tracing" className="hover:text-blue-300">Orbit Tracing</Link>
                </div>
            </nav>

            {/* Time Period Selection */}
            <div className="flex flex-col items-center mt-6">
                <div className="flex flex-col items-center">
                    <label className="text-blue-300 mb-2">Enter Simulation Length (Myr):</label>
                    <input
                        type="number"
                        placeholder="e.g. -5000 (Myr) for past, 5000 (Myr) for future"
                        value={timePeriod}
                        onChange={(e) => setTimePeriod(e.target.value)}
                        className="bg-gray-800 text-white border border-blue-400 p-2 rounded-md w-80 text-center"
                        style={{ width: "375px", height: "50px" }}
                    />
                </div>

                {/* Trace Orbit Button */}
                <button
                    className="mt-4 px-6 py-2 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600"
                    onClick={handleTraceOrbit}
                >
                    Trace Orbit
                </button>
            </div>

            {/* Circular Loading Indicator */}
            {loading && (
                <div className="mt-6 flex flex-col items-center">
                    <div className="loader"></div>
                    <p className="text-gray-400 text-sm mt-2">Loading...</p>
                </div>
            )}

            {/* Display Image Inside Styled Box After Loading */}
            {showImage && (
                <div className="bg-gray-800 p-4 rounded-lg border border-blue-400 w-full max-w-lg mt-6 flex flex-col items-center">
                    <Image
                        src="/orbit-trace.png" // Replace this with the actual image path
                        alt="Orbit Trace"
                        width={1200}
                        height={800}
                        className="rounded-md"
                    />
                </div>
            )}

            {/* Footer */}
            <footer className="relative text-center text-gray-400 mt-10">
                <p>© 2025 Stellar Tracer. All rights reserved.</p>
            </footer>

            {/* CSS for the rotating loader */}
            <style jsx>{`
                .loader {
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    border: 5px solid transparent;
                    border-top: 5px solid #3b82f6; /* Blue */
                    animation: spin 1s linear infinite;
                }

                @keyframes spin {
                    0% {
                        transform: rotate(0deg);
                    }
                    100% {
                        transform: rotate(360deg);
                    }
                }
            `}</style>
        </div>
    );
}