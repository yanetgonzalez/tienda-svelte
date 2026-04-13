<script>
import { onMount } from "svelte";
import { fade } from 'svelte/transition';
let filtroMarca = "Todos";

let mensaje = "";

let vista = "inicio";
let usuario = "Admin";

let productos = [];
let carrito = [];
let favoritos = [];

let busqueda = "";
let productosFiltrados = [];

// LOGIN
let correo = "";
let password = "";

// REGISTRO
let nombre = "";
let nuevoCorreo = "";
let nuevaPass = "";

// PAGO
let mostrarPago = false;
let nombreTarjeta = "";
let numTarjeta = "";
let cvv = "";


// CARGAR DATOS
onMount(async () => {
  let res1 = await fetch('http://localhost:3000/productos');
  productos = await res1.json();

  let res2 = await fetch('http://localhost:3000/carrito');
  carrito = await res2.json();
});

// FILTRO
$: productosFiltrados = productos.filter(p =>
  p.nombre.toLowerCase().includes(busqueda.toLowerCase()) &&
  (filtroMarca === "Todos" || p.nombre.toLowerCase().includes(filtroMarca.toLowerCase()))
);
// FUNCIONES
async function agregar(p) {
  let res = await fetch('http://localhost:3000/carrito', {
    method:"POST",
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify(p)
  });
  carrito = await res.json();

  mensaje = "Producto agregado 🛒";

  setTimeout(() => {
    mensaje = "";
  }, 2000);
}
function toggleFavorito(p) {
  if (favoritos.find(f => f.id === p.id)) {
    favoritos = favoritos.filter(f => f.id !== p.id);
  } else {
    favoritos = [...favoritos, p];
  }
}

function login() {
  if (correo && password) {
    usuario = correo;
    vista = "inicio";
    alert("Bienvenido 🔐");
  }
}

function registrar() {
  alert("Usuario registrado ✅");
  vista = "login";
}

function logout() {
  usuario = null;
  vista = "login";
}

function abrirPago() {
  if (carrito.length === 0) return alert("Carrito vacío");
  mostrarPago = true;
}

function pagar() {
  if (!nombreTarjeta || !numTarjeta || !cvv) {
    alert("Completa los datos");
    return;
  }
  alert("Pago exitoso 💳");
  carrito = [];
  mostrarPago = false;
}
function eliminar(index) {
  carrito.splice(index, 1);
  carrito = [...carrito];
}

$: total = carrito.reduce((s,p)=>s+p.precio,0);

</script>

<style>
:global(body) {
  margin: 0;
  font-family: Arial;
  background: url('/images/fondo.jpg') center/cover no-repeat fixed;
}
/* CONTENEDOR PRINCIPAL */
main {
  max-width: 1200px;
  margin: auto;
  background: rgba(255, 255, 255, 0.2); /* transparente */
  backdrop-filter: blur(8px);
  border-radius: 15px;
  overflow: hidden;
}
/* HEADER */
header {
  background: #111;
  color: white;
  padding: 15px;
  text-align: center;
  font-size: 24px;
  letter-spacing: 2px;
}

/* NAV */
nav {
  display: flex;
  justify-content: center;
  gap: 10px;
  background: #222;
  padding: 10px;
}

nav button {
  padding: 10px 15px;
  border: none;
  background: #ff3c00;
  color: white;
  cursor: pointer;
  border-radius: 5px;
  transition: 0.3s;
}

nav button:hover {
  background: #ff5c2a;
}

/* HERO */
.hero {
  height: 400px;
  background: url('/images/nike.jpg') center/cover;
  position: relative;
  border-radius: 15px;
}

.overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  background: rgba(0,0,0,0.5);
}

.overlay h1 {
  font-size: 40px;
}

.overlay button {
  padding: 12px 20px;
  background: #ff3c00;
  border: none;
  color: white;
  cursor: pointer;
  margin-top: 10px;
  border-radius: 5px;
}

/* GRID PRODUCTOS */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px,1fr));
  gap: 20px;
  padding: 20px;
}

/* CARD */
.card {
  background: white;
  border-radius: 15px;
  padding: 15px;
  text-align: center;
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
  transition: 0.3s;
  position: relative;
  overflow: hidden;
}

.card:hover {
  transform: translateY(-10px) scale(1.05);
}
.card img {
  transition: 0.3s;
}

.card:hover img {
  transform: scale(1.2);
}

/* IMAGEN */
img {
  width: 150px;
  height: 150px;
  object-fit: contain;
}

/* BOTONES */
button {
  margin-top: 5px;
  padding: 8px;
  border: none;
  cursor: pointer;
  border-radius: 20px;
  background: #111;
  color: white;
}

button:hover {
  background: #ff3c00;
}
/* CARRITO */
.carrito {
  background: white;
  margin: 20px;
  padding: 20px;
  border-radius: 10px;
}

.pagar {
  background: #28a745;
  color: white;
}

.vaciar {
  background: red;
  color: white;
}

/* MODAL */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.7);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 300px;
}

input {
  width: 100%;
  margin: 5px 0;
  padding: 8px;
  border-radius: 5px;
  border: 1px solid #ccc;
}
.filtros {
  display: flex;
  justify-content: center;
  gap: 10px;
  padding: 10px;
}

.filtros button {
  background: #111;
  color: white;
}

.filtros button:hover {
  background: #ff3c00;
}
.filtros button.activo {
  background: #ff3c00;
}
.toast {
  position: fixed;
  top: 20px;
  right: 20px;
  background: #111;
  color: white;
  padding: 12px 20px;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
  animation: fadeIn 0.3s;
}
ul {
  list-style: none;
  padding: 0;
}

li {
  background: white;
  margin: 10px;
  padding: 15px;
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

li button {
  background: red;
  color: white;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; }
}
</style>

<header>NIKE STORE 👟</header>

<main>

<!-- NAV -->
{#if usuario}
<nav>
  <button on:click={()=>vista="inicio"}>Inicio</button>
  <button on:click={()=>vista="productos"}>Productos</button>
  <button on:click={()=>vista="favoritos"}>Favoritos</button>
  <button on:click={()=>vista="carrito"}>Carrito</button>
  <button on:click={()=>vista="contacto"}>Contacto</button>
  <button on:click={logout}>Salir</button>
</nav>
{/if}

<!-- LOGIN -->
{#if !usuario && vista==="login"}
<h2>Login</h2>
<input placeholder="Correo" bind:value={correo}>
<input placeholder="Contraseña" type="password" bind:value={password}>
<button on:click={login}>Entrar</button>
<button on:click={()=>vista="registro"}>Registrarse</button>
{/if}

{#if mensaje}
<div class="toast">{mensaje}</div>
{/if}

<!-- REGISTRO -->
{#if vista==="registro"}
<h2>Registro</h2>
<input placeholder="Nombre" bind:value={nombre}>
<input placeholder="Correo" bind:value={nuevoCorreo}>
<input placeholder="Contraseña" bind:value={nuevaPass}>
<button on:click={registrar}>Crear cuenta</button>
{/if}

<!-- INICIO -->
{#if vista==="inicio"}
<div class="hero">
  <div class="overlay">
    <h1>NUEVA COLECCIÓN</h1>
    <button on:click={()=>vista="productos"}>Comprar ahora</button>
  </div>
</div>
{/if}

{#if vista==="productos"}
<div class="filtros">
  <button on:click={()=>filtroMarca="Todos"}>Todos</button>
  <button on:click={()=>filtroMarca="Nike"}>Nike</button>
  <button on:click={()=>filtroMarca="Adidas"}>Adidas</button>
  <button on:click={()=>filtroMarca="Puma"}>Puma</button>
  <button on:click={()=>filtroMarca="New Balance"}>NB</button>
</div>
<!-- PRODUCTOS -->

<input placeholder="Buscar tenis..." bind:value={busqueda}>

<div class="grid">
{#each productosFiltrados as p}
  <div class="card" in:fade={{ duration: 400 }}>
    <img src={"/images/"+p.imagen}>
    <h3>{p.nombre}</h3>
    <p>${p.precio}</p>

    <button on:click={()=>agregar(p)}>Agregar</button>

    <button on:click={()=>toggleFavorito(p)}>
      {favoritos.find(f=>f.id===p.id) ? "❤️" : "🤍"}
    </button>

    <button on:click={()=>{ agregar(p); vista="carrito"; }}>
      Comprar ahora
    </button>

  </div>
{/each}
</div>
{/if}

<!-- FAVORITOS -->
{#if vista==="favoritos"}
<h2>Favoritos ❤️</h2>
{#each favoritos as f}
<p>{f.nombre}</p>
{/each}
{/if}

<!-- CARRITO -->
{#if vista==="carrito"}
<h2>Carrito</h2>

<ul>
{#each carrito as c, i}
<li>
  {c.nombre} - ${c.precio}
  <button on:click={()=>eliminar(i)}>❌</button>
</li>
{/each}
</ul>

<h3>Total: ${total}</h3>
<button on:click={abrirPago}>Pagar</button>
{/if}

<!-- CONTACTO -->
{#if vista==="contacto"}
<h2>Contacto</h2>
<p>nike@store.com</p>
{/if}

</main>

<!-- MODAL (FUERA DEL MAIN) -->
{#if mostrarPago}
<div class="modal">
  <div class="modal-content">
    <h2>Pago</h2>
    <input placeholder="Nombre tarjeta" bind:value={nombreTarjeta}>
    <input placeholder="Número tarjeta" bind:value={numTarjeta}>
    <input placeholder="CVV" bind:value={cvv}>
    <button on:click={pagar}>Confirmar</button>
    <button on:click={()=>mostrarPago=false}>Cancelar</button>
  </div>
</div>
{/if}