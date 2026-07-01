export let bins = [];
export let searchFilter = "";

export const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=400&auto=format&fit=crop";

export function setBins(newBins) {
  bins = newBins;

  try {
    // Local storage only stores strings, so we serialize the data
    localStorage.setItem("bins", JSON.stringify(newBins));
  } catch (error) {
    // Log the full error to the console for developers
    console.error("An error occurred while saving to localStorage:", error);

    // Check if the error is specifically due to running out of space
    if (
      error.name === "QuotaExceededError" ||
      error.name === "NS_ERROR_DOM_QUOTA_REACHED"
    ) {
      alert(
        "Your changes were saved for this session, but your browser storage is full. Free up space or change your browser settings to permanently save your data.",
      );
    } else {
      alert(
        "An unexpected error occurred while trying to save your data permanently.",
      );
    }
  }
}

export function setSearchFilter(query) {
  searchFilter = query.trim().toLowerCase();
}

export function getFilteredBins() {
  if (!searchFilter) return bins;
  console.log(bins, searchFilter);
  return bins.filter((bin) => {
    const binIdStr = "bin " + String(bin.bin_id || "").toLowerCase();
    const matchesContents = bin.contents?.some((item) =>
      String(item).toLowerCase().includes(searchFilter),
    );
    if (searchFilter.startsWith("bin ")) {
      return binIdStr === searchFilter;
    } else 
      return matchesContents;
  });
}

export function generateUniqueBinId() {
  let attempts = 0;
  while (attempts < 1000) {
    const randomNum = Math.floor(100 + Math.random() * 900);
    const candidateId = `S-${randomNum}`;
    const exists = bins.some(
      (b) => String(b.bin_id).toLowerCase() === candidateId.toLowerCase(),
    );
    if (!exists) return candidateId;
    attempts++;
  }
  return `S-${Date.now().toString().slice(-3)}`;
}

export async function fetchInitialDatabase() {
  let bins = JSON.parse(localStorage.getItem("bins")) || [];
  setBins(bins);
}
