"use client";

import { Map, useYMaps, Placemark } from "@iminside/react-yandex-maps";
import {
  ArrowLeft,
  Route,
  Dices,
  Sparkle,
  Search,
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
import { useSearchParams } from "next/navigation";
import { IPlace } from "@/lib/types";
import Navigator from "@/components/Navigator";

export default function MapPage() {
  const mapRef = useRef<ymaps.Map>(undefined);
  const ymaps = useYMaps(["multiRouter.MultiRoute"]);
  const router = useRouter();
  const { points, setPoints } = useContext(PointsContext);
  const [drawerOpened, setDrawerOpened] = useState<boolean>(false);
  const [coords, setCoords] = useState<[number, number]>([
    44.555944, 34.314654,
  ]);
  const [currentRoute, setCurrentRoute] =
    useState<ymaps.multiRouter.MultiRoute | null>(null);
  const [play, setPlay] = useState(false);
  const [windowBlurred, setWindowBlurred] = useState(false);
  const [routeLoading, setRouteLoading] = useState(false);
  const [routeLoaded, setRouteLoaded] = useState(false);
  const [distance, setDistance] = useState("");
  const [time, setTime] = useState("");

  const searchParams = useSearchParams();

  useEffect(() => {
    // @ts-ignore
    setDistance(currentRoute?.getActiveRoute()?.properties.get("distance", {value: 0, text: ''}).text);
    // @ts-ignore
    setTime(currentRoute?.getActiveRoute()?.properties.get("duration", {value: 0, text: ''}).text);
  }, [currentRoute]);

  const defaultState = {
    center: [44.555944, 34.314654],
    zoom: 14,
    controls: [],
  };

  const options = {
    enableHighAccuracy: true,
    timeout: 1000,
    maximumAge: 0,
  };

  useEffect(() => {
    if (searchParams.get("route")) {
      setDrawerOpened(true);
    }
  }, []);

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      console.log("Геолокация не поддерживется на данном устройстве");
    } else {
      // getPosition();
    }
    loadRoute(coords, points);
  }, [points, ymaps]);

  const getPosition = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (
          !windowBlurred &&
          points.length > 0 &&
          (Math.abs(coords[0] - position.coords.latitude) > 0.0006 ||
            Math.abs(coords[1] - position.coords.longitude) > 0.0006)
        ) {
          loadRoute(
            [position.coords.latitude, position.coords.longitude],
            points
          );
        }
        setCoords([position.coords.latitude, position.coords.longitude]);
      },
      (err) => console.log(err),
      options
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      getPosition();
    }, 10000);

    return () => clearInterval(interval);
  }, [points]);

  useEffect(() => {
    getPosition();
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

  function loadRoute(coords: [number, number], points: IPlace[]) {
    if (ymaps && points.length > 0) {
      setDrawerOpened(false);
      setRouteLoaded(true);
      const multiRoute = new ymaps.multiRouter.MultiRoute(
        {
          referencePoints: [coords, ...points.map((point) => [point.coordinates.lat, point.coordinates.lng])],
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
        setRouteLoading(true);
        multiRoute.events.add("update", () => {
          setCurrentRoute(multiRoute);
          setRouteLoaded(true);
          setRouteLoading(false);
        });
      }
    }
  }

  function exitRoute() {
    setPlay(false);
    if (currentRoute) {
      mapRef.current?.geoObjects.remove(currentRoute);
    }
    setCurrentRoute(null);
    setRouteLoaded(false);
    setPoints([]);
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
        {/* <Route
          className="size-8"
          onClick={() => {
            const route = searchParams.get("route");
            if (route) {
              setPoints(
                route
                  .split(";")
                  .map((id) => places.find((place) => place._id === id))
                  .filter((place) => place !== undefined)
              );
            }
          }}
        /> */}
        <LocateFixed onClick={getPosition} />
        {/* <Dices className="size-8" /> */}
      </div>
      {points.length > 0 ? (
        <div className="flex gap-4 flex-col justify-center items-center w-full fixed bottom-28 z-10">
          {routeLoading ? (
            <div className="bg-white px-10 py-2 text-center rounded-xl animate-pulse text-sm shadow-lg">
              Строим маршрут...
            </div>
          ) : (
            ""
          )}
        </div>
      ) : (
        ""
      )}

      {routeLoaded ? (
        <div className="fixed bottom-0 z-10 bg-light-white w-full p-5 flex items-stretch justify-between gap-4 rounded-t-3xl shadow-xl">
          <Navigator
            mapRef={mapRef}
            coords={coords}
            exitRoute={exitRoute}
            loadRoute={loadRoute}
            getPosition={getPosition}
            time={time}
            distance={distance}
          />
        </div>
      ) : (
        <Drawer
          open={drawerOpened}
          onOpenChange={(open) => setDrawerOpened(open)}
        >
          <DrawerTrigger className="fixed bottom-0 z-10 bg-light-white w-full p-5 flex items-stretch justify-between gap-4 rounded-t-3xl shadow-xl">
            <div className="flex flex-1 items-center relative">
              <Input
                placeholder="Куда?"
                className="flex-1 h-full shadow-md py-4 rounded-2xl"
              />
              <Search className="size-6 text-neutral-500 absolute right-4" />
            </div>
            {/* <div className="p-3 bg-light-white shadow-md rounded-2xl">
              <Sparkle className="size-8" />
            </div> */}
          </DrawerTrigger>
          <DrawerContent className="h-[95%]">
            <DrawerHeader className="w-full flex items-stretch justify-between">
              <DrawerTitle className="sr-only">Поиск</DrawerTitle>
            </DrawerHeader>
            <GlobalSearch coords={coords} />
          </DrawerContent>
        </Drawer>
      )}

      <Map
        defaultState={defaultState}
        defaultOptions={{
          suppressMapOpenBlock: true,
        }}
        className="w-full h-screen fixed top-0"
        modules={["multiRouter.MultiRoute"]}
        instanceRef={mapRef}
        onLoad={() => loadRoute(coords, points)}
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
