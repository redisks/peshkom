"use client";

import "./style.css";
import { useEffect, useMemo, useState, Dispatch, SetStateAction } from "react";
import {
  MapPin,
  FlagTriangleLeft,
  Repeat,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { calculateDistance } from "@/lib/utils";
import { IPlace } from "@/lib/types";
import { useRouter } from "next/navigation";

const PlaceTinder = ({
  initialPlaces,
  setStep,
}: {
  initialPlaces: IPlace[];
  setStep: Dispatch<SetStateAction<number>>;
}) => {
  const router = useRouter();

  const [isAnimating, setIsAnimating] = useState<
    "right" | "left" | "refresh" | null
  >(null);
  const [coords, setCoords] = useState<[number, number]>([0, 0]);
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(
    null
  );
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(
    null
  );
  const [cardPosition, setCardPosition] = useState({ x: 0, y: 0 });

  const [yesPlaces, setYesPlaces] = useState<IPlace[]>([]);
  const [noPlaces, setNoPlaces] = useState<IPlace[]>([]);
  const [places, setPlaces] = useState<IPlace[]>(initialPlaces);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords([position.coords.latitude, position.coords.longitude]);
      },
      (err) => console.log(err)
    );
  }, []);

  const handleSwipe = (direction: "left" | "right" | "refresh") => {
    if (isAnimating || places.length === 0) return;

    setIsAnimating(direction);

    setTimeout(() => {
      let newYesPlaces: IPlace[] = [];
      if (direction === "left") {
        setNoPlaces(Array.from(new Set([...noPlaces, currentPlace])));
        if (places.length > 1) {
          setPlaces(places.filter((place) => place._id !== currentPlace._id));
        }
      } else if (direction === "right") {
        newYesPlaces = Array.from(new Set([...yesPlaces, currentPlace]));
        setYesPlaces(newYesPlaces);
        if (places.length > 1) {
          setPlaces(places.filter((place) => place._id !== currentPlace._id));
        }
      } else if (direction === "refresh") {
        setPlaces(places.sort(() => 0.5 - Math.random()));
      }

      if (direction !== "refresh" && places.length === 1) {
        router.push(
          "/map?route=" + newYesPlaces.map((place) => place._id).join(";")
        );
      }
      setIsAnimating(null);
      setCardPosition({ x: 0, y: 0 });
    }, 500);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart) return;

    const touchCurrent = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    };

    // Calculate movement for animation
    const diffX = touchCurrent.x - touchStart.x;
    const diffY = touchCurrent.y - touchStart.y;

    // Определяем, по какой оси идет движение
    const isHorizontalSwipe = Math.abs(diffX) > Math.abs(diffY);

    // Ограничиваем движение только по одной оси
    if (isHorizontalSwipe) {
      setCardPosition({ x: diffX, y: 0 });
    } else {
      setCardPosition({ x: 0, y: diffY });
    }

    setTouchEnd(touchCurrent);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const diffX = touchEnd.x - touchStart.x;
    const diffY = touchEnd.y - touchStart.y;

    // Minimum swipe distance
    const minSwipeDistance = 50;

    // Определяем, по какой оси идет движение
    const isHorizontalSwipe = Math.abs(diffX) > Math.abs(diffY);

    if (isHorizontalSwipe) {
      // Горизонтальный свайп
      if (Math.abs(diffX) > minSwipeDistance) {
        if (diffX > 0) {
          handleSwipe("right");
        } else {
          handleSwipe("left");
        }
      } else {
        // Reset position if swipe wasn't long enough
        setCardPosition({ x: 0, y: 0 });
      }
    } else {
      // Вертикальный свайп - ТОЛЬКО ВВЕРХ для refresh
      if (diffY < 0 && Math.abs(diffY) > minSwipeDistance) {
        // Только свайп вверх
        handleSwipe("refresh");
      } else {
        // Игнорируем свайп вниз и короткие свайпы, просто сбрасываем позицию
        setCardPosition({ x: 0, y: 0 });
      }
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  if (places.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        Загрузка...
      </div>
    );
  }

  const currentPlace = places[0];

  const distance = useMemo(() => {
    if (coords[0] !== 0 && coords[1] !== 0 && currentPlace) {
      const currentPlace = places[0];
      return calculateDistance(
        coords[0],
        coords[1],
        currentPlace.coordinates.lat,
        currentPlace.coordinates.lng
      ).toFixed(1);
    } else {
      return "?";
    }
  }, [coords]);

  return (
    <div className="w-full flex flex-col h-full mb-14">
      <header className="flex justify-between items-center w-full gap-12 text-lg px-5">
        <div
          className="flex gap-2 items-center cursor-pointer"
          onClick={() => setStep(0)}
        >
          <ChevronLeft className="size-6" />
          <span>Назад</span>
        </div>
        {/* link to map */}
        <div
          className="flex gap-2 items-center cursor-pointer text-pale-orange"
          onClick={() => {
            router.push(
              "/map?route=" + yesPlaces.map((place) => place._id).join(";")
            );
          }}
        >
          <span>Готово</span>
          <ChevronRight className="size-6" />
        </div>
      </header>
      <div className="relative w-11/12 flex-1 m-4 rounded-2xl overflow-hidden shadow-xl">
        <div
          className={`card-${
            places.length === 1 ? "end-" : "" + isAnimating
          } relative z-10 flex flex-col justify-end w-full h-full p-6 text-light-white max-w-screen bg-cover`}
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)), url(${currentPlace?.image})`,
            transform: `translate(${cardPosition.x}px, ${cardPosition.y}px)`,
            transition: touchStart ? "none" : "transform 0.2s ease",
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <button
            onClick={() => handleSwipe("refresh")}
            className={`p-3 rounded-full bg-gray-200 flex items-center justify-center shadow-lg hover:bg-gray-300 transition-colors mx-auto z-10 absolute top-5 right-5 ${
              places.length === 1 ? "opacity-0" : ""
            }`}
            aria-label="Обновить"
          >
            <Repeat className="size-6 text-light-black" />
          </button>
          <div className="mb-2">
            <h2 className="text-2xl w-full font-bold mb-2 max-h-5/6">
              {currentPlace?.name}
            </h2>
          </div>
          <div className="flex flex-col gap-2 text-base mb-24">
            <div className="flex items-center gap-2">
              <FlagTriangleLeft className="size-8" />
              <p>{distance} км от меня</p>
            </div>
          </div>
          <div className="relative flex justify-center items-center p-6">
            <button
              onClick={() => handleSwipe("left")}
              className="w-36 h-36 rounded-full bg-neutral-500 backdrop-blur-2xl flex items-center justify-center shadow-lg transition-colors text-xl font-medium absolute -bottom-10 -left-10 rounded-bl-2xl"
              style={{ boxShadow: "inset 5px 5px 10px white" }}
              aria-label="Не иду"
            >
              Не иду
            </button>
            <button
              onClick={() => handleSwipe("right")}
              className="w-36 h-36 rounded-full bg-pale-orange backdrop-blur-2xl flex items-center justify-center shadow-lg transition-colors text-xl font-medium absolute -bottom-10 -right-10 rounded-br-2xl"
              style={{ boxShadow: "inset 5px 5px 10px white" }}
              aria-label="Иду"
            >
              Иду
            </button>
          </div>
        </div>

        {/* Анимация свайпа */}
        {isAnimating && (
          <div className="absolute inset-0 bg-light-white/20 animate-pulse" />
        )}
      </div>
      <div className="w-full text-center flex justify-between items-center px-5">
        <span>Выбрано: {yesPlaces.length}</span>{" "}
        <span>Осталось: {places.length}</span>
      </div>
    </div>
  );
};

export default PlaceTinder;
