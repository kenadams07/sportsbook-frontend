import React, { useState, useEffect } from "react";
import { FaInfoCircle, FaStar, FaBolt } from "react-icons/fa";
import { TiEqualsOutline } from "react-icons/ti";
import ImageSkeleton from "./ui/imageSkelleton";

export default function ImageCardGrid({ images, heading }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [activeGame, setActiveGame] = useState(null);
    const [favorites, setFavorites] = useState({});
    const [activeTab, setActiveTab] = useState("jackpot");
    const [jackpotNumbers, setJackpotNumbers] = useState([1, 1, 1]);

    const toggleFavorite = (id) => {
        setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const openModal = (game) => {
        setActiveGame(game);
        setModalOpen(true);
        setActiveTab("jackpot");
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    useEffect(() => {
        let interval;
        if (activeTab === "jackpot" && modalOpen) {
            interval = setInterval(() => {
                setJackpotNumbers([
                    Math.floor(Math.random() * 9) + 1,
                    Math.floor(Math.random() * 9) + 1,
                    Math.floor(Math.random() * 9) + 1,
                ]);
            }, 100);
            setTimeout(() => clearInterval(interval), 2000);
        }
        return () => clearInterval(interval);
    }, [activeTab, modalOpen]);
    const loading = true
    return (
        <section className="p-4 max-w-full">
            <h1 className="text-white font-semibold mb-4">{heading}</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
                {images.map(({ id, name, src, description }) => (
                    <div
                        key={id}
                        className="group relative rounded-md overflow-hidden cursor-pointer w-full"
                        style={{ height: "230px" }}
                    >
                        <img
                            src={src}
                            alt={name}
                            className="w-full h-full object-cover rounded-md transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute top-2 right-2 z-10">
                            <FaInfoCircle
                                className="text-white cursor-pointer"
                                onClick={() => openModal({ id, name, src, description })}
                            />
                        </div>
                        <div className="absolute top-2 left-2 z-10">
                            <FaStar
                                className={`cursor-pointer ${favorites[id] ? "text-yellow-400" : "text-white"
                                    }`}
                                onClick={() => toggleFavorite(id)}
                            />
                        </div>
                        <div className="image-overlay rounded-md">
                            <h3 className="text-lg font-semibold flex-grow flex items-center justify-center">
                                {name}
                            </h3>
                            <button className="btn-primary-bg btn-primary-text btn-primary-hover px-4 py-2 rounded-md font-semibold cursor-pointer">
                                Play
                            </button>
                        </div>
                    </div>
                ))}
            </div>


            {modalOpen && activeGame && (
                <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40">
                    <div className="flex items-center justify-center gap-0.5 p-4 modal-content relative">
                        {/* Card 1 */}

                        <div className="bg-muted-foreground rounded-md p-6 w-[360px] h-[360px] text-card relative z-10">
                            <h3 className="text-lg font-semibold flex-grow flex items-center justify-center">
                                Game Info
                            </h3>
                            <img
                                src={activeGame.src}
                                alt={activeGame.name}
                                className="w-full h-40 object-cover rounded-md"
                            />
                            <div className="my-2 h-px bg-gradient-to-r from-transparent via-ring to-transparent" />
                            <div className="flex justify-between items-center mb-2">
                                <h2 className="text-secondary text-lg font-semibold">
                                    {activeGame.name}
                                </h2>
                                <button className="btn-primary-bg btn-primary-text btn-primary-hover px-4 py-1 rounded-md text-sm">
                                    Play
                                </button>
                            </div>
                            <p className="text-ring text-sm">Sample Description</p>
                        </div>

                        {/* Icon between cards */}
                        <div className="z-20 relative -mx-4">
                            <TiEqualsOutline className="text-yellow-400 text-5xl bg-background p-2 rounded-full shadow-md" />
                        </div>

                        {/* Card 2 */}
                        <div className="bg-muted-foreground rounded-md p-4 w-[260px] h-[360px] text-card relative z-10 flex flex-col ">
                            {/* Toggle */}
                            <div className="flex  mb-4 transition-all ">
                                {["jackpot", "tournaments"].map((tab) => (
                                    <div
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`flex-1 text-center cursor-pointer py-2 text-sm font-semibold transition-all duration-300 ${activeTab === tab
                                            ? "border-b-2 border-button-primary-bg text-secondary"
                                            : "text-ring"
                                            }`}
                                    >
                                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                    </div>
                                ))}
                            </div>

                            {/* Tab Content */}
                            {activeTab === "jackpot" ? (
                                <div className="flex-grow flex justify-center items-center gap-3 text-2xl font-bold">
                                    {jackpotNumbers.map((num, idx) => (
                                        <div
                                            key={idx}
                                            className="w-12 h-12 flex items-center justify-center bg-card text-black rounded-md shadow-inner transition-all duration-300 animate-[verticalScroll_0.6s_ease-in-out]"
                                        >
                                            {num}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="flex-grow flex items-center justify-center text-ring text-sm text-center">
                                    No tournaments available.
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Modal Dismiss Area */}
                    <div
                        className="absolute inset-0"
                        onClick={closeModal}
                        aria-hidden="true"
                    />
                </div>
            )}
        </section>
    );
}
