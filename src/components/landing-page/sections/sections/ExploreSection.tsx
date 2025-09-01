import { ThumbnailCard } from "@/components/cards/ThumbnailCard";
import Image from "next/image";
export const ExploreCity = () => {
  const cities = [
    {
      redirectUrl: "/search",
      image: "/assets/Bali.webp",
      text: "Bali",
    },
    {
      redirectUrl: "/search",
      image: "/assets/Makassar.webp",
      text: "Makassar",
    },
    {
      redirectUrl: "/search",
      image: "/assets/Magelang.webp",
      text: "Magelang",
    },
    {
      redirectUrl: "/search",
      image: "/assets/Semarang.webp",
      text: "Semarang",
    },
    {
      redirectUrl: "/search",
      image: "/assets/Surabaya.webp",
      text: "Surabaya",
    },
    {
      redirectUrl: "/search",
      image: "/assets/Bandung.webp",
      text: "Bandung",
    },
  ];
  return (
    <div>
      <div className="text-3xl font-bold pb-8">Explore Indonesia</div>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3 ">
        {cities.map((x, i: number) => (
          <ThumbnailCard
            key={i}
            redirectUrl={x.redirectUrl}
            imageUrl={x.image}
            hoverAnim={true}
            text={x.text}
          ></ThumbnailCard>
        ))}
      </div>
    </div>
  );
};
