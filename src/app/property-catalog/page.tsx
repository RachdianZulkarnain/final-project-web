import LandingPageLayout from "@/components/LandingPageLayout";
import PropertyCatalogPage from "@/components/property-catalog/page";
import React from "react";

const PropertyCatalog = () => {
  return (
    <div>
      <LandingPageLayout>
        <PropertyCatalogPage />
      </LandingPageLayout>
    </div>
  );
};

export default PropertyCatalog;
