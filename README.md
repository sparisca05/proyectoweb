# Sistema de Gestión de Eventos EIA 🎉

Un sistema web completo para la gestión y participación en eventos desarrollado con **Spring Boot**, **React** y **PostgreSQL**. Este proyecto permite a los usuarios crear, gestionar y participar en eventos de manera eficiente, con diferentes roles y funcionalidades específicas.

## 🚀 Características Principales

### 🔐 Sistema de Autenticación y Autorización

-   **JWT (JSON Web Tokens)** para autenticación segura
-   **Roles de usuario**: Administrador y Participante
-   **Registro e inicio de sesión** con validación

### 📅 Gestión de Eventos

-   **Creación de eventos** (solo administradores)
-   **Eventos públicos y privados** con clave de acceso
-   **Fechas y horarios** personalizables
-   **Imágenes de eventos** con integración a Cloudinary
-   **Empresas patrocinadoras** asociadas a eventos
-   **Invitados externos** y organizaciones participantes

### 👥 Participación y Comunidad

-   **Inscripción a eventos** públicos y privados
-   **Sistema de comentarios** en eventos
-   **Gestión de participantes** e invitados
-   **Historial de eventos** para usuarios

### 📊 Reportes y Estadísticas

-   **Generación de reportes PDF** con jsPDF
-   **Reportes generales** de todos los eventos
-   **Reportes individuales** por evento
-   **Exportación de listas** de participantes

### 🔍 Funcionalidades de Búsqueda y Filtrado

-   **Búsqueda por nombre**, tipo y organizador
-   **Filtros por tipo** de evento
-   **Filtros por estado** (Activo/Pasado)
-   **Filtros por visibilidad** (Público/Privado)

## 🛠️ Tecnologías Utilizadas

### Backend

-   **Java 17** con **Spring Boot 3.3.3**
-   **Spring Security** para autenticación y autorización
-   **Spring Data JPA** para persistencia de datos
-   **PostgreSQL** como base de datos principal
-   **JWT** para manejo de tokens
-   **Cloudinary** para almacenamiento de imágenes
-   **Maven** como gestor de dependencias

### Frontend

-   **React 18** con **TypeScript**
-   **Vite** como bundler y servidor de desarrollo
-   **React Router DOM** para navegación
-   **Axios** para peticiones HTTP
-   **React Icons** para iconografía
-   **jsPDF** para generación de reportes PDF
-   **Bootstrap** para estilos base

### DevOps y Contenedores

-   **Docker** para containerización
-   **PostgreSQL** en contenedor
-   **Variables de entorno** para configuración

## 📋 Prerrequisitos

-   **Node.js** (versión 18 o superior)
-   **Java 17** o superior
-   **Docker**
-   **Maven** (opcional, incluido en el proyecto)

## 🚀 Acceso

**Link público:** https://proyectoweb-liart.vercel.app

## 📁 Estructura del Proyecto

```
proyectoweb/
├── backend/                 # Aplicación Spring Boot
│   ├── src/
│   │   ├── main/java/com/example/proyectoweb/
│   │   │   ├── auth/        # Autenticación y JWT
│   │   │   ├── config/      # Configuraciones
│   │   │   ├── controllers/ # Controladores REST
│   │   │   ├── dto/         # Data Transfer Objects
│   │   │   ├── entity/      # Entidades JPA
│   │   │   ├── repositories/# Repositorios
│   │   │   └── services/    # Lógica de negocio
│   │   └── resources/
│   │       └── application.properties
│   ├── Dockerfile
│   └── pom.xml
├── frontend/               # Aplicación React
│   ├── src/
│   │   ├── api/           # Servicios HTTP
│   │   ├── components/    # Componentes reutilizables
│   │   ├── contexts/      # Context API
│   │   ├── screens/       # Páginas principales
│   │   └── assets/        # Recursos estáticos
│   ├── Dockerfile
│   └── package.json
└── README.md              # Este archivo
```

## 🎯 Funcionalidades por Rol

### 👑 Administrador

-   ✅ Crear, editar y eliminar eventos
-   ✅ Gestionar participantes e invitados
-   ✅ Ver reportes completos de todos los eventos
-   ✅ Administrar empresas patrocinadoras
-   ✅ Acceso a panel de estadísticas

### 👤 Participante

-   ✅ Ver eventos públicos y activos
-   ✅ Inscribirse a eventos públicos y privados
-   ✅ Ver historial de eventos propios
-   ✅ Comentar en eventos
-   ✅ Generar reportes de eventos propios

## 🌐 Endpoints Principales

### Autenticación

-   `POST /api/v1/auth/register` - Registro de usuario
-   `POST /api/v1/auth/authenticate` - Inicio de sesión

### Eventos

-   `GET /api/v1/eventos` - Listar todos los eventos
-   `GET /api/v1/eventos/activos` - Eventos activos
-   `GET /api/v1/eventos/{id}` - Obtener evento por ID
-   `POST /api/v1/eventos/nuevo-evento` - Crear evento
-   `PUT /api/v1/eventos/{id}` - Actualizar evento
-   `DELETE /api/v1/eventos/{id}` - Eliminar evento

### Participación

-   `PUT /api/v1/eventos/{id}/agregar-participante-publico` - Inscribirse a evento público
-   `PUT /api/v1/eventos/{id}/agregar-participante-privado` - Inscribirse a evento privado
-   `DELETE /api/v1/eventos/{id}/eliminar-participante` - Dejar de participar

### Usuarios

-   `GET /api/v1/usuario/perfil` - Obtener perfil del usuario
-   `GET /api/v1/usuario/mis-eventos` - Eventos del usuario
-   `PUT /api/v1/usuario/{id}` - Actualizar usuario

## 🎨 Características de la UI

-   **Diseño responsivo** que se adapta a dispositivos móviles y desktop
-   **Tema oscuro** con colores azul y negro
-   **Iconografía intuitiva** para acciones y estados
-   **Animaciones suaves** para mejor experiencia de usuario
-   **Notificaciones** y confirmaciones para acciones importantes

## 🔒 Seguridad

-   **Autenticación JWT** con tokens seguros
-   **Autorización basada en roles** con Spring Security
-   **Validación de datos** en frontend y backend
-   **Protección CORS** configurada
-   **Encriptación de contraseñas** con BCrypt

## 📧 Notificaciones por Email

El sistema incluye notificaciones automáticas por email para:

-   ✅ Confirmación de registro en eventos
-   ✅ Recordatorios de eventos próximos
-   ✅ Cambios en eventos registrados

## 📝 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 👥 Autores

-   **Equipo de Desarrollo** - Simón Parisca y Fernando Mesino
-   **Curso**: Ingeniería Web 2025-1

## 🐛 Reporte de Problemas

Si encuentras algún problema o tienes sugerencias, por favor abre un [issue](../../issues) en el repositorio.

## 📞 Soporte

Para soporte técnico o preguntas sobre el proyecto, contacta al equipo de desarrollo a través de los canales oficiales de la Universidad EIA.

---

⭐ **¡No olvides dar una estrella al proyecto si te ha sido útil!** ⭐
