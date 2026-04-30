fetch('./precios.json')
  .then(response => {
    if (!response.ok) throw new Error("JSON no encontrado");
    return response.json();
  })
  .then(data => {

    const menu = document.getElementById('menu-container');

    Object.entries(data).forEach(([nombre, info]) => {

      const card = document.createElement('div');
      card.className = 'producto';

      // 🔥 limpieza automática del nombre (clave)
      function limpiar(nombre) {
        return nombre
          .toLowerCase()
          .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
          .replace(/\s+/g, "-")
          .replace(".jpeg", ".jpg");
      }

      const img = limpiar(info.imagen);

      card.innerHTML = `
        <img src="imagen/${img}" alt="${nombre}">
        <h3>${nombre}</h3>
        <p>${info.ingredientes || ""}</p>
        <p><strong>Gs. ${info.precio.toLocaleString()}</strong></p>
        <button onclick="abrirPopup('${nombre}', ${info.precio})">Agregar</button>
      `;

      menu.appendChild(card);
    });

  })
  .catch(error => {
    console.error("Error al cargar el menú:", error);
    document.getElementById('menu-container').innerHTML =
      "<p style='color:red;'>No se pudo cargar el menú</p>";
  });

function abrirPopup(nombre, precio) {
  document.getElementById('popup-title').innerText = nombre;
  document.getElementById('popup').style.display = 'block';
  document.getElementById('overlay').style.display = 'block';

  document.getElementById('confirmar-btn').onclick = () => {
    const cantidad = parseInt(document.getElementById('cantidad').value);
    agregarPedido(nombre, precio, cantidad);
    cerrarPopup();
  };
}

function cerrarPopup() {
  document.getElementById('popup').style.display = 'none';
  document.getElementById('overlay').style.display = 'none';
}

let pedido = [];

function agregarPedido(nombre, precio, cantidad) {
  pedido.push({ nombre, precio, cantidad });
  renderPedido();
}

function renderPedido() {
  const lista = document.getElementById('lista-pedido');
  lista.innerHTML = '';
  let total = 0;

  pedido.forEach(item => {
    const li = document.createElement('li');
    li.textContent =
      `${item.cantidad} x ${item.nombre} - Gs. ${(item.precio * item.cantidad).toLocaleString()}`;
    lista.appendChild(li);

    total += item.precio * item.cantidad;
  });

  document.getElementById('total-pedido').innerText =
    'Total: Gs. ' + total.toLocaleString();
}

function borrarPedido() {
  pedido = [];
  renderPedido();
}

function enviarPedido() {
  if (pedido.length === 0) return alert("El pedido está vacío.");

  let mensaje = 'Hola, quiero pedir:\n';

  pedido.forEach(item => {
    mensaje += `${item.cantidad} x ${item.nombre} - Gs. ${(item.precio * item.cantidad).toLocaleString()}\n`;
  });

  window.open("https://wa.me/?text=" + encodeURIComponent(mensaje), "_blank");
}
