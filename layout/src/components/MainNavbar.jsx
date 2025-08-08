import React, { useState, useEffect } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useNavigate } from 'react-router-dom';
import { EllipsisVertical, ChevronDown, Menu, X } from 'lucide-react';
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from './ui/menubar';
import RegisterModal from '../modals/RegisterModal';
import LoginModal from '../modals/LoginModal';

// Dummy data for navigation items and their dropdowns
const navItems = [
  {
    label: 'Sports',
    items: [
      { label: 'Football', href: '/sports/football' },
      { label: 'Basketball', href: '/sports/basketball' },
      { label: 'Tennis', href: '/sports/tennis' },
      { label: 'Cricket', href: '/sports/cricket' },
      { label: 'All Sports', href: '/sports/all' },
    ]
  },
  {
    label: 'Live',
    items: [
      { label: 'In-Play', href: '/live/in-play' },
      { label: 'Live Streaming', href: '/live/streaming' },
      { label: 'Live Scores', href: '/live/scores' },
    ]
  },
  {
    label: 'Casino',
    items: [
      { label: 'Home', href: '/casino/slots' },
     {label:"testimonials",href:"/casino/testimonials"}
    ]
  },
  {
    label: 'Promotions',
    items: [
      { label: 'Sports Bonus', href: '/promotions/sports' },
      { label: 'Casino Bonus', href: '/promotions/casino' },
      { label: 'VIP Program', href: '/promotions/vip' },
    ]
  },
  {
    label: 'Virtual Sports',
    items: [
      { label: 'Virtual Football', href: '/virtual/football' },
      { label: 'Virtual Horse Racing', href: '/virtual/horse-racing' },
      { label: 'Virtual Tennis', href: '/virtual/tennis' },
    ]
  },
  {
    label: 'Esports',
    items: [
      { label: 'CS:GO', href: '/esports/csgo' },
      { label: 'Dota 2', href: '/esports/dota2' },
      { label: 'League of Legends', href: '/esports/lol' },
      { label: 'Valorant', href: '/esports/valorant' },
    ]
  },
  {
    label: 'PlayTech',
    items: [
      { label: 'Slots', href: '/playtech/slots' },
      { label: 'Live Casino', href: '/playtech/live' },
      { label: 'Table Games', href: '/playtech/table' },
    ]
  }
];

const MainNavbar = () => {
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false)
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

    const navigate = useNavigate();
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isMobileMenuOpen && !event.target.closest('.mobile-menu-container')) {
                setIsMobileMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isMobileMenuOpen]);

    const renderDesktopNav = () => (
        <div className="hidden md:block w-full">
            <Menubar className="bg-transparent flex justify-start gap-2 border-none text-white h-10">
                {navItems.map((item) => (
                    <MenubarMenu key={item.label}>
                        <MenubarTrigger className="h-full rounded-none text-white hover:bg-gray-900 data-[state=open]:bg-gray-900 data-[state=open]:text-white data-[state=open]:border-t-2 data-[state=open]:border-t-amber-400 cursor-pointer">
                            <div className="flex items-center gap-1">
                                {item.label}
                                <ChevronDown className="h-4 w-4" />
                            </div>
                        </MenubarTrigger>
                        <MenubarContent className="min-w-[200px] hover:text-white bg-gray-900 border-gray-700 rounded-sm">
                            {item.items.map((subItem) => (
                                <MenubarItem 
                                    key={subItem.href}
                                    className="text-white rounded-sm bg-[#424242] my-2 hover:bg-gray-700 hover:border-l-amber-400 hover:border-l-2 cursor-pointer"
                                    onClick={() => navigate(subItem.href)}
                                >
                                    {subItem.label}
                                </MenubarItem>
                            ))}
                        </MenubarContent>
                    </MenubarMenu>
                ))}
            </Menubar>
        </div>
    );

    const renderMobileNav = () => (
        <div className="md:hidden relative w-full  flex items-center justify-end">
            <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="flex items-center justify-center w-10 h-10 text-white hover:bg-gray-800 rounded"
            >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            
            {isMobileMenuOpen && (
                <div className="mobile-menu-container absolute right-0 top-10 mt-2 w-56 bg-[#424242] rounded-md shadow-lg z-50">
                    <div className="py-1">
                        {navItems.map((item) => (
                            <div key={item.label} className="border-b border-gray-700 last:border-b-0">
                                <div className="px-4 py-2 text-white font-medium">{item.label}</div>
                                {/* <div className="pl-4 pb-2">
                                    {item.items.map((subItem) => (
                                        <div
                                            key={subItem.href}
                                            onClick={() => {
                                                navigate(subItem.href);
                                                setIsMobileMenuOpen(false);
                                            }}
                                            className="px-2 py-1 text-sm text-gray-200 hover:bg-gray-700 cursor-pointer rounded"
                                        >
                                            {subItem.label}
                                        </div>
                                    ))}
                                </div> */}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <div className="relative">
            {/* Top Bar */}
            <div className="bg-[#AF0000] text-white h-28 w-full relative">
                <div className="w-full mx-auto px-4 py-2">
                    <div className="flex items-center justify-between h-full w-full">
                        <div className="flex items-center gap-4">
                            <LazyLoadImage 
                                src="https://myxxexchbucket.s3.ap-south-1.amazonaws.com/Logo/betxasia.co/betxasia.co-light.jpeg" 
                                alt="Logo" 
                                className="rounded-full w-20 h-12 bg-yellow-500 p-1"
                            />
                            <p className="text-white text-xl font-bold cursor-pointer hover:text-yellow-500">
                                Sportsbook
                            </p>
                        </div>
                        
                        <div className="flex items-center md:gap-4 gap-2">
                            <button className="bg-yellow-500 hidden md:block text-black font-bold h-10 py-2 px-6 rounded-md text-sm">
                                DEPOSIT
                            </button>
                            <p onClick={() => setIsLoginModalOpen(true)} className="hidden md:block text-white text-sm underline hover:no-underline">
                                Login
                            </p>
                            <button  onClick={() => setIsRegisterModalOpen(true)} className="bg-yellow-500 hidden md:block text-black font-bold h-10 py-2 px-6 rounded-md text-sm">
                                Register
                            </button>
                            
                            <div className="bg-red-700 text-white text-sm py-1 px-1 md:px-3  rounded-md">
                                {currentTime}
                            </div>
                            <div className="bg-red-700 p-2 rounded-md cursor-pointer">
                                <EllipsisVertical className="h-5 w-5 text-white" />
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Navigation Bar */}
                <div className="bg-[#505050] h-10 w-full absolute bottom-0">
                    <div className="container mx-auto h-full flex items-center px-4">
                        {renderMobileNav()}
                        {renderDesktopNav()}
                    </div>
                </div>
            </div>
            <RegisterModal isOpen={isRegisterModalOpen} onClose={() => setIsRegisterModalOpen(false)} />
            <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
        </div>
    );
};

export default MainNavbar;