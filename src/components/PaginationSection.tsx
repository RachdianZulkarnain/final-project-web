"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { FC } from "react";

interface PaginationSectionProps {
  page: number;
  take: number;
  total: number;
  onChangePage: (page: number) => void;
}

const PaginationSection: FC<PaginationSectionProps> = ({
  page,
  take,
  total,
  onChangePage,
}) => {
  const totalPages = Math.ceil(total / take);

  if (totalPages <= 1) return null; // hide pagination if only 1 page

  const handlePrev = () => {
    if (page > 1) onChangePage(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) onChangePage(page + 1);
  };

  return (
    <Pagination className="mb-12 mt-12 hover:cursor-pointer">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious onClick={handlePrev} />
        </PaginationItem>

        <PaginationItem>
          <PaginationLink>{page}</PaginationLink>
        </PaginationItem>

        <PaginationItem>
          <PaginationNext onClick={handleNext} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationSection;
