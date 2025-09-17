"use client";

import { Map, useYMaps, Placemark } from "@iminside/react-yandex-maps";
import {
  LoaderCircle,
  Bus,
  Footprints,
  Search,
  LocateFixed,
  House,
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
import {
  useEffect,
  useState,
  useRef,
  useContext,
  useLayoutEffect,
} from "react";
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
  const [onFeet, setOnFeet] = useState(true);
  const [windowBlurred, setWindowBlurred] = useState(false);
  const [routeLoading, setRouteLoading] = useState(false);
  const [routeLoaded, setRouteLoaded] = useState(false);
  const [distance, setDistance] = useState("");
  const [time, setTime] = useState("");
  const [positionLoading, setPositionLoading] = useState(false);

  const searchParams = useSearchParams();

  useEffect(() => {
    setDistance(
      currentRoute
        ?.getActiveRoute()
        // @ts-ignore
        ?.properties.get("distance", { value: 0, text: "" }).text
    );
    setTime(
      currentRoute
        ?.getActiveRoute()
        // @ts-ignore
        ?.properties.get("duration", { value: 0, text: "" }).text
    );
  }, [currentRoute]);

  const defaultState = {
    center: [44.555944, 34.314654],
    zoom: 14,
    controls: [],
  };

  const options = {
    enableHighAccuracy: false,
  };

  useLayoutEffect(() => {
    const timeout = setTimeout(() => {
      if (!("geolocation" in navigator)) {
        console.log("Геолокация не поддерживется на данном устройстве");
      } else {
        getPosition(true);
      }
    }, 500);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (searchParams.get("route")) {
      setDrawerOpened(true);
    }
  }, []);

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      console.log("Геолокация не поддерживется на данном устройстве");
    } else {
      getPosition(true);
    }
    loadRoute(coords, points);
  }, [points, ymaps, mapRef]);

  const getPosition = (zoom: boolean = false) => {
    setPositionLoading(true);
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
        if (zoom && mapRef.current) {
          mapRef.current
            .setCenter(
              [position.coords.latitude, position.coords.longitude],
              18,
              {
                duration: 500,
              }
            )
            .then(() => {
              setPositionLoading(false);
            });
        }
      },
      (err) => console.log(err),
      options
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      getPosition(false);
    }, 10000);

    return () => clearInterval(interval);
  }, [points]);

  useEffect(() => {
    return () => {
      exitRoute();
    };
  }, []);

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

  function loadRoute(coords: [number, number], points: IPlace[]) {
    if (ymaps && points.length > 0) {
      setDrawerOpened(false);
      setRouteLoaded(true);
      const multiRoute = new ymaps.multiRouter.MultiRoute(
        {
          referencePoints: [
            coords,
            ...points.map((point) => [
              point.coordinates.lat,
              point.coordinates.lng,
            ]),
          ],
          params: {
            routingMode: onFeet ? "pedestrian" : "masstransit",
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

  useEffect(() => {
    loadRoute(coords, points);
  }, [onFeet]);

  if (!ymaps) {
    // TODO: loading
    return null;
  }

  return (
    <div className="flex justify-center">
      <div
        className="fixed top-8 left-5 z-10 shadow-md p-3 bg-light-white rounded-2xl"
        onClick={() => {
          exitRoute();
          router.push("/");
        }}
      >
        <House className="size-7" />
      </div>
      <div
        className="fixed top-8 right-5 z-10 shadow-md p-3 bg-light-white rounded-2xl flex flex-col gap-6"
        onClick={() => getPosition(true)}
      >
        {positionLoading ? (
          <LoaderCircle className="size-7 animate-spin" />
        ) : (
          <LocateFixed className="size-7" />
        )}
      </div>
      {points.length > 0 ? (
        <div
          className="fixed top-28 right-5 z-10 shadow-md p-3 bg-light-white rounded-2xl flex flex-col gap-6"
          onClick={() => setOnFeet((onFeet) => !onFeet)}
        >
          {onFeet ? (
            <Bus className="size-7" />
          ) : (
            <Footprints className="size-7" />
          )}
        </div>
      ) : (
        ""
      )}
      {points.length > 0 ? (
        <div className="flex gap-4 flex-col justify-center items-center w-full fixed top-8 z-40">
          {routeLoading ? (
            <div className="bg-white px-3 py-3 text-center rounded-xl animate-pulse text-sm shadow-lg">
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
        <div className="fixed bottom-0 z-10 bg-light-white w-full p-5 flex gap-4 rounded-t-3xl shadow-xl flex-col">
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
              <div className="flex-1 h-full shadow-md py-4 rounded-2xl flex pl-5 text-neutral-500 border-1">
                Куда?
              </div>
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
