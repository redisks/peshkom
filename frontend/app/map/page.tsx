"use client";

import { Map, useYMaps, Placemark } from "@iminside/react-yandex-maps";
import {
  Sparkle,
  LoaderCircle,
  Bus,
  Footprints,
  Search,
  LocateFixed,
  House,
  SquareArrowOutUpRight,
  Check,
  Heart,
} from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useRouter } from "next/navigation";
import GlobalSearch from "@/components/GlobalSearch";
import { useEffect, useState, useRef, useContext } from "react";
import { PointsContext } from "@/context/PointsContext";
import { useSearchParams } from "next/navigation";
import { FavoriteType, IPlace } from "@/lib/types";
import Navigator from "@/components/Navigator";
import { places } from "@/data/places";
import { posts } from "@/data/posts";
import { favoritesService } from "@/lib/favorites";
import { useFavorites } from "@/hooks/useFavorites";

export default function MapPage() {
  const { favorites, isFavorite, removeFavorite, addFavorite } = useFavorites();

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
  const [shared, setShared] = useState(false);
  const [isInFavorite, setIsInFavorite] = useState<boolean | null>(null);

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

  useEffect(() => {
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
    setIsInFavorite(
      isFavorite(favoritesService.generateRouteId(points), FavoriteType.ROUTE)
    );
  }, [points, ymaps, mapRef]);

  useEffect(() => {
    setIsInFavorite(
      isFavorite(favoritesService.generateRouteId(points), FavoriteType.ROUTE)
    );
  }, [favorites]);

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
      const place = places.find(
        (place) => place._id === localStorage.getItem("endPoint")
      );
      if (
        localStorage.getItem("endPoint") &&
        place &&
        place._id !== points[points.length - 1]._id
      ) {
        setPoints((points) => [...points, place]);
      } else {
        setDrawerOpened(false);
        setRouteLoaded(false);
        const pointsArray = [
          coords,
          ...points.map((point) => [
            point.coordinates.lat,
            point.coordinates.lng,
          ]),
        ];

        const multiRoute = new ymaps.multiRouter.MultiRoute(
          {
            referencePoints: pointsArray,
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

  useEffect(() => {
    if (shared) {
      const timeout = setTimeout(() => {
        setShared(false);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [shared]);

  function toggleFavorite(pointsSelected: IPlace[] = points) {
    const routeId = favoritesService.generateRouteId(pointsSelected);
    if (isInFavorite) {
      removeFavorite(routeId, FavoriteType.ROUTE);
    } else {
      addFavorite(points, FavoriteType.ROUTE);
    }
  }

  if (!ymaps) {
    // TODO: loading
    return null;
  }

  return (
    <div className="flex justify-center">
      <div
        className="fixed top-8 left-5 z-10 shadow-md p-3 bg-light-white rounded-2xl"
        onClick={() => {
          router.push("/");
          exitRoute();
        }}
      >
        <House className="size-7" />
      </div>
      {points.length > 0 ? (
        <div
          className="fixed top-26 left-5 z-10 shadow-md p-3 bg-light-white rounded-2xl"
          onClick={() => toggleFavorite(points)}
        >
          {isInFavorite === null ? (
            <LoaderCircle className="size-7 animate-spin" />
          ) : (
            <Heart
              className={`size-7 ${
                isInFavorite
                  ? "text-pale-orange fill-pale-orange"
                  : "text-light-black"
              }`}
            />
          )}
        </div>
      ) : (
        ""
      )}
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
          className="fixed top-26 right-5 z-10 shadow-md p-3 bg-light-white rounded-2xl flex flex-col gap-6"
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
        <div
          className="fixed top-44 right-5 z-10 shadow-md p-3 bg-light-white rounded-2xl"
          onClick={() => {
            setShared(true);
            navigator.share({
              title: "Маршрут",
              url:
                window.location.origin +
                `/map?route=${points.map((point) => point._id).join(";")}`,
            });
            // navigator.clipboard
            //   .writeText(
            //     window.location.origin +
            //       `/map?route=${points.map((point) => point._id).join(";")}`
            //   )
            //   .then(() => {
            //     setShared(true);
            //   });
          }}
        >
          {shared ? (
            <Check className="size-7" />
          ) : (
            <SquareArrowOutUpRight className="size-7" />
          )}
        </div>
      ) : (
        ""
      )}
      {points.length > 0 ? (
        <div className="flex gap-4 flex-col justify-center items-center w-full fixed top-8 z-40">
          {routeLoading ? (
            <div className="bg-light-white px-3 py-3 text-center rounded-xl animate-pulse text-sm shadow-lg">
              Строим маршрут...
            </div>
          ) : (
            ""
          )}
        </div>
      ) : (
        ""
      )}

      {points.length > 0 ? (
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
          <DrawerTrigger className="fixed bottom-0 z-10 bg-light-white flex-col w-full p-5 flex items-center justify-between gap-4 rounded-t-3xl shadow-xl">
            <div className="flex flex-1 items-center relative w-full">
              <div className="flex-1 h-full shadow-md py-4 rounded-2xl flex pl-5 text-neutral-500 border-1">
                Куда?
              </div>
              <Search className="size-6 text-neutral-500 absolute right-4" />
            </div>
            <div className="w-full px-3 flex items-center gap-2">
              <Sparkle className="size-6" />
              <span>Вам понравится</span>
            </div>
            <div className="w-full px-3 flex flex-col gap-2 max-h-[200px] overflow-y-scroll pb-10">
              {posts.slice(0, 5).map((post) => (
                <div
                  className="w-full flex text-start text-base font-light p-5 rounded-xl shadow-lg"
                  key={post._id}
                  onClick={(evt) => {
                    evt.stopPropagation();
                    setPoints(post.route.places);
                  }}
                >
                  {post.title}
                </div>
              ))}
            </div>
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
        className="w-full fixed top-1"
        style={{ height: "calc(100vh - 25vh)" }}
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
