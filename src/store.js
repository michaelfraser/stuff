export let bins = [];
export let searchFilter = "";

export const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=400&auto=format&fit=crop";

export function setBins(newBins) {
  bins = newBins;
}

export function setSearchFilter(query) {
  searchFilter = query.trim().toLowerCase();
}

export function getFilteredBins() {
  if (!searchFilter) return bins;
  return bins.filter((bin) => {
    const binIdStr = String(bin.bin_id || "").toLowerCase();
    const matchesContents = bin.contents?.some((item) =>
      String(item).toLowerCase().includes(searchFilter)
    );
    return binIdStr.includes(searchFilter) || matchesContents;
  });
}

export function generateUniqueBinId() {
  let attempts = 0;
  while (attempts < 1000) {
    const randomNum = Math.floor(100 + Math.random() * 900);
    const candidateId = `S-${randomNum}`;
    const exists = bins.some(b => String(b.bin_id).toLowerCase() === candidateId.toLowerCase());
    if (!exists) return candidateId;
    attempts++;
  }
  return `S-${Date.now().toString().slice(-3)}`;
}

export async function fetchInitialDatabase() {
  try {
    const response = await fetch(`${import.meta.env.BASE_URL}stuff.json`);
    if (!response.ok) throw new Error();
    const data = await response.json();
    bins = data.map(bin => ({
      ...bin,
      level: bin.level !== undefined ? String(bin.level) : "N/A"
    }));
  } catch {
    console.log("No default stuff.json auto-loaded. Ready for manual uploads.");
  }
}