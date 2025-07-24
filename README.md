# <div align="center"><img src="./src/public/logo.png" width="500" heigth="500"></div>

> API RESTful para **Planit**, un gestor de tareas divertido y creativo.  
> Soporta **JWT Auth**, **Google OAuth2**, **validación con DTOs**, **Prisma ORM** y **PostgreSQL**.

---

## 🧰 Tech Stack

![NestJS](https://img.shields.io/badge/NestJS-E0234E?logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)
![Passport.js](https://img.shields.io/badge/Passport.js-34E27A?logo=passport&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?logo=jsonwebtokens&logoColor=white)
![Class Validator](https://img.shields.io/badge/class--validator-ff6b6b)
![ESLint](https://img.shields.io/badge/ESLint-4B32C3?logo=eslint&logoColor=white)

---

## ✨ Features

- 🔐 **Autenticación JWT**
- 🟢 **Login con Google OAuth 2.0**
- ✅ **Validación con DTOs (`class-validator`)**
- 🧭 **Rutas protegidas con `@UseGuards(AuthGuard('jwt'))`**
- 🧱 **Prisma ORM + PostgreSQL** con tipos estrictos
- 🧺 **Manejo claro de errores con `HttpException`**
- 🧩 **Decorador `@CurrentUser()`** para extraer el usuario del token

---

## 📂 Estructura del proyecto

```
src/
├── auth/
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── auth.module.ts
│   ├── dto/
│   │   ├── login.dto.ts
│   │   └── register.dto.ts
│   └── strategies/
│       ├── jwt.strategy.ts
│       └── google.strategy.ts
├── users/
│   ├── users.controller.ts
│   ├── users.service.ts
│   └── users.module.ts
├── tasks/
│   ├── tasks.controller.ts
│   ├── tasks.service.ts
│   └── dto/
│       ├── create-task.dto.ts
│       └── update-task.dto.ts
├── common/
│   ├── decorators/current-user.decorator.ts
│   └── enums/
│       ├── priority.enum.ts
│       └── status.enum.ts
└── prisma/
    ├── prisma.service.ts
    └── schema.prisma
```

---

## 🛠️ Instalación & Setup

```bash
# 1) Clonar
git clone https://github.com/martin-tavella/planit-api.git
cd planit-api

# 2) Instalar dependencias
npm install

# 3) Variables de entorno
cp .env.example .env

# 4) Migraciones Prisma
npx prisma migrate dev

# 5) Generar el cliente de Prisma
npx prisma generate

# 6) Levantar el servidor
npm run start:dev
```

### 📄 `.env` (ejemplo)

```env
# DB
DATABASE_URL="postgresql://user:password@localhost:5432/planit"

# JWT
JWT_SECRET="supersecret"
JWT_EXPIRES_IN="1d"

# Google OAuth
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
GOOGLE_CALLBACK_URL="http://localhost:3000/auth/google/redirect"
```

---

## 🔐 Autenticación

### JWT Flow

- `POST /auth/register` → Registro del usuario (password hasheado con bcrypt).
- `POST /auth/login` → Devuelve `access_token` (JWT).
- Rutas protegidas usan: `@UseGuards(AuthGuard('jwt'))`.

### Google OAuth2 Flow

- `GET /auth/google` → Redirige a Google.
- `GET /auth/google/redirect` → Recibe el perfil, crea o loguea al usuario y retorna **JWT propio**.

---

## 📚 Endpoints

### 🔑 Auth

#### `POST /auth/register`
Registra usuario y devuelve JWT.

**Body**
```json
{
  "name": "Martín",
  "email": "martin@mail.com",
  "password": "supersegura123"
}
```

#### `POST /auth/login`
Devuelve JWT si las credenciales son correctas.

**Body**
```json
{
  "email": "martin@mail.com",
  "password": "supersegura123"
}
```

**Response**
```json
{
  "access_token": "..."
}
```

#### `GET /auth/google`
Inicia el flujo de auth con Google.

#### `GET /auth/google/redirect`
Callback de Google. Devuelve tu propio JWT.

---

### 👤 Users

#### `GET /users/email/:email`
Busca un usuario por email.

#### `GET /users/id/:id`
Busca un usuario por id.

---

### ✅ Tasks (todas protegidas por JWT)

#### `GET /tasks`
Lista **solo** las tareas del usuario autenticado.

#### `POST /tasks/create`
Crea una tarea para el usuario autenticado.

**Body**
```json
{
  "title": "Implementar DTOs",
  "description": "Crear CreateTaskDto y UpdateTaskDto",
  "status": "pending",
  "priority": "medium",
  "deadline": "2025-08-01T00:00:00.000Z"
}
```

#### `PUT /tasks/update/:id`
Actualiza una tarea **del usuario autenticado**.

#### `DELETE /tasks/delete/:id`
Elimina una tarea **del usuario autenticado**.

---

## 🧾 DTOs relevantes

### `CreateTaskDto`
```ts
title: string;
description?: string;
status: 'pending' | 'in_progress' | 'completed';
priority: 'low' | 'medium' | 'high';
deadline?: Date;
```

### `UpdateTaskDto`
Hereda de `CreateTaskDto` con `PartialType` → todas las props son **opcionales**.

---

## 🧠 Enums

```ts
export enum TaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}
```

---

## 🛡️ Seguridad & Buenas prácticas

- **`AuthGuard('jwt')`** para rutas protegidas.
- **Decorador `@CurrentUser()`** para extraer `{ userId, email }` del token.
- **Validaciones con `class-validator` y DTOs** en cada endpoint.
- **Errores consistentes** usando `HttpException` y derivados (`UnauthorizedException`, `NotFoundException`, etc.).
- (Opcional) **`AllExceptionsFilter` global** para formatear respuestas de error.

---

## 🧭 Roadmap

- [ ] Refresh Tokens
- [ ] Recuperación de contraseña vía email
- [ ] Paginación y filtros avanzados en `/tasks`
- [ ] Soft deletes
- [ ] Roles & permisos (admin / user)
- [ ] Tests unitarios y e2e (Jest / Pactum / Supertest)

---

## 🤝 Contribuir

1. Fork del repo
2. `git checkout -b feature/nueva-feature`
3. Commit & push
4. Pull Request 🚀

---

## 👨‍💻 Autor

**Martín Tavella**  
Fullstack Dev — JS/TS • NestJS • Next.js • Prisma • PostgreSQL  
GitHub: [martin-tavella](https://github.com/martin-tavella)

---

## 📝 Licencia

Este proyecto está bajo la licencia MIT.
