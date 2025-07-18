import { obtenerProductos, mostrarProductos, filtrarDestacados, filtrarPorCategoria } from './api.js';

const API_URL = 'https://6875502cdd06792b9c9786f2.mockapi.io/api/v1/productos'; // URL de la API

document.addEventListener('DOMContentLoaded', async() => {
    const productos = await obtenerProductos(API_URL);//Esperar a que se carguen los productos
    if (productos.length > 0) {
        //console.log('Productos obtenidos:', productosGlobales);
        //mostrarProductos(productosGlobales, '.contenedor-destacados');//Mostrar los productos en el HTML y adjuntar eventos
        const productosDestacados = filtrarPorCategoria(productos, 'teclado');
        mostrarProductos(productosDestacados, '.contenedor-destacados');//Mostrar los productos destacados en el HTML y adjuntar
    }
});