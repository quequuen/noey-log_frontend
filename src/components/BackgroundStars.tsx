import { useEffect, useState } from 'react';

interface Star {
  id: number;
  top: string;
  left: string;
  size: string;
  opacity: number;
  animationDuration: string;
}

export default function BackgroundStars() {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    const starCount = 60;
    const generatedStars: Star[] = [];

    for (let i = 0; i < starCount; i++) {
      const size = `${Math.random() * 1.5 + 0.5}px`;
      const top = `${Math.random() * 100}%`;
      const left = `${Math.random() * 100}%`;
      const opacity = Math.random() * 0.6 + 0.2;
      const animationDuration = `${Math.random() * 3 + 2}s`;

      generatedStars.push({ id: i, top, left, size, opacity, animationDuration });
    }

    const timer = setTimeout(() => {
      setStars(generatedStars);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute bg-white rounded-full animate-pulse"
          style={{
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
            opacity: star.opacity,
            animationDuration: star.animationDuration, 
          }}
        />
      ))}
    </div>
  );
}