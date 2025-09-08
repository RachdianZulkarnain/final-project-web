import LandingPage from "@/components/landing-page/LandingPage";
import LandingPageLayout from "@/components/LandingPageLayout";

export default function Home() {
  return (
    <main>
      <LandingPageLayout>
        <LandingPage />
      </LandingPageLayout>
    </main>
  );
}
