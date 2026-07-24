"use client";

import { useRef, useEffect, useState } from "react";

export default function LazyVideo({ src, className, ...props }) {
  const videoRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Stop observing after video becomes visible
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, []);

  return (
    <video
      ref={videoRef}
      className={className}
      {...props}
    >
      {isVisible && <source src={src} type="video/mp4" />}
      Your browser does not support the video tag.
    </video>
  );
}
