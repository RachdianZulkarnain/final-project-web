"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getRoomNonAvailabilities,
  GetRoomNonAvailabilitiesListQueries,
} from "../_api/getRoomNonAvailability";

const useRoomNonAvailabilities = (
  queries: GetRoomNonAvailabilitiesListQueries
) => {
  return useQuery({
    queryKey: ["roomNonAvailabilities", queries],
    queryFn: () => getRoomNonAvailabilities(queries),
  });
};

export default useRoomNonAvailabilities;
