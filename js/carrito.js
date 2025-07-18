import { mostrarProductosCarrito, dibujarTotal } from './api.js';

document.addEventListener('DOMContentLoaded', () => {
  // Obtener carrito desde el localStorage
  const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

  if (carrito.length > 0) {
    mostrarProductosCarrito(carrito, '.campos');
  } else {
    document.querySelector('.campos').innerHTML = '<p>El carrito está vacío.</p>';
    document.querySelector('.total-carrito').innerHTML = dibujarTotal(0);
  }
});
