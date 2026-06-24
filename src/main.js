import { initVersionChecker } from './versionCheck';
import { 
  bins, setBins, setSearchFilter, getFilteredBins, 
  generateUniqueBinId, fetchInitialDatabase, FALLBACK_IMAGE 
} from './store';
import { els, showModal, closeAllModals } from './ui';
import { createBinCardHtml } from './templates';

let isEditing = false;
let activeEditingId = null;
let binToDelete = null;

function render() {
  const filtered = getFilteredBins();

  if (bins.length > 0) {
    els.btnDownload.classList.remove("hidden");
    els.btnClearAll.classList.remove("hidden");
    els.statsContainer.innerHTML = `<span class="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">Total Bins: ${bins.length}</span>`;
  } else {
    els.btnDownload.classList.add("hidden");
    els.btnClearAll.classList.add("hidden");
    els.statsContainer.innerHTML = `<span class="text-gray-400 text-sm italic">No bins loaded.</span>`;
  }

  if (filtered.length === 0) {
    els.binsGrid.innerHTML = `<div class="col-span-full text-center py-12 text-gray-400 italic">No storage bins found matching selection.</div>`;
    return;
  }
  els.binsGrid.innerHTML = filtered.map(createBinCardHtml).join("");
}

window.openLightbox = (imgSrc) => {
  document.getElementById("lightbox-img").src = imgSrc;
  showModal(els.lightboxModal);
};

window.openEditModal = (binId) => {
  const target = bins.find(b => b.bin_id === binId);
  if (!target) return;

  isEditing = true;
  activeEditingId = target.bin_id;
  els.modalTitle.textContent = "Edit Stuff";
  els.formBinId.disabled = true;

  const isPlaceholder = target.image.includes("images.unsplash.com") || target.image.includes("googleusercontent.com");
  els.formBinId.value = target.bin_id;
  els.formZone.value = target.zone === "N/A" ? "" : target.zone;
  els.formRack.value = target.rack === "N/A" ? "" : target.rack;
  els.formLevel.value = target.level === "N/A" ? "" : target.level;
  els.formImage.value = isPlaceholder ? "" : target.image;
  els.formContents.value = target.contents ? target.contents.join(", ") : "";

  showModal(els.formModal);
};

window.triggerDeleteModal = (binId) => {
  binToDelete = bins.find(b => b.bin_id === binId);
  if (!binToDelete) return;
  document.getElementById("delete-target-label").textContent = `Bin ${binToDelete.bin_id}`;
  showModal(els.deleteModal);
};

document.getElementById("btn-open-add").addEventListener("click", () => {
  isEditing = false;
  activeEditingId = null;
  els.modalTitle.textContent = "Add New Stuff";
  els.formBinId.disabled = false;
  els.binForm.reset();
  showModal(els.formModal);
});

els.binForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let finalBinId = els.formBinId.value.trim() || generateUniqueBinId();
  
  const dupIdx = bins.findIndex(b => String(b.bin_id).trim().toLowerCase() === finalBinId.toLowerCase());
  if ((isEditing && dupIdx !== -1 && bins[dupIdx].bin_id !== activeEditingId) || (!isEditing && dupIdx !== -1)) {
    alert("The Bin ID must be unique. This value is already allocated.");
    return;
  }

  const contentsArray = els.formContents.value.split(",").map(i => i.trim()).filter(i => i.length > 0);
  const binRecord = {
    bin_id: finalBinId,
    zone: els.formZone.value.trim() || "N/A",
    rack: els.formRack.value.trim() || "N/A",
    level: els.formLevel.value.trim() || "N/A",
    image: els.formImage.value.trim() || FALLBACK_IMAGE,
    contents: contentsArray,
  };

  if (isEditing) {
    const targetIndex = bins.findIndex(b => b.bin_id === activeEditingId);
    if (targetIndex !== -1) bins[targetIndex] = binRecord;
  } else {
    bins.unshift(binRecord);
  }

  closeAllModals();
  render();
});

document.getElementById("btn-confirm-delete").addEventListener("click", () => {
  if (binToDelete) {
    setBins(bins.filter(b => b.bin_id !== binToDelete.bin_id));
    binToDelete = null;
    closeAllModals();
    render();
  }
});

els.btnClearAll.addEventListener("click", () => showModal(els.clearModal));
document.getElementById("btn-confirm-clear").addEventListener("click", () => {
  setBins([]);
  closeAllModals();
  render();
});

els.btnDownload.addEventListener("click", () => {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(bins, null, 4));
  const dlAnchor = document.createElement("a");
  dlAnchor.setAttribute("href", dataStr);
  dlAnchor.setAttribute("download", `stuff-${new Date().toISOString()}.json`);
  document.body.appendChild(dlAnchor);
  dlAnchor.click();
  dlAnchor.remove();
});

document.getElementById("file-upload").addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const parsedData = JSON.parse(e.target.result);
      if (!Array.isArray(parsedData)) throw new Error("Schema Error");
      setBins(parsedData.map(bin => ({ ...bin, level: bin.level !== undefined ? String(bin.level) : "N/A" })));
      render();
    } catch {
      alert("Invalid JSON upload file structure.");
    }
  };
  reader.readAsText(file);
  event.target.value = "";
});

els.searchQuery.addEventListener("input", (e) => {
  setSearchFilter(e.target.value);
  render();
});

document.getElementById("btn-close-desc").addEventListener("click", () => els.descriptionBox.remove());
document.querySelectorAll("#btn-close-modal, #btn-close-clear, #btn-close-delete, #lightbox-modal").forEach(el => {
  el.addEventListener("click", closeAllModals);
});

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeAllModals();
});

fetchInitialDatabase().then(render);
initVersionChecker();