# ADIIC — Frontend

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

Interfaz web para el sistema **ADIIC (Administración de Dotaciones Institucionales)**, una aplicación fullstack que permite a empresas e instituciones gestionar pedidos e inventario de dotaciones de manera centralizada y eficiente.

🔗 **Demo en vivo:** [https://front-adiic.vercel.app](https://front-adiic.vercel.app)  
🔗 **Repositorio Backend:** [https://github.com/jcarrietab1974/Back_ADIIC](https://github.com/jcarrietab1974/Back_ADIIC)

---

## Descripción del proyecto

ADIIC resuelve el problema del manejo manual y desorganizado de dotaciones institucionales. A través de esta aplicación, las empresas pueden registrar, consultar y gestionar sus pedidos de dotaciones desde una interfaz web moderna, conectada a una API REST propia.

## Características principales

- Gestión de pedidos e inventario de dotaciones institucionales
- Interfaz responsiva adaptada a diferentes dispositivos
- Consumo de API REST desarrollada en Node.js y Express
- Navegación fluida con React Router
- Diseño moderno construido con TailwindCSS

## Tecnologías utilizadas

| Tecnología | Uso |
|---|---|
| React.js | Biblioteca principal de UI |
| TailwindCSS | Estilos y diseño responsivo |
| JavaScript (ES6+) | Lógica del frontend |
| React Router | Navegación entre vistas |
| Fetch API | Consumo de la API REST |
| Vercel | Despliegue en producción |

## Instalación y uso local

### Requisitos previos

- Node.js v16 o superior
- npm o yarn
- Backend de ADIIC corriendo localmente o en Render

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/jcarrietab1974/Front_ADIIC.git

# 2. Ingresar al directorio
cd Front_ADIIC

# 3. Instalar dependencias
npm install

# 4. Crear archivo de variables de entorno
cp .env.example .env
# Editar .env y agregar la URL del backend

# 5. Iniciar en modo desarrollo
npm start
```

La aplicación estará disponible en `http://localhost:3000`.

## Variables de entorno

Crea un archivo `.env` en la raíz del proyecto con la siguiente variable:

```env
REACT_APP_API_URL=https://tu-backend-en-render.com
```

## Estructura del proyecto

```
src/
├── components/       # Componentes reutilizables
├── pages/            # Vistas principales de la aplicación
├── services/         # Llamadas a la API REST
├── App.js            # Componente raíz y rutas
└── index.js          # Punto de entrada
```

## Scripts disponibles

```bash
npm start       # Inicia el servidor de desarrollo
npm run build   # Genera el build de producción
npm test        # Ejecuta las pruebas
```

## Despliegue

El frontend está desplegado en **Vercel**. Cada push a la rama `main` genera un despliegue automático.

🔗 [https://front-adiic.vercel.app](https://front-adiic.vercel.app)

## Autor

**Juan Carlos Arrieta Bustos**
**Richard Pardo Cardona**
Desarrollador Web Fullstack — React · Node.js · MongoDB  
🔗 [LinkedIn](https://www.linkedin.com/in/juan-carlos-arrieta-bustos-247212219)  
🐙 [GitHub](https://github.com/jcarrietab1974)

---

## Licencia

Este proyecto está bajo la licencia MIT. Consulta el archivo [license](./license) para más detalles.project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
