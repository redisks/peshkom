// app/favorites/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useFavorites } from "@/hooks/useFavorites";
import { FavoriteType } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Trash2, MapPin, Route, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function FavoritesPage() {
  const { favorites, removeFavorite, clearFavorites, hasFavorites } =
    useFavorites();
  const [endPoint, setEndPoint] = useState<string>("");
  const [showClearAlert, setShowClearAlert] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    id: string;
    type: FavoriteType;
    name: string;
  } | null>(null);

  useEffect(() => {
    setEndPoint(localStorage.getItem("endPoint") ?? "");
  }, []);

  const handleClearAll = () => {
    setShowClearAlert(true);
  };

  const handleConfirmClear = () => {
    clearFavorites();
    setShowClearAlert(false);
  };

  const handleDeleteItem = (id: string, type: FavoriteType, name: string) => {
    setItemToDelete({ id, type, name });
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      removeFavorite(itemToDelete.id, itemToDelete.type);
      setItemToDelete(null);
    }
  };

  if (!hasFavorites) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <Heart className="w-12 h-12 text-gray-300" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Избранное</h1>
          <p className="text-gray-500 mb-6">
            У вас пока нет избранных мест или маршрутов
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Избранное</h1>
        <Button
          variant="outline"
          size="icon"
          onClick={handleClearAll}
          className="h-10 w-10 text-red-500 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="h-5 w-5" />
        </Button>
      </div>

      <div className="space-y-8">
        {/* Избранные места */}
        {favorites.places.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-6 h-6 text-pale-orange" />
              <h2 className="text-lg font-semibold">Любимые места</h2>
              <Badge variant="secondary" className="ml-2">
                {favorites.places.length}
              </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.places.map((place, index) => (
                <Link
                  key={index}
                  href={"/place/" + place._id}
                  className="block"
                >
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{place.name}</CardTitle>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(evt) => {
                            evt.stopPropagation();
                            evt.preventDefault();
                            handleDeleteItem(
                              place._id,
                              FavoriteType.PLACE,
                              place.name
                            );
                          }}
                          className="h-8 w-8 text-red-400 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-3">
                        {place.address}
                      </p>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          ★ {place.rating}
                        </Badge>
                      </div>
                      <div
                        className={`text-sm text-center p-2 border-1 shadow-md mt-4 rounded-xl ${
                          endPoint === place._id
                            ? "bg-light-black text-light-white"
                            : "bg-light-white text-light-black transition-colors"
                        }`}
                        onClick={(evt) => {
                          evt.stopPropagation();
                          evt.preventDefault();
                          if (localStorage.getItem("endPoint") === place._id) {
                            setEndPoint("");
                            localStorage.setItem("endPoint", "");
                          } else {
                            setEndPoint((endPoint) =>
                              endPoint === place._id ? "" : place._id
                            );
                            localStorage.setItem("endPoint", place._id);
                          }
                        }}
                      >
                        {endPoint === place._id
                          ? "Убрать конечную точку"
                          : "Сделать конечной точкой"}
                      </div>
                      <span className="flex text-sm font-light text-center text-neutral-400 w-full mt-2">
                        этой точкой будут заканчиваться маршруты
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Избранные маршруты */}
        {favorites.routes.length > 0 && (
          <section className="pb-20">
            <div className="flex items-center gap-2 mb-4">
              <Route className="w-6 h-6 text-pale-orange" />
              <h2 className="text-lg font-semibold">Любимые маршруты</h2>
              <Badge variant="secondary" className="ml-2">
                {favorites.routes.length}
              </Badge>
            </div>
            <div className="grid grid-cols-1 gap-6">
              {favorites.routes.map((route, index) => {
                const routeId = route
                  .map((place) => place._id)
                  .sort()
                  .join("-");
                const routeName = `Маршрут ${index + 1}`;

                return (
                  <Link
                    href={
                      "/map?route=" + route.map((point) => point._id).join(";")
                    }
                    className="block"
                    key={routeId}
                  >
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{routeName}</CardTitle>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(evt) => {
                              evt.stopPropagation();
                              evt.preventDefault();
                              handleDeleteItem(
                                routeId,
                                FavoriteType.ROUTE,
                                routeName
                              );
                            }}
                            className="h-8 w-8 text-red-400 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <p className="text-sm text-gray-600">
                            {route.length} точек маршрута
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {route.slice(0, 3).map((point, i) => (
                              <Badge
                                key={i}
                                variant="outline"
                                className="text-xs"
                              >
                                {point.name}
                              </Badge>
                            ))}
                            {route.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{route.length - 3} ещё
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </div>

      {/* Диалог подтверждения очистки всего */}
      <AlertDialog open={showClearAlert} onOpenChange={setShowClearAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Очистить всё избранное?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие удалит все ваши избранные места и маршруты. Отменить
              это действие будет невозможно.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmClear}
              className="bg-red-500 hover:bg-red-600"
            >
              Очистить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Диалог подтверждения удаления одного элемента */}
      <AlertDialog
        open={!!itemToDelete}
        onOpenChange={(open) => !open && setItemToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить из избранного?</AlertDialogTitle>
            <AlertDialogDescription>
              Вы уверены, что хотите удалить "{itemToDelete?.name}" из
              избранного?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
