export function stringToJson(inputStr: string) {
  // 1. Handle apostrophes in values by temporarily replacing them
  const tempMarker = "___APOSTROPHE___";
  const escapedStr = inputStr
    .replace(/'/g, tempMarker) // Replace all single quotes
    .replace(/"/g, "'") // Convert real apostrophes back
    .replace(new RegExp(tempMarker, "g"), '"'); // Restore original quotes as JSON needs

  // 2. Wrap in parentheses for safe evaluation
  try {
    const obj = new Function(`return (${escapedStr})`)();
    return JSON.parse(JSON.stringify(obj, null, 2));
  } catch (error) {
    console.error("Conversion error:", error);
    return null;
  }
}

export function processImageUrl(url: string) {
  // https://image.tmdb.org/t/p/w400/mbm8k3GFhXS0ROd9AD1gqYbIFbM.jpg
  return url.replace("w154", "w400");
}
