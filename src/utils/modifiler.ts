import { Entity } from "@/store/history";
import { moviesResponseSchema } from "@/zod/z";
import { z } from "zod";
export function stringToJson(inputStr: string) {
  if (!inputStr || typeof inputStr !== "string") {
    return null;
  }

  // Try to parse if it's already valid JSON
  try {
    return JSON.parse(inputStr);
  } catch {
    // Not valid JSON, continue with conversion
  }

  try {
    // First, handle the entire string by replacing all single quotes with double quotes
    // but we need to be careful with apostrophes in text

    // Step 1: Convert the entire string to use double quotes instead of single quotes
    // This is a more comprehensive approach than trying to match specific patterns
    let processedStr = inputStr;

    // Step 2: Replace all single quotes with double quotes
    // But first, temporarily replace any escaped single quotes
    const tempMarker = "___APOSTROPHE___";
    processedStr = processedStr
      .replace(/\\'/g, tempMarker) // Save escaped single quotes
      .replace(/'/g, '"') // Replace all single quotes with double quotes
      .replace(new RegExp(tempMarker, "g"), "\\'"); // Restore escaped single quotes

    // Step 3: Fix any unquoted property names
    processedStr = processedStr.replace(
      /([{,]\s*)([a-zA-Z0-9_]+)(\s*:)/g,
      '$1"$2"$3'
    );

    // Try to parse the processed string
    try {
      return JSON.parse(processedStr);
    } catch (parseError) {
      console.log("First parse attempt failed:", parseError);

      // If still not valid JSON, try a more aggressive approach
      // Convert to valid JSON by wrapping in braces if needed
      if (!processedStr.trim().startsWith("{")) {
        processedStr = "{" + processedStr + "}";
      }

      // Last attempt to parse
      return JSON.parse(processedStr);
    }
  } catch (error) {
    console.error("String to JSON conversion error:", error);
    return null;
  }
}

export function processImageUrl(url: string) {
  // https://image.tmdb.org/t/p/w400/mbm8k3GFhXS0ROd9AD1gqYbIFbM.jpg
  if (!url) return null;
  return url.replace("w154", "w400");
}

export const filterMovies = (
  flatMovies: z.infer<typeof moviesResponseSchema>,
  entities: Entity
) => {
  const movieTitles = new Set();
  const uniqueMovies = flatMovies.filter((movie) => {
    // filter genres

    if (entities.genre && entities.genre.length > 0) {
      const movieGenres = movie.genres.map((genre) => genre.toLowerCase());

      if (entities.genres_union) {
        // OR condition - movie should have at least one of the requested genres
        const hasAnyGenre = entities.genre.some((genre) =>
          movieGenres.includes(genre.toLowerCase())
        );
        if (!hasAnyGenre) return false;
      } else {
        // AND condition - movie should have all requested genres
        const hasAllGenres = entities.genre.every((genre) =>
          movieGenres.includes(genre.toLowerCase())
        );
        if (!hasAllGenres) return false;
      }
    }
    // handle actor condition
    if (entities.actor && entities.actor.length > 0) {
      const movieActors = movie.actors.map((actor) => actor.toLowerCase());
      const hasAnyActor = entities.actor.some((actor) =>
        movieActors.includes(actor.toLowerCase())
      );
      if (!hasAnyActor) return false;

      if (entities.actors_union) {
        const hasAllActors = entities.actor.every((actor) =>
          movieActors.includes(actor.toLowerCase())
        );
        if (!hasAllActors) return false;
      } else {
        const hasAnyActor = entities.actor.some((actor) =>
          movieActors.includes(actor.toLowerCase())
        );
        if (!hasAnyActor) return false;
      }
    }

    // Handle duplicate titles
    if (movieTitles.has(movie.title)) {
      return false;
    }
    movieTitles.add(movie.title);
    return true;
  });
  return uniqueMovies;
};
