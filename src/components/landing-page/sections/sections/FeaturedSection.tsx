import { ArrowRight } from "lucide-react";
import PropertyList from "@/components/property/index";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const FeaturedRooms = () => {
  return (
    <div className="my-16 flex flex-col gap-6">
      <div>
        <PropertyList />
      </div>
    </div>
  );
};
