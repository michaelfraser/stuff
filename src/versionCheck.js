const currentVersion = __APP_VERSION__;
let abortController = null;
let debounceTimer = null;

const checkServer = async () => {
  // If there's an ongoing network request, cancel it
  if (abortController) {
    abortController.abort();
  }

  abortController = new AbortController();
  const { signal } = abortController;

  try {
    const baseUrl = import.meta.env.BASE_URL;
    const response = await fetch(`${baseUrl}version.json?cb=${Date.now()}`, { signal });
    
    if (!response.ok) throw new Error("Network response was not ok");

    const data = await response.json();

    if (data.version !== currentVersion) {
      updateUI();
    }
  } catch (error) {
    if (error.name === "AbortError") {
      console.log("Fetch aborted: A newer request took over.");
    } else {
      console.error("Version fetch error:", error);
    }
  } finally {
    if (abortController?.signal === signal) {
      abortController = null;
    }
  }
};

const updateUI = () => {
  const indicator = document.getElementById("version-status");
  if (!indicator) return;

  // Prevent duplicate button injection if it's already there
  if (document.getElementById("btn-update-version")) return;

  indicator.innerHTML = `
    <button id="btn-update-version" class="bg-red-600 hover:bg-red-700 text-white font-medium py-1 px-3 rounded shadow-sm transition-colors text-xs flex items-center gap-1">
      Click to update to new version of site
    </button>
  `;

  document.getElementById("btn-update-version")?.addEventListener("click", () => {
    if (confirm("Unsaved changes will be lost. Do you want to proceed with the update?")) {
      window.location.reload();
    }
  });
};

const debouncedCheck = () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(checkServer, 5000); // Wait for 5 seconds of DOM silence before checking
};

export function initVersionChecker() {
  console.log('App Version:', currentVersion);

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") checkServer();
  });
  window.addEventListener("pageshow", checkServer);
  window.addEventListener("focus", checkServer);

  const observer = new MutationObserver(debouncedCheck);
  
  if (document.body) {
    observer.observe(document.body, { childList: true, subtree: true });
  } else {
    document.addEventListener("DOMContentLoaded", () => {
      observer.observe(document.body, { childList: true, subtree: true });
    });
  }
  checkServer();
}