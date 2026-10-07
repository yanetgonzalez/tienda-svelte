<script>
  import { onMount } from "svelte";
  import { fade } from 'svelte/transition';

  let filtroMarca = "Todos";
  let mensaje = "";

  let vista = "inicio";
  let usuario = null;

  let productos = [];
  let carrito = [];
  let favoritos = [];

  let busqueda = "";
  let productosFiltrados = [];

  // LOGIN
  let correo = "";
  let password = "";
  let rolSeleccionado = "cliente"; // 'cliente' o 'admin'
  let mostrarModalLogin = false;

  // REGISTRO / PANEL
  let nombre = "";
  let nuevoCorreo = "";

  // PRODUCTOS INICIALES
  const productosBase = [
    { id: 1, nombre: "Nike Air Max", precio: 2500, imagen: "nike1.jpg", marca: "Nike" },
    { id: 2, nombre: "Nike Jordan", precio: 3200, imagen: "nike2.jpg", marca: "Nike" },
    { id: 3, nombre: "Nike Revolution", precio: 1900, imagen: "nike4.jpeg", marca: "Nike" },
    { id: 4, nombre: "Adidas Run", precio: 2100, imagen: "adidas1.jpg", marca: "Adidas" },
    { id: 5, nombre: "Puma Sport", precio: 1900, imagen: "puma.jpg", marca: "Puma" },
    { id: 6, nombre: "Reebok Sport", precio: 1800, imagen: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500", marca: "Reebok" },
    { id: 7, nombre: "New Balance 574", precio: 2600, imagen: "https://images.unsplash.com/photo-1539185441755-769473a23570?w=500", marca: "New Balance" }
  ];

  onMount(() => {
    // Cargar datos de localStorage
    const pGuardados = localStorage.getItem("productos");
    productos = pGuardados ? JSON.parse(pGuardados) : productosBase;

    const cGuardado = localStorage.getItem("carrito");
    if (cGuardado) carrito = JSON.parse(cGuardado);

    const uGuardado = localStorage.getItem("usuario");
    if (uGuardado) usuario = JSON.parse(uGuardado);

    filtrarProductos();
  });

  function seleccionarRol(rol) {
    rolSeleccionado = rol;
    if (rol === 'admin') {
      correo = "admin@sneakers.com";
      password = "admin123";
    } else {
      correo = "cliente@correo.com";
      password = "123456";
    }
  }

  function abrirLogin() {
    mostrarModalLogin = true;
    seleccionarRol(rolSeleccionado);
  }

  function cerrarLogin() {
    mostrarModalLogin = false;
  }

  function ejecutarLogin() {
    if (!correo) {
      alert("Por favor ingresa un correo.");
      return;
    }

    if (rolSeleccionado === 'admin') {
      if (correo !== "admin@sneakers.com" || password !== "admin123") {
        alert("Credenciales de Administrador incorrectas.\nCorreo: admin@sneakers.com\nPassword: admin123");
        return;
      }
      usuario = { correo, rol: "admin" };
    } else {
      usuario = { correo, rol: "cliente" };
    }

    localStorage.setItem("usuario", JSON.stringify(usuario));
    cerrarLogin();
    mostrarNotificacion(`¡Bienvenido ${usuario.rol === 'admin' ? 'Administrador' : 'Cliente'}! 🔐`);

    if (usuario.rol === 'admin') {
      vista = 'adminPanel';
    }
  }

  function logout() {
    usuario = null;
    localStorage.removeItem("usuario");
    vista = "inicio";
    mostrarNotificacion("Sesión cerrada");
  }

  function filtrarProductos() {
    productosFiltrados = productos.filter(p => {
      const coincideNombre = p.nombre.toLowerCase().includes(busqueda.toLowerCase());
      const coincideMarca = filtroMarca === "Todos" || p.marca === filtroMarca;
      return coincideNombre && coincideMarca;
    });
  }

  $: busqueda, filtroMarca, filtrarProductos();

  function agregarAlCarrito(prod) {
    carrito = [...carrito, prod];
    localStorage.setItem("carrito", JSON.stringify(carrito));
    mostrarNotificacion("Producto agregado al carrito 🛒");
  }

  function mostrarNotificacion(txt) {
    mensaje = txt;
    setTimeout(() => { mensaje = ""; }, 2500);
  }
</script>

<!-- NAVEGACIÓN -->
<header>
  <div class="logo">
    <i class="fa-solid fa-shoe-prints"></i> SNEAKERS <span>STORE</span>
  </div>
  <nav>
    <button class:active={vista === 'inicio'} on:click={() => vista = 'inicio'}>Inicio</button>
    <button class:active={vista === 'productos'} on:click={() => vista = 'productos'}>Productos</button>
    <button class:active={vista === 'carrito'} on:click={() => vista = 'carrito'}>Carrito ({carrito.length})</button>

    {#if usuario && usuario.rol === 'admin'}
      <button class="btn-admin" class:active={vista === 'adminPanel'} on:click={() => vista = 'adminPanel'}>Panel Admin</button>
    {/if}

    {#if usuario}
      <span class="user-info">{usuario.correo}</span>
      <button class="btn-salir" on:click={logout}>Salir</button>
    {:else}
      <button class="btn-login" on:click={abrirLogin}>Iniciar sesión</button>
    {/if}
  </nav>
</header>

<main>
  {#if mensaje}
    <div class="toast" transition:fade>{mensaje}</div>
  {/if}

  {#if vista === 'inicio'}
    <section class="hero">
      <h1>ELEVANDO TU ESTILO URBANO</h1>
      <p>Consigue los tenis más exclusivos.</p>
      <button class="btn-primary" on:click={() => vista = 'productos'}>Ver Catálogo</button>
    </section>
  {:else if vista === 'productos'}
    <section class="container">
      <h2>Catálogo de Productos</h2>
      <input type="text" bind:value={busqueda} placeholder="Buscar tenis..." class="input-search">

      <div class="grid">
        {#each productosFiltrados as item}
          <div class="card">
            <img src={item.imagen} alt={item.nombre} />
            <h3>{item.nombre}</h3>
            <p>${item.precio} MXN</p>
            <button on:click={() => agregarAlCarrito(item)}>Agregar al carrito</button>
          </div>
        {/each}
      </div>
    </section>
  {:else if vista === 'adminPanel'}
    <section class="container">
      <h2>Panel de Administrador</h2>
      <p>Bienvenido al control de la tienda.</p>
    </section>
  {/if}
</main>

<!-- MODAL LOGIN SVELTE -->
{#if mostrarModalLogin}
  <div class="modal-backdrop">
    <div class="modal-content">
      <button class="close-btn" on:click={cerrarLogin}>&times;</button>
      <h2>Iniciar Sesión</h2>

      <div class="role-selector">
        <button class:active={rolSeleccionado === 'cliente'} on:click={() => seleccionarRol('cliente')}>Cliente</button>
        <button class:active={rolSeleccionado === 'admin'} on:click={() => seleccionarRol('admin')}>Administrador</button>
      </div>

      <div class="form-group">
        <label for="inputCorreo">Correo electrónico</label>
        <input id="inputCorreo" type="email" bind:value={correo} placeholder="ejemplo@correo.com">
      </div>

      <div class="form-group">
        <label for="inputPass">Contraseña</label>
        <input id="inputPass" type="password" bind:value={password} placeholder="••••••••">
      </div>

      <button type="button" class="btn-primary" on:click={ejecutarLogin}>Ingresar al sistema</button>
    </div>
  </div>
{/if}

<style>
  /* Estilos globales básicos */
  header { display: flex; justify-content: space-between; align-items: center; padding: 1rem 2rem; background: #111; color: white; }
  nav button { background: transparent; border: none; color: white; margin: 0 5px; cursor: pointer; padding: 8px 12px; }
  nav button.active { background: #ff5722; border-radius: 5px; }
  .btn-login { background: #ff5722 !important; border-radius: 5px; }
  .modal-backdrop { position: fixed; top:0; left:0; width:100%; height:100%; background: rgba(0,0,0,0.7); display:flex; justify-content:center; align-items:center; }
  .modal-content { background: white; padding: 2rem; border-radius: 10px; width: 350px; color: #333; position: relative; }
  .close-btn { position: absolute; top: 10px; right: 15px; border:none; background:none; font-size: 1.5rem; cursor:pointer; }
  .role-selector { display: flex; gap: 10px; margin-bottom: 1rem; }
  .role-selector button { flex: 1; padding: 8px; border: 1px solid #ccc; background: #f0f0f0; cursor: pointer; }
  .role-selector button.active { background: #ff5722; color: white; border-color: #ff5722; }
  .form-group { margin-bottom: 1rem; display: flex; flex-direction: column; }
  .form-group input { padding: 8px; margin-top: 5px; border: 1px solid #ccc; border-radius: 4px; }
  .btn-primary { width: 100%; padding: 10px; background: #ff5722; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold; }
  .toast { position: fixed; bottom: 20px; right: 20px; background: #333; color: white; padding: 12px 20px; border-radius: 5px; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px; margin-top: 20px; }
  .card { border: 1px solid #ddd; padding: 15px; border-radius: 8px; text-align: center; }
  .card img { width: 100%; height: 150px; object-fit: contain; }
</style>
