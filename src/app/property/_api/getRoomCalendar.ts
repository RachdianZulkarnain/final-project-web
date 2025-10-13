import { axiosInstance } from "@/lib/axios";
import { format } from "date-fns";

export interface CalendarEntry {
  date: string;
  price: number;
  isPeakSeason: boolean;
  isAvailable: boolean;
  availableStock: number;
  totalStock: number;
}

export interface RoomCalendarData {
  success: boolean;
  data: {
    roomId: number;
    basePrice: number;
    calendar: {
      [key: string]: CalendarEntry;
    };
  };
}

export const getRoomCalendar = async (
  roomId: number,
  date: Date = new Date()
): Promise<RoomCalendarData> => {
  const formattedDate = format(date, "yyyy-MM-dd");
  const { data } = await axiosInstance.get<RoomCalendarData>(
    `/calendar/room/${roomId}?date=${formattedDate}`
  );
  return data;
};
