import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface BlogPaginationProps {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  onPageChange: (page: number) => void;
  getPageNumbers: () => (number | string)[];
}

const BlogPagination = ({
  currentPage,
  totalPages,
  hasNextPage,
  hasPrevPage,
  onPageChange,
  getPageNumbers
}: BlogPaginationProps) => {
  if (totalPages <= 1) return null;

  const pageNumbers = getPageNumbers();

  return (
    <div className="mt-12 flex justify-center">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => onPageChange(currentPage - 1)}
              className={`cursor-pointer ${!hasPrevPage ? 'pointer-events-none opacity-50' : 'hover:bg-muted/50'}`}
            />
          </PaginationItem>
          
          {pageNumbers.map((pageNumber, index) => (
            <PaginationItem key={index}>
              {pageNumber === '...' ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  onClick={() => onPageChange(pageNumber as number)}
                  isActive={currentPage === pageNumber}
                  className="cursor-pointer hover:bg-muted/50"
                >
                  {pageNumber}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}
          
          <PaginationItem>
            <PaginationNext 
              onClick={() => onPageChange(currentPage + 1)}
              className={`cursor-pointer ${!hasNextPage ? 'pointer-events-none opacity-50' : 'hover:bg-muted/50'}`}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default BlogPagination;