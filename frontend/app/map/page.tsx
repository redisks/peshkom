"use client";

import { Map, useYMaps, Placemark } from "@iminside/react-yandex-maps";
import {
  ArrowLeft,
  Route,
  Dices,
  Sparkle,
  Search,
  Play,
  Pause,
  Repeat,
  X,
  LocateFixed,
} from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import GlobalSearch from "@/components/GlobalSearch";
import { useEffect, useState, useRef, useContext } from "react";
import { PointsContext } from "@/context/PointsContext";

export default function MapPage() {
  const mapRef = useRef<ymaps.Map>(undefined);
  const ymaps = useYMaps(["multiRouter.MultiRoute"]);
  const router = useRouter();
  const { points, setPoints } = useContext(PointsContext);
  const [drawerOpened, setDrawerOpened] = useState<boolean>(false);
  const [coords, setCoords] = useState<[number, number]>([
    55.768418, 37.588948,
  ]);
  const [currentRoute, setCurrentRoute] =
    useState<ymaps.multiRouter.MultiRoute | null>(null);
  const [play, setPlay] = useState(false);
  const [windowBlurred, setWindowBlurred] = useState(false);

  const defaultState = {
    center: [55.768418, 37.588948],
    zoom: 13,
    controls: [],
  };

  const options = {
    enableHighAccuracy: true,
    timeout: 1000,
    maximumAge: 0,
  };

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      console.log("Геолокация не поддерживется на данном устройстве");
    } else {
      // getPosition();
    }
    loadRoute(coords);
  }, [points, ymaps]);

  // function getPosition() {
  //   navigator.geolocation.getCurrentPosition(
  //     (position) => {
  //       setCoords([position.coords.latitude, position.coords.longitude]);
  //     },
  //     (err) => console.log(err),
  //     options
  //   );
  // }

  const getPosition = () => {
    const offset = 0.005;
    const [latitude, longitude] = coords;

    const newLatitude = parseFloat(
      (latitude + (Math.random() * 2 - 1) * offset).toFixed(5)
    );
    const newLongitude = parseFloat(
      (longitude + (Math.random() * 2 - 1) * offset).toFixed(5)
    );

    setCoords([newLatitude, newLongitude]);

    console.log(
      points.length,
      Math.abs(latitude - newLatitude) > 0.0006 ||
        Math.abs(longitude - newLongitude) > 0.0006
    );
    if (
      !windowBlurred &&
      points.length > 0 &&
      (Math.abs(latitude - newLatitude) > 0.0006 ||
        Math.abs(longitude - newLongitude) > 0.0006)
    ) {
      console.log("yes");
      loadRoute([newLatitude, newLongitude]);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      getPosition();
    }, 10000);

    return () => clearInterval(interval);
  }, [points]);

  useEffect(() => {
    const onBlur = () => {
      setWindowBlurred(true);
    };
    const onFocus = () => {
      setWindowBlurred(false);
    };
    window.addEventListener("blur", onBlur);
    window.addEventListener("focus", onFocus);

    return () => {
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  function loadRoute(coords: [number, number]) {
    if (ymaps && points.length > 0) {
      setDrawerOpened(false);
      const multiRoute = new ymaps.multiRouter.MultiRoute(
        {
          referencePoints: [coords, ...points.map((point) => point.address)],
          params: {
            routingMode: "pedestrian",
          },
        },
        {
          mapStateAutoApply: true,
          boundsAutoApply: true,
        }
      );
      if (mapRef.current) {
        mapRef.current.geoObjects.splice(1, 1);
        mapRef.current.geoObjects.add(multiRoute);
        setCurrentRoute(multiRoute);
      }
    }
  }

  useEffect(() => {
    if (play) {
      mapRef.current?.setCenter(coords, 18, {
        duration: 500,
      });
    }
  }, [play]);

  if (!ymaps) {
    // TODO: loading
    return null;
  }

  return (
    <div className="flex justify-center">
      <div
        className="fixed top-8 left-5 z-10 shadow-md p-3 bg-light-white rounded-2xl"
        onClick={() => router.back()}
      >
        <ArrowLeft className="size-8" />
      </div>
      <div className="fixed top-8 right-5 z-10 shadow-md p-3 bg-light-white rounded-2xl flex flex-col gap-6">
        <LocateFixed className="size-8" onClick={getPosition} />
        <Route className="size-8" />
        <Dices className="size-8" />
      </div>
      {points.length > 0 ? (
        <div className="flex gap-4 justify-center items-center w-full fixed bottom-28 z-10">
          <div
            className="p-5 bg-light-white rounded-[50%] shadow-xl"
            onClick={() => loadRoute(coords)}
          >
            <Repeat className="size-8" />
          </div>
          <div
            className="p-5 bg-light-white rounded-[50%] z-10 shadow-xl"
            onClick={() => setPlay((play) => !play)}
          >
            {play ? <Pause className="size-8" /> : <Play className="size-8" />}
          </div>
          <div
            className="p-5 bg-light-white rounded-[50%] shadow-xl"
            onClick={() => {
              setPlay(false);
              if (currentRoute) {
                mapRef.current?.geoObjects.remove(currentRoute);
              }
              setCurrentRoute(null);
              setPoints([]);
            }}
          >
            <X className="size-8" />
          </div>
        </div>
      ) : (
        ""
      )}
      <Drawer
        open={drawerOpened}
        onOpenChange={(open) => setDrawerOpened(open)}
      >
        <DrawerTrigger className="fixed bottom-0 z-10 bg-light-white w-full p-5 flex items-stretch justify-between gap-4 rounded-t-3xl shadow-xl">
          <div className="flex flex-1 items-center relative">
            <Input
              placeholder="Что хотите посетить?"
              className="flex-1 h-full shadow-md py-4 rounded-2xl"
            />
            <Search className="size-6 text-neutral-500 absolute right-4" />
          </div>
          <div className="p-3 bg-light-white shadow-md rounded-2xl">
            <Sparkle className="size-8" />
          </div>
        </DrawerTrigger>
        <DrawerContent className="h-[95%]">
          <DrawerHeader className="w-full flex items-stretch justify-between">
            <DrawerTitle className="sr-only">Поиск</DrawerTitle>
          </DrawerHeader>
          <GlobalSearch />
        </DrawerContent>
      </Drawer>
      <Map
        defaultState={defaultState}
        defaultOptions={{
          suppressMapOpenBlock: true,
        }}
        className="w-full h-screen fixed top-0"
        modules={["multiRouter.MultiRoute"]}
        instanceRef={mapRef}
        onLoad={() => loadRoute(coords)}
      >
        <Placemark
          geometry={coords}
          options={{
            preset: "islands#bluePersonIcon",
          }}
        />
      </Map>
    </div>
  );
}
