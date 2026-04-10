"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { X, ZoomIn, ChevronLeft, ChevronRight, Download } from "lucide-react";

interface ImageGalleryProps {
  images: string[];
  prompt?: string;
}

export default function ImageGallery({ images, prompt }: ImageGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
  }, []);

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe && images.length > 1) goNext();
    if (isRightSwipe && images.length > 1) goPrev();
  };

  const downloadImage = (url: string, index: number) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = `yeneta-image-${index + 1}.png`;
    link.click();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen, closeLightbox, goNext, goPrev]);

  useEffect(() => {
    if (lightboxOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [lightboxOpen]);

  return (
    <>
      <div className="space-y-3 my-4">
        {prompt && (
          <p className="text-xs text-content-muted italic px-1">
            {prompt}
          </p>
        )}
        
        <div className={`grid gap-3 ${
          images.length === 1 ? "grid-cols-1" :
          images.length === 2 ? "grid-cols-2" :
          images.length >= 3 ? "grid-cols-2 md:grid-cols-3" : "grid-cols-1"
        }`}>
          {images.map((url, index) => (
            <div 
              key={index}
              className="relative group rounded-xl overflow-hidden border border-border-subtle shadow-md hover:shadow-lg transition-all duration-300 cursor-zoom-in"
              onClick={() => openLightbox(index)}
            >
              <img
                src={url}
                alt={`Generated image ${index + 1}`}
                className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => { e.stopPropagation(); downloadImage(url, index); }}
                  className="p-2 bg-black/50 backdrop-blur-sm rounded-lg hover:bg-black/70 transition-colors"
                  title="Download"
                >
                  <Download size={14} className="text-white" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); openLightbox(index); }}
                  className="p-2 bg-black/50 backdrop-blur-sm rounded-lg hover:bg-black/70 transition-colors"
                  title="View fullscreen"
                >
                  <ZoomIn size={14} className="text-white" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {lightboxOpen && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-300"
          onClick={closeLightbox}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
          >
            <X size={24} className="text-white" />
          </button>

          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); goPrev(); }}
                className="absolute left-4 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors hidden md:block"
              >
                <ChevronLeft size={24} className="text-white" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); goNext(); }}
                className="absolute right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors hidden md:block"
              >
                <ChevronRight size={24} className="text-white" />
              </button>
            </>
          )}

          <div 
            className="max-w-[95vw] max-h-[90vh] relative mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={images[currentIndex]}
              alt={`Image ${currentIndex + 1}`}
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
            />
            
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent rounded-b-lg">
              <div className="flex items-center justify-between">
                <span className="text-white/80 text-sm font-medium">
                  {currentIndex + 1} / {images.length}
                </span>
                <div className="flex gap-2">
                  {images.length > 1 && (
                    <div className="flex items-center gap-1 md:hidden">
                      <button
                        onClick={(e) => { e.stopPropagation(); goPrev(); }}
                        className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                      >
                        <ChevronLeft size={16} className="text-white" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); goNext(); }}
                        className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                      >
                        <ChevronRight size={16} className="text-white" />
                      </button>
                    </div>
                  )}
                  <button
                    onClick={() => downloadImage(images[currentIndex], currentIndex)}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                    title="Download"
                  >
                    <Download size={16} className="text-white" />
                  </button>
                </div>
              </div>
              {prompt && (
                <p className="text-white/60 text-xs mt-2 italic truncate">{prompt}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
