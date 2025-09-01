import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { SectionCards } from "@/components/section-cards";

export default function Page() {
  return (
    <div className="flex w-full flex-1 flex-col">
      <div className="flex w-full flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <SectionCards />
          <div className="mx-4">
            <ChartAreaInteractive />
          </div>
        </div>
      </div>
    </div>
  );
}
