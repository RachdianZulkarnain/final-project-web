import { ThumbnailCard } from "@/components/cards/ThumbnailCard";

export const ExploreCity = () => {
  const cities = [
    { name: "Bali", image: "/assets/Bali.webp" },
    { name: "Makassar", image: "/assets/Makassar.webp" },
    { name: "Magelang", image: "/assets/Magelang.webp" },
    { name: "Semarang", image: "/assets/Semarang.webp" },
    { name: "Surabaya", image: "/assets/Surabaya.webp" },
    { name: "Bandung", image: "/assets/Bandung.webp" },
  ];

  return (
    <div>
      <div className="text-3xl text-[#0290d1] font-bold pb-8">Explore Indonesia</div>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
        {cities.map((x, i) => (
          <ThumbnailCard
            key={i}
            redirectUrl={`/property-catalog?location=${encodeURIComponent(
              x.name
            )}`}
            imageUrl={x.image}
            hoverAnim={true}
            text={x.name}
          />
        ))}
      </div>
    </div>
  );
};
