'use client';

import type { EmblaCarouselType } from 'embla-carousel';
import React, {
  type ComponentPropsWithRef,
  useCallback,
  useEffect,
  useId,
  useState,
} from 'react';

import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { cn } from '@/utils/cn';

type UseDotButtonType = {
  selectedIndex: number;
  scrollSnaps: number[];
  onDotButtonClick: (index: number) => void;
};

const useDotButton = (api: CarouselApi | undefined): UseDotButtonType => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const onDotButtonClick = useCallback(
    (index: number) => {
      if (!api) return;
      api.scrollTo(index);
    },
    [api],
  );

  const onInit = useCallback((api: EmblaCarouselType) => {
    setScrollSnaps(api.scrollSnapList());
  }, []);

  const onSelect = useCallback((api: EmblaCarouselType) => {
    setSelectedIndex(api.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!api) return;

    onInit(api);
    onSelect(api);
    api.on('reInit', onInit).on('reInit', onSelect).on('select', onSelect);
  }, [api, onInit, onSelect]);

  return {
    selectedIndex,
    scrollSnaps,
    onDotButtonClick,
  };
};

const DotButton = (props: ComponentPropsWithRef<'button'>) => {
  const { className, ...rest } = props;

  return (
    <button
      type="button"
      className={cn(
        'size-1 shrink-0 rounded-full bg-soft-foreground  transition-all duration-200 ease-out',
        className,
      )}
      {...rest}
    />
  );
};

type CarouselProps = {
  slides: string[];
};

export const ProductImagesSlider = ({ slides }: CarouselProps) => {
  const [api, setApi] = React.useState<CarouselApi>();

  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(api);

  return (
    <section className="embla">
      <div className="embla__viewport">
        <Carousel setApi={setApi} className="embla__container">
          <CarouselContent>
            {slides.map((slide, i) => (
              <CarouselItem className="embla__slide w-full" key={useId()}>
                <img
                  src={slide}
                  alt=""
                  height={146}
                  width={146}
                  className="mx-auto h-[146px] w-auto min-w-0 object-contain"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      <div className="absolute left-4 top-4 flex gap-1.5">
        {scrollSnaps.map((_, index) => (
          <DotButton
            key={`dot-${_}`}
            onClick={() => onDotButtonClick(index)}
            className={cn(index === selectedIndex ? 'w-4 bg-soft' : '')}
          />
        ))}
      </div>
    </section>
  );
};
