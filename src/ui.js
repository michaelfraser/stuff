export const els = {
  binsGrid: document.getElementById("bins-grid"),
  searchQuery: document.getElementById("search-query"),
  statsContainer: document.getElementById("stats-container"),
  descriptionBox: document.getElementById("description-box"),
  btnDownload: document.getElementById("btn-download"),
  btnClearAll: document.getElementById("btn-clear-all"),
  formModal: document.getElementById("form-modal"),
  clearModal: document.getElementById("clear-modal"),
  deleteModal: document.getElementById("delete-modal"),
  lightboxModal: document.getElementById("lightbox-modal"),
  binForm: document.getElementById("bin-form"),
  modalTitle: document.getElementById("modal-title"),
  formBinId: document.getElementById("form-bin-id"),
  formZone: document.getElementById("form-zone"),
  formRack: document.getElementById("form-rack"),
  formLevel: document.getElementById("form-level"),
  formImage: document.getElementById("form-image"),
  formContents: document.getElementById("form-contents")
};

export function showModal(modalNode) {
  modalNode.classList.remove("hidden");
  modalNode.classList.add("flex");
}

export function closeAllModals() {
  [els.formModal, els.clearModal, els.deleteModal, els.lightboxModal].forEach((m) => {
    m.classList.remove("flex");
    m.classList.add("hidden");
  });
  els.binForm.reset();
}