import slugify from 'slugify';

/**
 * Generates a slug with dots as separators instead of hyphens
 *
 * @param str - The input string to be converted to a slug
 * @returns The processed slug string with dots as separators
 *
 * @example
 * ```typescript
 * generatePointSlug("Hello World") // "hello.world"
 * generatePointSlug("User's Profile") // "users.profile"
 * ```
 */
export function generatePointSlug(str: string): string {
  return slugify(str, { lower: true, replacement: '.', remove: /['_\.-]/g });
}

/**
 * Generates a slug from the input string
 *
 * @param str - The input string to be converted to a slug
 * @returns The processed slug string with hyphens as separators
 *
 * @example
 * ```typescript
 * generateSlug("Hello World!"); // Returns: "hello-world"
 * generateSlug("Product Name 123"); // Returns: "product-name-123"
 * ```
 */
export function generateSlug(str: string): string {
  return slugify(str, { lower: true });
}
