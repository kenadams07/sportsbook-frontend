import { LazyLoadImage } from 'react-lazy-load-image-component'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../../components/ui/carousel'
import React from 'react'
import UpcomingMatches from '../../components/UpcomingMatches'
import ImageCardGrid from '../../components/ImageCardGamesGrid'
import img1 from "/assets/img1.jpg"
import img2 from "/assets/img2.jpg"
import img3 from "/assets/img3.jpg"
import img4 from "/assets/img4.jpg"
const images = [
  { id: 1, src: img1, name: "Game One" },
  { id: 2, src: img2, name: "Game Two" },
  { id: 3, src: img3, name: "Game Three" },
  { id: 4, src: img4, name: "Game Four" },
  { id: 5, src: img4, name: "Game Five" },

];
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
        {/* <UpcomingMatches /> */}
      </div>
      <div className='mx-1'>
        <ImageCardGrid images={images} heading="CASINO GAMES" />
        <ImageCardGrid images={images} heading="LIVE GAMES" />
        <ImageCardGrid images={images} heading="GAMES" />
      </div>
    </div>
  )
}

export default Home;