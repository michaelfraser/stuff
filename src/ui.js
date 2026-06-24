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

export function showInfo(infoText) {
  const infoContainer = document.querySelector("div[data-info]");
  if (!infoContainer) return;

  infoContainer.innerHTML = "";

  const alertBox = document.createElement("div");
  alertBox.className = "flex items-center justify-between p-4 mb-4 text-blue-800 border border-blue-300 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400 dark:border-blue-800";
  alertBox.setAttribute("role", "alert");

  const textContent = document.createElement("div");
  textContent.className = "text-sm font-medium";
  textContent.textContent = infoText;

  const closeBtn = document.createElement("button");
  closeBtn.type = "button";
  closeBtn.className = "ms-auto -mx-1.5 -my-1.5 bg-blue-50 text-blue-500 rounded-lg focus:ring-2 focus:ring-blue-400 p-1.5 hover:bg-blue-200 inline-flex items-center justify-center h-8 w-8 dark:bg-gray-800 dark:text-blue-400 dark:hover:bg-gray-700";
  closeBtn.innerHTML = `
    <span class="sr-only">Close</span>
    <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
    </svg>
  `;

  closeBtn.addEventListener("click", () => alertBox.remove());

  alertBox.appendChild(textContent);
  alertBox.appendChild(closeBtn);
  infoContainer.appendChild(alertBox);
}
