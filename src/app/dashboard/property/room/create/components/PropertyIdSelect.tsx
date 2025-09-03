import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetPropertiesTenant } from "@/hooks/api/property/useGetPropertiesTenant";
import { FC } from "react";
import { Property } from "@/types/property"; // <-- gunakan type Property yang sesuai hook

interface FormSelectProps {
  setFieldValue: any;
}

export const PropertyIdSelect: FC<FormSelectProps> = ({ setFieldValue }) => {
  const { data, isPending } = useGetPropertiesTenant({ take: 100 });

  return (
    <Select
      onValueChange={(value) => setFieldValue("propertyId", Number(value))}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select Property" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Your Property List</SelectLabel>
          {data?.data.map((property: Property) => (
            <SelectItem key={property.id} value={String(property.id)}>
              {property.title}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
