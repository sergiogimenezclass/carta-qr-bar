# 🍽️ Carta Digital con Código QR: de la Maquetación al Pedido

¡Hola! En este proyecto vamos a construir una **Carta Digital Interactiva con Códigos QR** para restaurantes, cafeterías y bares.

La aplicación permite a los clientes consultar el menú desde su mesa en su celular, filtrar productos por categoría y preferencia alimentaria, marcar favoritos, armar su comanda en tiempo real con calculadora de propinas, solicitar asistencia (mozo/cuenta) y guardar el historial de consumos. Además, cuenta con un **Tablero de Administración (Dashboard / MenuCraft QR)** para gestionar locales, elegir estéticas visuales (Bistro, Urbano, Retro) y generar Códigos QR dinámicos.

El trabajo tiene dos caminos posibles:

- **Usar la maqueta ya resuelta** y concentrarse en la funcionalidad con JavaScript.
- **Construir la maqueta desde cero** con HTML y CSS, y después agregar JavaScript.

En ambos casos, la interactividad se programa con **baby steps**: una funcionalidad pequeña por vez, probada antes de pasar a la siguiente, con ayuda de inteligencia artificial.

---

## 🛠️ Las tres partes del proyecto

Una página web se puede dividir en tres capas:

```text
┌──────────────────────────────────────────────────────────┐
│ 1. HTML (index.html)  ──► Estructura y contenido         │
│ 2. CSS (theme-*.css)  ──► Presentación y estéticas       │
│ 3. JS (app.js)        ──► Interactividad y comportamiento│
└──────────────────────────────────────────────────────────┘
```

### HTML: la estructura (`plantilla-comercio/index.html`)

El archivo `index.html` contiene los elementos de la aplicación:

- La cabecera del comercio (Hero) con marca, estado y etiqueta de mesa.
- Botón de cambio de tema (modo noche/día) y asistencia rápida (Mozo, Cuenta, Historial).
- El buscador por texto en tiempo real (`#search`).
- Los botones de categorías y las etiquetas (chips) de preferencia alimentaria.
- La grilla interactiva de productos (`#product-list`).
- La barra flotante del pedido (`#sticky-order-bar`) con contador e importe subtotal.
- La ventana modal de detalle del pedido (`#order-modal`) con propina y botones de acción.
- El aviso flotante temporizado (`#toast-notice`).
- Las ventanas modales de comanda enviada (`#success-modal`) e historial (`#history-modal`).

### CSS: el diseño y las estéticas (`plantilla-comercio/css/`)

El proyecto incluye **3 hojas de estilos CSS independientes**:

1. **☕ Bistro Cálido (`theme-bistro.css`)**: Tonos terracota (`#A0432C`) y arena (`#FAF5EE`), esquinas redondeadas cálidas.
2. **🍸 Urbano Moderno (`theme-urbano.css`)**: Tonos verde esmeralda (`#0F4C3A`) y gris pizarra (`#E8ECEF`), bordes nítidos modernos.
3. **🍺 Retro Clásico (`theme-retro.css`)**: Tonos madera (`#3B2317`) y pergamino tostado (`#EADCC6`), estética bodegón vintage.

Las reglas de maquetación son fijas:

- **Sin variables de CSS:** los colores se escriben directos en código hexadecimal en cada regla.
- **El layout general con Grid:** estructura en grilla adaptable a pantallas móviles y computadoras.
- **Los componentes con Flexbox:** cabecera, tarjetas de productos, barra flotante y ventanas modales.
- **Unidades didácticas:** medidas exclusivas en píxeles (`px`) y porcentajes (`%`).

### JavaScript: la funcionalidad (`plantilla-comercio/js/app.js` y `productos.js`)

El archivo `app.js` permite:

- Leer el catálogo de productos desde `productos.js` y renderizar tarjetas HTML.
- Filtrar por categorías (Cafés, Bebidas frías, Platos, etc.).
- Buscar productos por texto en tiempo real.
- Mostrar aviso de "Sin resultados".
- Marcar/Desmarcar favoritos con el ícono de corazón.
- Gestionar el carrito de compras en memoria con `Map()`.
- Calcular subtotales y actualizar la barra flotante.
- Abrir la ventana modal del pedido y modificar cantidades (`+` / `-`).
- Seleccionar propina sugerida (0%, 10%, 15%, 20%).
- Notificar asistencia rápida (Mozo / Cuenta) con avisos temporizados (`setTimeout`).
- Confirmar comanda y guardar en el historial con `localStorage`.
- Alternar tema modo noche / modo día (`dark-theme`).

---

## 📁 Archivos del proyecto

```text
carta-cafe-bar/
├── index.html                  # Portal / Hub principal de bienvenida
│
├── plantilla-comercio/          # Plantilla base didáctica para estudiantes
│   ├── index.html              # Estructura semántica de la carta
│   ├── css/
│   │   ├── theme-bistro.css    # Estilo 1: Bistro Cálido (Terracota y Arena)
│   │   ├── theme-urbano.css    # Estilo 2: Urbano Moderno (Esmeralda y Pizarra)
│   │   ├── theme-retro.css     # Estilo 3: Retro Clásico (Madera y Pergamino)
│   │   └── styles.css          # Estilos base alternativos
│   ├── js/
│   │   ├── productos.js        # Base de datos de productos (Arreglo JS)
│   │   └── app.js              # Lógica interactiva de la carta
│   └── assets/
│       └── images/             # Imágenes de productos de muestra
│
├── comercios/                   # Carpetas físicas de locales de demostración
│   ├── cafe-nomade/            # Ejemplo 1 (Bistro Cálido)
│   ├── bruma-cafe/             # Ejemplo 2 (Urbano Moderno)
│   ├── patio-central/          # Ejemplo 3 (Retro Clásico)
│   └── [nombre-comercio]/      # Carpetas creadas por estudiantes
│
└── dashboard/                  # Tablero de Administración (MenuCraft QR)
    ├── index.html              # Interfaz del panel de gestión
    ├── css/
    │   └── styles.css          # Estilos del tablero (Craft Studio)
    └── js/
        └── comercios.js        # Lógica CRUD y generador de Códigos QR relativas
```

Los archivos están conectados desde `plantilla-comercio/index.html`:

```html
<link rel="stylesheet" href="css/theme-bistro.css" id="theme-stylesheet" />
```

```html
<script src="js/productos.js"></script>
<script src="js/app.js"></script>
```

---

## 🏷️ Convenciones de nombres

Para que JavaScript encuentre cada parte de la interfaz, la plantilla usa estos identificadores y clases:

| Elemento | Selector | Descripción |
| --- | --- | --- |
| Grilla de productos | `#product-list` | Contenedor donde se generan las tarjetas dinámicamente |
| Campo de búsqueda | `#search` | Input de texto para filtrar productos por nombre |
| Botones de categoría | `.category-button` | Botones de categoría (`data-category="..."`) |
| Chips de preferencia | `.preference-chip` | Filtro por preferencia (`data-preference="..."`) |
| Botón de favorito | `.favorite-button` | Ícono de corazón en cada tarjeta (`data-product-id`) |
| Botón agregar | `button[data-action="add"]` | Botón para incorporar producto al pedido |
| Barra flotante del pedido | `#sticky-order-bar` | Barra fijada al pie de la pantalla |
| Contador del pedido | `#order-count` | Número total de unidades seleccionadas |
| Subtotal del pedido | `#order-summary` | Importe acumulado en pesos |
| Botón ver pedido | `#view-order` | Botón que despliega el modal del pedido |
| Modal de detalle del pedido | `#order-modal` | Ventana modal de revisión del carrito |
| Lista de ítems en modal | `#modal-order-items` | Contenedor `<ul>` del desglose en modal |
| Total con propina | `#modal-order-total` | Importe final calculado en modal |
| Botones de propina | `.tip-button` | Botones de propina (`data-tip="0|10|15|20"`) |
| Botón confirmar pedido | `#btn-confirm-order` | Envía la comanda y guarda en el historial |
| Botones de asistencia | `#btn-call-waiter`, `#btn-request-check` | Llamar mozo y pedir cuenta |
| Aviso flotante (Toast) | `#toast-notice` | Cartel emergente temporizado con `setTimeout()` |
| Modal de historial | `#history-modal` | Ventana modal de comandas confirmadas |
| Lista de historial | `#history-list` | Contenedor de comandas guardadas |
| Botón modo noche / día | `#btn-theme-toggle` | Alterna la clase `.dark-theme` en `<body>` |

---

## 🎯 ¿Qué tienen que hacer los alumnos?

### Camino A: usar la maqueta

Si prefieren ir directo a la funcionalidad, abran la carpeta `plantilla-comercio/`, exploren `index.html` y pasen a la sección de prompts. Antes de cada prompt, lean el HTML y ubiquen los selectores de la tabla anterior.

### Camino B: construir la maqueta

En `index.html` y `css/styles.css`, resuelvan los siguientes puntos:

1. Crear la cabecera (Hero) con Flexbox.
2. Maquetar los controles y el buscador con CSS Grid.
3. Diseñar la grilla de productos adaptables con CSS Grid (`repeat(auto-fill, minmax(280px, 1fr))`).
4. Construir las tarjetas de producto con Flexbox vertical.
5. Anclar la barra flotante al pie con `position: fixed`.
6. Diseñar las ventanas modales con `position: fixed` y `display: flex`.

---

## 📋 Secuencia Didáctica de Prompts Progresivos

Copia y pega cada prompt progresivamente en la IA para ir construyendo la interactividad de tu carta digital paso a paso:

---

### Paso 1: Cargar y renderizar productos desde JavaScript
* **Objetivo**: Leer el arreglo `productos` de `productos.js` y generar las tarjetas HTML dinámicamente.
* **Elementos HTML**: `#product-list`.
* **Conceptos JS**: `querySelector`, `innerHTML`, `map()`, Template Literals.

```text
Crea una función renderProducts(lista) en app.js que tome la lista de productos de productos.js y genere la estructura HTML de cada tarjeta dentro del contenedor #product-list. Incluye imagen, título, descripción, precio formateado y botón de agregar.
```

---

### Paso 2: Filtrar productos por categoría
* **Objetivo**: Al hacer clic en los botones de categoría, mostrar solo los productos correspondientes.
* **Elementos HTML**: `.category-button`.
* **Conceptos JS**: `querySelectorAll`, `addEventListener('click')`, `filter()`.

```text
Agrega listeners de eventos click a los botones .category-button para que al presionar uno, se filtre la lista de productos por su propiedad categoria y se vuelva a ejecutar renderProducts(). Destaca el botón activo agregando la clase CSS is-active.
```

---

### Paso 3: Buscar productos por nombre
* **Objetivo**: Filtrar la lista de productos en tiempo real mientras el usuario escribe en el buscador.
* **Elementos HTML**: `#search`.
* **Conceptos JS**: `addEventListener('input')`, `toLowerCase()`, `includes()`.

```text
Agrega un listener al campo de texto #search para que al escribir, filtre los productos cuyo nombre contenga la palabra ingresada (ignorando mayúsculas y minúsculas) y refresque la vista.
```

---

### Paso 4: Mensaje de "Sin resultados"
* **Objetivo**: Mostrar un aviso cuando una búsqueda o filtro no devuelva ningún producto.
* **Elementos HTML**: `#product-list`.
* **Conceptos JS**: Evaluación de `array.length === 0`.

```text
En la función renderProducts(), si el arreglo filtrado está vacío, genera en #product-list un bloque HTML con la clase .empty-state informando que no se encontraron productos para esa búsqueda.
```

---

### Paso 5: Marcar y desmarcar productos como Favoritos
* **Objetivo**: Permitir al cliente hacer clic en el corazón de una tarjeta para agregarla o quitarla de sus favoritos.
* **Elementos HTML**: `.favorite-button`, `data-product-id`.
* **Conceptos JS**: Manejo de eventos delegados, estructura `Set()`, clase CSS `is-favorite`.

```text
Crea un conjunto favoriteProductIds = new Set(). Al hacer clic en el botón .favorite-button de una tarjeta, conmuta el ID del producto en el Set y alterna la clase CSS is-favorite para pintar el corazón de rojo.
```

---

### Paso 6: Agregar un producto al pedido
* **Objetivo**: Al hacer clic en "Agregar +", incorporar el producto al carrito de compras.
* **Elementos HTML**: `button[data-action="add"]`.
* **Conceptos JS**: Estructura de mapa `Map()`, actualización de cantidades.

```text
Crea un mapa orderItems = new Map() para almacenar productId -> cantidad. Al hacer clic en el botón de agregar de una tarjeta, incrementa la cantidad de ese producto en el mapa y llama a updateOrderSummary().
```

---

### Paso 7: Actualizar la cantidad total en la barra flotante
* **Objetivo**: Reflejar el número total de unidades sumadas al pedido en la barra flotante.
* **Elementos HTML**: `#order-count`.
* **Conceptos JS**: `textContent`, suma acumulada de valores del mapa.

```text
Crea una función updateOrderSummary() que calcule la suma total de unidades en orderItems y actualice el texto del elemento #order-count.
```

---

### Paso 8: Calcular el subtotal del pedido
* **Objetivo**: Multiplicar las cantidades por sus precios y mostrar el subtotal acumulado en pesos.
* **Elementos HTML**: `#order-summary`.
* **Conceptos JS**: `toLocaleString('es-AR')`, cálculo matemático.

```text
En updateOrderSummary(), calcula el total en pesos multiplicando la cantidad de cada producto por su precio. Muestra el resultado formateado como moneda argentina (ej. $14.100) en el elemento #order-summary.
```

---

### Paso 9: Habilitar o deshabilitar el botón "Ver pedido"
* **Objetivo**: El botón de la barra flotante solo debe estar activo cuando haya al menos un ítem agregado.
* **Elementos HTML**: `#view-order`.
* **Conceptos JS**: Propiedad `disabled`.

```text
En updateOrderSummary(), habilita el botón #view-order (disabled = false) solo cuando la cantidad total de ítems sea mayor a 0. De lo contrario, mantenelo deshabilitado.
```

---

### Paso 10: Mostrar productos agotados deshabilitados
* **Objetivo**: Identificar los productos con `disponible: false` y bloquear su compra.
* **Elementos HTML**: `.product-card`, `button:disabled`.
* **Conceptos JS**: Renderizado condicional.

```text
En el renderizado de la tarjeta, si el producto tiene disponible: false, agrega la clase CSS is-sold-out a la tarjeta y deshabilita su botón de agregar.
```

---

### Paso 11: Mostrar el detalle del pedido (Modal)
* **Objetivo**: Abrir una ventana modal con la lista de productos al presionar "Ver pedido".
* **Elementos HTML**: `#order-modal`, `#modal-order-items`, `#view-order`.
* **Conceptos JS**: Quitar clase `is-hidden`, iterar mapa de pedido.

```text
Al hacer clic en #view-order, remueve la clase is-hidden del modal #order-modal y genera la lista HTML de los productos agregados dentro de #modal-order-items con sus cantidades y subtotal.
```

---

### Paso 12: Aumentar o disminuir cantidades dentro del modal
* **Objetivo**: Permitir modificar cantidades `+` y `-` directamente en la ventana del pedido.
* **Elementos HTML**: `.btn-increase`, `.btn-decrease`.
* **Conceptos JS**: Eventos dentro del modal, actualización del mapa `orderItems`.

```text
Agrega botones + y - en cada fila del modal para modificar la cantidad del producto en el mapa orderItems sin cerrar la ventana, y refresca los totales del modal y de la barra flotante.
```

---

### Paso 13: Eliminar productos del pedido
* **Objetivo**: Si la cantidad de un ítem llega a 0 al restar, quitar el producto de la lista.
* **Elementos HTML**: `#modal-order-items`.
* **Conceptos JS**: `orderItems.delete(id)`.

```text
Cuando la cantidad de un producto llegue a 0 mediante el botón de resta, eliminalo del mapa orderItems con delete() y actualiza la vista del modal y la barra flotante.
```

---

### Paso 14: Vaciar todo el pedido
* **Objetivo**: Limpiar por completo todos los productos del carrito con un solo botón.
* **Elementos HTML**: `#btn-clear-order`.
* **Conceptos JS**: `orderItems.clear()`.

```text
Agrega un listener al botón #btn-clear-order para ejecutar orderItems.clear(), cerrar el modal agregando is-hidden y restablecer la barra flotante a cero.
```

---

### Paso 15: Guardar el pedido en el navegador (Persistencia)
* **Objetivo**: Mantener el pedido intacto si el cliente recarga la página.
* **Elementos HTML**: N/A.
* **Conceptos JS**: `localStorage.setItem()`, `localStorage.getItem()`, `JSON.stringify()`, `JSON.parse()`.

```text
Guarda el contenido de orderItems en localStorage bajo la clave cartas_pedido_cliente cada vez que sufra una modificación, y recupéralo automáticamente al iniciar la página en loadFromLocalStorage().
```

---

### Paso 16: Publicar la carta en Netlify o GitHub Pages
* **Objetivo**: Subir la carpeta del proyecto a un servidor para obtener una URL pública.
* **Flujo**:
  1. Ingresar a Netlify o GitHub Pages.
  2. Subir la carpeta del proyecto.
  3. Copiar la dirección pública generada (ej: `https://mi-comercio.netlify.app`).

---

### Paso 17: Registrar el comercio en el Tablero de Administración y generar el QR
* **Objetivo**: Cargar el comercio en el **Dashboard** (`dashboard/index.html`) para obtener su Código QR.
* **Flujo**:
  1. Abrir el **Dashboard**.
  2. Hacer clic en **"+ Nuevo comercio"**.
  3. Ingresar el nombre del local, tipo, estética elegida y la URL pública.
  4. Guardar los cambios.
* **Comprobación**: El comercio pasa a estado **Publicado** y el Código QR dinámico se genera de forma instantánea.

---

### Paso 18: Descargar e imprimir el Código QR para la mesa
* **Objetivo**: Obtener la imagen del Código QR para colocar en el local.
* **Flujo**:
  1. Seleccionar el comercio en el Dashboard.
  2. Hacer clic en **"Descargar QR"**.
  3. Imprimir la imagen `.png` descargada.

---

### Paso 19: Filtros Múltiples por Preferencia Alimentaria
* **Objetivo**: Filtrar productos combinando categoría, preferencia alimentaria (*Vegano*, *Vegetariano*, *Sin lactosa*) y búsqueda por texto.
* **Elementos HTML**: `.preference-chip`, `data-preference`.
* **Conceptos JS**: Evaluación con múltiples condiciones en `filter()`.

```text
Crea una función applyFilters() que filtre el arreglo de productos evaluando simultáneamente la categoría seleccionada, la preferencia alimentaria activa (.preference-chip) y el texto ingresado en el buscador.
```

---

### Paso 20: Calculadora de Propina Sugerida
* **Objetivo**: Seleccionar un porcentaje de propina (0%, 10%, 15%, 20%) en el modal y recalcular el total final.
* **Elementos HTML**: `.tip-button`, `#tip-detail-text`, `#modal-order-total`.
* **Conceptos JS**: Operaciones porcentuales.

```text
Agrega listeners a los botones .tip-button del modal para guardar la propina seleccionada (0, 10, 15 o 20%), calcular el monto adicional sobre el subtotal y actualizar el total final en #modal-order-total.
```

---

### Paso 21: Asistencia Rápida ("Llamar al mozo" y "Pedir la cuenta")
* **Objetivo**: Mostrar un aviso flotante temporizado al solicitar mozo o cuenta.
* **Elementos HTML**: `#btn-call-waiter`, `#btn-request-check`, `#toast-notice`.
* **Conceptos JS**: Temporizadores con `setTimeout()`.

```text
Crea una función showToastNotice(icono, mensaje) que muestre el contenedor #toast-notice removiendo la clase is-hidden durante 3.5 segundos utilizando setTimeout() para volver a ocultarlo automáticamente.
```

---

### Paso 22: Historial de Consumos de la Mesa
* **Objetivo**: Registrar cada comanda confirmada para consultar el consumo acumulado de la mesa.
* **Elementos HTML**: `#btn-confirm-order`, `#history-modal`, `#history-list`.
* **Conceptos JS**: Arreglos de objetos en `localStorage`, formateo de fecha con `Date()`.

```text
Al hacer clic en #btn-confirm-order, guarda un objeto con la hora actual, el total abonado y el detalle del pedido en un arreglo historyArray guardado en localStorage. Muestra este historial en el modal #history-modal.
```

---

### Paso 23: Conmutador de Modo Noche / Modo Día (Theme Toggle)
* **Objetivo**: Alternar entre tema claro y tema oscuro guardando la preferencia.
* **Elementos HTML**: `#btn-theme-toggle`, clase `.dark-theme` en `<body>`.
* **Conceptos JS**: `classList.toggle()`, persistencia en `localStorage`.

```text
Agrega un listener al botón #btn-theme-toggle para alternar la clase dark-theme en el body al hacer clic, cambiar el ícono del botón entre 🌙 y ☀️, y guardar la preferencia 'dark' o 'light' en localStorage.
```
