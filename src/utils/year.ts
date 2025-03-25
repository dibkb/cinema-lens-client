import { genres } from "@/data/genre";

export const processYear = (
  year: number[] | null
): { minYear: string; maxYear: string } | null => {
  if (!year) return null;
  const minYear = Math.min(...year);
  const maxYear = Math.max(...year);
  return { minYear: minYear.toString(), maxYear: maxYear.toString() };
};

export const getGenres = (ids: number[] | null): string[] | null => {
  if (!ids) return null;
  const x = genres
    .filter((genre) => ids.includes(genre.id))
    .map((genre) => genre.slug);
  return x;
};
