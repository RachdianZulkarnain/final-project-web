"use client";

import FormInput from "@/components/FormInput";
import FormTextarea from "@/components/FormTextArea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import useDeleteProperty from "@/app/property/_hooks/useDeleteProperty";
import useGetPropertyTenant from "@/app/property/_hooks/useGetPropertyTenant";
import useUpdateProperty from "@/app/property/_hooks/useUpdateProperty";
import axios from "axios";
import { useFormik } from "formik";
import { Save, Trash2 } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { ChangeEvent, FC, useEffect, useRef, useState } from "react";
import { EditPropertyCategorySelect } from "../management/components/EditPropertyCategorySelect";

const DynamicMapComponent = dynamic(() => import("@/components/Map"), {
  ssr: false,
});

interface PropertyDetailPageProps {
  propertyId: number;
}

const UpdatePropertyPage: FC<PropertyDetailPageProps> = ({ propertyId }) => {
  const { mutateAsync: updateProperty, isPending } =
    useUpdateProperty(propertyId);
  const { mutateAsync: deleteProperty, isPending: deletePending } =
    useDeleteProperty();
  const { data, isPending: dataIsPending } = useGetPropertyTenant(propertyId);

  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const imageRef = useRef<HTMLInputElement>(null);
  const [selectedPosition, setSelectedPosition] = useState<[string, string]>([
    "0",
    "0",
  ]);

  const formik = useFormik({
    initialValues: {
      title: data?.title || "",
      slug: data?.slug || "",
      description: data?.description || "",
      latitude: data?.latitude || "",
      longitude: data?.longitude || "",
      location: data?.location || "",
      imageUrl: [],
      propertyCategoryId: data?.propertyCategory?.id || null,
    },
    onSubmit: async (values) => {
      await updateProperty({
        ...values,
        propertyCategoryId: Number(values.propertyCategoryId),
      });
    },
    enableReinitialize: true,
  });

  useEffect(() => {
    if (data) setSelectedPosition([data.latitude, data.longitude]);
  }, [data]);

  const fetchAddress = async (lat: string, lng: string) => {
    try {
      const { data } = await axios.get(
        `https://api.opencagedata.com/geocode/v1/json?q=${lat},${lng}&key=${process.env.NEXT_PUBLIC_OPENCAGE_API_KEY!}&language=id&pretty=1`
      );
      const results = data.results[0]?.components || {};
      const location = [
        results.suburb,
        results.city_district,
        results.city,
        results.state,
      ]
        .filter(Boolean)
        .join(", ");
      formik.setValues((prev) => ({ ...prev, location }));
    } catch (err) {
      console.error("Error fetching address:", err);
    }
  };

  const handlePositionChange = (lat: string, lng: string) => {
    setSelectedPosition([lat, lng]);
    formik.setValues((prev) => ({ ...prev, latitude: lat, longitude: lng }));
    fetchAddress(lat, lng);
  };

  const onChangeImage = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length) {
      const fileArray = Array.from(files);
      formik.setFieldValue("imageUrl", fileArray);
      setSelectedImages(fileArray.map((file) => URL.createObjectURL(file)));
    }
  };

  const removeSelectedImage = (index: number) => {
    const newImages = [...selectedImages];
    newImages.splice(index, 1);
    setSelectedImages(newImages);

    const newFiles = [...formik.values.imageUrl];
    newFiles.splice(index, 1);
    formik.setFieldValue("imageUrl", newFiles);
  };

  const removeAllImages = () => {
    formik.setFieldValue("imageUrl", []);
    setSelectedImages([]);
    if (imageRef.current) imageRef.current.value = "";
  };

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    const slug = title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9 ]/g, "")
      .replace(/\s+/g, "-");
    formik.setFieldValue("title", title);
    formik.setFieldValue("slug", slug);
  };

  if (dataIsPending) {
    return (
      <div className="container mx-auto max-w-7xl space-y-6 p-6 ">
        <Skeleton className="h-[300px] w-full overflow-hidden rounded-2xl bg-slate-200" />
        <Skeleton className="h-[300px] w-full overflow-hidden rounded-2xl bg-slate-200" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="container mx-auto max-w-7xl space-y-6 p-6">
        Error: Property data not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="container mx-auto max-w-7xl px-6 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#0290d1]">
              Update Property
            </h1>
            <p className="text-sm text-gray-600">
              Manage property details, images, location, and category
            </p>
          </div>
          <Button
            type="button"
            variant="destructive"
            onClick={async () => await deleteProperty(propertyId)}
            disabled={deletePending}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            {deletePending ? "Deleting..." : ""}
          </Button>
        </div>
      </div>

      <section className="container mx-auto max-w-7xl p-6">
        <form
          onSubmit={formik.handleSubmit}
          className="space-y-5 bg-white shadow-sm rounded-xl p-6"
        >
          <div className="space-y-5">
            {selectedImages.length > 0 ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {selectedImages.map((image, index) => (
                    <div
                      key={index}
                      className="relative h-[200px] overflow-hidden rounded-lg"
                    >
                      <Image
                        src={image}
                        alt={`Property Image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                      <Button
                        onClick={() => removeSelectedImage(index)}
                        variant="destructive"
                        className="absolute right-2 top-2 h-8 w-8 p-0"
                      >
                        ✕
                      </Button>
                    </div>
                  ))}
                </div>
                <Button onClick={removeAllImages} variant="destructive">
                  Remove All Images
                </Button>
              </div>
            ) : data.propertyImage && data.propertyImage.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {data.propertyImage.map((image, index) => (
                  <div
                    key={index}
                    className="relative h-[200px] overflow-hidden rounded-lg"
                  >
                    <Image
                      src={image.imageUrl || "/placeholder-image.jpg"}
                      alt={`Property Image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            ) : null}

            <div className="mx-auto max-w-xs">
              <Label>Property Images</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={onChangeImage}
                ref={imageRef}
                multiple
              />
            </div>
          </div>

          <FormInput
            name="title"
            label="Property Name"
            type="text"
            placeholder="Property Name"
            value={formik.values.title}
            isError={!!formik.touched.title && !!formik.errors.title}
            error={formik.errors.title}
            onBlur={formik.handleBlur}
            onChange={handleTitleChange}
          />

          <EditPropertyCategorySelect
            setFieldValue={formik.setFieldValue}
            initialValue={data.propertyCategory?.id}
          />

          <FormTextarea
            name="description"
            label="Description"
            placeholder="Description"
            value={formik.values.description}
            isError={
              !!formik.touched.description && !!formik.errors.description
            }
            error={formik.errors.description}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
          />

          <div className="overflow-hidden rounded-md border-[1px]">
            <div className="h-[500px] w-full rounded-md">
              <DynamicMapComponent
                selectedPosition={selectedPosition}
                onPositionChange={handlePositionChange}
              />
            </div>
          </div>

          <div className="grid w-full grid-cols-3 items-end gap-7">
            <FormInput
              name="latitude"
              label="Latitude"
              type="text"
              value={formik.values.latitude}
              isError={!!formik.touched.latitude && !!formik.errors.latitude}
              error={formik.errors.latitude}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              readOnly
            />
            <FormInput
              name="longitude"
              label="Longitude"
              type="text"
              value={formik.values.longitude}
              isError={!!formik.touched.longitude && !!formik.errors.longitude}
              error={formik.errors.longitude}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              readOnly
            />
            <FormInput
              name="location"
              label="Location"
              type="text"
              value={formik.values.location}
              isError={!!formik.touched.location && !!formik.errors.location}
              error={formik.errors.location}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              readOnly
            />
          </div>

          <div className="flex justify-end gap-4">
            <Button type="submit" disabled={isPending}>
              <Save />
              {isPending ? "Updating..." : ""}
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default UpdatePropertyPage;
