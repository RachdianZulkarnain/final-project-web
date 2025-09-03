"use client";
import Image from "next/image";
import { ExploreCity } from "./sections/sections/ExploreSection";
import { FeaturedRooms } from "./sections/sections/FeaturedSection";
import { BestDeals } from "./sections/sections/PromoSection";
import Loading from "@/app/loading";
import SearchBar from "../searchbar/SearchBar";
import { useGetHeroImage } from "./unsplash/hooks/useGetHeroImage";
import { useGetListings } from "../listings/hooks/useGetListings";

export default function LandingPage() {
  const { heroImage } = useGetHeroImage();
  const { listings } = useGetListings();

  if (!heroImage && !listings) return <Loading />;
  return (
    <div>
      <div className="w-full overflow-hidden">
        <div className="absolute z-[15] flex flex-col gap-12 items-center justify-center inset-0 h-[85vh] md:h-[70vh]">
          <div className="drop-shadow-[0_5px_15px_rgba(0,0,0,0.4)] font-bold  text-3xl md:text-5xl w-[50%] lg:w-full text-center text-white">
            Find a Home in Every Journey
          </div>
          <SearchBar></SearchBar>
        </div>
        <Image
          src={heroImage}
          width={100}
          height={100}
          alt="Hero Image"
          unoptimized
          priority
          className="w-screen transition bg-black h-[85vh] md:h-[70vh] z-0 object-cover brightness-90 lg:object-center"
        />
      </div>
      <div
        id="bigCard"
        className="relative w-full mt-[-35px] bg-white py-16 z-10 rounded-[30px]"
      >
        <div className="w-[80vw] mx-auto ">
          <ExploreCity></ExploreCity>
          <FeaturedRooms listings={listings}></FeaturedRooms>
          
          <BestDeals></BestDeals>
        </div>
      </div>
    </div>
  );
}
