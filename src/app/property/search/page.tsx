import LandingPageLayout from "@/components/LandingPageLayout";
import SearchPropertiesPage from "@/components/search";
import { divIcon } from "leaflet";
import React from "react";

const SearchProperty = () => {
  return (
    <div>
      <LandingPageLayout>
        <SearchPropertiesPage />;
      </LandingPageLayout>
    </div>
  );
};

export default SearchProperty;
