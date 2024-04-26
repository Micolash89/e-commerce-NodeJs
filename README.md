# Backend de la API REST para el E-commerce

Este proyecto consiste en un backend desarrollado en Node.js que proporciona una API REST para un e-commerce. A continuación se detallan las dependencias utilizadas y las rutas disponibles en la API.

## Deploy

- El backend está desplegado en [Render](https://dashboard.render.com/).
  - [Enlace al despliegue](https://e-commerce-nodejs-2-4qw3.onrender.com/)
- Repositorio del frontend.
  - [Enlace al frontend](https://github.com/Micolash89/e-commerce-Coder-FrontEnd?tab=readme-ov-file)

## Dependencias

A continuación se detallan las dependencias utilizadas en este proyecto:

| Nombre               | Versión      |
| -------------------- | ------------ |
| @faker-js/faker      | ^8.4.1       |
| bcrypt               | ^5.1.1       |
| cookie-parser        | ^1.4.6       |
| cors                 | ^2.8.5       |
| dotenv               | ^16.4.5      |
| express              | ^4.18.2      |
| express-session      | ^1.18.0      |
| jsonwebtoken         | ^9.0.2       |
| mongoose             | ^8.0.4       |
| mongoose-paginate-v2 | ^1.8.0       |
| multer               | ^1.4.5-lts.1 |
| nodemailer           | ^6.9.11      |
| passport             | ^0.7.0       |
| passport-github2     | ^0.1.12      |
| passport-jwt         | ^4.0.1       |
| passport-local       | ^1.0.0       |
| swagger-jsdoc        | ^6.2.8       |
| swagger-ui-express   | ^5.0.0       |
| winston              | ^3.12.0      |

### Dependencias de desarrollo

| Nombre    | Versión |
| --------- | ------- |
| chai      | ^5.1.0  |
| mocha     | ^10.3.0 |
| supertest | ^6.3.4  |

## Rutas

A continuación se detallan las rutas disponibles en la API:

### Rutas Principales

- `/api/products`: Endpoints relacionados con los productos.
- `/api/carts`: Endpoints relacionados con los carritos de compra.
- `/api/sessions`: Endpoints relacionados con las sesiones de usuario.
- `/api/tickets`: Endpoints relacionados con los tickets de compra.

### Rutas de Productos

- `GET /api/products`: Obtiene todos los productos.
- `GET /api/products/nologin`: Obtiene todos los productos sin necesidad de autenticación.
- `GET /api/products/:id`: Obtiene un producto por su ID.
- `GET /api/products/custom/search`: Realiza una búsqueda personalizada de productos.
- `GET /api/products/find/categories`: Obtiene las categorías de los productos.
- `POST /api/products`: Crea un nuevo producto (solo para administradores y usuarios premium).
- `PUT /api/products/:pid`: Actualiza un producto existente (solo para administradores y usuarios premium).
- `DELETE /api/products/:pid`: Elimina un producto existente (solo para administradores y usuarios premium).
- `GET /api/products/user/myproducts`: Obtiene los productos del usuario actual (solo para administradores y usuarios premium).
- `GET /api/products/mockingproducts/mock`: Obtiene productos de muestra (moks).

### Rutas de Sesiones de Usuario

- `GET /api/sessions/login`: Renderiza la página de inicio de sesión.
- `POST /api/sessions/login`: Inicia sesión en el sistema.
- `GET /api/sessions/github`: Inicia sesión con GitHub.
- `GET /api/sessions/githubcallback`: Callback de inicio de sesión con GitHub.
- `GET /api/sessions/faillogin`: Renderiza la página de fallo de inicio de sesión.
- `GET /api/sessions/perfil`: Renderiza la página de perfil del usuario.
- `GET /api/sessions/registrar`: Renderiza la página de registro de usuario.
- `POST /api/sessions/registrar`: Registra un nuevo usuario.
- `GET /api/sessions/failregistrar`: Renderiza la página de fallo de registro.
- `GET /api/sessions/logout`: Cierra sesión en el sistema.
- `PUT /api/sessions/editprofile/:uid`: Edita el perfil de usuario.
- `GET /api/sessions/changerole`: Cambia el rol de usuario.
- `GET /api/sessions/restorepassword`: Renderiza la página de restauración de contraseña.
- `POST /api/sessions/restorepassword`: Envía un correo electrónico para restaurar la contraseña.
- `GET /api/sessions/restorepassword/:token`: Renderiza la página de restauración de contraseña con token.
- `POST /api/sessions/restorepassword/:token`: Restaura la contraseña utilizando el token.
- `GET /api/sessions/current`: Obtiene la sesión actual del usuario.

### Rutas de Carritos de Compra

- `GET /api/carts`: Obtiene el carrito de compra del usuario actual.
- `GET /api/carts/all`: Obtiene todos los carritos de compra.
- `POST /api/carts`: Crea un nuevo carrito de compra.
- `POST /api/carts/products/:pid`: Agrega un producto al carrito de compra.
- `DELETE /api/carts/products/:pid`: Elimina un producto del carrito de compra.
- `PUT /api/carts`: Actualiza el carrito de compra.
- `PUT /api/carts/products/:pid`: Actualiza un producto en el carrito de compra.
- `DELETE /api/carts`: Elimina el carrito de compra.
- `POST /api/carts/purchase`: Realiza la compra del carrito.

### Rutas de Tickets

- `GET /api/tickets/owntickets`: Obtiene todos los tickets del usuario actual.
- `GET /api/tickets/getticket/:tid`: Obtiene un ticket específico por su ID.

## Capturas de Pantalla

A continuación se muestran algunas capturas de pantalla del proyecto:

<p  align="center">
    <img src="https://i.imgur.com/72YK9wv." alt="HomePage" width=50% />
</p>

## Instrucciones de Ejecución

1. Clonar este repositorio.
2. Instalar las dependencias utilizando `npm install`.
3. Ejecutar el proyecto utilizando `npm run dev`.
