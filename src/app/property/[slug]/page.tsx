import LandingPageLayout from "@/components/LandingPageLayout";
import PropertyDetailPage from "@/components/property/PropertyDetailPage";

export default function Page({ params }: { params: { slug: string } }) {
  return (
    <div>
      <LandingPageLayout>
        <PropertyDetailPage propertySlug={params.slug} />
      </LandingPageLayout>
    </div>
  );
}
