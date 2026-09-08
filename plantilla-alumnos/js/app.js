const productList = document.querySelector("#product-list");
const categoryButtons = document.querySelectorAll(".category-button");
const searchInput = document.querySelector("#search");
let selectedCategory = "Todo";
let searchTerm = "";
const favoriteProductIds = new Set();

function formatPrice(price) {
  return `$${price.toLocaleString("es-AR")}`;
}

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
          aria-label="${isFavorite ? "Quitar" : "Agregar"} ${product.nombre} ${isFavorite ? "de" : "a"} favoritos"
          aria-pressed="${isFavorite}"
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
          <button type="button" ${buttonDisabled}>
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
        <p>Probá con otra palabra o elegí una categoría diferente.</p>
      </div>
    `;
    return;
  }

  productList.innerHTML = productListToRender.map(createProductCard).join("");
}

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

searchInput.addEventListener("input", () => {
  searchTerm = searchInput.value.trim();
  applyFilters();
});

productList.addEventListener("click", (event) => {
  const favoriteButton = event.target.closest('[data-action="favorite"]');
  if (!favoriteButton) return;

  const productId = Number(favoriteButton.dataset.productId);
  if (favoriteProductIds.has(productId)) {
    favoriteProductIds.delete(productId);
  } else {
    favoriteProductIds.add(productId);
  }

  applyFilters();
});

renderProducts(productos);
