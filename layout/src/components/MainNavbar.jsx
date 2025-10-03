import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import RegisterModal from '../modals/RegisterModal';
import LoginModal from '../modals/LoginModal';
import DepositModal from '../components/DepositModal';
import { Clock } from './ui/clock';
import DesktopNav from './DesktopNav';
import MobileNav from './MobileNav';
import { Link } from 'react-router-dom';
import { ChevronDown, User } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { getUserData } from '../redux/Action';
import { logout } from '../redux/Action/auth/logoutAction';

const navItems = [
    {
        label: 'Live', items: [
            { label: 'Event View', href: '/live_events/event-view' },
            { label: 'Live Calendar', href: '/live_events/live-calendar' },
            { label: 'Results', href: '/live_events/results' },
            { label: 'Statistics', href: '/live_events/statistics' }
        ]
    },
    { 
        label: 'Sports', 
        items: [
            { 
                label: 'Event View', 
                href: '/live_events/event-view',
                state: { viewType: 'prematch' }
            }, 
            { 
                label: 'Live Calendar', 
                href: '/live_events/live-calendar',
                state: { viewType: 'prematch' }
            }, 
            { 
                label: 'Results', 
                href: '/live_events/results',
                state: { viewType: 'prematch' }
            }, 
            { 
                label: 'Statistics', 
                href: '/live_events/statistics',
                state: { viewType: 'prematch' }
            }
        ]
    },

    { label: 'Casino', items: [{ label: 'Home', href: '/casino/slots' }, { label: 'Tournaments', href: '/casino/tournaments' }] }, 
     { label: 'Games', href: '/games'},
    { label: 'Virtual Sports', items: [{ label: 'Virtual Football', href: '/virtual/football' }, { label: 'Virtual Horse Racing', href: '/virtual/horse-racing' }, { label: 'Virtual Tennis', href: '/virtual/tennis' }] },
    { label: 'Esports', items: [{ label: 'Event View', href: '/esports/event-view' }, { label: 'Live Calendar', href: '/esports/live-calendar' }, { label: 'Results', href: '/esports/results' }, { label: 'Statistics', href: '/esports/statistics' }] },
    { label: 'PlayTech', items: [{ label: 'Slots', href: '/playtech/slots' }, { label: 'Live Casino', href: '/playtech/live' }, { label: 'Table Games', href: '/playtech/table' }] }
];

export default function MainNavbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // Added selector to get authentication state
  const { isAuthenticated, userData } = useSelector(state => state.Login);
  const { userData: profileData, loading } = useSelector(state => state.GetUserData);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(0); // State to force re-render
  const [exposure, setExposure] = useState(0); // State to hold exposure from WebSocket
  const [socket, setSocket] = useState(null); // State to hold socket connection

  // Initialize WebSocket connection
  useEffect(() => {
    if (isAuthenticated && userData?._id) {
      const newSocket = new WebSocket('ws://localhost:3001'); // Adjust URL as needed
      
      newSocket.onopen = () => {
        console.log('WebSocket connection established');
      };

      newSocket.onmessage = function(event) {
        const data = JSON.parse(event.data);
        
        if (data.type === 'exposureUpdate' && data.userId === userData._id) {
          console.log(`User ${data.userId} exposure updated to ${data.exposure}`);
          setExposure(data.exposure);
        }
      };

      newSocket.onclose = () => {
        console.log('WebSocket connection closed');
      };

      newSocket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      setSocket(newSocket);

      // Clean up function to close the socket when component unmounts or user logs out
      return () => {
        if (newSocket) {
          newSocket.close();
        }
      };
    }
  }, [isAuthenticated, userData?._id]);

  // Calculate total exposure from exposures array
  const calculateTotalExposure = useCallback((exposures) => {
    if (!exposures || !Array.isArray(exposures)) {
      return 0;
    }
    
    return exposures.reduce((total, exposureObj) => {
      const exposureValue = parseFloat(exposureObj?.exposure) || 0;
      return total + exposureValue;
    }, 0);
  }, []);

  // New function to calculate only active (non-cleared) exposures for display
  const calculateActiveExposure = useCallback((exposures) => {
    if (!exposures || !Array.isArray(exposures)) {
      return 0;
    }
    
    return exposures.reduce((total, exposureObj) => {
      // Only calculate exposure when is_clear is false
      if (exposureObj?.is_clear === "true" || exposureObj?.is_clear === true) {
        return total;
      }
      const exposureValue = parseFloat(exposureObj?.exposure) || 0;
      return total + exposureValue;
    }, 0);
  }, []);

  // Get exposure value to display
  const getTotalExposure = useMemo(() => {
    
    // Use WebSocket exposure when available, otherwise fallback to existing logic
    if (exposure !== 0) {
      return exposure;
    }
    
    // Use the most recently updated data (from Login reducer when available)
    const sourceData = userData || profileData || {};
    
    // First try to calculate from exposures array
    if (sourceData?.exposures) {
      return calculateActiveExposure(sourceData.exposures);
    } 
    // Fallback to single exposure value
    else if (sourceData?.exposure) {
      return parseFloat(sourceData.exposure) || 0;
    }
 
    return 0;
  }, [profileData, userData, calculateActiveExposure, exposure]);

  // Get balance value to display (available balance for betting)
  const getAvailableBalance = useMemo(() => {
    // Use the most recently updated data (from Login reducer when available)
    const sourceData = userData || profileData || {};
    
    const balance = parseFloat(sourceData?.balance) || 0;
    // Use active exposure (excluding cleared exposures) for balance calculation
    const activeExposure = getTotalExposure;
    
    // Available balance is total balance minus active exposure
    return Math.max(0, balance - activeExposure);
  }, [profileData, userData, getTotalExposure]);

  useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        const handleClickOutside = (e) => {
            if (isMobileMenuOpen && !e.target.closest('.mobile-menu-container')) {
                setIsMobileMenuOpen(false);
            }
            // Close user menu when clicking outside
            if (isUserMenuOpen && !e.target.closest('.user-menu-container')) {
                setIsUserMenuOpen(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMobileMenuOpen, isUserMenuOpen]); // Added isUserMenuOpen to dependency array

    // Check for login parameter in URL to auto-open login modal
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        if (searchParams.get('login') === 'true') {
            setIsLoginModalOpen(true);
            // Remove the parameter from URL without refreshing the page
            window.history.replaceState({}, document.title, location.pathname);
        }
    }, [location]);

    // Fetch user data when authenticated
    useEffect(() => {
        if (isAuthenticated) {
            dispatch(getUserData());
        }
    }, [isAuthenticated, dispatch]);

  // Log when profileData or userData changes for debugging
  useEffect(() => {
   
  }, [profileData]);

  useEffect(() => {
  
    // Calculate exposures for debugging
    const sourceData = userData || profileData || {};
    const totalExposure = calculateTotalExposure(sourceData?.exposures) || parseFloat(sourceData?.exposure) || 0;
    const activeExposure = getTotalExposure;
    
 
  }, [userData, getAvailableBalance, getTotalExposure, calculateTotalExposure]);
    
    // Listen for changes in profileData (from GetUserData reducer) to trigger re-render
    useEffect(() => {
     
        setForceUpdate(prev => prev + 1);
    }, [profileData]);
    
    // Log when forceUpdate changes
    useEffect(() => {
      
    }, [forceUpdate]);

    const toggleMobileMenu = useCallback(() => {
        setIsMobileMenuOpen((prev) => !prev);
    }, []);

    // Loading skeleton component for user data
    const UserDataSkeleton = () => (
        <div className="hidden md:flex items-center gap-4">
            <div className="h-4 w-20 bg-gray-400 rounded animate-pulse"></div>
            <div className="h-4 w-1 bg-gray-400 rounded"></div>
            <div className="h-4 w-20 bg-gray-400 rounded animate-pulse"></div>
        </div>
    );

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
                                    <img
                                        src="/appLogo/LOGOICON.png"
                                        alt="Logo"
                                        className="w-16 h-16 object-contain"
                                    />
                                    <p className="text-muted-card text-brand cursor-pointer hover:text-chart-5">
                                        Sportsbook
                                    </p>
                                </Link>
                            </div>
                            <div className="flex items-center md:gap-4 gap-2">
                                {/* Show balance and exposure only when authenticated */}
                                {isAuthenticated && loading && <UserDataSkeleton />}
                                {isAuthenticated && !loading && (
                                    <div className="hidden md:flex items-center gap-4 text-white font-bold">
                                        <span>Balance: {typeof getAvailableBalance === 'number' ? getAvailableBalance.toFixed(2) : '0.00'}</span>
                                        <span>|</span>
                                        <span>Exposure: {typeof getTotalExposure === 'number' ? getTotalExposure.toFixed(2) : '0.00'}</span>
                                    </div>
                                )}
                                {/* Show deposit button only when authenticated */}
                                {isAuthenticated && (
                                    <button 
                                        className="bg-yellow-500 hidden md:block text-black font-bold h-10 py-2 px-6 rounded-md text-sm"
                                        onClick={() => setIsDepositModalOpen(true)}
                                    >
                                        DEPOSIT
                                    </button>
                                )}
                                {!isAuthenticated && (
                                    <p
                                        onClick={() => setIsLoginModalOpen(true)}
                                        className="hidden md:block text-navbar-text text-sm underline hover:no-underline cursor-pointer"
                                    >
                                        Login
                                    </p>
                                )}
                                {!isAuthenticated && (
                                    <button
                                        onClick={() => setIsRegisterModalOpen(true)}
                                        className="bg-yellow-500 hidden md:block text-black font-bold h-10 py-2 px-6 rounded-md text-sm"
                                    >
                                        Register
                                    </button>
                                )}

                                {/* Show user menu icon only when authenticated */}
                                {isAuthenticated && (
                                    <div className="relative user-menu-container">
                                        <button
                                            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                            className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                                        >
                                            <User className="w-5 h-5 text-gray-700" />
                                        </button>

                                        {/* Dropdown Menu */}
                                        {isUserMenuOpen && (
                                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                                                <Link
                                                    to="/profile"
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                    onClick={() => setIsUserMenuOpen(false)}
                                                >
                                                    Profile
                                                </Link>
                                                <Link
                                                    to="/change-password"
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                    onClick={() => setIsUserMenuOpen(false)}
                                                >
                                                    Change Password
                                                </Link>
                                                <button
                                                    onClick={() => {
                                                        dispatch(logout());
                                                        setIsUserMenuOpen(false);
                                                    }}
                                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                >
                                                    Logout
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}

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
                onCloseAll={() => {
                    setIsRegisterModalOpen(false);
                    setIsLoginModalOpen(false);
                }}
            />
            <LoginModal
                isOpen={isLoginModalOpen}
                onClose={() => setIsLoginModalOpen(false)}
                onSwitchToRegister={() => {
                    setIsLoginModalOpen(false);
                    setIsRegisterModalOpen(true);
                }}
            />
            <DepositModal 
                isOpen={isDepositModalOpen}
                onClose={() => setIsDepositModalOpen(false)}
            />
        </>
    );
};