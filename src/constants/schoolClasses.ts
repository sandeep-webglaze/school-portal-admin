/**
 * Single source of truth for the school class options shown in
 * Class From / Class To dropdowns.
 *
 * Why this exists:
 *   The admin used to hardcode `[...Array(12)].map((_, i) => ...)` which gave
 *   only Class 1 - Class 12. Many Indian schools (especially day schools and
 *   play schools) start from Nursery / LKG / UKG. Adding those values here in
 *   one place makes them available wherever schools are created or edited.
 *
 * Storage convention:
 *   The `value` is the string stored on the school record (DB).
 *   The `label` is what's shown in dropdowns.
 *   The numeric `order` is for sort comparisons (Nursery < LKG < UKG < 1 < … < 12).
 *
 *   Pre-primary values use the human-readable names ("Nursery", "LKG", "UKG")
 *   so that any new code reading the value can render it directly without a
 *   lookup table. Existing code that reads numeric class values ("1" – "12")
 *   keeps working untouched.
 */

export type SchoolClassOption = {
  /** Stored value in DB (e.g. "Nursery", "1", "12") */
  value: string;
  /** Dropdown / display label (e.g. "Nursery", "Class 1") */
  label: string;
  /** Numeric ordering for comparisons / sorting */
  order: number;
};

export const SCHOOL_CLASSES: SchoolClassOption[] = [
  { value: 'Nursery', label: 'Nursery', order: -3 },
  { value: 'LKG', label: 'LKG', order: -2 },
  { value: 'UKG', label: 'UKG', order: -1 },
  ...Array.from({ length: 12 }, (_, idx) => {
    const n = idx + 1;
    return {
      value: String(n),
      label: `Class ${n}`,
      order: n
    };
  })
];

/**
 * Look up a class option by its stored value.
 * Returns `undefined` if the value isn't recognised.
 */
export function getSchoolClassOption(value?: string | null): SchoolClassOption | undefined {
  if (!value) return undefined;
  return SCHOOL_CLASSES.find((c) => c.value === value);
}
