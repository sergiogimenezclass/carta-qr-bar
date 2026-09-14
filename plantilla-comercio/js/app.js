/*
===============================================================================
LÓGICA JAVASCRIPT DE LA CARTA DIGITAL (app.js)
===============================================================================
En este archivo administramos:
1. La selección de elementos del DOM (HTML).
2. El filtrado de productos por categoría y por buscador de texto.
3. La interacción de Favoritos (marcar/desmarcar con el corazón).
4. La gestión del pedido (agregar productos, sumar cantidades, calcular total).
5. La apertura del modal con el desglose del pedido.
6. La persistencia en localStorage para que el pedido no se pierda al recargar.
===============================================================================
*/

// CLAVE PARA GUARDAR EL PEDIDO DEL CLIENTE EN LOCALSTORAGE
const LOCAL_STORAGE_ORDER_KEY = "cartas_pedido_cliente";

// --- SELECCIÓN DE ELEMENTOS DEL DOM ---
const productList = document.querySelector("#product-list");
const categoryButtons = document.querySelectorAll(".category-button");
const searchInput = document.querySelector("#search");

// Elementos de la barra flotante del pedido
const orderCount = document.querySelector("#order-count");
const orderSummary = document.querySelector("#order-summary");
const viewOrderButton = document.querySelector("#view-order");

// Elementos del Modal de Pedido
const orderModal = document.querySelector("#order-modal");
const btnCloseOrderModal = document.querySelector("#btn-close-order-modal");
const modalOrderItems = document.querySelector("#modal-order-items");
const modalOrderTotal = document.querySelector("#modal-order-total");
const btnClearOrder = document.querySelector("#btn-clear-order");
const btnConfirmOrder = document.querySelector("#btn-confirm-order");

// --- ESTADO GLOBAL EN MEMORIA ---
let selectedCategory = "Todo";
let searchTerm = "";
const favoriteProductIds = new Set();
const orderItems = new Map(); // Guarda productId -> cantidad

// ===========================================================================
// FUNCIONES AUXILIARES DE FORMATO
// ===========================================================================

/**
 * Convierte un número a formato de moneda argentina ($ 4.800)
 */
function formatPrice(price) {
  return `$${price.toLocaleString("es-AR")}`;
}

// ===========================================================================
// FUNCIONES DE PERSISTENCIA CON LOCALSTORAGE
// ===========================================================================

function loadOrderFromLocalStorage() {
  const savedData = localStorage.getItem(LOCAL_STORAGE_ORDER_KEY);
  if (savedData) {
    try {
      const parsedArray = JSON.parse(savedData);
      // Reconstruimos el Map desde el arreglo guardado
      parsedArray.forEach(([id, quantity]) => {
        orderItems.set(id, quantity);
      });
    } catch (e) {
      console.warn("No se pudo recuperar el pedido previo.");
    }
  }
}

function saveOrderToLocalStorage() {
  // Convertimos el Map a un arreglo de pares [id, cantidad] para guardarlo en JSON
  const arrayToSave = Array.from(orderItems.entries());
  localStorage.setItem(LOCAL_STORAGE_ORDER_KEY, JSON.stringify(arrayToSave));
}

// ===========================================================================
// RENDERIZADO DE TARJETAS DE PRODUCTO
// ===========================================================================

/**
 * Genera la plantilla HTML de una tarjeta de producto individual
 */
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

/**
 * Renderiza la lista completa de productos o el estado vacío si no hay coincidencias
 */
function renderProducts(productListToRender) {
  if (productListToRender.length === 0) {
    productList.innerHTML = `
      <div class="empty-state">
        <strong>No encontramos productos</strong>
        <p>Probá buscando con otra palabra o seleccioná otra categoría.</p>
      </div>
    `;
    return;
  }

  productList.innerHTML = productListToRender.map(createProductCard).join("");
}

/**
 * Aplica los filtros combinados (categoría seleccionada + término de búsqueda)
 */
function applyFilters() {
  const normalizedSearch = searchTerm.toLocaleLowerCase("es");
  const filteredProducts = productos.filter((product) => {
    const matchesCategory =
      selectedCategory === "Todo" || product.categoria === selectedCategory;
    const matchesSearch = product.nombre
      .toLocaleLowerCase("es")
      .includes(normalizedSearch);

    return matchesCategory && matchesSearch;
  });
  
  renderProducts(filteredProducts);
}

// ===========================================================================
// RESUMEN Y GESTIÓN DEL PEDIDO
// ===========================================================================

/**
 * Actualiza los contadores de la barra flotante inferior y habilita/deshabilita el botón
 */
function updateOrderSummary() {
  let itemCount = 0;
  let subtotal = 0;

  orderItems.forEach((quantity, productId) => {
    const product = productos.find((item) => item.id === productId);
    if (product) {
      itemCount += quantity;
      subtotal += product.precio * quantity;
    }
  });

  orderCount.textContent = itemCount;
  orderSummary.textContent =
    itemCount === 0
      ? "Todavía está vacío"
      : `${itemCount} ${itemCount === 1 ? "producto" : "productos"} · ${formatPrice(subtotal)}`;

  viewOrderButton.disabled = itemCount === 0;

  // Guardamos cambios en localStorage
  saveOrderToLocalStorage();
}

/**
 * Renderiza el listado detallado de productos dentro del modal de pedido
 */
function renderOrderModal() {
  let totalCalculated = 0;
  const rows = [];

  orderItems.forEach((quantity, productId) => {
    const product = productos.find((item) => item.id === productId);
    if (product) {
      const itemSubtotal = product.precio * quantity;
      totalCalculated += itemSubtotal;

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

  if (rows.length === 0) {
    modalOrderItems.innerHTML = `<li style="text-align:center; padding:16px; color:#7A6F68;">El pedido está vacío</li>`;
  } else {
    modalOrderItems.innerHTML = rows.join("");
  }

  modalOrderTotal.textContent = formatPrice(totalCalculated);
}

// ===========================================================================
// EVENT LISTENERS E INTERACTIVIDAD DE LA INTERFAZ
// ===========================================================================

// Cambio de categoría al hacer clic en los botones
categoryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectedCategory = button.dataset.category;
    categoryButtons.forEach((categoryButton) => {
      const isSelected = categoryButton.dataset.category === selectedCategory;
      categoryButton.classList.toggle("is-active", isSelected);
    });
    applyFilters();
  });
});

// Evento de búsqueda por texto en tiempo real
searchInput.addEventListener("input", () => {
  searchTerm = searchInput.value.trim();
  applyFilters();
});

// Delegación de eventos en la grilla de productos (Favoritos y Agregar)
productList.addEventListener("click", (event) => {
  // Acción de Favorito (Corazón)
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

  // Acción de Agregar al pedido
  const addButton = event.target.closest('[data-action="add"]');
  if (!addButton) return;

  const productId = Number(addButton.dataset.productId);
  const currentQuantity = orderItems.get(productId) || 0;
  orderItems.set(productId, currentQuantity + 1);
  updateOrderSummary();
});

// Abrir Modal de Pedido
viewOrderButton.addEventListener("click", () => {
  renderOrderModal();
  orderModal.classList.remove("is-hidden");
});

// Cerrar Modal de Pedido
btnCloseOrderModal.addEventListener("click", () => {
  orderModal.classList.add("is-hidden");
});

orderModal.addEventListener("click", (e) => {
  if (e.target === orderModal) orderModal.classList.add("is-hidden");
});

// Controles de cantidad (+ / -) dentro del modal
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

// Elementos del Modal de Confirmación de Éxito
const successModal = document.querySelector("#success-modal");
const btnCloseSuccessModal = document.querySelector("#btn-close-success-modal");

btnCloseSuccessModal.addEventListener("click", () => {
  successModal.classList.add("is-hidden");
});

successModal.addEventListener("click", (e) => {
  if (e.target === successModal) successModal.classList.add("is-hidden");
});

// Confirmar Pedido
btnConfirmOrder.addEventListener("click", () => {
  if (orderItems.size === 0) return;
  orderItems.clear();
  updateOrderSummary();
  orderModal.classList.add("is-hidden");
  successModal.classList.remove("is-hidden");
});

// --- INICIALIZACIÓN DE LA APLICACIÓN ---
loadOrderFromLocalStorage();
renderProducts(productos);
updateOrderSummary();
