import { initVersionChecker } from './versionCheck';


initVersionChecker();

let bins = [];
let isEditing = false;
let activeEditingId = null;
let binToDelete = null;

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=400&auto=format&fit=crop";

const binsGrid = document.getElementById("bins-grid");
const searchQuery = document.getElementById("search-query");
const statsContainer = document.getElementById("stats-container");
const descriptionBox = document.getElementById("description-box");

const btnDownload = document.getElementById("btn-download");
const btnClearAll = document.getElementById("btn-clear-all");
const btnOpenAdd = document.getElementById("btn-open-add");
const btnCloseDesc = document.getElementById("btn-close-desc");
const fileUploadInput = document.getElementById("file-upload");

const formModal = document.getElementById("form-modal");
const clearModal = document.getElementById("clear-modal");
const deleteModal = document.getElementById("delete-modal");
const lightboxModal = document.getElementById("lightbox-modal");

const binForm = document.getElementById("bin-form");
const modalTitle = document.getElementById("modal-title");
const formBinId = document.getElementById("form-bin-id");
const formZone = document.getElementById("form-zone");
const formRack = document.getElementById("form-rack");
const formLevel = document.getElementById("form-level");
const formImage = document.getElementById("form-image");
const formContents = document.getElementById("form-contents");

function render() {
  const query = searchQuery.value.trim().toLowerCase();

  const filteredBins = bins.filter((bin) => {
    const binIdStr = String(bin.bin_id || "").toLowerCase();
    const matchesBinId = binIdStr.includes(query);
    const matchesContents =
      bin.contents &&
      bin.contents.some((item) => String(item).toLowerCase().includes(query));
    return matchesBinId || matchesContents;
  });

  if (bins.length > 0) {
    btnDownload.classList.remove("hidden");
    btnClearAll.classList.remove("hidden");
    statsContainer.innerHTML = `<span class="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">Total Bins: ${bins.length}</span>`;
  } else {
    btnDownload.classList.add("hidden");
    btnClearAll.classList.add("hidden");
    statsContainer.innerHTML = `<span class="text-gray-400 text-sm italic">No bins loaded.</span>`;
  }

  if (filteredBins.length === 0) {
    binsGrid.innerHTML = `<div class="col-span-full text-center py-12 text-gray-400 italic">No storage bins found matching selection.</div>`;
    return;
  }

  binsGrid.innerHTML = filteredBins
    .map((bin) => {
      const displayImg =
        bin.image && bin.image.includes("googleusercontent.com")
          ? bin.image
          : FALLBACK_IMAGE;
      const tagsHtml = bin.contents
        .map(
          (item) => `
                <span class="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-md border border-gray-200">${item}</span>
            `,
        )
        .join("");

      return `
                <div class="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-200">
                    <img src="${displayImg}" alt="Bin ${bin.bin_id}" 
                            onclick="openLightbox('${displayImg}')"
                            onerror="this.onerror=null; this.src='${FALLBACK_IMAGE}';"
                            class="w-full h-40 object-cover bg-gray-200 cursor-pointer hover:opacity-90 transition-opacity">
                    <div class="p-4">
                        <div class="flex justify-between items-start mb-3">
                            <div>
                                <h2 class="text-xl font-bold text-gray-800">Bin ${bin.bin_id}</h2>
                                <p class="text-xs text-gray-400 uppercase tracking-tighter">
                                    Zone ${bin.zone || "N/A"} / Rack ${bin.rack || "N/A"} / Lvl ${bin.level || "N/A"}
                                </p>
                            </div>
                            <div class="flex items-center gap-1 shrink-0">
                                <button onclick="openEditModal('${bin.bin_id}')" class="text-gray-400 hover:text-blue-600 p-1 rounded-md hover:bg-gray-100 transition-colors" title="Edit Bin">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </button>
                                <button onclick="triggerDeleteModal('${bin.bin_id}')" class="text-gray-400 hover:text-red-600 p-1 rounded-md hover:bg-gray-100 transition-colors" title="Delete Bin">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div class="flex flex-wrap gap-1">${tagsHtml}</div>
                    </div>
                </div>
            `;
    })
    .join("");
}

function generateUniqueBinId() {
  let attempts = 0;
  while (attempts < 1000) {
    const randomNum = Math.floor(100 + Math.random() * 900);
    const candidateId = `S-${randomNum}`;
    const idExists = bins.some(
      (b) =>
        String(b.bin_id).trim().toLowerCase() === candidateId.toLowerCase(),
    );
    if (!idExists) return candidateId;
    attempts++;
  }
  return `S-${Date.now().toString().slice(-3)}`;
}

btnOpenAdd.addEventListener("click", () => {
  isEditing = false;
  activeEditingId = null;
  modalTitle.textContent = "Add New Stuff";
  binForm.reset();
  formBinId.disabled = false;
  showElementModal(formModal);
});

window.openEditModal = function (binId) {
  const bin = bins.find((b) => b.bin_id === binId);
  if (!bin) return;

  isEditing = true;
  activeEditingId = bin.bin_id;
  modalTitle.textContent = "Edit Stuff";

  const isPlaceholder =
    bin.image.includes("images.unsplash.com") ||
    bin.image.includes("googleusercontent.com");

  formBinId.value = bin.bin_id;
  formZone.value = bin.zone === "N/A" ? "" : bin.zone;
  formRack.value = bin.rack === "N/A" ? "" : bin.rack;
  formLevel.value = bin.level === "N/A" ? "" : bin.level;
  formImage.value = isPlaceholder ? "" : bin.image;
  formContents.value = bin.contents ? bin.contents.join(", ") : "";

  showElementModal(formModal);
};

window.openLightbox = function (imgSrc) {
  document.getElementById("lightbox-img").src = imgSrc;
  showElementModal(lightboxModal);
};

window.triggerDeleteModal = function (binId) {
  binToDelete = bins.find((b) => b.bin_id === binId);
  if (!binToDelete) return;
  document.getElementById("delete-target-label").textContent =
    `Bin ${binToDelete.bin_id}`;
  showElementModal(deleteModal);
};

btnClearAll.addEventListener("click", () => showElementModal(clearModal));

function showElementModal(modalNode) {
  modalNode.classList.remove("hidden");
  modalNode.classList.add("flex");
}

function closeAllModals() {
  [formModal, clearModal, deleteModal, lightboxModal].forEach((m) => {
    m.classList.remove("flex");
    m.classList.add("hidden");
  });
  binForm.reset();
  binToDelete = null;
}

document
  .getElementById("btn-close-modal")
  .addEventListener("click", closeAllModals);
document
  .getElementById("btn-close-clear")
  .addEventListener("click", closeAllModals);
document
  .getElementById("btn-close-delete")
  .addEventListener("click", closeAllModals);
lightboxModal.addEventListener("click", closeAllModals);
btnCloseDesc.addEventListener("click", () => descriptionBox.remove());

binForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let finalBinId = formBinId.value.trim();

  if (!finalBinId) {
    finalBinId = generateUniqueBinId();
  }

  const duplicateIndex = bins.findIndex(
    (b) => String(b.bin_id).trim().toLowerCase() === finalBinId.toLowerCase(),
  );

  if (isEditing) {
    if (
      duplicateIndex !== -1 &&
      bins[duplicateIndex].bin_id !== activeEditingId
    ) {
      alert(
        `The Bin ID "${finalBinId}" is already in use. Please use a unique ID.`,
      );
      return;
    }
  } else {
    if (duplicateIndex !== -1) {
      alert(
        `A Bin with ID "${finalBinId}" already exists. Please use a unique name.`,
      );
      return;
    }
  }

  const contentsArray = formContents.value
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);

  const binRecord = {
    bin_id: finalBinId,
    zone: formZone.value.trim() || "N/A",
    rack: formRack.value.trim() || "N/A",
    level: formLevel.value.trim() || "N/A",
    image: formImage.value.trim() || FALLBACK_IMAGE,
    contents: contentsArray,
  };

  if (isEditing) {
    const targetIndex = bins.findIndex((b) => b.bin_id === activeEditingId);
    if (targetIndex !== -1) bins[targetIndex] = binRecord;
  } else {
    bins.unshift(binRecord);
  }

  closeAllModals();
  render();
});

document.getElementById("btn-confirm-delete").addEventListener("click", () => {
  if (binToDelete) {
    bins = bins.filter((b) => b.bin_id !== binToDelete.bin_id);
    closeAllModals();
    render();
  }
});

document.getElementById("btn-confirm-clear").addEventListener("click", () => {
  bins = [];
  closeAllModals();
  render();
});

btnDownload.addEventListener("click", () => {
  const dataStr =
    "data:text/json;charset=utf-8," +
    encodeURIComponent(JSON.stringify(bins, null, 4));
  const downloadAnchor = document.createElement("a");
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute(
    "download",
    `stuff-${new Date().toISOString().slice(0, 10)}.json`,
  );
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
});

fileUploadInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const parsedData = JSON.parse(e.target.result);
      if (Array.isArray(parsedData)) {
        bins = parsedData.map((bin) => ({
          ...bin,
          level: bin.level !== undefined ? String(bin.level) : "N/A",
        }));
        render();
      } else {
        alert("Invalid JSON data schema. File must be a JSON Array.");
      }
    } catch (error) {
      alert("Failed to read JSON profile file cleanly.");
    }
  };
  reader.readAsText(file);
  event.target.value = "";
});

async function loadInitialDatabase() {
  try {
    // Tries to look for an adjacent 'stuff.json' inside the same directory structure folder context
    const baseUrl = import.meta.env.BASE_URL;
    const response = await fetch(`${baseUrl}stuff.json`);      

    if (!response.ok) throw new Error();
    const rawData = await response.json();
    bins = rawData.map((bin) => ({
      ...bin,
      level: bin.level !== undefined ? String(bin.level) : "N/A",
    }));
  } catch (error) {
    console.log("No default stuff.json auto-loaded. Ready for manual uploads.");
  }
  render();
}

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeAllModals();
});
searchQuery.addEventListener("input", render);

loadInitialDatabase();
