const productList = document.querySelector("#product-list");

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
          class="favorite-button"
          type="button"
          aria-label="Agregar ${product.nombre} a favoritos"
        >♡</button>
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
  productList.innerHTML = productListToRender.map(createProductCard).join("");
}

renderProducts(productos);
