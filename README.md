# 🍽️ Cartas Digitales con Código QR para Restaurantes y Bares

> **CFP N° 27 · Diseño Web**  
> *Proyecto integrador con metodología de prompts progresivos asistidos por Inteligencia Artificial.*

---

## 🎯 Presentación del Proyecto

El objetivo de este proyecto es construir **cartas digitales interactivas para restaurantes, cafeterías y bares**. 

Cada grupo de alumnos recibe o crea su propio comercio y desarrolla una carta accesible desde celulares. Una vez terminada y publicada en la web, la carta genera un **Código QR dinámico** que los clientes pueden escanear directamente desde las mesas del local.

```text
    ┌──────────────────┐           ┌──────────────────┐           ┌──────────────────┐
    │  1. Maquetado    │   ─────►  │  2. Publicación  │   ─────►  │ 3. Código QR     │
    │  HTML + CSS + JS │           │  Sitio en Netlify│           │ En mesa cliente  │
    └──────────────────┘           └──────────────────┘           └──────────────────┘
```

---

## 📚 Enfoque Pedagógico: Prompts Progresivos

En el desarrollo web profesional, dividimos las responsabilidades en tres capas:

1. **HTML (Estructura)**: La semántica, secciones y contenido del sitio.
2. **CSS (Presentación)**: El diseño visual, la disposición de elementos y la adaptabilidad a celulares.
3. **JavaScript (Comportamiento)**: La interactividad, filtros, buscadores y la gestión del pedido.

Como los alumnos se encuentran en etapa de aprendizaje de JavaScript, las funcionalidades se incorporan de manera gradual mediante **prompts pequeños e independientes ("baby steps")**. En lugar de pedir la aplicación entera de una vez, se agrega y comprueba **una sola funcionalidad por paso**.

---

## 🛠️ Reglas Didácticas para el Código CSS

El proyecto debe seguir estrictamente estas convenciones de maquetación:

* **Sin variables CSS para los colores**: Escribir directamente el código hexadecimal (ej. `#C86D51`, `#2C221E`) en cada regla CSS.
* **Layout General con CSS Grid**: La estructura principal de la página se maqueta mediante `display: grid`.
* **Componentes con Flexbox**: Tarjetas, botones, cabeceras y controles internos se organizan mediante `display: flex`.
* **Unidades de Medida**: Utilizar únicamente píxeles (`px`) y porcentajes (`%`). *(Evitar `rem`, `em`, `vh`, `vw` y `clamp`)*.
* **Comentarios Didácticos**: Todo el código debe incluir explicaciones breves sobre los bloques y propiedades importantes.

---

## 🛤️ Dos Caminos Posibles para los Alumnos

Los alumnos pueden realizar la actividad siguiendo cualquiera de estas dos modalidades según su ritmo de aprendizaje:

### 🔹 Camino A: Usar la maqueta resuelta
Los alumnos parten de la maqueta completa en `plantilla-alumnos/` (HTML y CSS terminados) y se concentran en aprender a conectar los datos e incorporar las funcionalidades de JavaScript paso a paso.

### 🔹 Camino B: Construir la maqueta desde cero
Los alumnos escriben el HTML semántico y los estilos CSS desde cero, aplicando la normativa de Grid, Flexbox y medidas. Luego incorporan la interactividad con JavaScript mediante los prompts.

---

## 📂 Estructura del Repositorio

```text
carta-cafe-bar/
├── plantilla-alumnos/          # Proyecto principal de la carta para estudiantes
│   ├── index.html              # Estructura semántica de la carta
│   ├── css/
│   │   └── styles.css          # Estilos visuales de la carta
│   ├── js/
│   │   ├── productos.js        # Listado de productos (Base de datos JS)
│   │   └── app.js              # Lógica interactiva de la carta
│   └── assets/
│       └── images/             # Imágenes de productos de ejemplo
│
└── dashboard/                  # Panel docente para gestión de comercios y QR
    ├── index.html              # Interfaz del tablero docente
    ├── css/
    │   └── styles.css          # Estilos del panel (Tema Craft Studio)
    └── js/
        └── comercios.js        # Lógica CRUD y generador de QR (100% localStorage)
```

---

## 📋 Secuencia Didáctica de Prompts Progresivos

A continuación se presenta la secuencia guiada de **18 prompts** que los alumnos deben ir ejecutando progresivamente en la IA para construir su aplicación:

---

### Paso 1: Cargar y renderizar productos desde JavaScript
* **Objetivo**: Leer el arreglo `productos` desde `productos.js` y generar las tarjetas HTML dinámicamente.
* **Elementos HTML**: `#product-list`.
* **Conceptos JS**: `querySelector`, `innerHTML`, `map()`, Template Literals.
* **Prompt**: *"Crea una función en `app.js` que tome la lista de productos de `productos.js` y genere la estructura HTML de cada tarjeta dentro del contenedor `#product-list`."*
* **Comprobación**: Al abrir la página, deben verse los productos cargados desde el archivo JS y no código estático.

---

### Paso 2: Filtrar productos por categoría
* **Objetivo**: Al hacer clic en los botones de categoría (Cafés, Bebidas frías, etc.), mostrar solo los productos correspondientes.
* **Elementos HTML**: `.category-button`.
* **Conceptos JS**: `querySelectorAll`, `addEventListener('click')`, `filter()`.
* **Prompt**: *"Agrega un evento 'click' a los botones de categoría para que al presionar uno, se filtren los productos por su propiedad `categoria` y se vuelva a renderizar la lista."*
* **Comprobación**: Al hacer clic en "Bebidas frías", solo deben aparecer las bebidas frías.

---

### Paso 3: Buscar productos por nombre
* **Objetivo**: Filtrar la lista de productos en tiempo real mientras el usuario escribe en el campo de búsqueda.
* **Elementos HTML**: `#search`.
* **Conceptos JS**: `addEventListener('input')`, `toLowerCase()`, `includes()`.
* **Prompt**: *"Agrega un listener al campo de texto `#search` para filtrar los productos cuyo nombre contenga la palabra ingresada por el usuario (sin importar mayúsculas/minúsculas)."*
* **Comprobación**: Al escribir "tostón", la pantalla debe actualizarse mostrando solo los tostones.

---

### Paso 4: Mensaje de "Sin resultados"
* **Objetivo**: Mostrar un aviso claro cuando una búsqueda o filtro no devuelva ningún producto.
* **Elementos HTML**: `#product-list`.
* **Conceptos JS**: Evaluación de `array.length === 0`.
* **Prompt**: *"Si el arreglo de productos filtrados está vacío, muestra un contenedor en `#product-list` con un mensaje indicando que no se encontraron productos."*
* **Comprobación**: Escribir algo inexistente (ej: "pizza") y verificar que aparece el mensaje de "No encontramos productos".

---

### Paso 5: Marcar y desmarcar productos como Favoritos
* **Objetivo**: Permitir al cliente hacer clic en el corazón de una tarjeta para agregarla o quitarla de sus favoritos.
* **Elementos HTML**: `.favorite-button`, atributo `data-product-id`.
* **Conceptos JS**: Manejo de eventos delegados, estructura `Set()`, clase CSS `is-favorite`.
* **Prompt**: *"Permite que al hacer clic en el botón de favoritos de una tarjeta, cambie el ícono del corazón y la clase CSS `is-favorite` para destacar ese producto."*
* **Comprobación**: El corazón debe alternar entre lleno y vacío al hacer clic.

---

### Paso 6: Agregar un producto al pedido
* **Objetivo**: Al presionar "Agregar +", incorporar el producto al mapa o carrito de compra.
* **Elementos HTML**: `button[data-action="add"]`.
* **Conceptos JS**: `Map()`, actualización de contadores.
* **Prompt**: *"Crea una estructura para almacenar los ítems seleccionados. Al hacer clic en 'Agregar', incrementa la cantidad de ese producto en el pedido."*
* **Comprobación**: El contador de la barra inferior debe aumentar.

---

### Paso 7: Actualizar la cantidad total en la barra flotante
* **Objetivo**: Reflejar el número total de unidades sumadas al pedido en la barra inferior.
* **Elementos HTML**: `#order-count`.
* **Conceptos JS**: `textContent`, suma acumulada.
* **Prompt**: *"Actualiza el número en `#order-count` para mostrar la suma total de ítems agregados al pedido."*
* **Comprobación**: Si se agregan 2 cafés y 1 tostón, el contador debe indicar "3".

---

### Paso 8: Calcular el subtotal del pedido
* **Objetivo**: Multiplicar la cantidad de cada producto por su precio y mostrar el total acumulado en pesos.
* **Elementos HTML**: `#order-summary`.
* **Conceptos JS**: `toLocaleString('es-AR')`, cálculo matemático.
* **Prompt**: *"Calcula el total a pagar multiplicando las cantidades por sus precios y muestralo en el elemento `#order-summary` formateado en moneda argentina."*
* **Comprobación**: El subtotal debe reflejar el importe exacto acumulado (ej: "$14.100").

---

### Paso 9: Deshabilitar o habilitar el botón "Ver pedido"
* **Objetivo**: El botón de la barra flotante solo debe estar activo cuando haya al menos un producto en el pedido.
* **Elementos HTML**: `#view-order`.
* **Conceptos JS**: Propiedad `disabled`.
* **Prompt**: *"Habilita el botón `#view-order` solo cuando la cantidad total de ítems sea mayor a 0; de lo contrario, mantenelo deshabilitado."*
* **Comprobación**: El botón inicia desactivado y se activa apenas se agrega el primer ítem.

---

### Paso 10: Mostrar productos agotados sin botón de agregar
* **Objetivo**: Identificar los productos con `disponible: false` y deshabilitar su botón.
* **Elementos HTML**: `.product-card`, `button:disabled`.
* **Conceptos JS**: Renderizado condicional.
* **Prompt**: *"En el renderizado de la tarjeta, si el producto tiene `disponible: false`, agrega la clase `is-sold-out` y deshabilita el botón de agregar."*
* **Comprobación**: Los productos agotados deben mostrarse opacos y con el botón deshabilitado.

---

### Paso 11: Mostrar el detalle del pedido (Modal / Resumen)
* **Objetivo**: Abrir una ventana modal con el desglose de productos al hacer clic en "Ver pedido".
* **Elementos HTML**: `#order-modal`.
* **Conceptos JS**: Manipulación de clases CSS (`is-hidden`), iteración de mapa.
* **Prompt**: *"Al hacer clic en `#view-order`, abre una ventana modal que liste los productos agregados, sus cantidades y los precios parciales."*
* **Comprobación**: Al hacer clic en "Ver pedido", se despliega la lista con el detalle.

---

### Paso 12: Aumentar o disminuir cantidades dentro del resumen
* **Objetivo**: Permitir modificar las cantidades `+` y `-` directamente desde la ventana del pedido.
* **Elementos HTML**: `.btn-increase`, `.btn-decrease`.
* **Conceptos JS**: Eventos en modal, actualización de estado.
* **Prompt**: *"Agrega botones de suma y resta en cada fila del resumen para modificar las cantidades del pedido sin cerrar la ventana."*
* **Comprobación**: Presionar `-` reduce la cantidad y presionar `+` la aumenta.

---

### Paso 13: Eliminar productos del pedido
* **Objetivo**: Si la cantidad de un ítem llega a 0 mediante la resta, el producto se elimina del resumen.
* **Elementos HTML**: `.btn-remove`.
* **Conceptos JS**: `map.delete()`.
* **Prompt**: *"Cuando la cantidad de un producto llegue a cero o se presione el botón de eliminar, quitalo completamente del pedido y actualiza los totales."*
* **Comprobación**: El producto desaparece del resumen y se descuenta del total.

---

### Paso 14: Vaciar todo el pedido
* **Objetivo**: Un botón "Vaciar pedido" que limpie todos los productos agregados.
* **Elementos HTML**: `#clear-order`.
* **Conceptos JS**: `map.clear()`.
* **Prompt**: *"Agrega un botón 'Vaciar' en el resumen que limpie por completo el pedido y cierre el modal."*
* **Comprobación**: El pedido vuelve a cero y la barra se deshabilita.

---

### Paso 15: Guardar el pedido en el navegador (Persistencia)
* **Objetivo**: Si el cliente recarga la página en su teléfono, el pedido no debe perderse.
* **Elementos HTML**: N/A.
* **Conceptos JS**: `localStorage.setItem()`, `localStorage.getItem()`.
* **Prompt**: *"Guarda el estado del pedido en `localStorage` cada vez que sufra un cambio, y recupéralo automáticamente al cargar la página."*
* **Comprobación**: Agregar productos, refrescar la ventana (`F5`) y verificar que los productos se mantienen.

---

### Paso 16: Publicar la carta en Netlify o GitHub Pages
* **Objetivo**: Subir la carpeta del proyecto a un servicio de hosting gratuito para obtener una URL pública.
* **Flujo**:
  1. Ingresar a Netlify o GitHub Pages.
  2. Subir el proyecto terminado.
  3. Obtener la dirección pública (ej: `https://mi-bar-cfp27.netlify.app`).
* **Comprobación**: La URL debe abrirse correctamente desde cualquier celular con acceso a internet.

---

### Paso 17: Registrar el comercio en el Dashboard docente y generar el QR
* **Objetivo**: Copiar la URL de Netlify y pegarla en el **Dashboard Docente** (`dashboard/`).
* **Flujo**:
  1. Abrir el **Dashboard docente**.
  2. Buscar o crear el comercio en el panel.
  3. Pegar la URL de Netlify en el campo de dirección pública.
  4. Guardar los cambios.
* **Comprobación**: El estado cambia a **🟢 Publicado** y el Código QR se genera de forma instantánea.

---

### Paso 18: Descargar e imprimir el Código QR para la mesa
* **Objetivo**: Descargar la imagen del QR generado desde el Dashboard.
* **Flujo**:
  1. Presionar el botón **"Descargar QR"** en la tarjeta del comercio.
  2. Imprimir o incorporar la imagen en el material promocional de la mesa.
* **Comprobación**: Escanear el QR impreso con la cámara del celular y verificar que abre directamente la carta digital.

---

## 👩‍🏫 Créditos y Licencia

Proyecto desarrollado para las clases de **Diseño Web · CFP N° 27**.  
Libre para uso educativo y pedagógico.
