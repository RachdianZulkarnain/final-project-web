"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useRoomCalendar from "@/hooks/api/calendar/useRoomCalendar";
import { cn } from "@/lib/utils";
import {
  formatLocalDate,
  standardizeToCheckInTime,
  standardizeToCheckOutTime,
} from "@/utils/date";
import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import {
  AlertTriangle,
  CalendarIcon,
  CheckCircle2,
  Clock,
  CreditCard,
  Info,
  Loader2,
  Users,
} from "lucide-react";
import * as React from "react";
import type { DayButtonProps } from "react-day-picker";

const GOOD_PRICE_THRESHOLD_RATIO = 0.9;

const formatCompactPrice = (price: number) => {
  if (price >= 1_000_000) {
    return `${Math.round(price / 1_000_000)}M`;
  } else if (price >= 1_000) {
    return `${Math.round(price / 1_000)}k`;
  }
  return `${price}`;
};

type DateRange = {
  from: Date | undefined;
  to?: Date | undefined;
};

interface Room {
  id: number;
  type: string;
  price: number;
  guest: number;
}

interface RoomPriceCalendarProps {
  rooms: Room[];
  onRoomSelect: (roomId: string) => void;
  selectedRoomId: string;
  onDateChange: (dateRange: DateRange) => void;
  dateRange: DateRange;
  onTotalPriceChange?: (totalPrice: number | null) => void;
}

const today = new Date();
today.setHours(0, 0, 0, 0);

const TIMEZONE = "Asia/Jakarta";

const calculateNights = (checkIn: Date, checkOut: Date) => {
  const from = new Date(checkIn);
  const to = new Date(checkOut);

  from.setHours(0, 0, 0, 0);
  to.setHours(0, 0, 0, 0);

  const diffTime = to.getTime() - from.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
};

const DayButton = (
  props: DayButtonProps & {
    calendarData?: any;
    basePrice?: number;
    isPeakSeason?: Record<string, boolean>;
  }
) => {
  const {
    day,
    modifiers,
    calendarData,
    basePrice,
    isPeakSeason,
    ...buttonProps
  } = props;

  if (!calendarData || !basePrice) {
    return <button {...buttonProps}>{props.children}</button>;
  }

  const dateKey = format(day.date, "yyyy-MM-dd");
  const dayData = calendarData[dateKey];

  if (!dayData) {
    return <button {...buttonProps}>{props.children}</button>;
  }

  const price = dayData.price;
  const isGoodPrice = price < basePrice * GOOD_PRICE_THRESHOLD_RATIO;
  const isPeak = isPeakSeason?.[dateKey] || false;
  const isSoldOut = !dayData.isAvailable;

  return (
    <button
      {...buttonProps}
      className={cn(
        buttonProps.className,
        "group relative overflow-hidden p-0 transition-all duration-300",
        isPeak &&
          "ring-2 ring-amber-300 ring-opacity-60 bg-gradient-to-br from-amber-50 to-orange-50",
        isSoldOut &&
          "cursor-not-allowed bg-gradient-to-br from-red-50 to-rose-100 opacity-80",
        !isSoldOut && "hover:scale-105 hover:shadow-md hover:z-10",
        isGoodPrice &&
          !isSoldOut &&
          "ring-2 ring-emerald-300 ring-opacity-40 bg-gradient-to-br from-emerald-50 to-green-50"
      )}
      disabled={isSoldOut}
    >
      <div className="flex h-full w-full flex-col items-center justify-center p-1">
        <span
          className={cn(
            "font-semibold text-sm transition-colors",
            isSoldOut && "text-red-600 line-through",
            isPeak && !isSoldOut && "text-amber-700",
            isGoodPrice && !isSoldOut && "text-emerald-700"
          )}
        >
          {props.children}
        </span>

        {price && (
          <span
            className={cn(
              "text-[9px] font-bold mt-0.5 px-1 py-0.5 rounded-sm",
              isGoodPrice && !isSoldOut
                ? "text-emerald-700 bg-emerald-100"
                : price > basePrice * 1.1 && !isSoldOut
                  ? "text-red-700 bg-red-100"
                  : "text-slate-700 bg-slate-100",
              isSoldOut && "text-red-600 bg-red-200"
            )}
          >
            {formatCompactPrice(price)}
          </span>
        )}

        <div className="mt-1 flex items-center justify-center">
          {dayData.isAvailable ? (
            <span className="flex items-center gap-1 rounded-full bg-white/80 px-1.5 py-0.5 text-[7px] font-medium shadow-sm">
              <CheckCircle2 className="h-2 w-2 text-emerald-500" />
              <span className="text-slate-600">{dayData.availableStock}</span>
            </span>
          ) : (
            <span className="flex items-center gap-1 rounded-full bg-red-100 px-1.5 py-0.5 text-[7px] font-bold">
              <AlertTriangle className="h-2 w-2 text-red-500" />
              <span className="text-red-700">Full</span>
            </span>
          )}
        </div>

        {isPeak && !isSoldOut && (
          <div className="absolute top-0 right-0 h-2 w-2 rounded-full bg-amber-400 shadow-sm"></div>
        )}

        {isGoodPrice && !isSoldOut && (
          <div className="absolute top-0 left-0 h-2 w-2 rounded-full bg-emerald-400 shadow-sm"></div>
        )}
      </div>
    </button>
  );
};

export function RoomPriceCalendar({
  rooms,
  onRoomSelect,
  selectedRoomId,
  onDateChange,
  dateRange,
  onTotalPriceChange,
}: RoomPriceCalendarProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [currentMonth, setCurrentMonth] = React.useState<Date>(new Date());
  const [totalPrice, setTotalPrice] = React.useState<number | null>(null);
  const [nightlyPrices, setNightlyPrices] = React.useState<{
    [key: string]: number;
  }>({});
  const [hasUnavailableDates, setHasUnavailableDates] = React.useState(false);

  const { data: calendarData, isLoading } = useRoomCalendar(
    selectedRoomId ? Number.parseInt(selectedRoomId) : 0,
    currentMonth,
    { enabled: !!selectedRoomId }
  );

  React.useEffect(() => {
    if (
      dateRange.from &&
      dateRange.to &&
      calendarData?.data?.calendar &&
      selectedRoomId
    ) {
      let total = 0;
      const prices: { [key: string]: number } = {};
      let unavailableDatesDetected = false;

      const startDate = new Date(dateRange.from);
      const endDate = new Date(dateRange.to);
      const days = calculateNights(startDate, endDate);

      for (let i = 0; i < days; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + i);
        const dateKey = format(currentDate, "yyyy-MM-dd");

        if (calendarData.data.calendar[dateKey]) {
          const dayData = calendarData.data.calendar[dateKey];
          if (!dayData.isAvailable) {
            unavailableDatesDetected = true;
            break;
          }

          const dayPrice = dayData.price;
          total += dayPrice;
          prices[dateKey] = dayPrice;
        } else {
          total += calendarData.data.basePrice;
          prices[dateKey] = calendarData.data.basePrice;
        }
      }

      setHasUnavailableDates(unavailableDatesDetected);

      if (unavailableDatesDetected) {
        setTotalPrice(null);
        setNightlyPrices({});

        if (onTotalPriceChange) {
          onTotalPriceChange(null);
        }
      } else {
        setTotalPrice(total);
        setNightlyPrices(prices);

        if (onTotalPriceChange) {
          onTotalPriceChange(total);
        }
      }
    } else {
      setHasUnavailableDates(false);
      setTotalPrice(null);
      setNightlyPrices({});

      if (onTotalPriceChange) {
        onTotalPriceChange(null);
      }
    }
  }, [dateRange, calendarData, selectedRoomId, onTotalPriceChange]);

  const handleDateSelect = (newDateRange: DateRange | undefined) => {
    if (!newDateRange) {
      onDateChange({ from: undefined, to: undefined });
      return;
    }

    let { from, to } = newDateRange;

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    if (from) {
      if (from < currentDate) {
        from = currentDate;
      }
      const zonedFrom = toZonedTime(from, TIMEZONE);
      from = standardizeToCheckInTime(zonedFrom);
    }

    if (to) {
      if (to < currentDate) {
        to = currentDate;
      }
      const zonedTo = toZonedTime(to, TIMEZONE);
      to = standardizeToCheckOutTime(zonedTo);
    }

    if (from && to) {
      if (from > to) {
        onDateChange({ from, to: undefined });
        return;
      }

      if (calendarData?.data?.calendar) {
        const startDate = new Date(from);
        const endDate = new Date(to);

        const currentDateCheck = new Date(startDate);
        while (currentDateCheck < endDate) {
          const dateKey = format(currentDateCheck, "yyyy-MM-dd");
          const dayData = calendarData.data.calendar[dateKey];

          if (dayData && !dayData.isAvailable) {
            const prevDate = new Date(currentDateCheck);
            prevDate.setDate(prevDate.getDate() - 1);
            if (prevDate >= from) {
              onDateChange({ from, to: prevDate });
            } else {
              onDateChange({ from, to: undefined });
            }
            alert(
              `Sorry, the date ${format(currentDateCheck, "MM/dd/yyyy")} is not available for booking.`
            );
            return;
          }
          currentDateCheck.setDate(currentDateCheck.getDate() + 1);
        }
      }
    }

    onDateChange({ from, to });
  };

  const buttonClasses = (date: Date | undefined) =>
    cn("w-full justify-start text-left font-normal", !date && "text-slate-400");

  const isPeakSeason: Record<string, boolean> = {};

  if (calendarData?.data?.calendar) {
    Object.entries(calendarData.data.calendar).forEach(([dateKey, data]) => {
      isPeakSeason[dateKey] = (data as any).isPeakSeason || false;
    });
  }

  const isDateDisabled = (date: Date) => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    if (date < currentDate) {
      return true;
    }

    if (!calendarData?.data?.calendar) return false;

    const dateKey = format(date, "yyyy-MM-dd");
    const dayData = calendarData.data.calendar[dateKey];

    return dayData ? !dayData.isAvailable : false;
  };

  const selectedRoom = rooms.find(
    (room) => room.id.toString() === selectedRoomId
  );

  const formatIDR = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
      .format(amount)
      .replace("Rp", "Rp ");
  };

  const nights =
    dateRange.from && dateRange.to
      ? calculateNights(dateRange.from, dateRange.to)
      : 0;

  const checkUnavailableDatesInRange = () => {
    if (!dateRange.from || !dateRange.to || !calendarData?.data?.calendar) {
      return false;
    }

    const startDate = new Date(dateRange.from);
    const endDate = new Date(dateRange.to);
    const currentDateCheck = new Date(startDate);
    while (currentDateCheck < endDate) {
      const dateKey = format(currentDateCheck, "yyyy-MM-dd");
      const dayData = calendarData.data.calendar[dateKey];

      if (dayData && !dayData.isAvailable) {
        return true;
      }

      currentDateCheck.setDate(currentDateCheck.getDate() + 1);
    }

    return false;
  };

  return (
    <div className="mx-auto max-w-lg space-y-6 rounded-2xl bg-white p-6 shadow-xl ring-1 ring-slate-200/60 backdrop-blur-sm">
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-800">
          <Users className="h-4 w-4 text-blue-600" />
          Select Room Type
        </label>
        <Select onValueChange={onRoomSelect} value={selectedRoomId}>
          <SelectTrigger className="group border-slate-300 bg-white shadow-sm transition-all duration-200 hover:border-blue-400 hover:shadow-md focus:ring-2 focus:ring-blue-500/20">
            <SelectValue placeholder="Choose your perfect room..." />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-slate-200 shadow-xl">
            {rooms.map((room) => (
              <SelectItem
                key={room.id}
                value={room.id.toString()}
                className="cursor-pointer transition-colors hover:bg-blue-50"
              >
                <div className="flex items-center justify-between gap-6 py-1">
                  <div className="flex flex-col">
                    <span className="font-medium text-slate-800">
                      {room.type}
                    </span>
                    <span className="text-xs text-slate-500">
                      Up to {room.guest} {room.guest === 1 ? "guest" : "guests"}
                    </span>
                  </div>
                  <span className="font-semibold text-blue-600">
                    {formatIDR(room.price)}
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Date Selection */}
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-800">
          <CalendarIcon className="h-4 w-4 text-blue-600" />
          Select Your Dates
        </label>

        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div
                className="group cursor-pointer rounded-xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50/50 p-4 transition-all duration-200 hover:border-blue-300 hover:shadow-md hover:shadow-blue-100/50"
                onClick={() => setIsOpen(true)}
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3 text-blue-500" />
                      <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                        Check-in
                      </span>
                    </div>
                    <div className="text-sm font-medium text-slate-900">
                      {dateRange.from
                        ? formatLocalDate(dateRange.from)
                        : "Select date"}
                    </div>
                    <div className="text-xs text-slate-500">After 2:00 PM</div>
                  </div>
                  <CalendarIcon className="h-5 w-5 text-blue-400 transition-transform group-hover:scale-110" />
                </div>
              </div>

              {/* Check-out */}
              <div
                className="group cursor-pointer rounded-xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50/50 p-4 transition-all duration-200 hover:border-blue-300 hover:shadow-md hover:shadow-blue-100/50"
                onClick={() => setIsOpen(true)}
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3 text-blue-500" />
                      <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                        Check-out
                      </span>
                    </div>
                    <div className="text-sm font-medium text-slate-900">
                      {dateRange.to
                        ? formatLocalDate(dateRange.to)
                        : "Select date"}
                    </div>
                    <div className="text-xs text-slate-500">
                      Before 12:00 PM
                    </div>
                  </div>
                  <CalendarIcon className="h-5 w-5 text-blue-400 transition-transform group-hover:scale-110" />
                </div>
              </div>
            </div>
          </PopoverTrigger>

          <PopoverContent
            className="w-auto rounded-2xl border-slate-200 p-0 shadow-2xl"
            align="start"
          >
            <div className="flex flex-col overflow-hidden">
              {selectedRoomId && (
                <div className="border-b bg-gradient-to-r from-blue-50 via-white to-slate-50 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Info className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-slate-800">
                      Price & Availability Legend
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-gradient-to-br from-red-100 to-rose-200 border border-red-200"></div>
                      <span className="text-slate-700">Sold Out</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-gradient-to-br from-amber-50 to-orange-100 border border-amber-300"></div>
                      <span className="text-slate-700">Peak Season</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-gradient-to-br from-emerald-50 to-green-100 border border-emerald-300"></div>
                      <span className="text-slate-700">Best Deal</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                      <span className="text-slate-700">Available</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Calendar */}
              <div className="p-4">
                <Calendar
                  mode="range"
                  defaultMonth={dateRange.from || new Date()}
                  selected={dateRange}
                  onSelect={handleDateSelect}
                  numberOfMonths={1}
                  showOutsideDays={false}
                  initialFocus
                  disabled={isDateDisabled}
                  onMonthChange={setCurrentMonth}
                  components={{
                    DayButton: (props: DayButtonProps) => (
                      <DayButton
                        {...props}
                        calendarData={calendarData?.data?.calendar}
                        basePrice={calendarData?.data?.basePrice}
                        isPeakSeason={isPeakSeason}
                      />
                    ),
                  }}
                  classNames={{
                    months: "flex flex-col space-y-4",
                    month: "space-y-4",
                    caption:
                      "flex justify-center pt-1 pb-2 relative items-center",
                    caption_label: "text-base font-semibold text-slate-800",
                    nav: "space-x-1 flex items-center",
                    nav_button:
                      "h-8 w-8 bg-white border border-slate-200 p-0 text-slate-600 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-200 rounded-lg transition-all duration-200 shadow-sm hover:shadow",
                    nav_button_previous: "absolute left-1",
                    nav_button_next: "absolute right-1",
                    table: "w-full border-collapse space-y-1",
                    head_row: "flex mb-1",
                    head_cell:
                      "text-slate-600 rounded-md w-12 font-semibold text-xs py-2 uppercase tracking-wide",
                    row: "flex w-full mt-1",
                    cell: "h-16 w-12 text-center text-sm p-0.5 relative [&:has([aria-selected])]:bg-blue-100/50 first:[&:has([aria-selected])]:rounded-l-xl last:[&:has([aria-selected])]:rounded-r-xl focus-within:relative focus-within:z-20",
                    day: "h-16 w-12 p-0 font-normal aria-selected:opacity-100 rounded-lg transition-all duration-200",
                    day_selected:
                      "bg-blue-600 text-white hover:bg-blue-700 focus:bg-blue-700 rounded-lg shadow-lg ring-2 ring-blue-200",
                    day_today:
                      "bg-blue-50 text-blue-700 font-semibold ring-2 ring-blue-200 shadow-sm",
                    day_outside: "text-slate-300 opacity-40",
                    day_disabled:
                      "text-slate-300 opacity-40 cursor-not-allowed",
                    day_range_middle:
                      "aria-selected:bg-blue-100 aria-selected:text-blue-800",
                    day_hidden: "invisible",
                    day_button: "h-16 w-12 p-0",
                  }}
                />
              </div>

              {/* Error Message */}
              {selectedRoomId &&
                dateRange.from &&
                dateRange.to &&
                checkUnavailableDatesInRange() && (
                  <div className="mx-4 mb-4 rounded-xl bg-red-50 border border-red-200 p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-red-800 text-sm">
                          Dates Unavailable
                        </h4>
                        <p className="text-red-700 text-xs mt-1">
                          Some dates in your selection are sold out. Please
                          choose different dates.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

              {/* Actions */}
              <div className="flex items-center justify-between gap-3 border-t bg-gradient-to-r from-slate-50 to-blue-50 p-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    onDateChange({ from: undefined, to: undefined });
                  }}
                  className="border-slate-300 text-slate-700 transition-all hover:bg-slate-100 hover:border-slate-400"
                >
                  Clear Dates
                </Button>
                <Button
                  onClick={() => setIsOpen(false)}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg transition-all hover:from-blue-700 hover:to-blue-800 hover:shadow-xl"
                >
                  Confirm Selection
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {isLoading && selectedRoomId && (
        <div className="flex items-center justify-center py-6">
          <div className="flex items-center gap-3 rounded-full bg-blue-50 px-4 py-2 shadow-sm">
            <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
            <span className="text-sm font-medium text-blue-700">
              Loading pricing data...
            </span>
          </div>
        </div>
      )}

      {selectedRoomId &&
        dateRange.from &&
        dateRange.to &&
        hasUnavailableDates && (
          <div className="rounded-xl bg-red-50 border border-red-200 p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-red-800 text-sm">
                  Booking Unavailable
                </h4>
                <p className="text-red-700 text-sm mt-1">
                  The selected date range contains sold-out dates. Please select
                  different dates to continue.
                </p>
              </div>
            </div>
          </div>
        )}

      {selectedRoom &&
        dateRange.from &&
        dateRange.to &&
        totalPrice &&
        !hasUnavailableDates && (
          <div className="space-y-4 rounded-2xl border-2 border-blue-100 bg-gradient-to-br from-blue-50/30 via-white to-slate-50/30 p-5 shadow-lg">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="font-bold text-slate-900 text-lg">
                  {selectedRoom.type}
                </h3>
                <div className="flex items-center gap-4 text-sm text-slate-600">
                  <div className="flex items-center gap-1">
                    <CalendarIcon className="h-4 w-4" />
                    <span>
                      {nights} {nights === 1 ? "night" : "nights"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>
                      {selectedRoom.guest}{" "}
                      {selectedRoom.guest === 1 ? "guest" : "guests"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-700">
                  {formatIDR(totalPrice)}
                </div>
                <div className="text-sm text-slate-500">
                  {formatIDR(Math.round(totalPrice / nights))}/night avg
                </div>
              </div>
            </div>

            <details className="group">
              <summary className="flex cursor-pointer items-center justify-between rounded-lg bg-white/60 p-3 text-sm font-medium text-slate-700 transition-all hover:bg-white/80 hover:text-blue-600">
                <span className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-blue-500" />
                  View detailed breakdown
                </span>
                <span className="text-xs text-slate-400 transition-transform duration-200 group-open:rotate-180">
                  ▼
                </span>
              </summary>
              <div className="mt-3 space-y-2 rounded-lg bg-white/40 p-4">
                {Object.entries(nightlyPrices).map(([date, price]) => (
                  <div
                    key={date}
                    className="flex items-center justify-between py-1"
                  >
                    <span className="text-slate-600 text-sm">
                      {format(new Date(date), "EEE, MMM d")}
                    </span>
                    <span className="font-semibold text-slate-800">
                      {formatIDR(price)}
                    </span>
                  </div>
                ))}
                <div className="mt-3 flex items-center justify-between border-t border-slate-200 pt-3">
                  <span className="font-semibold text-slate-900">
                    Total for {nights} {nights === 1 ? "night" : "nights"}
                  </span>
                  <span className="text-xl font-bold text-blue-700">
                    {formatIDR(totalPrice)}
                  </span>
                </div>
              </div>
            </details>
          </div>
        )}
    </div>
  );
}
