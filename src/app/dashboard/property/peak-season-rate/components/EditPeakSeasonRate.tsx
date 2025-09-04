"use client";

import FormInput from "@/components/FormInput";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useFormik, FormikHelpers } from "formik";
import { useSession } from "next-auth/react";
import { FC, useState } from "react";
import { PeakSeasonRateSchema } from "../schemas/PeakSeasonRateSchema";
import { useUpdatePeakSeasonRate } from "@/hooks/api/peak-season-rate/useUpdatePeakSeasonRate";

interface EditPeakSeasonButtonProps {
  id: number;
}

interface FormValues {
  id: number;
  price: number;
}

export const EditPeakSeasonButton: FC<EditPeakSeasonButtonProps> = ({ id }) => {
  const session = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const { mutateAsync: updateCategory, isPending: pendingUpdate } =
    useUpdatePeakSeasonRate();

  const formik = useFormik<FormValues>({
    initialValues: {
      id,
      price: 0,
    },
    validationSchema: PeakSeasonRateSchema,
    onSubmit: async (
      values: FormValues,
      helpers: FormikHelpers<FormValues>
    ) => {
      const dataToSubmit = {
        ...values,
        price: Number(values.price), // pastikan number
      };
      await updateCategory(dataToSubmit);
      setIsOpen(false);
      helpers.resetForm({ values }); // reset form jika perlu
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => setIsOpen(true)}>
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={formik.handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Peak Season Rate</DialogTitle>
            <DialogDescription>
              Make changes to your Peak Season Rate here. Click save when you're
              done.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <FormInput
              name="price"
              label="Price"
              type="number"
              placeholder="Price for Peak Season"
              value={formik.values.price} // sekarang pasti number
              isError={!!formik.touched.price && !!formik.errors.price}
              error={formik.errors.price}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
            />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={pendingUpdate}>
              {pendingUpdate ? "Updating..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
