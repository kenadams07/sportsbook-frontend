import React from "react";
import { Link } from "react-router-dom"; // Ensure this is installed

const footerData = [
    {
        heading: "Company",
        links: [
            { name: "About Us", to: "/about" },
        ],
    },
    {
        heading: "Terms and Policy",
        links: [
            { name: "Privacy Policy", to: "/privacy-policy" },
            { name: "Safer Gambling", to: "/safer-gambling" },
            { name: "General Terms and Conditions", to: "/terms-conditions" },
            { name: "General Promotion Terms", to: "/safer-gambling" },
            { name: "Casino Terms and Conditions", to: "/safer-gambling" },
            { name: "RTP Lists", to: "/safer-gambling" },
        ],
    },
    {
        heading: "Rules",
        links: [
            { name: "Sport Betting", to: "/sports-betting" },
            { name: "Virtual Sport Betting", to: "/sports-betting" },
        ],
    },
    {
        heading: "Statistics",
        links: [
            { name: "Live Calendar", to: "/live-calendar" },
            { name: "Statistics", to: "/live-calendar" },
        ],
    },
    {
        heading: "Help",
        links: [
            { name: "FAQ", to: "/faq" },
            { name: "Contact Us", to: "/faq" },
        ],
    },
];

export default function Footer() {
    return (
        <footer className="bg-background text-muted-foreground pt-10 pb-6 px-4 text-xs">

            {/* Fading Divider */}
            <div className="relative mb-6 h-px w-full overflow-hidden">
                <div className="absolute left-0 top-0 h-full w-full bg-gradient-to-r from-transparent via-muted-foreground to-transparent opacity-30" />
            </div>

            {/* Footer Content */}
            <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 text-center sm:text-left">
                {footerData.map((section, index) => (
                    <div key={index}>
                        <h4 className="text-xs font-semibold mb-2 text-primary-foreground">
                            {section.heading.toUpperCase()}
                        </h4>
                        <ul className="space-y-1">
                            {section.links.map((link, idx) => (
                                <li key={idx}>
                                    <Link
                                        to={link.to}
                                        className="transition-colors duration-200 hover:text-primary-foreground"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 text-muted-foreground text-lg">
                <div className="flex items-center justify-center w-8 h-8 rounded-full border border-pink-500 text-pink-500 text-xs font-bold">
                    18+
                </div>
                <span className="text-center sm:text-left">
                    Gambling can be addictive, play responsibly
                </span>
            </div>
            {/* Bottom Note */}
            <div className="mt-8 text-center text-xs text-muted-foreground">
                © {new Date().getFullYear()} Sportsbook. All rights reserved.
            </div>
        </footer>
    );
}
