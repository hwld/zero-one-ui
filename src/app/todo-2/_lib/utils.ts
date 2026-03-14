import { format as dateFormat } from "date-fns";

export const format = (date: Date) => {
  return dateFormat(date, "yyyy/MM/dd hh:mm:ss");
};

export const paginate = <T>(items: T[], { page, limit }: { page: number; limit: number }): T[] => {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  return items.slice(startIndex, endIndex);
};
