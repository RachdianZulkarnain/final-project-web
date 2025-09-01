"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import * as z from "zod";
import { useState, useEffect } from "react";
// import { useToast } from '@/components/ui/use-toast'; // hapus
import { toast } from "sonner"; // <-- pakai Sonner
import { listingUploadImagesFormSchema } from "@/components/listings/schemas/ListingFormSchema";
import { useNewListing } from "@/components/listings/hooks/useNewListing";

export const ListingUploadImages = ({ onBack, onNext }: any) => {
  const [images, setImages] = useState<any[]>([]);
  const { mutationNewListing } = useNewListing();
  const getCategory = localStorage.getItem("selectedCategory");
  const getGeneralData = localStorage.getItem("listingGeneralDetails");
  const getRoomTypeData = localStorage.getItem("RoomTypeData");

  let general: any;
  if (getGeneralData) {
    general = JSON.parse(getGeneralData);
  }

  const getFacilitiesData = localStorage.getItem("listingFacilitiesDetails");
  let facilities: any;
  if (getFacilitiesData) {
    facilities = JSON.parse(getFacilitiesData);
  }

  let roomType: any;
  if (getRoomTypeData && getRoomTypeData.length >= 1) {
    roomType = JSON.parse(getRoomTypeData);
  }

  const form = useForm<z.infer<typeof listingUploadImagesFormSchema>>({
    resolver: zodResolver(listingUploadImagesFormSchema),
    defaultValues: { listingImages: "" },
  });

  const { reset } = form;

  const onSetFiles = (event: any) => {
    try {
      const acceptedFormat = ["jpg", "jpeg", "webp", "png"];
      const files: any = [...event.target.files];

      files.forEach((file: any) => {
        if (
          !acceptedFormat.includes(
            file.name.split(".")[file.name.split(".").length - 1]
          )
        ) {
          throw { message: `${file.name} Format Not Acceptable` };
        }
        if (file.size > 1000000) {
          throw {
            message: `${file.name} is too Large! Maximum Filesize is 1Mb`,
          };
        }
      });

      if (files.length > 5) throw { message: "Selected Files more than 5" };

      setImages(files);
    } catch (error: any) {
      toast.error(error.message); // <-- pakai Sonner
      reset();
    }
  };

  const handleBack = () => {
    onBack();
  };

  const onSubmit = async (
    values: z.infer<typeof listingUploadImagesFormSchema>
  ) => {
    const fd = new FormData();
    const allFacilities: number[] = [];

    if (roomType && roomType.length > 0) {
      roomType.forEach((room: any) => {
        if (room.facilities && room.facilities.length > 0) {
          allFacilities.push(...room.facilities);
        }
      });
    }

    const hotelFacilities = Array.from(new Set(allFacilities));

    fd.append(
      "listingData",
      JSON.stringify({
        title: general?.title || "",
        description: general?.description || "",
        country: general?.country || "",
        categoriesId: Number(getCategory) || 0,
        address: general?.addressDetails || "",
        contact_person: general?.phone || "",
        location_coordinate: general?.coordinate || "",
        city: general?.city || "",
        listing_facilities: facilities
          ? facilities.facilities
          : hotelFacilities,
      })
    );

    if (images) {
      images.forEach((file) => fd.append("listingImages", file));
    }

    if (roomType?.length >= 1) {
      fd.append(
        "roomTypeData",
        JSON.stringify(
          roomType.map((rt: any) => ({
            name: rt.name,
            stock: rt.stock,
            capacity: rt.capacity,
            bed_details: rt.bed_details,
            price: rt.price,
            has_breakfast_option: rt.has_breakfast_option,
            breakfast_price: rt.breakfast_price,
            restrictions: rt.restrictions,
            room_facilities: rt.facilities,
          }))
        )
      );
    }

    const roomImages = localStorage.getItem("RoomtypeImages");
    if (roomImages) {
      const urls = JSON.parse(roomImages);
      if (urls.length > 0) {
        urls.forEach((url: string) => {
          const [meta, base64Data] = url.split(",");
          const fileFormat = meta.split(";")[0].split(":")[1];
          const binaryString = atob(base64Data);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          const file = new File([bytes], "file_name_here.jpeg", {
            type: fileFormat,
          });
          fd.append("roomtypeImages", file);
        });
      }
    }

    if (!roomType) {
      fd.append(
        "roomTypeData",
        JSON.stringify([
          {
            name: facilities?.name || "",
            stock: facilities?.stock || 0,
            capacity: Number(facilities?.capacity) || 0,
            bed_details: facilities?.bedding_details || "",
            price: Number(facilities?.price_per_night) || 0,
          },
        ])
      );
    }

    mutationNewListing(fd, {
      onSuccess: () => {
        localStorage.clear();
        toast.success("Listing uploaded successfully!"); // <-- Sonner sukses
        onNext();
      },
      onError: (err: any) => {
        toast.error(err?.message || "Failed to upload listing"); // <-- Sonner error
      },
    });
  };

  return (
    <div className="flex flex-col gap-4 w-full h-full items-center justify-center">
      <div className="flex items-center justify-center font-semibold text-xl">
        Listing images
      </div>
      <div className="w-3/5 h-full mt-5 flex items-center justify-center">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full flex flex-col gap-3"
          >
            <FormField
              control={form.control}
              name="listingImages"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Property&apos;s building images</FormLabel>
                  <FormControl className="h-44 flex items-center justify-center">
                    <Input
                      multiple
                      type="file"
                      accept="image/*"
                      {...field}
                      onChange={(event) => {
                        onSetFiles(event);
                        field.onChange(event);
                      }}
                      className="rounded-2xl h-1/2 flex items-center justify-center"
                    />
                  </FormControl>
                  <FormDescription>
                    *Maximum 5 images, maximum size 1MB each
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="text-sm text-zinc-500 italic">
              You can share the building&apos;s front view, main areas,
              bathrooms, and any other spaces of the property here.
            </div>
            <div className="mt-4 flex justify-between items-end">
              <Button
                variant={"ghost"}
                onClick={handleBack}
                className="text-zinc-500 underline underline-offset-2 w-28 h-8 flex items-center justify-center"
              >
                Back
              </Button>
              <Button className="w-28 h-8" type="submit">
                Finish
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};
