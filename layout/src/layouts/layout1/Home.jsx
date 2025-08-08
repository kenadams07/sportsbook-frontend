import { LazyLoadImage } from 'react-lazy-load-image-component'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../../components/ui/carousel'
import React from 'react'
import UpcomingMatches from '../../components/upcoming-matches'

const Home = () => {
  return (
    <div className='w-full  mx-auto px-2 py-2 '>
      {/* Carousel Container */}
      <div className='w-full  h-full rounded-lg overflow-hidden shadow-lg'>
        <Carousel className='w-full h-full'>
          <CarouselContent className='h-full'>
            {['slider1', 'slider2', 'slider3'].map((item) => (
              <CarouselItem key={item} className='h-full'>
                <div className='relative w-full h-full'>
                  <LazyLoadImage 
                    src={`/assets/${item}.png`}
                    alt={`Slide ${item}`}
                    className='w-full h-full object-contain rounded-sm'
                    effect='opacity'
                    width='100%'
                    height='100%'
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className='left-4 bg-[white] w-[40px] h-[40px] rounded-full flex items-center justify-center' />
          <CarouselNext className='right-4 bg-[white] w-[40px] h-[40px] rounded-full flex items-center justify-center' />
        </Carousel>
      </div>

      {/* upcoming matches */}
      <div className='mx-1'>

      <UpcomingMatches />
      </div>
      <div className='mx-1'>
    
      </div>
    </div>
  )
}

export default Home;