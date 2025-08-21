import React, { useState, useEffect, useCallback } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import RegisterModal from '../modals/RegisterModal';
import LoginModal from '../modals/LoginModal';
import { Clock } from './ui/clock';
import DesktopNav from './DesktopNav';
import MobileNav from './MobileNav';
import { Link } from 'react-router-dom';
const navItems = [
    {
        label: 'Live', items: [
            { label: 'Event View', href: '/live_events/event-view' },
            { label: 'Live Calendar', href: '/live_events/live-calendar' },
            { label: 'Results', href: '/live_events/results' },
            { label: 'Statistics', href: '/live_events/statistics' }
        ]
    },
    { label: 'Sports', items: [{ label: 'Event View', href: '/live/in-play' }, { label: 'Live Calendar', href: '/live/streaming' }, { label: 'Results', href: '/live/scores' }, { label: 'Statistics', href: '/live/scores' }] },

    { label: 'Casino', items: [{ label: 'Home', href: '/casino/slots' }, { label: 'Tournaments', href: '/casino/testimonials' }] },
    { label: 'Promotions', items: [{ label: 'Sports Bonus', href: '/promotions/sports' }, { label: 'Casino Bonus', href: '/promotions/casino' }, { label: 'VIP Program', href: '/promotions/vip' }] },
    { label: 'Virtual Sports', items: [{ label: 'Virtual Football', href: '/virtual/football' }, { label: 'Virtual Horse Racing', href: '/virtual/horse-racing' }, { label: 'Virtual Tennis', href: '/virtual/tennis' }] },
    { label: 'Esports', items: [{ label: 'CS:GO', href: '/esports/csgo' }, { label: 'Dota 2', href: '/esports/dota2' }, { label: 'League of Legends', href: '/esports/lol' }, { label: 'Valorant', href: '/esports/valorant' }] },
    { label: 'PlayTech', items: [{ label: 'Slots', href: '/playtech/slots' }, { label: 'Live Casino', href: '/playtech/live' }, { label: 'Table Games', href: '/playtech/table' }] }
];

const MainNavbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        const handleClickOutside = (e) => {
            if (isMobileMenuOpen && !e.target.closest('.mobile-menu-container')) {
                setIsMobileMenuOpen(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMobileMenuOpen]);

    const toggleMobileMenu = useCallback(() => {
        setIsMobileMenuOpen((prev) => !prev);
    }, []);

    return (
        <>
            <div
                className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'backdrop-blur-md bg-black/70 shadow-lg' : 'bg-navbar-main'
                    }`}
            >
                <div className="text-navbar-text h-28 w-full relative">
                    <div className="w-full mx-auto px-4 py-2">
                        <div className="flex items-center justify-between h-full w-full">
                            <div className="flex items-center gap-4">
                                <Link to="/" className="flex items-center gap-4">
                                    <LazyLoadImage
                                        src="https://myxxexchbucket.s3.ap-south-1.amazonaws.com/Logo/betxasia.co/betxasia.co-light.jpeg"
                                        alt="Logo"
                                        className="rounded-full w-20 h-12 bg-yellow-500 p-1"
                                    />
                                    <p className="text-muted-card text-brand cursor-pointer hover:text-chart-5">
                                        Sportsbook
                                    </p>
                                </Link>
                            </div>
                            <div className="flex items-center md:gap-4 gap-2">
                                <button className="bg-yellow-500 hidden md:block text-black font-bold h-10 py-2 px-6 rounded-md text-sm">
                                    DEPOSIT
                                </button>
                                <p
                                    onClick={() => setIsLoginModalOpen(true)}
                                    className="hidden md:block text-navbar-text text-sm underline hover:no-underline cursor-pointer"
                                >
                                    Login
                                </p>
                                <button
                                    onClick={() => setIsRegisterModalOpen(true)}
                                    className="bg-yellow-500 hidden md:block text-black font-bold h-10 py-2 px-6 rounded-md text-sm"
                                >
                                    Register
                                </button>

                                <Clock />
                            </div>
                        </div>
                    </div>

                    <div className="h-10 w-[95%] absolute bottom-0 left-1/2 transform -translate-x-1/2 z-20 bg-muted-foreground rounded-t-lg">
                        <div className="container mx-auto h-full flex items-center px-4">
                            <MobileNav
                                isOpen={isMobileMenuOpen}
                                toggleOpen={toggleMobileMenu}
                                navItems={navItems}
                            />
                            <DesktopNav navItems={navItems} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="h-28" />
            <RegisterModal
                isOpen={isRegisterModalOpen}
                onClose={() => setIsRegisterModalOpen(false)}
            />
            <LoginModal
                isOpen={isLoginModalOpen}
                onClose={() => setIsLoginModalOpen(false)}
            />
        </>
    );
};

export default MainNavbar;
