/*
===============================================================================
LÓGICA JAVASCRIPT DEL DASHBOARD DOCENTE (100% LOCALSTORAGE)
===============================================================================
En este archivo administramos:
1. La lista de comercios del curso utilizando únicamente localStorage.
2. La actualización de la tarjeta seleccionada y sus estadísticas.
3. La generación automática del Código QR cuando hay una URL de Netlify.
4. El copiado de URL al portapapeles y la descarga de la imagen QR.
5. El alta, modificación y baja de comercios mediante un modal interactivo.
===============================================================================
*/

// CLAVE UTILIZADA EN LOCALSTORAGE PARA GUARDAR LOS COMERCIOS EN EL NAVEGADOR
const LOCAL_STORAGE_KEY = "cartas_comercios_cfp27";

// DATOS INICIALES DE PRUEBA (Se cargan la primera vez si localStorage está vacío)
const COMERCIOS_DEFAULT = [
  { id: 1, nombre: "Café Nómade", tipo: "Cafetería", netlifyName: "cafe-nomade-cfp27-2026-01", url: "https://cafe-nomade-cfp27-2026-01.netlify.app", estado: "en-construccion" },
  { id: 2, nombre: "Bruma Café", tipo: "Cafetería", netlifyName: "bruma-cafe-cfp27-2026-02", url: "https://bruma-cafe-cfp27-2026-02.netlify.app", estado: "en-construccion" },
  { id: 3, nombre: "Patio Central", tipo: "Bar", netlifyName: "patio-central-cfp27-2026-03", url: "https://patio-central-cfp27-2026-03.netlify.app", estado: "en-construccion" },
  { id: 4, nombre: "La Esquina Verde", tipo: "Restaurante", netlifyName: "esquina-verde-cfp27-2026-04", url: "https://esquina-verde-cfp27-2026-04.netlify.app", estado: "en-construccion" },
  { id: 5, nombre: "Tostado Club", tipo: "Cafetería", netlifyName: "tostado-club-cfp27-2026-05", url: "https://tostado-club-cfp27-2026-05.netlify.app", estado: "en-construccion" },
  { id: 6, nombre: "Bodega Urbana", tipo: "Bar", netlifyName: "bodega-urbana-cfp27-2026-06", url: "https://bodega-urbana-cfp27-2026-06.netlify.app", estado: "en-construccion" },
  { id: 7, nombre: "Miga y Miel", tipo: "Café y pastelería", netlifyName: "miga-miel-cfp27-2026-07", url: "https://miga-miel-cfp27-2026-07.netlify.app", estado: "en-construccion" },
  { id: 8, nombre: "Fuego Lento", tipo: "Restaurante", netlifyName: "fuego-lento-cfp27-2026-08", url: "https://fuego-lento-cfp27-2026-08.netlify.app", estado: "en-construccion" },
  { id: 9, nombre: "Estación Café", tipo: "Cafetería", netlifyName: "estacion-cafe-cfp27-2026-09", url: "https://estacion-cafe-cfp27-2026-09.netlify.app", estado: "en-construccion" },
  { id: 10, nombre: "Terraza Sur", tipo: "Bar y restaurante", netlifyName: "terraza-sur-cfp27-2026-10", url: "https://terraza-sur-cfp27-2026-10.netlify.app", estado: "en-construccion" }
];

// ESTADO GLOBAL EN MEMORIA
let comerciosList = [];
let selectedCommerceId = 1;

// --- REFERENCIAS A ELEMENTOS DEL DOM ---
const summaryTotal = document.querySelector("#summary-total");
const summaryPublished = document.querySelector("#summary-published");
const commerceSelect = document.querySelector("#comercio");
const commerceOlList = document.querySelector("#commerce-ol-list");
const commerceListCount = document.querySelector("#commerce-list-count");

// Tarjeta de Detalle
const cardStatusBadge = document.querySelector("#card-status-badge");
const cardStatusText = document.querySelector("#card-status-text");
const cardName = document.querySelector("#card-name");
const cardType = document.querySelector("#card-type");
const cardNumber = document.querySelector("#card-number");
const cardNetlifyName = document.querySelector("#card-netlify-name");
const cardUrlLink = document.querySelector("#card-url-link");

// Botones de Acción
const btnOpenSite = document.querySelector("#btn-open-site");
const btnCopyUrl = document.querySelector("#btn-copy-url");
const btnEditCommerce = document.querySelector("#btn-edit-commerce");
const btnDeleteCommerce = document.querySelector("#btn-delete-commerce");
const btnDownloadQr = document.querySelector("#btn-download-qr");
const btnOpenCreateModal = document.querySelector("#btn-open-create-modal");

// Panel QR
const qrPlaceholder = document.querySelector("#qr-placeholder");
const qrImage = document.querySelector("#qr-image");
const qrTitle = document.querySelector("#qr-title");
const qrDescription = document.querySelector("#qr-description");
const cardFooterStatus = document.querySelector("#card-footer-status");

// Elementos del Modal
const commerceModal = document.querySelector("#commerce-modal");
const modalTitle = document.querySelector("#modal-title");
const commerceForm = document.querySelector("#commerce-form");
const formCommerceId = document.querySelector("#form-commerce-id");
const formNombre = document.querySelector("#form-nombre");
const formTipo = document.querySelector("#form-tipo");
const formNetlifyName = document.querySelector("#form-netlify-name");
const formUrl = document.querySelector("#form-url");
const btnCloseModal = document.querySelector("#btn-close-modal");
const btnCancelModal = document.querySelector("#btn-cancel-modal");

// ===========================================================================
// FUNCIONES DE PERSISTENCIA CON LOCALSTORAGE
// ===========================================================================

/**
 * Carga los comercios guardados en la memoria local del navegador (localStorage).
 * Si no existen datos previos, inicializa con la lista por defecto y los guarda.
 */
function loadComercios() {
  const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
  
  if (localData) {
    // JSON.parse convierte la cadena de texto de localStorage a un arreglo de objetos JS
    comerciosList = JSON.parse(localData);
  } else {
    // Si es la primera vez, copiamos los comercios por defecto y guardamos
    comerciosList = [...COMERCIOS_DEFAULT];
    saveToLocalStorage();
  }

  // Aseguramos que el ID seleccionado exista dentro del arreglo
  if (comerciosList.length > 0) {
    const exists = comerciosList.some(c => c.id === selectedCommerceId);
    if (!exists) selectedCommerceId = comerciosList[0].id;
  }

  renderUI();
}

/**
 * Convierte la lista de comercios a texto con JSON.stringify y la guarda en localStorage.
 */
function saveToLocalStorage() {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(comerciosList));
}

// ===========================================================================
// FUNCIONES DE RENDERIZADO VISUAL
// ===========================================================================

function renderUI() {
  renderSummaryCounters();
  renderSelectOptions();
  renderList();
  renderSelectedCommerceCard();
}

function renderSummaryCounters() {
  const total = comerciosList.length;
  const publicados = comerciosList.filter(c => c.url && c.url.trim() !== "").length;
  
  summaryTotal.textContent = total;
  summaryPublished.textContent = publicados;
  commerceListCount.textContent = `${total} ${total === 1 ? 'lugar' : 'lugares'}`;
}

function renderSelectOptions() {
  commerceSelect.innerHTML = comerciosList.map(c => `
    <option value="${c.id}" ${c.id === selectedCommerceId ? 'selected' : ''}>
      ${c.nombre}
    </option>
  `).join("");
}

function renderList() {
  commerceOlList.innerHTML = comerciosList.map((c, index) => {
    const num = String(index + 1).padStart(2, "0");
    const isActive = c.id === selectedCommerceId ? 'class="is-active"' : '';
    return `
      <li data-id="${c.id}" ${isActive}>
        <span>${num}</span> ${c.nombre}
      </li>
    `;
  }).join("");
}

function renderSelectedCommerceCard() {
  const comercio = comerciosList.find(c => c.id === selectedCommerceId);

  if (!comercio) {
    cardName.textContent = "Sin comercio seleccionado";
    cardType.textContent = "-";
    return;
  }

  // Formatear el número de orden (ej. 01, 02)
  const index = comerciosList.findIndex(c => c.id === selectedCommerceId);
  cardNumber.textContent = String(index + 1).padStart(2, "0");

  cardName.textContent = comercio.nombre;
  cardType.textContent = comercio.tipo;
  cardNetlifyName.textContent = comercio.netlifyName || "No asignado";

  const hasUrl = comercio.url && comercio.url.trim() !== "";

  if (hasUrl) {
    // ESTADO PUBLICADO
    cardStatusBadge.className = "status status--published";
    cardStatusText.textContent = "Publicado";

    cardUrlLink.textContent = comercio.url;
    cardUrlLink.href = comercio.url;
    btnOpenSite.href = comercio.url;

    // Habilitar botones de acción
    btnOpenSite.classList.remove("is-disabled");
    btnOpenSite.removeAttribute("aria-disabled");
    btnCopyUrl.disabled = false;

    // Generar Código QR utilizando la API gratuita de código QR
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(comercio.url)}`;
    qrImage.src = qrUrl;
    qrImage.classList.remove("is-hidden");
    qrPlaceholder.classList.add("is-hidden");

    qrTitle.textContent = "Escaneá para abrir la carta";
    qrDescription.textContent = "El código QR está listo para ser escaneado por los clientes.";
    btnDownloadQr.classList.remove("is-hidden");
    cardFooterStatus.textContent = "El sitio web se encuentra publicado y operativo.";

  } else {
    // ESTADO EN CONSTRUCCIÓN
    cardStatusBadge.className = "status status--building";
    cardStatusText.textContent = "En construcción";

    cardUrlLink.textContent = "Sin dirección pública cargada";
    cardUrlLink.removeAttribute("href");
    btnOpenSite.removeAttribute("href");

    // Deshabilitar botones de acción
    btnOpenSite.classList.add("is-disabled");
    btnOpenSite.setAttribute("aria-disabled", "true");
    btnCopyUrl.disabled = true;

    // Ocultar QR
    qrImage.classList.add("is-hidden");
    qrPlaceholder.classList.remove("is-hidden");

    qrTitle.textContent = "Código QR no disponible";
    qrDescription.textContent = "Cargá la URL pública de Netlify para generar el código QR.";
    btnDownloadQr.classList.add("is-hidden");
    cardFooterStatus.textContent = "El sitio todavía no fue publicado en Netlify.";
  }
}

// ===========================================================================
// EVENTOS E INTERACTIVIDAD DE LA INTERFAZ
// ===========================================================================

// Cambiar selección desde el dropdown <select>
commerceSelect.addEventListener("change", (e) => {
  selectedCommerceId = Number(e.target.value);
  renderUI();
});

// Cambiar selección haciendo clic en un ítem de la lista <ol>
commerceOlList.addEventListener("click", (e) => {
  const li = e.target.closest("li");
  if (li && li.dataset.id) {
    selectedCommerceId = Number(li.dataset.id);
    renderUI();
  }
});

// Copiar la URL pública al portapapeles
btnCopyUrl.addEventListener("click", async () => {
  const comercio = comerciosList.find(c => c.id === selectedCommerceId);
  if (comercio && comercio.url) {
    try {
      await navigator.clipboard.writeText(comercio.url);
      const originalText = btnCopyUrl.textContent;
      btnCopyUrl.textContent = "¡Copiado!";
      setTimeout(() => { btnCopyUrl.textContent = originalText; }, 2000);
    } catch (err) {
      alert("No se pudo copiar la URL automáticamente.");
    }
  }
});

// Descargar la imagen del Código QR
btnDownloadQr.addEventListener("click", async () => {
  const comercio = comerciosList.find(c => c.id === selectedCommerceId);
  if (comercio && comercio.url) {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(comercio.url)}`;
    try {
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `qr-${comercio.nombre.toLowerCase().replace(/\s+/g, '-')}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (e) {
      window.open(qrUrl, "_blank");
    }
  }
});

// ===========================================================================
// GESTIÓN DEL MODAL (CREACIÓN, EDICIÓN Y ELIMINACIÓN CON LOCALSTORAGE)
// ===========================================================================

function openModal(isEditMode = false) {
  commerceModal.classList.remove("is-hidden");
  if (isEditMode) {
    const comercio = comerciosList.find(c => c.id === selectedCommerceId);
    if (!comercio) return;
    modalTitle.textContent = "Editar Comercio";
    formCommerceId.value = comercio.id;
    formNombre.value = comercio.nombre;
    formTipo.value = comercio.tipo;
    formNetlifyName.value = comercio.netlifyName || "";
    formUrl.value = comercio.url || "";
  } else {
    modalTitle.textContent = "Nuevo Comercio";
    commerceForm.reset();
    formCommerceId.value = "";
  }
}

function closeModal() {
  commerceModal.classList.add("is-hidden");
  commerceForm.reset();
}

btnOpenCreateModal.addEventListener("click", () => openModal(false));
btnEditCommerce.addEventListener("click", () => openModal(true));
btnCloseModal.addEventListener("click", closeModal);
btnCancelModal.addEventListener("click", closeModal);

// Cerrar modal haciendo clic fuera de la tarjeta modal
commerceModal.addEventListener("click", (e) => {
  if (e.target === commerceModal) closeModal();
});

// Enviar formulario (Crear o Editar un comercio)
commerceForm.addEventListener("submit", (e) => {
  e.preventDefault();
  
  const idValue = formCommerceId.value;
  const nuevoComercio = {
    nombre: formNombre.value.trim(),
    tipo: formTipo.value.trim(),
    netlifyName: formNetlifyName.value.trim(),
    url: formUrl.value.trim(),
    estado: formUrl.value.trim() !== "" ? "publicado" : "en-construccion"
  };

  if (!nuevoComercio.nombre || !nuevoComercio.tipo) {
    alert("Por favor completá el nombre y el tipo de comercio.");
    return;
  }

  if (idValue) {
    // EDICIÓN DE COMERCIO EXISTENTE
    const id = Number(idValue);
    const idx = comerciosList.findIndex(c => c.id === id);
    if (idx !== -1) {
      comerciosList[idx] = { id, ...nuevoComercio };
    }
  } else {
    // ALTA DE NUEVO COMERCIO
    const newId = comerciosList.length > 0 ? Math.max(...comerciosList.map(c => c.id)) + 1 : 1;
    comerciosList.push({ id: newId, ...nuevoComercio });
    selectedCommerceId = newId;
  }

  // Guardar cambios en localStorage y refrescar la vista
  saveToLocalStorage();
  closeModal();
  renderUI();
});

// Elementos del Modal de Eliminación
const deleteConfirmModal = document.querySelector("#delete-confirm-modal");
const deleteModalMessage = document.querySelector("#delete-modal-message");
const btnCloseDeleteModal = document.querySelector("#btn-close-delete-modal");
const btnCancelDelete = document.querySelector("#btn-cancel-delete");
const btnConfirmDelete = document.querySelector("#btn-confirm-delete");

function openDeleteModal() {
  const comercio = comerciosList.find(c => c.id === selectedCommerceId);
  if (!comercio) return;
  
  deleteModalMessage.textContent = `¿Estás seguro de que querés eliminar "${comercio.nombre}"? Esta acción no se puede deshacer.`;
  deleteConfirmModal.classList.remove("is-hidden");
}

function closeDeleteModal() {
  deleteConfirmModal.classList.add("is-hidden");
}

btnDeleteCommerce.addEventListener("click", openDeleteModal);
btnCloseDeleteModal.addEventListener("click", closeDeleteModal);
btnCancelDelete.addEventListener("click", closeDeleteModal);

deleteConfirmModal.addEventListener("click", (e) => {
  if (e.target === deleteConfirmModal) closeDeleteModal();
});

// Confirmación de eliminación en el modal propio
btnConfirmDelete.addEventListener("click", () => {
  comerciosList = comerciosList.filter(c => c.id !== selectedCommerceId);
  saveToLocalStorage();

  if (comerciosList.length > 0) {
    selectedCommerceId = comerciosList[0].id;
  }

  closeDeleteModal();
  renderUI();
});

// Cargar la aplicación al iniciar
loadComercios();
