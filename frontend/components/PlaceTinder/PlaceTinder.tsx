"use client";

import "./style.css";
import { useEffect, useMemo, useState } from "react";
import { MapPin, FlagTriangleLeft, Repeat } from "lucide-react";
import { calculateDistance } from "@/lib/utils";
import { IPlace } from "@/lib/types";
import { useRouter } from "next/navigation";

const PlaceTinder = ({ initialPlaces }: { initialPlaces: IPlace[] }) => {
  const router = useRouter();

  const [isAnimating, setIsAnimating] = useState<
    "right" | "left" | "refresh" | null
  >(null);
  const [coords, setCoords] = useState<[number, number]>([0, 0]);

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

  const handleSwipe = (direction: "left" | "right") => {
    if (isAnimating || places.length === 0) return;

    setIsAnimating(direction);

    setTimeout(() => {
      const newYesPlaces = Array.from(new Set([...yesPlaces, currentPlace]));
      if (direction === "left") {
        setNoPlaces(Array.from(new Set([...noPlaces, currentPlace])));
        if (places.length > 1) {
          setPlaces(places.filter((place) => place._id !== currentPlace._id));
        }
      } else if (direction === "right") {
        setYesPlaces(newYesPlaces);
        if (places.length > 1) {
          setPlaces(places.filter((place) => place._id !== currentPlace._id));
        }
      }

      if (places.length === 1) {
        router.push(
          "/map?route=" + newYesPlaces.map((place) => place._id).join(";")
        );
      }
      setIsAnimating(null);
    }, 500);
  };

  const handleRefresh = () => {
    if (places.length > 1) {
      if (isAnimating) return;

      setIsAnimating("refresh");

      setTimeout(() => {
        setPlaces(places.sort(() => 0.5 - Math.random()));

        setIsAnimating(null);
      }, 500);
    }
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
    <div className="relative flex-1 m-4 rounded-2xl overflow-hidden shadow-xl">
      <div
        className={`card-${
          places.length === 1 ? "end-" : "" + isAnimating
        } relative z-10 flex flex-col justify-end h-full p-6 text-white bg-cover`}
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)), url(${currentPlace?.image})`,
        }}
      >
        <div className="mb-2">
          <h2 className="text-2xl font-bold mb-2">{currentPlace?.name}</h2>
        </div>
        <div className="flex flex-col gap-2 text-base mb-4">
          <div className="flex items-center gap-2">
            <MapPin className="size-8" />
            <p>{currentPlace?.address}</p>
          </div>
          <div className="flex items-center gap-2">
            <FlagTriangleLeft className="size-8" />
            <p>{distance} км от меня</p>
          </div>
        </div>
        <div className="relative flex justify-between items-center p-6">
          {/* Кнопка "Не иду" */}
          <button
            onClick={() => handleSwipe("left")}
            className="w-40 h-40 rounded-full bg-pale-orange/20 backdrop-blur-2xl flex items-center justify-center shadow-lg transition-colors text-2xl font-medium absolute -bottom-10 -left-10 rounded-bl-2xl"
            style={{ boxShadow: "inset 5px 5px 10px white" }}
            aria-label="Не иду"
          >
            Не иду
          </button>

          {/* Кнопка обновления */}
          <button
            onClick={handleRefresh}
            className={`w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center shadow-lg hover:bg-gray-300 transition-colors mx-auto z-10 ${
              places.length === 1 ? "opacity-0" : ""
            }`}
            aria-label="Обновить"
          >
            <Repeat className="size-6 text-light-black" />
          </button>

          {/* Кнопка "Иду" */}
          <button
            onClick={() => handleSwipe("right")}
            className="w-40 h-40 rounded-full bg-pale-orange/20 backdrop-blur-2xl flex items-center justify-center shadow-lg transition-colors text-2xl font-medium absolute -bottom-10 -right-10 rounded-br-2xl"
            style={{ boxShadow: "inset 5px 5px 10px white" }}
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
