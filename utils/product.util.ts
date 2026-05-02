/**
 * Utility functions for Products
 */

export const uid = () => Math.random().toString(36).slice(2, 9);

// Convert string to slug (remove accents, spaces, special characters)
export const toSlug = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD") // Convert to Unicode Normalization Form D (canonical decomposition)
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics (accents)
    .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric characters with hyphens
    .replace(/^-|-$/g, ""); // Remove leading/trailing hyphens

/**
 * Generate SKU based on format: [BrandPrefix][TypePrefix][Day][Warehouse] - [Size] - [ColorCode]
 * Example: UNLE15HCM - S - H (Uniqlo - Len - 15th - HCM)
 */
export const generateSKU = (
  productName: string,
  color: string,
  size: string,
) => {
  if (!productName) return "";

  const cleanString = (str: string) =>
    str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[đĐ]/g, "d")
      .replace(/[^a-zA-Z0-9 ]/g, "")
      .toUpperCase();

  const words = cleanString(productName).split(" ").filter(Boolean);

  // Heuristic for Brand and Type
  // Brand: Last word (e.g., Uniqlo -> UN)
  // Type: Second word if available, else first word (e.g., Len -> LE)
  const brandPrefix =
    words.length > 1 ? words[words.length - 1].substring(0, 2) : "DD";
  const typePrefix =
    words.length > 1
      ? words[1].length >= 2
        ? words[1].substring(0, 2)
        : words[1].substring(0, 1) + "X"
      : words[0].substring(0, 2);

  const day = new Date().getDate().toString().padStart(2, "0");
  const warehouse = "HCM";

  const colorPart = cleanString(color).substring(0, 1) || "X";
  const sizePart = size.toUpperCase() || "N";

  const baseSKU = `${brandPrefix}${typePrefix}${day}${warehouse}`;

  return `${baseSKU}-${sizePart}-${colorPart}`;
};
