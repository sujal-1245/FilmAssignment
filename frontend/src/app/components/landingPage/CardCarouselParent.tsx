import { CardCarousel } from '@/components/ui/card-carousel'
import React from 'react'

const CardCarouselParent = () => {

    const images = [
    { src: "/card1.jpg", alt: "Image 1" },
    { src: "/card2.jpg", alt: "Image 2" },
    { src: "/card3.jpg", alt: "Image 3" },
    { src: "/card4.jpg", alt: "Image 4" },
    { src: "/card5.jpg", alt: "Image 5" },
    { src: "/card6.jpg", alt: "Image 6" },
    { src: "/card7.jpg", alt: "Image 7" }
  ]


  return (
    <div className="pt-10">
      <CardCarousel
        images={images}
        autoplayDelay={2000}
        showPagination={false}
        showNavigation={true}
      />
    </div>
  )
}

export default CardCarouselParent
