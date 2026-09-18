import React, { useRef, useEffect, ReactNode } from 'react';

import { Carousel as NativeCarousel } from '@fancyapps/ui';
import '@fancyapps/ui/dist/carousel/carousel.css';

interface CarouselProps {
  options?: any;
  children: ReactNode;
}

function Carousel(props: CarouselProps) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const options = props.options || {};

    const instance = new NativeCarousel(container, { ...options, Dots: true });

    return () => {
      instance.destroy();
    };
  });

  return (
    <div className="f-carousel" id="myCarousel" ref={containerRef}>
      {props.children}
    </div>
  );
}

export default Carousel;
