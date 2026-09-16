/*
===============================================================================
LÓGICA JAVASCRIPT DE LA CARTA DIGITAL (app.js)
===============================================================================
En este archivo administramos:
1. Selección de elementos del DOM.
2. Filtros múltiples (Buscador por texto + Categoría + Preferencia alimentaria).
3. Interacción de Favoritos (marcar/desmarcar con el corazón).
4. Gestión del pedido con cálculo de propina sugerida (0%, 10%, 15%, 20%).
5. Historial de comandas de la mesa guardadas en localStorage.
6. Avisos de asistencia rápida (Llamar al mozo / Pedir la cuenta con setTimeout).
7. Conmutador de Modo Noche / Modo Día guardado en localStorage.
===============================================================================
*/

// CLAVES DE LOCALSTORAGE
const LOCAL_STORAGE_ORDER_KEY = "cartas_pedido_cliente";
const LOCAL_STORAGE_HISTORY_KEY = "cartas_historial_mesa";
const LOCAL_STORAGE_THEME_KEY = "cartas_theme_pref";
const LOCAL_STORAGE_STYLE_KEY = "cartas_estilo_pref";

// --- SELECCIÓN DE ELEMENTOS DEL DOM ---
const productList = document.querySelector("#product-list");
const categoryButtons = document.querySelectorAll(".category-button");
const preferenceChips = document.querySelectorAll(".preference-chip");
const searchInput = document.querySelector("#search");

// Asistencia y Tema
const btnThemeToggle = document.querySelector("#btn-theme-toggle");
const btnCallWaiter = document.querySelector("#btn-call-waiter");
const btnRequestCheck = document.querySelector("#btn-request-check");
const btnOpenHistory = document.querySelector("#btn-open-history");
const toastNotice = document.querySelector("#toast-notice");
const toastNoticeIcon = document.querySelector("#toast-notice-icon");
const toastNoticeMsg = document.querySelector("#toast-notice-msg");

// Elementos de la barra flotante del pedido
const orderCount = document.querySelector("#order-count");
const orderSummary = document.querySelector("#order-summary");
const viewOrderButton = document.querySelector("#view-order");

// Elementos del Modal de Pedido
const orderModal = document.querySelector("#order-modal");
const btnCloseOrderModal = document.querySelector("#btn-close-order-modal");
const modalOrderItems = document.querySelector("#modal-order-items");
const modalOrderTotal = document.querySelector("#modal-order-total");
const tipDetailText = document.querySelector("#tip-detail-text");
const tipButtons = document.querySelectorAll(".tip-button");
const btnClearOrder = document.querySelector("#btn-clear-order");
const btnConfirmOrder = document.querySelector("#btn-confirm-order");

// Elementos del Modal de Éxito
const successModal = document.querySelector("#success-modal");
const btnCloseSuccessModal = document.querySelector("#btn-close-success-modal");

// Elementos del Modal de Historial
const historyModal = document.querySelector("#history-modal");
const historyList = document.querySelector("#history-list");
const btnCloseHistoryModal = document.querySelector("#btn-close-history-modal");
const btnCloseHistory = document.querySelector("#btn-close-history");

// --- ESTADO GLOBAL EN MEMORIA ---
let selectedCategory = "Todo";
let selectedPreference = "Todas";
let searchTerm = "";
let selectedTipPercent = 0; // 0, 10, 15, 20
let toastTimeoutId = null;

const favoriteProductIds = new Set();
const orderItems = new Map(); // Guarda productId -> cantidad
let historyArray = []; // Arreglo de comandas confirmadas

// ===========================================================================
// FUNCIONES AUXILIARES DE FORMATO Y PERSISTENCIA
// ===========================================================================

function formatPrice(price) {
  return `$${price.toLocaleString("es-AR")}`;
}

function loadFromLocalStorage() {
  // 1. Cargar Pedido previo
  const savedOrder = localStorage.getItem(LOCAL_STORAGE_ORDER_KEY);
  if (savedOrder) {
    try {
      const parsedArray = JSON.parse(savedOrder);
      parsedArray.forEach(([id, quantity]) => {
        orderItems.set(id, quantity);
      });
    } catch (e) {
      console.warn("No se pudo recuperar el pedido previo.");
    }
  }

  // 2. Cargar Historial previo
  const savedHistory = localStorage.getItem(LOCAL_STORAGE_HISTORY_KEY);
  if (savedHistory) {
    try {
      historyArray = JSON.parse(savedHistory);
    } catch (e) {
      historyArray = [];
    }
  }

  // 3. Cargar Preferencia de Tema (Oscuro / Claro)
  const savedTheme = localStorage.getItem(LOCAL_STORAGE_THEME_KEY);
  if (savedTheme === "dark") {
    document.body.classList.add("dark-theme");
    btnThemeToggle.textContent = "☀️";
  } else {
    document.body.classList.remove("dark-theme");
    btnThemeToggle.textContent = "🌙";
  }

  // 4. Cargar Hoja de Estilo Visual (bistro, urbano, retro)
  initVisualTheme();
}

function initVisualTheme() {
  const urlParams = new URLSearchParams(window.location.search);
  const estiloUrl = urlParams.get("estilo");
  const validStyles = ["bistro", "urbano", "retro"];

  const themeStylesheet = document.querySelector("#theme-stylesheet");
  if (!themeStylesheet) return;

  // Solo si viene un parámetro explícito en la URL (?estilo=urbano) se sobrescribe el CSS
  if (estiloUrl && validStyles.includes(estiloUrl.toLowerCase())) {
    const estilo = estiloUrl.toLowerCase();
    themeStylesheet.href = `css/theme-${estilo}.css`;
    localStorage.setItem(LOCAL_STORAGE_STYLE_KEY, estilo);
  }
}

function saveOrderToLocalStorage() {
  const arrayToSave = Array.from(orderItems.entries());
  localStorage.setItem(LOCAL_STORAGE_ORDER_KEY, JSON.stringify(arrayToSave));
}

function saveHistoryToLocalStorage() {
  localStorage.setItem(LOCAL_STORAGE_HISTORY_KEY, JSON.stringify(historyArray));
}

// ===========================================================================
// MODO NOCHE / DÍA (THEME TOGGLE)
// ===========================================================================

btnThemeToggle.addEventListener("click", () => {
  const isDark = document.body.classList.toggle("dark-theme");
  btnThemeToggle.textContent = isDark ? "☀️" : "🌙";
  localStorage.setItem(LOCAL_STORAGE_THEME_KEY, isDark ? "dark" : "light");
});

// ===========================================================================
// ASISTENCIA RÁPIDA (LLAMAR AL MOZO / PEDIR CUENTA) CON SETTIMEOUT
// ===========================================================================

function showToastNotice(icon, message) {
  if (toastTimeoutId) clearTimeout(toastTimeoutId);
  
  toastNoticeIcon.textContent = icon;
  toastNoticeMsg.textContent = message;
  toastNotice.classList.remove("is-hidden");

  // El aviso desaparece automáticamente después de 3.5 segundos
  toastTimeoutId = setTimeout(() => {
    toastNotice.classList.add("is-hidden");
  }, 3500);
}

btnCallWaiter.addEventListener("click", () => {
  showToastNotice("🔔", "El mozo ha sido notificado a la Mesa 04");
});

btnRequestCheck.addEventListener("click", () => {
  showToastNotice("💳", "Se solicitó la cuenta para la Mesa 04");
});

// ===========================================================================
// RENDERIZADO Y FILTROS MÚLTIPLES DE PRODUCTOS
// ===========================================================================

function createProductCard(product) {
  const tag = product.destacado
    ? `<span class="product-tag">${product.destacado}</span>`
    : "";

  const availabilityClass = product.disponible ? "" : " is-sold-out";
  const buttonText = product.disponible ? "Agregar" : "Agotado";
  const buttonDisabled = product.disponible ? "" : "disabled";
  const isFavorite = favoriteProductIds.has(product.id);

  return `
    <article class="product-card${availabilityClass}" data-product-id="${product.id}">
      <div
        class="product-image"
        role="img"
        aria-label="${product.nombre}"
        style="background-image: url('assets/images/${product.imagen}')"
      >
        ${tag}
        <button
          class="favorite-button${isFavorite ? " is-favorite" : ""}"
          type="button"
          data-action="favorite"
          data-product-id="${product.id}"
          aria-label="${isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}"
        >${isFavorite ? "♥" : "♡"}</button>
      </div>
      <div class="product-content">
        <div class="product-title-row">
          <h3>${product.nombre}</h3>
          <strong>${formatPrice(product.precio)}</strong>
        </div>
        <p>${product.descripcion}</p>
        <div class="product-footer">
          <span>${product.preferencia}</span>
          <button
            class="button button--secondary"
            type="button"
            data-action="add"
            data-product-id="${product.id}"
            ${buttonDisabled}
          >
            ${buttonText}${product.disponible ? " <b>+</b>" : ""}
          </button>
        </div>
      </div>
    </article>
  `;
}

function renderProducts(productListToRender) {
  if (productListToRender.length === 0) {
    productList.innerHTML = `
      <div class="empty-state">
        <strong>No encontramos productos</strong>
        <p>Probá cambiando los filtros de categoría o preferencia alimentaria.</p>
      </div>
    `;
    return;
  }

  productList.innerHTML = productListToRender.map(createProductCard).join("");
}

/**
 * FILTROS MÚLTIPLES: Evalúa Categoría + Búsqueda por Texto + Preferencia Alimentaria
 */
function applyFilters() {
  const normalizedSearch = searchTerm.toLocaleLowerCase("es");
  
  const filteredProducts = productos.filter((product) => {
    const matchesCategory =
      selectedCategory === "Todo" || product.categoria === selectedCategory;
      
    const matchesPreference =
      selectedPreference === "Todas" || product.preferencia === selectedPreference;
      
    const matchesSearch = product.nombre
      .toLocaleLowerCase("es")
      .includes(normalizedSearch);

    return matchesCategory && matchesPreference && matchesSearch;
  });
  
  renderProducts(filteredProducts);
}

// ===========================================================================
// GESTIÓN DEL PEDIDO Y CÁLCULO DE PROPINAS
// ===========================================================================

function calculateOrderTotals() {
  let subtotal = 0;
  let itemCount = 0;

  orderItems.forEach((quantity, productId) => {
    const product = productos.find((item) => item.id === productId);
    if (product) {
      itemCount += quantity;
      subtotal += product.precio * quantity;
    }
  });

  const tipAmount = Math.round(subtotal * (selectedTipPercent / 100));
  const finalTotal = subtotal + tipAmount;

  return { itemCount, subtotal, tipAmount, finalTotal };
}

function updateOrderSummary() {
  const { itemCount, subtotal } = calculateOrderTotals();

  orderCount.textContent = itemCount;
  orderSummary.textContent =
    itemCount === 0
      ? "Todavía está vacío"
      : `${itemCount} ${itemCount === 1 ? "producto" : "productos"} · ${formatPrice(subtotal)}`;

  viewOrderButton.disabled = itemCount === 0;

  saveOrderToLocalStorage();
}

function renderOrderModal() {
  const { subtotal, tipAmount, finalTotal } = calculateOrderTotals();
  const rows = [];

  orderItems.forEach((quantity, productId) => {
    const product = productos.find((item) => item.id === productId);
    if (product) {
      rows.push(`
        <li class="order-item-row">
          <div>
            <strong>${product.nombre}</strong>
            <small style="display:block; color:#7A6F68;">${formatPrice(product.precio)} c/u</small>
          </div>
          <div class="quantity-controls">
            <button type="button" data-action="decrease" data-product-id="${product.id}">-</button>
            <span><strong>${quantity}</strong></span>
            <button type="button" data-action="increase" data-product-id="${product.id}">+</button>
          </div>
        </li>
      `);
    }
  });

  modalOrderItems.innerHTML = rows.length === 0
    ? `<li style="text-align:center; padding:16px; color:#7A6F68;">El pedido está vacío</li>`
    : rows.join("");

  if (selectedTipPercent > 0) {
    tipDetailText.textContent = `Subtotal: ${formatPrice(subtotal)} + Propina (${selectedTipPercent}%): ${formatPrice(tipAmount)}`;
  } else {
    tipDetailText.textContent = "Sin propina agregada";
  }

  modalOrderTotal.textContent = formatPrice(finalTotal);
}

// ===========================================================================
// HISTORIAL DE CONSUMOS DE LA MESA
// ===========================================================================

function renderHistoryModal() {
  if (historyArray.length === 0) {
    historyList.innerHTML = `<p style="text-align:center; color:#7A6F68; padding:20px;">No realizaste pedidos previos en esta mesa.</p>`;
    return;
  }

  historyList.innerHTML = historyArray.map((order, index) => `
    <div class="history-card">
      <div class="history-card-header">
        <strong>Comanda #${historyArray.length - index}</strong>
        <small>${order.hora}</small>
      </div>
      <div style="font-size:14px; margin-bottom:6px;">
        ${order.items.map(i => `${i.cantidad}x ${i.nombre}`).join(", ")}
      </div>
      <div style="display:flex; justify-content:space-between; font-size:13px; font-weight:700;">
        <span>Total abonado</span>
        <span style="color:#C86D51;">${formatPrice(order.total)}</span>
      </div>
    </div>
  `).join("");
}

// ===========================================================================
// EVENT LISTENERS E INTERACTIVIDAD
// ===========================================================================

// Cambio de categoría
categoryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectedCategory = button.dataset.category;
    categoryButtons.forEach(btn => btn.classList.toggle("is-active", btn === button));
    applyFilters();
  });
});

// Cambio de preferencia alimentaria (Chips)
preferenceChips.forEach((chip) => {
  chip.addEventListener("click", () => {
    selectedPreference = chip.dataset.preference;
    preferenceChips.forEach(c => c.classList.toggle("is-active", c === chip));
    applyFilters();
  });
});

// Búsqueda en tiempo real
searchInput.addEventListener("input", () => {
  searchTerm = searchInput.value.trim();
  applyFilters();
});

// Selección de Propina
tipButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    selectedTipPercent = Number(btn.dataset.tip);
    tipButtons.forEach(b => b.classList.toggle("is-active", b === btn));
    renderOrderModal();
  });
});

// Delegación de eventos en grilla (Favoritos y Agregar)
productList.addEventListener("click", (event) => {
  const favoriteButton = event.target.closest('[data-action="favorite"]');
  if (favoriteButton) {
    const productId = Number(favoriteButton.dataset.productId);
    if (favoriteProductIds.has(productId)) {
      favoriteProductIds.delete(productId);
    } else {
      favoriteProductIds.add(productId);
    }
    applyFilters();
    return;
  }

  const addButton = event.target.closest('[data-action="add"]');
  if (!addButton) return;

  const productId = Number(addButton.dataset.productId);
  const currentQuantity = orderItems.get(productId) || 0;
  orderItems.set(productId, currentQuantity + 1);
  updateOrderSummary();
});

// Abrir y Cerrar Modal de Pedido
viewOrderButton.addEventListener("click", () => {
  renderOrderModal();
  orderModal.classList.remove("is-hidden");
});

btnCloseOrderModal.addEventListener("click", () => {
  orderModal.classList.add("is-hidden");
});

// Controles de cantidad dentro del modal
modalOrderItems.addEventListener("click", (event) => {
  const increaseBtn = event.target.closest('[data-action="increase"]');
  if (increaseBtn) {
    const productId = Number(increaseBtn.dataset.productId);
    const qty = orderItems.get(productId) || 0;
    orderItems.set(productId, qty + 1);
    updateOrderSummary();
    renderOrderModal();
    return;
  }

  const decreaseBtn = event.target.closest('[data-action="decrease"]');
  if (decreaseBtn) {
    const productId = Number(decreaseBtn.dataset.productId);
    const qty = orderItems.get(productId) || 0;
    if (qty > 1) {
      orderItems.set(productId, qty - 1);
    } else {
      orderItems.delete(productId);
    }
    updateOrderSummary();
    renderOrderModal();
    if (orderItems.size === 0) {
      orderModal.classList.add("is-hidden");
    }
    return;
  }
});

// Vaciar Pedido
btnClearOrder.addEventListener("click", () => {
  orderItems.clear();
  updateOrderSummary();
  orderModal.classList.add("is-hidden");
});

// Confirmar Pedido y Guardar en Historial
btnConfirmOrder.addEventListener("click", () => {
  if (orderItems.size === 0) return;

  const { finalTotal } = calculateOrderTotals();
  const now = new Date();
  const hora = now.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });

  // Crear registro para el historial de la mesa
  const itemsComanda = [];
  orderItems.forEach((qty, id) => {
    const prod = productos.find(p => p.id === id);
    if (prod) itemsComanda.push({ nombre: prod.nombre, cantidad: qty });
  });

  historyArray.unshift({
    hora,
    items: itemsComanda,
    total: finalTotal
  });

  saveHistoryToLocalStorage();

  // Limpiar pedido actual
  orderItems.clear();
  updateOrderSummary();
  orderModal.classList.add("is-hidden");

  // Mostrar modal de éxito
  successModal.classList.remove("is-hidden");
});

// Modal de Éxito
btnCloseSuccessModal.addEventListener("click", () => {
  successModal.classList.add("is-hidden");
});

// Modal de Historial
btnOpenHistory.addEventListener("click", () => {
  renderHistoryModal();
  historyModal.classList.remove("is-hidden");
});

btnCloseHistoryModal.addEventListener("click", () => {
  historyModal.classList.add("is-hidden");
});

btnCloseHistory.addEventListener("click", () => {
  historyModal.classList.add("is-hidden");
});

// --- INICIALIZACIÓN ---
loadFromLocalStorage();
renderProducts(productos);
updateOrderSummary();
