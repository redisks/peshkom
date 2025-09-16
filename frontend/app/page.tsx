"use client";

import "./blob.css";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { GirloSP } from "@/data/localFonts";
import PlaceTinder from "@/components/PlaceTinder/PlaceTinder";
import { places } from "@/data/places";
import DomeGallery from "@/components/DomeGallery";

export default function Home() {
  const [step, setStep] = useState(0);
  const [presentedCategories, setPresentedCategories] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const categories: string[] = useMemo(() => {
    const categs: string[] = [];
    places.forEach((place) => {
      categs.push(...place.tags);
    });
    return Array.from(new Set(categs));
  }, [places]);

  useEffect(() => {
    setPresentedCategories(
      categories.sort((a, b) => 0.5 - Math.random())
    );
  }, []);

  return (
    <main className="flex gap-4 flex-col items-center py-5 w-full h-full">
      {step === 0 ? (
        <>
          <header className="flex justify-between items-center w-full gap-12 text-lg px-5">
            <Link href="/map" className="text-neutral-500!">
              Пропустить
            </Link>
            <div
              onClick={() => {
                if (selectedCategories.length > 0) setStep(1);
              }}
              className={`flex gap-2 items-center cursor-pointer ${
                selectedCategories.length > 0
                  ? "text-pale-orange"
                  : "text-neutral-500"
              }`}
            >
              <span>Далее</span>
              <ChevronRight className="size-6" />
            </div>
          </header>
          <div className="w-full h-full">
            <header
              className={`mb-2 w-full bg-light-white text-center text-2xl ${GirloSP.className}`}
            >
              Куда идем?
            </header>
            <section className="w-full h-full">
              <DomeGallery
                segments={categories.length}
                elements={presentedCategories.map((category, index) => {
                  return {
                    id: category,
                    key: index,
                    content: (
                      <div
                        className="blob flex justify-center items-center text-center w-full h-full break-keep p-5"
                        data-selected={
                          selectedCategories.includes(category)
                            ? "true"
                            : "false"
                        }
                        key={index}
                        onClick={() => {
                          setSelectedCategories((selectedCategories) =>
                            selectedCategories.includes(category)
                              ? selectedCategories.filter(
                                  (categoryFilter) =>
                                    categoryFilter !== category
                                )
                              : [...selectedCategories, category]
                          );
                        }}
                      >
                        {category}
                      </div>
                    ),
                  };
                })}
              />
            </section>
          </div>
        </>
      ) : step === 1 ? (
        <PlaceTinder
          setStep={setStep}
          initialPlaces={places.filter((place) =>
            place.tags.some((tag) => selectedCategories.includes(tag))
          )}
        />
      ) : (
        ""
      )}
    </main>
  );
}
