import { LazyLoadImage } from 'react-lazy-load-image-component'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../../components/ui/carousel'
import React, { useState, useEffect, useRef } from 'react'
import UpcomingMatches from '../../components/UpcomingMatches'
import ImageCardGrid from '../../components/ImageCardGamesGrid'
import img1 from "/assets/img1.jpg"
import img2 from "/assets/img2.jpg"
import img3 from "/assets/img3.jpg"
import img4 from "/assets/img4.jpg"
import WelcomeComponent from '../../components/WelcomeComponent'
import { getLocalStorageItem, setLocalStorageItem } from '../../utils/Helper'
import RegisterModal from '../../modals/RegisterModal'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchHomepageCasinoGames, fetchHomepageLiveGames } from '../../redux/Action/casinoActions'
import CasinoGameCard from '../../components/CasinoGameCard'

// Updated slider images from the 1029x290 folder
const sliderImages = [
  { id: 1, src: '/1029x290 banner/1029x290 banner/banner1.png', alt: 'Slide 1' },
  { id: 2, src: '/1029x290 banner/1029x290 banner/banner-2.png', alt: 'Slide 2' },
  { id: 3, src: '/1029x290 banner/1029x290 banner/banner-3.png', alt: 'Slide 3' },
   { id: 4, src: '/1029x290 banner/1029x290 banner/banner-4.png', alt: 'Slide 4' },
    { id: 5, src: '/1029x290 banner/1029x290 banner/banner-5.png', alt: 'Slide 5' },
];

const Home = () => {
  const [showWelcome, setShowWelcome] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const intervalRef = useRef(null);
  const apiRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Get homepage games data from Redux store
  const { 
    homepageCasinoGames, 
    loadingHomepageCasinoGames, 
    homepageCasinoGamesError,
    homepageLiveGames,
    loadingHomepageLiveGames,
    homepageLiveGamesError
  } = useSelector(state => state.CasinoGames);

  useEffect(() => {
    // Check if we should show the welcome modal
    const shouldShowWelcome = getLocalStorageItem('showWelcomeModal');
    if (shouldShowWelcome === 'true') {
      setShowWelcome(true);
      // Remove the flag so it doesn't show again
      setLocalStorageItem('showWelcomeModal', 'false');
    }
    
    // Fetch homepage casino games data (SUNO provider)
    dispatch(fetchHomepageCasinoGames({ 
      batchNumber: 0, 
      batchSize: 5, 
      providerName: 'SUNO', 
      search: '' 
    }));
    
    // Fetch homepage live games data (SPRIBE provider)
    dispatch(fetchHomepageLiveGames({ 
      batchNumber: 0, 
      batchSize: 5, 
      providerName: 'SPRIBE', 
      search: '' 
    }));
  }, [dispatch]);

  // Set up carousel API reference and start autoplay
  const setApi = (api) => {
    apiRef.current = api;
    
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    // Start autoplay when API is available
    if (api) {
      intervalRef.current = setInterval(() => {
        api.scrollNext();
      }, 3000);
    }
  };

  // Clear interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Handle user interaction (pause autoplay and restart after interaction)
  const handleUserInteraction = () => {
    // Clear existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    // Restart autoplay
    if (apiRef.current) {
      intervalRef.current = setInterval(() => {
        apiRef.current.scrollNext();
      }, 3000);
    }
  };

  const handleCloseWelcome = () => {
    setShowWelcome(false);
  };

  // Function to check if banner has register text and open register modal
  const handleBannerClick = (item) => {
    // Check if the banner contains register text (banner1.png is the one with register text)
    if (item.src.includes('banner1')) {
      setIsRegisterModalOpen(true);
    }
    // Check if the banner is banner-2.png and navigate to games section
    else if (item.src.includes('banner-2')) {
      navigate('/games');
    }
    // Check if the banner is banner-5.png and navigate to sports market section with pre-match selected
    else if (item.src.includes('banner-5')) {
      navigate('/live_events/event-view', { state: { viewType: 'prematch' } });
    }
  };

  // Get first 5 games for each section
  const displayCasinoGames = homepageCasinoGames && homepageCasinoGames.length > 0 
    ? (homepageCasinoGames[0].games || []).slice(0, 5) 
    : [];
    
  const displayLiveGames = homepageLiveGames && homepageLiveGames.length > 0 
    ? (homepageLiveGames[0].games || []).slice(0, 5) 
    : [];

  return (
    <div className='w-full mx-auto px-2 py-2'>
      {/* Welcome Modal */}
      {showWelcome && <WelcomeComponent onClose={handleCloseWelcome} showDepositButton={true} />}

      {/* Register Modal */}
      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onCloseAll={() => {
          setIsRegisterModalOpen(false);
        }}
      />

      {/* Carousel Container */}
      <div className='w-full h-full rounded-lg overflow-hidden shadow-lg'>
        <Carousel 
          className='w-full h-full' 
          opts={{ loop: true }}
          setApi={setApi}
          onMouseEnter={() => {
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
            }
          }}
          onMouseLeave={handleUserInteraction}
        >
          <CarouselContent className='h-full custom-scrollbar'>
            {sliderImages.map((item) => (
              <CarouselItem key={item.id} className='h-full'>
                <div className='relative w-full h-full'>
                  <LazyLoadImage
                    src={item.src}
                    alt={item.alt}
                    className='w-full h-full object-contain rounded-sm cursor-pointer'
                    effect='opacity'
                    width='100%'
                    height='100%'
                    onClick={() => handleBannerClick(item)}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious 
            className='left-4 bg-[white] w-[40px] h-[40px] rounded-full flex items-center justify-center'
            onClick={() => {
              if (apiRef.current) {
                apiRef.current.scrollPrev();
                handleUserInteraction(); // Reset autoplay timer
              }
            }}
          />
          <CarouselNext 
            className='right-4 bg-[white] w-[40px] h-[40px] rounded-full flex items-center justify-center'
            onClick={() => {
              if (apiRef.current) {
                apiRef.current.scrollNext();
                handleUserInteraction(); // Reset autoplay timer
              }
            }}
          />
        </Carousel>
      </div>

      {/* upcoming matches */}
      <div className='mx-1'>
        <UpcomingMatches />
      </div>
      
      {/* Casino Games Section */}
      <div className='mx-1'>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-white font-semibold">CASINO GAMES</h1>
          <button 
            className="text-button-primary-bg hover:text-button-primary-hover font-semibold"
            onClick={() => navigate('/casino')}
          >
            More →
          </button>
        </div>
        
        {loadingHomepageCasinoGames ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="casino-game-card">
                <div className="casino-game-card-img-loading">
                  <div className="casino-game-card-img-shimmer"></div>
                </div>
              </div>
            ))}
          </div>
        ) : homepageCasinoGamesError ? (
          <div className="text-red-500 text-center py-4">
            Error loading games: {homepageCasinoGamesError}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
            {displayCasinoGames.map(game => (
              <CasinoGameCard 
                key={game.gameId || game.id}
                game={game}
                onPlay={() => console.log('Playing game:', game)}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Live Games Section */}
      <div className='mx-1 mt-8'>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-white font-semibold">LIVE GAMES</h1>
          <button 
            className="text-button-primary-bg hover:text-button-primary-hover font-semibold"
            onClick={() => navigate('/games')}
          >
            More →
          </button>
        </div>
        
        {loadingHomepageLiveGames ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="casino-game-card">
                <div className="casino-game-card-img-loading">
                  <div className="casino-game-card-img-shimmer"></div>
                </div>
              </div>
            ))}
          </div>
        ) : homepageLiveGamesError ? (
          <div className="text-red-500 text-center py-4">
            Error loading games: {homepageLiveGamesError}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
            {displayLiveGames.map(game => (
              <CasinoGameCard 
                key={game.gameId || game.id}
                game={game}
                onPlay={() => console.log('Playing game:', game)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Home;