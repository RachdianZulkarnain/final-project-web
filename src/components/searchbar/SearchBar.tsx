"use client";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Search, User, Baby, Dog } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@radix-ui/react-popover";
import { DatePickerWithRange } from "../DateRangePicker";
import { CounterComponent } from "../cards/CounterComponent";

export default function SearchBarFormikShadcn() {
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      title: "",
      guests: { adults: 0, children: 0 },
      duration: { from: new Date(), to: new Date() },
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Destination is required"),
    }),
    onSubmit: async (values) => {
      const totalGuests = values.guests.adults + values.guests.children;

      const query = new URLSearchParams({
        title: values.title,
        guest: String(totalGuests), // ✅ samakan dengan SearchPropertiesPage
        startDate: values.duration.from?.toISOString() ?? "",
        endDate: values.duration.to?.toISOString() ?? "",
      }).toString();

      router.push(`/property/search?${query}`);
    },
  });

  const guests = formik.values.guests;

  return (
    <div className="mx-auto mt-5 max-w-5xl px-4">
      <form
        onSubmit={formik.handleSubmit}
        className="flex items-center justify-between rounded-full bg-white shadow-lg overflow-hidden"
      >
        {/* Location */}
        <div className="flex flex-col flex-1 px-6 py-3 border-r">
          <Input
            name="title"
            type="text"
            placeholder="Search Properties Name"
            value={formik.values.title}
            onChange={formik.handleChange}
            className="h-6 w-max border-0 p-0 text-base font-normal placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>

        {/* Duration */}
        <div className="flex flex-col flex-1 px-6 py-3 border-r">
          <DatePickerWithRange setFieldValue={formik.setFieldValue} />
        </div>

        {/* Guests */}
        <div className="flex flex-col flex-1 px-6 py-3">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "justify-start p-0 h-6 text-base font-normal text-gray-500 hover:bg-transparent",
                  guests.adults + guests.children > 0 && "text-black"
                )}
              >
                {guests.adults + guests.children === 0
                  ? "Who's coming?"
                  : `Adults (${guests.adults}), Children (${guests.children}))`}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-60 grid gap-2 bg-white p-4 rounded-lg shadow-lg">
              <CounterComponent
                icon={<User className="h-4 w-4" />}
                text="Adults"
                count={guests.adults}
                setCount={(val: number) =>
                  formik.setFieldValue("guests.adults", val)
                }
              />
              <CounterComponent
                icon={<Baby className="h-4 w-4" />}
                text="Children"
                count={guests.children}
                setCount={(val: number) =>
                  formik.setFieldValue("guests.children", val)
                }
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Search Button */}
        <Button
          type="submit"
          className="flex items-center justify-center bg-black text-white rounded-full w-14 h-14 mr-2 hover:bg-gray-800"
        >
          <Search className="h-5 w-5" />
        </Button>
      </form>
    </div>
  );
}
