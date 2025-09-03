import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';

const CasinoTournaments = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("tournaments");

  // Navigation tabs
  const tabs = [
    { id: "home", label: "Home" },
    { id: "tournaments", label: "Tournaments" }
  ];

  // Handle tab change
  const handleTabChange = (tabId) => {
    if (tabId === "home") {
      navigate("/casino/slots");
    } else {
      setActiveTab(tabId);
    }
  };

  const tournaments = [
    {
      id: 1,
      title: "Summer Slots Championship",
      prize: "$50,000",
      dates: "Aug 1 - Aug 31, 2025",
      image: "https://placehold.co/400x200/2a2a2a/FFA500?text=Summer+Championship"
    },
    {
      id: 2,
      title: "Weekend Warriors",
      prize: "$10,000",
      dates: "Every Weekend",
      image: "https://placehold.co/400x200/2a2a2a/FF5500?text=Weekend+Warriors"
    },
    {
      id: 3,
      title: "Megaways Masters",
      prize: "$25,000",
      dates: "Sep 15 - Sep 30, 2025",
      image: "https://placehold.co/400x200/2a2a2a/00AAFF?text=Megaways+Masters"
    }
  ];

  return (
    <div className="bg-black text-white min-h-screen pb-10">
      {/* Banner */}
      <div className="relative w-full h-[300px] overflow-hidden">
        <img 
          src="https://placehold.co/1600x600/2a2a2a/FFCC00?text=Casino+Tournaments" 
          alt="Tournaments Banner" 
          className="w-full h-full object-cover"
        />
        
        {/* Navigation Tabs Overlay */}
        <div className="absolute top-0 left-0 right-0 flex space-x-8 px-8 py-4">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={cn(
                "text-base font-medium px-2 py-1 relative",
                activeTab === tab.id ? "text-white" : "text-gray-400 hover:text-gray-200"
              )}
              onClick={() => handleTabChange(tab.id)}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-yellow-500 rounded-t-md"></div>
              )}
            </button>
          ))}
        </div>

        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 text-center p-8 bg-gradient-to-t from-black to-transparent">
          <h1 className="text-3xl font-bold uppercase mb-2">CASINO TOURNAMENTS</h1>
          <p className="text-gray-300">Compete for massive prizes in our exclusive tournaments</p>
        </div>
      </div>

      {/* Tournaments List */}
      <div className="container mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold mb-6">Active Tournaments</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tournaments.map(tournament => (
            <div key={tournament.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
              <img 
                src={tournament.image} 
                alt={tournament.title} 
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{tournament.title}</h3>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-gray-400 text-sm">Prize Pool</p>
                    <p className="text-yellow-500 font-bold">{tournament.prize}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Dates</p>
                    <p className="text-white">{tournament.dates}</p>
                  </div>
                </div>
                <button className="w-full bg-yellow-500 text-black font-bold py-3 rounded-md hover:bg-yellow-600 transition duration-200">
                  Join Tournament
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Tournaments */}
      <div className="container mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold mb-6">Upcoming Tournaments</h2>
        <div className="bg-gray-900 p-6 rounded-lg">
          <p className="text-center text-gray-400">Stay tuned for more exciting tournaments coming soon!</p>
        </div>
      </div>
    </div>
  );
};

export default CasinoTournaments;