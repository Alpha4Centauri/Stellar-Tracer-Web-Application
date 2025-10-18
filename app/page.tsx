"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
    const [filters, setFilters] = useState<string[]>([]);
    const [darkMode, setDarkMode] = useState(false);
    const [hydrated, setHydrated] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showCluster, setShowCluster] = useState(false);
    const [showInput, setShowInput] = useState(false);
    const [customFilter, setCustomFilter] = useState("");
    const [starProperties, setStarProperties] = useState<Record<string, string | number> | null>(null);
    const [circlePosition, setCirclePosition] = useState<{ x: number; y: number } | null>(null);

    useEffect(() => {
        setHydrated(true);
        setDarkMode(true);
    }, []);

    const addFilter = (filter: string) => {
        if (filter && !filters.includes(filter)) setFilters([...filters, filter]);
    };

    const removeFilter = (index: number) => {
        setFilters(filters.filter((_, i) => i !== index));
    };

    const handleSearch = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setShowCluster(true);
        }, 21000);
    };

    const handleImageClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const boundingRect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - boundingRect.left;
        const y = e.clientY - boundingRect.top;

        setCirclePosition({ x, y });

        // Mock star properties for demonstration purposes
        const mockStarProperties = {
            ra: (x / boundingRect.width * 360).toFixed(2), // Example RA calculation
            dec: (y / boundingRect.height * 180 - 90).toFixed(2), // Example DEC calculation
            pmra: (Math.random() * 10).toFixed(2),
            pmdec: (Math.random() * 10).toFixed(2),
            rv: (Math.random() * 500 - 250).toFixed(2), // Example RV (randomized value)
        };

        setStarProperties(mockStarProperties);
    };

    return (
        <div className={`${hydrated ? "opacity-100" : "opacity-0"} ${darkMode ? "bg-black text-white" : "bg-white text-black"} relative min-h-screen flex flex-col items-center transition-all duration-300`}>

            {/* Navigation Bar */}
            <nav className="relative z-10 w-full flex justify-between items-center py-4 px-6 bg-gray-900/80 backdrop-blur-md border-b border-blue-500">
                <h1 className="text-xl font-semibold tracking-wide text-blue-400">Stellar Tracer</h1>
                <div className="space-x-6 flex items-center">
                    <Link href="/" className="hover:text-blue-300">Home</Link>
                    <Link href="/orbit-tracing" className="hover:text-blue-300">Orbit Tracing</Link>
                    <button
                        className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-all"
                        onClick={() => setDarkMode(!darkMode)}
                    >
                        {darkMode ? "Light Mode ☀️" : "Dark Mode 🌙"}
                    </button>
                </div>
            </nav>

            {/* Cluster Image and Star Properties */}
            {showCluster ? (
                <div className="flex flex-row h-screen space-x-4 items-center justify-center relative">
                    {/* Cluster Plot */}
                    <div
                        className="relative"
                        style={{ position: "relative", display: "inline-block" }}
                        onClick={handleImageClick}
                    >
                        <Image src="/cluster-plot.png" width={600} height={400} alt="Cluster Plot" className="rounded-lg shadow-lg" />
                        {/* Circle to mark clicked point */}
                        {circlePosition && (
                            <div
                                className="absolute rounded-full bg-black border-2 border-white"
                                style={{
                                    width: "10px",
                                    height: "10px",
                                    top: `${circlePosition.y - 5}px`, // Adjust for circle center alignment
                                    left: `${circlePosition.x - 5}px`, // Adjust for circle center alignment
                                }}
                            ></div>
                        )}
                    </div>

                    {/* Star Properties Box */}
                    {starProperties && (
                        <div className="bg-gray-800 text-white p-4 rounded-lg shadow-lg w-64">
                            <h3 className="text-xl font-semibold text-blue-400 mb-4">Star Properties</h3>
                            <p><strong>RA:</strong> {starProperties.ra}</p>
                            <p><strong>DEC:</strong> {starProperties.dec}</p>
                            <p><strong>PMRA:</strong> {starProperties.pmra}</p>
                            <p><strong>PMDEC:</strong> {starProperties.pmdec}</p>
                            <p><strong>RV:</strong> {starProperties.rv}</p>
                        </div>
                    )}
                </div>
            ) : loading ? (
                <div className="flex flex-col justify-center items-center h-screen">
                    <div className="h-12 w-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-lg text-blue-300">Identifying star clusters...</p>
                </div>
            ) : (
                <>
                    <header className="relative z-10 text-center my-8">
                        <h2 className="text-5xl font-extrabold text-blue-400 drop-shadow-lg">Welcome to Stellar Tracer!</h2>
                        <p className="text-lg text-gray-300 mt-3">Trace the orbits of tidal tail stars in open clusters.</p>
                    </header>

                    {/* ADQL Query Input Section */}
                    <section className="relative z-10 bg-gray-900/80 p-6 rounded-lg w-full max-w-3xl shadow-xl backdrop-blur-md border border-blue-500 mt-6">
                        <h3 className="text-lg font-semibold text-blue-300 mb-4">Enter your GAIA ADQL Query:</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {["RA", "DEC", "μ*", "RV", "pmra", "pmdec", "Start Epoch", "End Epoch", "Search Radius"].map((label) => (
                                <input
                                    key={label}
                                    type="text"
                                    placeholder={label}
                                    className="bg-gray-800 text-white placeholder-gray-400 border border-blue-400 focus:ring-blue-500 p-2 rounded-md w-full"
                                />
                            ))}
                        </div>

                        {/* Filters Section */}
                        <div className="mt-4">
                            <h3 className="text-lg font-semibold text-blue-300 mb-4">Choose your Filters:</h3>
                            <div className="flex space-x-4">
                                <select className="border border-blue-400 bg-gray-800 text-white p-2 rounded-md" onChange={(e) => addFilter(e.target.value)}>
                                    <option value="">Select a filter...</option>
                                    <option value="dropNa()">dropNa()</option>
                                    <option value="pmra_error<0.1">pmra_error &lt; 0.1</option>
                                    <option value="ruwe<1.4">ruwe &lt; 1.4</option>
                                </select>
                                <button
                                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                                    onClick={() => setShowInput(true)}
                                >
                                    Add Custom Filter
                                </button>
                            </div>

                            {/* Custom Filter Input */}
                            {showInput && (
                                <div className="mt-4 flex space-x-2">
                                    <input
                                        type="text"
                                        value={customFilter}
                                        onChange={(e) => setCustomFilter(e.target.value)}
                                        placeholder="Enter custom filter"
                                        className="bg-gray-800 text-white placeholder-gray-400 border border-blue-400 p-2 rounded-md w-full"
                                    />
                                    <button
                                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                        onClick={() => {
                                            if (customFilter.trim()) {
                                                setFilters([...filters, customFilter.trim()]);
                                                setCustomFilter("");
                                                setShowInput(false);
                                            }
                                        }}
                                    >
                                        Add
                                    </button>
                                </div>
                            )}

                            {/* Display Selected Filters */}
                            <div className="mt-4 flex flex-wrap gap-2">
                                {filters.map((filter, index) => (
                                    <span
                                        key={index}
                                        className="bg-blue-600 text-white px-3 py-1 rounded-md flex items-center space-x-2"
                                    >
                                        <span>{filter}</span>
                                        <button
                                            onClick={() => removeFilter(index)}
                                            className="ml-2 bg-red-500 px-2 py-1 rounded-md hover:bg-red-600"
                                        >
                                            ✖
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Search Button */}
                        <div className="mt-6 text-center">
                            <button
                                className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-all"
                                onClick={handleSearch}
                            >
                                Search
                            </button>
                        </div>
                    </section>
                </>
            )}
        </div>
    );
}
