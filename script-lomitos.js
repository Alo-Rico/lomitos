fetch('precios.json')
  .then(response => response.json())
  .then(data => {
    const menu = document.getElementById('menu-container');
    Object.entries(data).forEach(([nombre, info]) => {
      const card = document.createElement('div');
      card.className = 'producto';
      card.innerHTML = `
        <img src="img-lomitos/${info.imagen}" alt="${nombre}">
        <h3>${nombre}</h3>
        <p>${info.ingredientes}</p>
        <p><strong>Gs. ${info.precio.toLocaleString()}</strong></p>
        <button onclick="abrirPopup('${nombre}', ${info.precio})">Agregar</button>
      `;
      menu.appendChild(card);
    });
  })
  .catch(error => {
    console.error("Error al cargar el menú:", error);
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
    li.textContent = `${item.cantidad} x ${item.nombre} - Gs. ${(item.precio * item.cantidad).toLocaleString()}`;
    lista.appendChild(li);
    total += item.precio * item.cantidad;
  });
  document.getElementById('total-pedido').innerText = 'Total: Gs. ' + total.toLocaleString();
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
