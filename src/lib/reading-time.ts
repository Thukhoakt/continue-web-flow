export const calculateReadingTime = (content: string): number => {
  // Số từ trung bình người đọc được mỗi phút (tiếng Việt)
  const wordsPerMinute = 200;
  
  // Xóa HTML tags và đếm số từ
  const cleanText = content.replace(/<[^>]*>/g, ' ');
  const wordCount = cleanText.trim().split(/\s+/).length;
  
  // Tính thời gian đọc (tối thiểu 1 phút)
  const readingTime = Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  
  return readingTime;
};

export const formatReadingTime = (minutes: number): string => {
  if (minutes === 1) {
    return '1 phút đọc';
  }
  return `${minutes} phút đọc`;
};

export const getContentPreview = (content: string, maxLength: number = 200): string => {
  const cleanText = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  
  if (cleanText.length <= maxLength) {
    return cleanText;
  }
  
  return cleanText.substring(0, maxLength).trim() + '...';
};