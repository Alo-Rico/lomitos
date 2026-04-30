<script>
document.addEventListener('DOMContentLoaded', async () => {

  const menu = document.getElementById('menu');

  function mostrarError(msg) {
    menu.innerHTML = `<p style="color:red;">${msg}</p>`;
  }

  function limpiarNombre(nombre) {
    return nombre
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-");
  }

  function crearCard(nombre, info) {

    const card = document.createElement('div');
    card.className = 'product';

    const img = limpiarNombre(info.imagen || "default.jpg");
    const ruta = "./imagen/" + img;

    card.innerHTML = `
      <img src="${ruta}" alt="${nombre}">
      <h3>${nombre}</h3>
      <p>Gs. ${(info.precio || 0).toLocaleString()}</p>
    `;

    // 🔥 FALLBACK SI NO EXISTE LA IMAGEN
    const imagen = card.querySelector("img");
    imagen.onerror = () => {
      imagen.src = "https://via.placeholder.com/200x140?text=Sin+imagen";
    };

    return card;
  }

  try {

    const res = await fetch("./precios.json");

    if (!res.ok) {
      throw new Error("No se encontró precios.json");
    }

    let data;

    try {
      data = await res.json();
    } catch (e) {
      throw new Error("JSON mal formado (coma de más o error de sintaxis)");
    }

    if (!data || typeof data !== "object") {
      throw new Error("JSON vacío o inválido");
    }

    menu.innerHTML = "";

    Object.entries(data).forEach(([nombre, info]) => {

      // 🔥 VALIDACIÓN DE CADA PRODUCTO
      if (!info.precio) {
        console.warn("Producto sin precio:", nombre);
        return;
      }

      const card = crearCard(nombre, info);
      menu.appendChild(card);

    });

  } catch (error) {
    console.error(error);
    mostrarError("⚠️ Error: " + error.message);
  }

});
</script>
