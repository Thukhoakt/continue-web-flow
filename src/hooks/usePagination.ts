import { useState, useEffect } from 'react';

interface UsePaginationProps {
  totalItems: number;
  itemsPerPage?: number;
  initialPage?: number;
}

export const usePagination = ({ 
  totalItems, 
  itemsPerPage = 6, 
  initialPage = 1 
}: UsePaginationProps) => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;
  
  const nextPage = () => {
    if (hasNextPage) {
      setCurrentPage(prev => prev + 1);
    }
  };
  
  const prevPage = () => {
    if (hasPrevPage) {
      setCurrentPage(prev => prev - 1);
    }
  };
  
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  
  const getPageNumbers = () => {
    const delta = 2; // Số trang hiển thị xung quanh trang hiện tại
    const range = [];
    const rangeWithDots = [];
    
    for (let i = Math.max(2, currentPage - delta); 
         i <= Math.min(totalPages - 1, currentPage + delta); 
         i++) {
      range.push(i);
    }
    
    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }
    
    rangeWithDots.push(...range);
    
    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }
    
    return rangeWithDots.filter((item, index, arr) => arr.indexOf(item) === index);
  };
  
  // Reset về trang 1 khi totalItems thay đổi
  useEffect(() => {
    setCurrentPage(1);
  }, [totalItems]);
  
  return {
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    hasNextPage,
    hasPrevPage,
    nextPage,
    prevPage,
    goToPage,
    getPageNumbers,
    itemsPerPage
  };
};