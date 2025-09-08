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

// Partner images data - using actual sponsor logos with uniform sizes
const partners = [
    { title: "OFFICIAL MAIN SPONSOR", image: "/sponsor logo/sponsor logo/173937252_1193271851126219_8062574705595154570_n.png" },
    { title: "SPONSOR & OFFICIAL BETTING PARTNER", image: "/sponsor logo/sponsor logo/200x200-01 (1).png" },
    { title: "OFFICIAL BETTING PARTNER", image: "/sponsor logo/sponsor logo/200x200-01.png" },
    { title: "OFFICIAL BETTING PARTNER", image: "/sponsor logo/sponsor logo/200x200_deportivo-alaves.png" },
    { title: "OFFICIAL PARTNER", image: "/sponsor logo/sponsor logo/200x200_derbyshire.png" },
    { title: "OFFICIAL PARTNER", image: "/sponsor logo/sponsor logo/200x200_durham.png" },
    { title: "OFFICIAL PARTNER", image: "/sponsor logo/sponsor logo/200x200_leicestershire.png" },
    { title: "OFFICIAL BETTING PARTNER", image: "/sponsor logo/sponsor logo/200x200_northamptonshire.png" },
    { title: "OFFICIAL PARTNER", image: "/sponsor logo/sponsor logo/200x200_somerset-ccc-white.png" },
    { title: "OFFICIAL PARTNER", image: "/sponsor logo/sponsor logo/200x200_sussex.png" },
    { title: "OFFICIAL PARTNER", image: "/sponsor logo/sponsor logo/celtic-logo.png" },
    { title: "OFFICIAL PARTNER", image: "/sponsor logo/sponsor logo/logo-joburg-super-kings.png" },
];

// Regulatory logos - using actual logos from buttom logo folder with uniform sizes
const regulatoryLogos = [
    { name: "Logo 1", image: "/buttom logo/buttom logo/logo-icon.png" },
    { name: "Logo 2", image: "/buttom logo/buttom logo/logo-icon2.png" },
    { name: "Logo 3", image: "/buttom logo/buttom logo/logo-icon3.png" },
    { name: "Logo 4", image: "/buttom logo/buttom logo/logo-icon4.png" },
    { name: "Logo 5", image: "/buttom logo/buttom logo/logo-icon5.png" },
    { name: "Logo 6", image: "/buttom logo/buttom logo/logo-icon6.png" },
];

// Payment method logos - using actual logos from payments folder with uniform sizes
const paymentMethods = [
    { name: "Skrill", image: "/payments/skrill-preview.png" },
    { name: "Neteller", image: "/payments/neteller-preview.png" },
    { name: "SafeCharge", image: "/payments/safecharge-preview.png" },
    { name: "MuchBetter", image: "/payments/MUHBTR.png" },
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

          

            {/* REGULATIONS & PARTNERS SECTION - New addition */}
            <div className="mt-12 max-w-6xl mx-auto">
                {/* Partners Heading */}
                <div className="text-center mb-6">
                    <h3 className="text-xs uppercase tracking-wider text-gray-400 mb-1">REGULATIONS & PARTNERS</h3>
                    <h2 className="text-lg font-semibold text-gray-300">OUR PARTNERS</h2>
                </div>
                
                {/* Partners Grid with uniform logo sizes */}
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 justify-items-center mb-10">
                    {partners.map((partner, index) => (
                        <div key={index} className="flex flex-col items-center">
                            <p className="text-[8px] text-center text-gray-500 mb-1 h-8 flex items-center">
                                {partner.title}
                            </p>
                            <img 
                                src={partner.image} 
                                alt={partner.title} 
                                className="h-12 w-12 object-contain" 
                            />
                        </div>
                    ))}
                </div>
                  {/* Responsible Gambling Message */}
            <div className="m   -8 flex flex-col sm:flex-row items-center justify-center gap-3 text-muted-foreground text-lg">
                <div className="flex items-center justify-center w-8 h-8 rounded-full border border-pink-500 text-pink-500 text-xs font-bold">
                    18+
                </div>
                <span className="text-center sm:text-left">
                    Gambling can be addictive, play responsibly
                </span>
            </div>
             
                
                {/* Regulatory Logos with uniform sizes */}
                <div className="flex flex-wrap justify-center gap-6 mb-10">
                    {regulatoryLogos.map((logo, index) => (
                        <img 
                            key={index} 
                            src={logo.image} 
                            alt={logo.name} 
                            className="h-15 w-25 object-contain opacity-80 hover:opacity-100 transition-opacity" 
                        />
                    ))}
                </div>
                
                {/* Regulatory Text */}
                <p className="text-[10px] text-gray-500 text-center mb-10 max-w-4xl mx-auto leading-relaxed">
                    Sportsbook.co.uk is operated by SGCG Limited, a company registered in Malta with registration number 045929 and having its registered address at Luxe Pavilion, 
                    2nd level, Diamonds International Building, Portomaso, St Julian's STJ 4010, Malta. SGCG Limited is licensed and regulated by the UK Gambling 
                    Commission for provision of services to the United Kingdom (UKGC Account number xxxx). Under 18s are strictly forbidden from gambling on this website. 
                    Underage gambling is an offence. © Sportsbook.co.uk 2023 | Sportsbook is committed to endorsing safer gambling among its customers as well as promoting 
                    the awareness of problem gambling and improving prevention, intervention and treatment. Gambling can be addictive, please play responsibly.
                </p>
                
                {/* Payment Methods with uniform sizes */}
                <div className="mb-8">
                    <h3 className="text-center text-xs uppercase tracking-wider text-gray-400 mb-4">PAYMENTS</h3>
                    <div className="flex flex-wrap justify-center gap-4">
                        {paymentMethods.map((method, index) => (
                            <img 
                                key={index} 
                                src={method.image} 
                                alt={method.name} 
                                className="h-12 object-contain opacity-80 hover:opacity-100 transition-opacity"
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Note */}
            <div className="mt-8 text-center text-xs text-muted-foreground">
                © {new Date().getFullYear()} Sportsbook. All rights reserved.
            </div>
        </footer>
    );
}