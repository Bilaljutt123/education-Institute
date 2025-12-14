import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

interface Slide {
  image: string;
  title: string;
  description: string;
  ctaText?: string;
  ctaLink?: string;
}

interface CarouselProps {
  slides: Slide[];
  autoPlayInterval?: number;
}

const Carousel = ({ slides, autoPlayInterval = 5000 }: CarouselProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, autoPlayInterval);
    return () => clearInterval(timer);
  }, [autoPlayInterval, slides.length]);

  return (
    <div className="relative h-[600px] w-full overflow-hidden bg-gray-900">
      {/* Slides */}
      <div 
        className="absolute inset-0 flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div key={index} className="relative min-w-full h-full">
            {/* Image */}
            <img 
              src={slide.image} 
              alt={slide.title}
              className="w-full h-full object-cover opacity-60"
            />
            
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

            {/* Content */}
            <div className="absolute inset-0 flex items-center justify-center text-center px-6">
              <div className="max-w-4xl animate-fade-in-up">
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
                  {slide.title}
                </h1>
                <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl mx-auto drop-shadow-md">
                  {slide.description}
                </p>
                {slide.ctaText && slide.ctaLink && (
                  <Link
                    to={slide.ctaLink}
                    className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-full font-semibold text-lg hover:bg-blue-700 transition-all duration-300 shadow-lg hover:scale-105"
                  >
                    {slide.ctaText}
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <button 
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-all border border-white/20"
      >
        <ChevronLeft className="w-8 h-8" />
      </button>
      <button 
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-all border border-white/20"
      >
        <ChevronRight className="w-8 h-8" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              currentSlide === index ? 'bg-blue-500 w-8' : 'bg-white/50 hover:bg-white'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
