let productosGlobales = []; //almacena todos los productos
const API_URL = 'https://6875502cdd06792b9c9786f2.mockapi.io/api/v1/productos';// URL de la API

// Función para obtener los productos de la API
export async function obtenerProductos(API) {
    try {
        const response = await fetch(API);
        if (!response.ok) {
            throw new Error(`Error al obtener los productos: ${response.status}`);
        }
        productosGlobales = await response.json();//almacena los productos en la variable global
        
        return productosGlobales; // Devuelve los productos obtenidos   
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}

export function filtrarDestacados(productos){
    // Filtrar los productos destacados (aquellos con "destacado" en true)
    return productos.filter(producto => producto.destacado).slice(0,3);
}

export function filtrarPorCategoria(productos, categoria) {
  return productos.filter(producto => 
    producto.categoria.toLowerCase() === categoria.toLowerCase()
  );
}

//Función que recibe un producto y crea su HTML como un string
export function crearProductoHTML(producto) {
    //substring() extrae una parte de una cadena de texto.
    //Se le indican dos posiciones: una donde empieza a cortar y otra donde termina (sin incluir ese último carácter).
    const displayTitle = producto.nombre.substring(0, 20) + '...';

    // Se utiliza un template literal para construir todo el HTML del producto directamente como una cadena.
    return `
            <div class="contenedor-productos">
                <div>
                    <img src="${producto.imagen}" alt="${producto.nombre}" class="item-imagen">
                </div>
                <div class="item-descripcion">
                    <h2>${displayTitle}</h2>
                </div>
                <div class="item-precio">
                    <h1>$${producto.precio.toFixed(2)}</h1>
                </div>
                <div>    
                    <button class="item-boton" id="boton-${producto.id}">Agregar</button>
                </div>
            </div>
    `;
}

//Función que itera sobre los productos y genera el HTML para cada uno
export function mostrarProductos(jsonProductos, selector) {
    const filas = jsonProductos.map(obj => crearProductoHTML(obj));
    document.querySelector(selector).innerHTML = filas.join('');//join('') une todos los elementos del array en una sola cadena de texto

    //Adjuntar los eventos DESPUES de que se haya generado el HTML
    adjuntarEventosCarrito();
}

export function adjuntarEventosCarrito() {
    productosGlobales.forEach(producto => {
        const boton =document.getElementById(`boton-${producto.id}`);//identificador del botón de agregar al carrito por el id del producto
        if (boton) {//comprueba que el botón existe
            boton.addEventListener('click', () => {//cuando se hace clic, ya tenemos acceso al objeto 'producto'
                agregarAlCarrito(producto);//llama a la función que agrega el producto al carrito
            });
        }
    });
}
//Agregar al localStorage
export function agregarAlCarrito(producto) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];//Obtener el carrito del localStorage o crear uno vacío
    const indiceProductoExistente = carrito.findIndex(item => item.id === producto.id);//Buscar si el producto ya está en el carrito
    if (indiceProductoExistente !== -1) {
        carrito[indiceProductoExistente].cantidad ++; // Si ya existe, aumentar la cantidad
    }else{
        carrito.push({
            id: producto.id,
            nombre: producto.nombre,
            descripcion: producto.descripcion,
            categoria: producto.categoria,
            precio: producto.precio,
            stock: producto.stock,
            imagen: producto.imagen,
            destacado: producto.destacado,
            cantidad: 1 // Si no existe, agregarlo con cantidad 1
        })
    }

    localStorage.setItem('carrito', JSON.stringify(carrito));//Guardar el carrito actualizado en el localStorage (como string)
    alert(`${producto.nombre} agregado al carrito`);
    ///Agregar contador de carrito
}
export function crearProductoCarrito(producto) {//crea la tabla con los productos del localStorage
    return `
        <tr>
            <td><button class="boton-eliminar" type="button" data-id="${producto.id}">""</button></td>
            <td><img src="${producto.imagen}" alt="${producto.nombre}" class="campo-imagen"></td>
            <td>${producto.nombre}</td>
            <td>$${producto.precio.toFixed(2)}</td>
            <td><input type="number" value="${producto.cantidad}" min="1" data-id="${producto.id}" class="input-cantidad"></td>
            <td>$${(producto.precio * producto.cantidad).toFixed(2)}</td>
        </tr>
    `;
}
export function mostrarProductosCarrito(jsonProductos, selector) {
    const filas = jsonProductos.map(obj => crearProductoCarrito(obj));
    document.querySelector(selector).innerHTML = filas.join('');//join('') une todos los elementos del array en una sola cadena de texto
    
    const subtotal = actualizarTotalCarrito();  
    const total = [dibujarTotal(subtotal)];//Crear el HTML del total del carrito
    document.querySelector('.total-carrito').innerHTML = total.join('');//Muestra el total del carrito
    
    const botones = document.querySelectorAll('.boton-eliminar');
    botones.forEach(boton => {
    boton.addEventListener('click', () => {
      const id = parseInt(boton.getAttribute('data-id'));
      eliminarProducto(id);
    });
  });
    
    const cantidades = document.querySelectorAll('.input-cantidad');
    cantidades.forEach(cantidad => {
    cantidad.addEventListener( 'change', () => {
      const id = parseInt(cantidad.getAttribute('data-id'));
      cambiarCantidadProducto(id, parseInt(cantidad.value));
    });
  });

}

function actualizarTotalCarrito() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    let subtotal = 0;
    if(carrito.length === 0) {
        return subtotal;
    }else{
            carrito.forEach(producto => {
                subtotal += producto.precio * producto.cantidad;
            });
        return subtotal;
    }
}
//Dibujar total
export function dibujarTotal(subtotal) {
    return `
        <div class="total-carrito">
            <table>
                <tr>
                    <td colspan="2" style="color: red; font-size: 1.5em">Resumen de Compra</td>
                </tr>
                <tr>
                    <td>Subtotal</td>
                    <td>$${subtotal}</td>
                </tr>
                <tr>
                    <td>Envío</td>
                    <td>Gratis</td>
                </tr>
                <tr>
                    <td>Total</td>
                    <td>$${subtotal}</td>
                </tr>
                <tr>
                    <td colspan="2"><button class="boton-pagar">PAGAR</button></td>
                </tr>
            </table>
            
        </div>
    `;
}
function eliminarProducto(id) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    // Filtrar el producto a eliminar
    carrito = carrito.filter(producto => producto.id !== id.toString()); 

    // Actualizar el localStorage
    localStorage.setItem('carrito', JSON.stringify(carrito));

    // Recargar la página para reflejar los cambios
    /* location.reload();  */
    mostrarProductosCarrito(carrito, '.campos');
}
function cambiarCantidadProducto(id, nuevaCantidad) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const indice = carrito.findIndex(producto => producto.id === id.toString());  
    if(indice !== -1){
        carrito[indice].cantidad = nuevaCantidad; // Actualizar la cantidad del producto
        localStorage.setItem('carrito', JSON.stringify(carrito));
        /* location.reload(); */
        mostrarProductosCarrito(carrito, '.campos');
    }
}
