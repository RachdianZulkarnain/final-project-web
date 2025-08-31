import { ThumbnailCard } from '@/components/cards/ThumbnailCard';
import Image from 'next/image';
export const ExploreCity = () => {
  const cities = [
    {
      redirectUrl:
        "/search?lat=-8.4095178&lng=115.188916&country=Indonesia&page=1",
      image: "/assets/Bali.webp",
      text: "Bali",
    },
    {
      redirectUrl:
        "/search?lat=13.7563309&lng=100.5017651&country=Thailand&page=1",
      image: "/assets/Makassar.webp",
      text: "Makassar",
    },
    {
      redirectUrl: "/search?lat=35.6764225&lng=139.650027&country=Japan&page=1",
      image: "/assets/Magelang.webp",
      text: "Magelang",
    },
    {
      redirectUrl:
        "/search?lat=-6.1944491&lng=106.8229198&country=Indonesia&page=1",
      image: "/assets/Semarang.webp",
      text: "Semarang",
    },
    {
      redirectUrl:
        "/search?lat=3.1319197&lng=101.6840589&country=Malaysia&page=1",
      image: "/assets/Surabaya.webp",
      text: "Surabaya",
    },
    {
      redirectUrl:
        "/search?lat=-6.917245132212107&lng=107.61494597543596&country=Indonesia&page=1",
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
