import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
export default function NotFound() {
  return (
    <div className="flex h-screen">
      <div className="m-auto flex flex-col gap-2 items-center">
        <div className="font-bold text-[100px] text-[#0290d1]">404</div>
        <Separator className="bg-stone-400 -mt-2" />
        <div className="font-medium text-lg text-[#0290d1]">Page not found</div>
        <Link href={"/"}>
          <Button className="rounded-full my-3 w-64 bg-[#0290d1] hover:bg-[#12394b]">
            <ArrowLeft className="h-5 w-5" />
            Back to home
          </Button>
        </Link>
      </div>
    </div>
  );
}
