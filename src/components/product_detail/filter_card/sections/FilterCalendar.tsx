import { Calendar } from '@/components/ui/calendar';
import {
  addDays,
  areIntervalsOverlapping,
  closestTo,
  isWithinInterval,
  subDays,
} from 'date-fns';
import { DateRange} from 'react-day-picker';

export default function FilterCalendar({
  date,
  setDate,
  form,
  data,
  seasonal_prices,
  unbookable,
  room_typesIndex,
}: any) {
  const { setValue } = form;

  const bookings = [...data.room_types[room_typesIndex].bookings].filter(
    (x) => x.booking_statusId < 4,
  );

  const stock = data.room_types[room_typesIndex].stock;

  const handleDateChange = (selectedDate: DateRange | undefined) => {
    setDate(selectedDate);
    setValue('duration', {
      from: selectedDate?.from as Date,
      to: selectedDate?.to as Date,
    });
    let result;
    if (selectedDate?.from && selectedDate?.to) {
      if (selectedDate?.to > date?.to!) {
        setDate({ from: selectedDate.to, to: undefined });
        setValue('duration', selectedDate as { from: Date; to: Date });
      } else {
        result = unbookable.filter((x: any) =>
          areIntervalsOverlapping(
            { start: selectedDate.from as Date, end: selectedDate.to as Date },
            { start: x.from, end: x.to },
          ),
        );

        const isBooked = bookings.filter((x) =>
          areIntervalsOverlapping(
            { start: selectedDate.from as Date, end: selectedDate.to as Date },
            {
              start: subDays(x.start_date, 1),
              end: subDays(x.end_date, 1),
            },
          ),
        );

        if (result.length > 0) {
          const froms = result.map((x: any) => x.from);
          const closestDate = closestTo(selectedDate.from as Date, froms);
          setDate({
            from: selectedDate.from,
            to: subDays(closestDate as Date, 1),
          });
          setValue('duration', {
            from: selectedDate.from,
            to: subDays(closestDate as Date, 1),
          });
        }

        if (isBooked.length > 0) {
          const froms = isBooked.map((x: any) => x.start_date);
          const closestDate = closestTo(selectedDate.from as Date, froms);
          setDate({
            from: selectedDate.from,
            to: subDays(closestDate as Date, 1),
          });
          setValue('duration', {
            from: selectedDate.from,
            to: subDays(closestDate as Date, 1),
          });
        }
      }
      setValue('duration', selectedDate as { from: Date; to: Date });
    }
  };

  const isDateDisabled = (date: Date) => {
    const isDisabled = unbookable.some((x: any) =>
      isWithinInterval(date, { start: subDays(x.from, 1), end: x.to }),
    );

    const isBooked = bookings.filter((x) =>
      isWithinInterval(date, {
        start: subDays(x.start_date, 1),
        end: subDays(x.end_date, 1),
      }),
    );

    const isFullBooked = isBooked.length >= stock;

    return isDisabled || isFullBooked;
  };

  return (
    <Calendar
      initialFocus
      mode="range"
      min={2}
      fromDate={new Date()}
      defaultMonth={date?.from}
      selected={date}
      disabled={isDateDisabled}
      onSelect={handleDateChange}
      numberOfMonths={1}
      className="bg-white align-center rounded-lg shadow-lg"
    />
  );
}
