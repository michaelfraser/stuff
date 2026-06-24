import { FALLBACK_IMAGE } from './store';

export function createBinCardHtml(bin) {
  const displayImg = bin.image?.includes("googleusercontent.com") ? bin.image : FALLBACK_IMAGE;
  const tagsHtml = bin.contents
    .map(item => `<span class="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-md border border-gray-200">${item}</span>`)
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
}