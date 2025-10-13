import { useQuery } from "@tanstack/react-query";
import { getProperties, GetPropertiesQuery } from "../_api/getProperties";

const useGetProperties = (queries: GetPropertiesQuery) => {
  return useQuery({
    queryKey: ["properties", queries],
    queryFn: () => getProperties(queries),
  });
};

export default useGetProperties;
