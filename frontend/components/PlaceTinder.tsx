"use client";

import { useState } from "react";
import { places } from "@/data/places";
import { MapPin, FlagTriangleLeft, Repeat } from "lucide-react";

const PlaceTinder = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleSwipe = (direction: "left" | "right") => {
    if (isAnimating || places.length === 0) return;

    setIsAnimating(true);
    console.log(
      `${direction === "right" ? "Иду" : "Не иду"} в ${
        places[currentIndex].name
      }`
    );

    setTimeout(() => {
      if (currentIndex < places.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        // Если закончились карточки, начинаем сначала
        setCurrentIndex(0);
      }
      setIsAnimating(false);
    }, 300);
  };

  const handleRefresh = () => {
    if (isAnimating) return;

    setIsAnimating(true);

    const randomIndex = Math.floor(Math.random() * places.length);
    setCurrentIndex(randomIndex);

    setTimeout(() => {
      setIsAnimating(false);
    }, 300);
  };

  if (places.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        Загрузка...
      </div>
    );
  }

  const currentPlace = places[currentIndex];

  return (
    <div className="relative flex-1 m-4 rounded-2xl overflow-hidden shadow-xl">
      <div
        className="relative z-10 flex flex-col justify-end h-full p-6 text-white bg-cover"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)), url(${currentPlace.image})`,
        }}
      >
        <div className="mb-2">
          <h2 className="text-2xl font-bold mb-2">{currentPlace.name}</h2>
        </div>
        <div className="text-sm mb-4">
          <div className="flex items-center gap-2">
            <MapPin className="size-8" />
            <p>{currentPlace.address}</p>
          </div>
          <div className="flex items-center gap-2">
            <FlagTriangleLeft className="size-8" />
            <p className="opacity-75">1 км от меня</p>
          </div>
        </div>
        <div className="relative flex justify-between items-center p-6">
          {/* Кнопка "Не иду" */}
          <button
            onClick={() => handleSwipe("left")}
            disabled={isAnimating}
            className="w-40 h-40 rounded-full bg-red-500 flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors disabled:opacity-50 text-2xl font-medium absolute -bottom-10 -left-10 rounded-bl-none"
            aria-label="Не иду"
          >
            Не иду
          </button>

          {/* Кнопка обновления */}
          <button
            onClick={handleRefresh}
            disabled={isAnimating}
            className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center shadow-lg hover:bg-gray-300 transition-colors disabled:opacity-50 mx-auto z-10"
            aria-label="Обновить"
          >
            <Repeat className='size-6 text-light-black' />
          </button>

          {/* Кнопка "Иду" */}
          <button
            onClick={() => handleSwipe("right")}
            disabled={isAnimating}
            className="w-40 h-40 rounded-full bg-green-500 flex items-center justify-center shadow-lg hover:bg-green-600 transition-colors disabled:opacity-50 text-3xl font-medium absolute -bottom-10 -right-10 rounded-br-none"
            aria-label="Иду"
          >
            Иду
          </button>
        </div>
      </div>

      {/* Анимация свайпа */}
      {isAnimating && (
        <div className="absolute inset-0 bg-white/20 animate-pulse" />
      )}
    </div>
  );
};

export default PlaceTinder;
