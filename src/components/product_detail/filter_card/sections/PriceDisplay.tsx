interface PriceDisplayProps {
  priceBasedOnRange: {
    seasonalNight?: number;
    seasonalPrice?: number;
    normalNight?: number;
    normalPrice?: number;
  };
  room_typesIndex: number;
  data: any;
}

export default function PriceDisplay({
  priceBasedOnRange,
  room_typesIndex,
  data,
}: PriceDisplayProps) {
  // Fungsi toCurrency internal
  const toCurrency = (val: number | undefined) => {
    if (val === undefined) val = 0;
    return Number(val).toLocaleString("id-ID", {
      style: "currency",
      currency: "IDR",
    });
  };

  return (
    <div className="font-semibold numbers-font py-4">
      {priceBasedOnRange.seasonalNight && priceBasedOnRange.normalNight ? (
        <div className="flex flex-col">
          <div className="text-2xl">
            {toCurrency(priceBasedOnRange.seasonalPrice)} -
          </div>
          <div className="flex gap-2 items-end">
            <div className="text-2xl">
              {toCurrency(priceBasedOnRange.normalPrice)}
            </div>
            <div>/ night</div>
          </div>
        </div>
      ) : priceBasedOnRange.seasonalNight ? (
        <div className="flex gap-2 items-end">
          <div className="text-2xl">
            {toCurrency(priceBasedOnRange.seasonalPrice)}
          </div>
          <div>/ night</div>
        </div>
      ) : (
        <div className="flex gap-2 items-end">
          <div className="text-2xl">
            {toCurrency(data.room_types[room_typesIndex].price)}
          </div>
          <div>/ night</div>
        </div>
      )}
    </div>
  );
}
