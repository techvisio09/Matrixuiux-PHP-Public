// Variant resolution: groups products into bases (office, word, excel, windows, project, visio)
// with version (2024/2021/2019 or 11/10), edition and OS — so the product page can offer
// Version / Edition / OS selectors that navigate to the real matching product in the catalog.
// The catalog is loaded from the backend API by CatalogContext via setCatalog().

const norm = (s) => s.toLowerCase().replace(/&/g, "and").replace(/\s+/g, " ");
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

// Deduped catalog (populated by CatalogContext after fetching /api/products)
export let catalog = [];

export const setCatalog = (list) => {
  const seen = new Set();
  const out = [];
  list.forEach((p) => {
    const k = norm(p.name);
    if (!seen.has(k)) {
      seen.add(k);
      out.push(p);
    }
  });
  catalog = out;
};

// Resolves a route id to a product — supports both original ids and name-slug ids
// (mega-menu links use slugged names; dedupe may have kept an entry with a different id)
export const findProduct = (id) =>
  catalog.find((p) => p.id === id) || catalog.find((p) => slug(p.name) === id) || null;

/* ---------- parsing helpers ---------- */

const detectOS = (p, n) => {
  if (p.platform === "Mac") return "Mac";
  if (!p.platform && n.includes("mac")) return "Mac";
  return "PC";
};

const detectWindowsVersion = (n) => {
  if (n.includes("11")) return "11";
  if (n.includes("10")) return "10";
  return null;
};

const detectOfficeEdition = (n) => {
  if (n.includes("professional plus")) return "Professional Plus";
  if (n.includes("home and business")) return "Home and Business";
  if (n.includes("home and student")) return "Home and Student";
  if (n.includes("home")) return "Home";
  return null;
};

export const parseVariant = (p) => {
  const n = norm(p.name);
  const year = (n.match(/\b(20\d{2})\b/) || [])[1] || null;
  const core = { ...p, os: detectOS(p, n), year, base: null, version: null, edition: null };

  if (n.includes("project")) return { ...core, base: "project", version: year };
  if (n.includes("visio")) return { ...core, base: "visio", version: year };
  if (n.startsWith("windows")) {
    const version = detectWindowsVersion(n);
    if (!version) return core;
    const edition = n.includes("pro") ? "Pro" : "Home";
    return { ...core, base: "windows", version, edition };
  }
  if (n.includes("word") && year) return { ...core, base: "word", version: year };
  if (n.includes("excel") && year) return { ...core, base: "excel", version: year };
  if (n.includes("office") && year) {
    return { ...core, base: "office", version: year, edition: detectOfficeEdition(n) };
  }
  return core;
};

/* ---------- grouping ---------- */

export const EDITION_ORDER = ["Home and Business", "Professional Plus", "Home and Student", "Home", "Pro"];

const sortEditions = (editions) =>
  [...editions].sort((a, b) => EDITION_ORDER.indexOf(a) - EDITION_ORDER.indexOf(b));

const sortVersionsDesc = (versions) => [...versions].sort((a, b) => Number(b) - Number(a));

export const getVariantGroup = (product) => {
  const cur = parseVariant(product);
  if (!cur.base) return { cur, versions: [], editions: [], osOptions: [], baseGroup: [] };

  const baseGroup = catalog.map(parseVariant).filter((p) => p.base === cur.base);

  let versions = sortVersionsDesc([...new Set(baseGroup.map((p) => p.version).filter(Boolean))]);
  // Editions: union across the whole base so unavailable ones render blurred (not hidden)
  let editions = sortEditions([...new Set(baseGroup.map((p) => p.edition).filter(Boolean))]);
  let osOptions = [...new Set(baseGroup.map((p) => p.os))].sort((a) => (a === "PC" ? -1 : 1));

  if (versions.length < 2) versions = [];
  if (editions.length < 2) editions = [];
  if (osOptions.length < 2) osOptions = [];

  return { cur, versions, editions, osOptions, baseGroup };
};
