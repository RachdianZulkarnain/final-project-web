import LandingPageLayout from "@/components/LandingPageLayout";
import PropertyDetailPage from "@/components/property/PropertyDetailPage";

export default function Page(props: any) {
  const slug = props.params.slug; 

  return (
    <div>
      <LandingPageLayout>
        <PropertyDetailPage propertySlug={slug} />
      </LandingPageLayout>
    </div>
  );
}
