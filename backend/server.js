const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

let carrito = [];
let usuarios = [];

let productos = [
  { id: 1, nombre: "Nike Air Max", precio: 2500, imagen: "nike1.jpg" },
  { id: 2, nombre: "Nike Jordan", precio: 3200, imagen: "nike2.jpg" },
  { id: 3, nombre: "Nike Revolution", precio: 1800, imagen: "nike3.jpg" },
  { id: 4, nombre: "Adidas Ultraboost", precio: 3000, imagen: "adidas1.jpg" },
  { id: 5, nombre: "Adidas RunFalcon", precio: 1500, imagen: "adidas2.jpg" },
  { id: 6, nombre: "Puma RS-X", precio: 2100, imagen: "puma1.jpg" },
  { id: 7, nombre: "Puma Future Rider", precio: 1900, imagen: "puma2.jpg" },
  { id: 8, nombre: "New Balance 574", precio: 2200, imagen: "nb1.jpg" },
  { id: 9, nombre: "New Balance 997", precio: 2600, imagen: "nb2.jpg" },
  { id: 10, nombre: "Nike ZoomX", precio: 3500, imagen: "nike4.jpg" }
];

// =======================
// PRODUCTOS
// =======================
app.get('/productos', (req, res) => {
  res.json(productos);
});

// =======================
// CARRITO
// =======================
app.get('/carrito', (req, res) => {
  res.json(carrito);
});

app.post('/carrito', (req, res) => {
  carrito.push(req.body);
  res.json(carrito);
});

app.delete('/carrito', (req, res) => {
  carrito = [];
  res.send("Carrito vacío");
});

// =======================
// REGISTRO
// =======================
app.post('/registro', (req, res) => {
  usuarios.push(req.body);
  res.send("Usuario registrado");
});

// =======================
// LOGIN
app.post('/login', (req, res) => {
  const { correo, password } = req.body;

  // ADMIN
  if (correo === "admin@nike.com" && password === "1234") {
    return res.json({ rol: "admin" });
  }

  // USUARIO NORMAL
  if (correo && password) {
    return res.json({ rol: "usuario" });
  }

  res.status(401).send("Datos incorrectos");
});

// =======================
// AGREGAR PRODUCTO
// =======================
app.post('/productos', (req, res) => {
  productos.push(req.body);
  res.send("Producto agregado");
});

// =======================
// ELIMINAR PRODUCTO
// =======================
app.delete('/productos/:id', (req, res) => {
  const id = parseInt(req.params.id);

  productos = productos.filter(p => p.id !== id);

  res.send("Producto eliminado");
});

// =======================
// EDITAR PRODUCTO
// =======================
app.put('/productos/:id', (req, res) => {
  const id = parseInt(req.params.id);

  const index = productos.findIndex(p => p.id === id);

  if (index !== -1) {
    productos[index] = req.body;
  }

  res.send("Producto actualizado");
});

// =======================
// RUTA PRINCIPAL
// =======================
app.get('/', (req, res) => {
  res.send('Servidor funcionando 🚀');
});

// =======================
// SERVIDOR
// =======================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor funcionando 🚀");
});