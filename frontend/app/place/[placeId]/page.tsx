"use client";

import { useParams, useRouter } from "next/navigation";
import { places } from "@/data/places";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Star, MapPin, ArrowLeft, LoaderCircle, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { num_word } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FavoriteType } from "@/lib/types";
import { useFavorites } from "@/hooks/useFavorites";

export default function Place() {
  const router = useRouter();
  const { favorites, isFavorite, addFavorite, removeFavorite } = useFavorites();
  const [isInFavorite, setIsInFavorite] = useState<boolean | null>(null);

  const { placeId } = useParams();
  const placeIds = useMemo(
    () => places.map((place) => String(place._id)),
    [places]
  );
  const place = useMemo(
    () => places.find((place) => String(place._id) === placeId),
    [placeId]
  );

  function toggleFavorite() {
    if (place) {
      if (isFavorite(place._id, FavoriteType.PLACE)) {
        removeFavorite(place._id, FavoriteType.PLACE);
      } else {
        addFavorite(place, FavoriteType.PLACE);
      }
    }
  }

  useEffect(() => {
    if (place) setIsInFavorite(isFavorite(place._id, FavoriteType.PLACE));
  }, [place, favorites]);

  if (!placeIds.includes(placeId?.toString() ?? "")) return "notfound";
  if (!place) return "notfound";

  return (
    <div className="w-full h-full min-h-screen flex flex-col font-unbounded">
      <header className="fixed top-3 w-full flex px-5 py-2 justify-between items-center">
        <Button
          className="bg-light-white rounded-full size-14"
          onClick={() => router.back()}
        >
          <ArrowLeft className="size-7 text-light-black" />
        </Button>
        <Button
          className="bg-light-white rounded-full size-14"
          onClick={() => toggleFavorite()}
        >
          {
            isInFavorite === null
            ?
            <LoaderCircle className='size-7 text-light-black animate-spin' />
            :

          <Heart
            className={`size-7 ${
              isInFavorite ? "text-pale-orange" : "text-light-black"
            }`}
          />
          }
        </Button>
      </header>
      <Image
        src={place.image}
        alt={place.name}
        className="w-full h-1/3"
        width={300}
        height={300}
      />
      <div className="w-full flex-1 bg-light-white border-pale-orange border-16 border-b-0 rounded-t-4xl flex flex-col gap-3 p-4 -mt-8">
        <div className="text-2xl font-unbounded font-medium">
          {place.name}
        </div>
        <div className="w-full flex gap-1 items-center">
          <Star className="size-6 text-yellow-400 fill-yellow-400" />
          <span className="text-xl">{place.rating}</span>
        </div>
        <Drawer>
          <DrawerTrigger className="w-full flex text-lg font-light underline text-pale-orange">
            {place.reviews.length}{" "}
            {num_word(place.reviews.length, ["отзыв", "отзыва", "отзывов"])}
          </DrawerTrigger>
          <DrawerContent className="h-5/6">
            <DrawerHeader>
              <DrawerTitle>Отзывы</DrawerTitle>
              <DrawerDescription>
                ⭐ {place.rating} - {place.reviews.length}{" "}
                {num_word(place.reviews.length, ["отзыв", "отзыва", "отзывов"])}
              </DrawerDescription>
            </DrawerHeader>
            <div className="w-full flex flex-col gap-4 px-4 pb-8 max-h-full overflow-y-scroll">
              {place.reviews.map((review, index) => (
                <div
                  key={index}
                  className="border-1 border-neutral-300 shadow-sm bg-neutral-50 p-4 rounded-xl flex flex-col"
                >
                  <header className="flex justify-between items-center">
                    <div className="flex gap-2 items-center">
                      <Avatar>
                        <AvatarFallback>
                          {review.author.slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{review.author}</span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <Star className="size-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-lg">{place.rating}</span>
                    </div>
                  </header>
                  <span className="w-full px-3">{review.text}</span>
                  <span className="w-full px-3 pt-2  text-base text-neutral-400">
                    {review.date}
                  </span>
                </div>
              ))}
            </div>
          </DrawerContent>
        </Drawer>
        <div className="flex gap-4 flex-wrap">
          {place.tags.map((tag, index) => (
            <Badge
              key={index}
              variant="outline"
              className="font-light border-light-black border-1 text-md"
            >
              {tag}
            </Badge>
          ))}
        </div>
        <div className="text-lg py-2 font-inter">{place.description}</div>
        <div className="text-sm font-light flex gap-2">
          <MapPin className="size-6 text-pale-orange" />
          <span className="text-pale-orange">{place.address}</span>
        </div>
      </div>
    </div>
  );
}
