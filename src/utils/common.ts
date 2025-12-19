import { MovieCrew } from "@services/apis/movie";
import ISO6391 from "iso-639-1";

/**
 * Convert a duration in minutes to a human-readable string like "3h 17m".
 *
 * Examples:
 * - 197 -> "3h 17m"
 * - 60 -> "1h"
 * - 45 -> "45m"
 * - 0 / invalid -> "0m"
 */
export const toHourMinute = (value: number | string): string => {
  const total = Number(value);
  if (!Number.isFinite(total) || total <= 0) return "0m";

  const totalMinutes = Math.floor(total);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0 && minutes > 0) return `${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h`;
  return `${minutes}m`;
};

/**
 * Convert an array of genre objects or strings to a comma-separated list.
 *
 * Input example:
 * [
 *   { id: 878, name: 'Science Fiction' },
 *   { id: 12, name: 'Adventure' },
 *   { id: 14, name: 'Fantasy' }
 * ]
 *
 * Output: "Science Fiction, Adventure, Fantasy"
 */
export const toGenreNames = (
  genres: Array<{ id?: number; name?: string } | string> | null | undefined
): string => {
  if (!Array.isArray(genres) || genres.length === 0) return "";
  const names = genres
    .map((g) => (typeof g === "string" ? g : g?.name ?? ""))
    .filter((s): s is string => Boolean(s && s.trim()))
    .map((s) => s.trim());
  return names.join(", ");
};

/**
 * Convert a BCP-47/ISO 639 language code to a human-readable language name.
 *
 * Examples:
 * - "en" -> "English"
 * - "en-US" -> "English"
 * - "pt_BR" -> "Portuguese"
 * - unknown/empty -> "" or returns the original code if not found
 */
export const toLanguageName = (code?: string | null): string => {
  if (!code) return "";
  const trimmed = String(code).trim();
  if (!trimmed) return "";

  const langPart = trimmed.toLowerCase().split(/[-_]/)[0];
  const name = ISO6391.getName(langPart);
  return name || trimmed;
};

/**
 * Extract the US MPAA certification from TMDB release dates data.
 * Prefers the theatrical release (type = 3). Normalizes "PG-13" → "PG13".
 *
 * Input can be either the full object `{ results: [...] }` or just the `results` array.
 */
export const toUSCertification = (
  data:
    | {
        results?: Array<{
          iso31661?: string;
          releaseDates?: Array<{ certification?: string; type?: number }>;
        }>;
      }
    | Array<{
        iso31661?: string;
        releaseDates?: Array<{ certification?: string; type?: number }>;
      }>
    | null
    | undefined
): string => {
  if (!data) return "";
  const countries = Array.isArray(data) ? data : data.results ?? [];
  if (!Array.isArray(countries) || countries.length === 0) return "";

  const us = countries.find((c) => c?.iso31661 === "US");
  const list = us?.releaseDates ?? [];
  if (!Array.isArray(list) || list.length === 0) return "";

  const theatrical = list.find(
    (r) => Boolean(r?.certification?.trim()) && r?.type === 3
  );
  const anyRated =
    theatrical ?? list.find((r) => Boolean(r?.certification?.trim()));
  const cert = (anyRated?.certification ?? "").trim();
  if (!cert) return "";
  return cert.replace(/[\s-]+/g, "");
};

const normalize = (s?: string | null) => (s ? s.trim() : "");

/**
 * Get a single Director name from crew list.
 * - Filters by `knownForDepartment === "Directing"` (case-insensitive)
 * - Prefers the member with `job === "Director"`
 * - Deduplicates by name and returns the first unique match
 */
export const getDirectorName = (
  crew: Array<MovieCrew> | null | undefined
): string => {
  if (!Array.isArray(crew) || crew.length === 0) return "";
  const candidates = crew.filter(
    (m) => normalize(m.knownForDepartment).toLowerCase() === "directing"
  );
  if (candidates.length === 0) return "";

  const primary = candidates.find(
    (m) => normalize(m.job).toLowerCase() === "director"
  );
  const primaryName = normalize(primary?.name);
  if (primaryName) return primaryName;

  const seen = new Set<string>();
  for (const m of candidates) {
    const nm = normalize(m.name);
    if (!nm) continue;
    if (!seen.has(nm)) {
      seen.add(nm);
      return nm;
    }
  }
  return "";
};

/**
 * Get a single Writer name from crew list.
 * - Filters by `knownForDepartment === "Writing"` (case-insensitive)
 * - Prefers jobs: Screenplay > Writer > Story > Teleplay
 * - Deduplicates by name and returns the first unique match
 */
export const getWriterName = (
  crew: Array<MovieCrew> | null | undefined
): string => {
  if (!Array.isArray(crew) || crew.length === 0) return "";
  const candidates = crew.filter(
    (m) => normalize(m.knownForDepartment).toLowerCase() === "writing"
  );
  if (candidates.length === 0) return "";

  const preferredOrder = ["screenplay", "writer", "story", "teleplay"];
  for (const job of preferredOrder) {
    const pick = candidates.find((m) => normalize(m.job).toLowerCase() === job);
    const nm = normalize(pick?.name);
    if (nm) return nm;
  }

  const seen = new Set<string>();
  for (const m of candidates) {
    const nm = normalize(m.name);
    if (!nm) continue;
    if (!seen.has(nm)) {
      seen.add(nm);
      return nm;
    }
  }
  return "";
};
