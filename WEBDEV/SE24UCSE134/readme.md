## Tech Stack Overview

### **Backend**

- **TypeScript** - Strongly typed JavaScript for better development experience
- **Express** - Web application framework for Node.js
- **PostgreSQL** - Robust relational database system
- **Prisma** - Modern database toolkit and ORM
- **Bun** - Fast JavaScript runtime and package manager (primary)
- **Additional Backend Libraries:**
  - JWT authentication (`jsonwebtoken`)
  - Password hashing (`bcryptjs`)
  - Input validation (`zod`)
  - CORS handling (`cors`)
  - Request logging (`morgan`)

### **Frontend** ⚡

- **React** - UI library for building user interfaces
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful UI components built on Radix UI
- **React Router** - Client-side routing
- **Axios** - HTTP client for API requests

### **Database & ORM**

- **PostgreSQL** - Primary database (containerized with Docker)
- **Prisma** - Database toolkit with type-safe queries and migrations

### **Development Tools**

- **Bun** (preferred) / **npm** - Package management and runtime
- **ESLint** - Code linting
- **Docker** - PostgreSQL containerization
- **ts-node** - TypeScript execution

## Setup Instructions

### Backend Setup (Complete this first)

1. Change to the backend directory:

   ```bash
   cd WEBDEV/SE24UCSE134/backend
   ```

2. Install dependencies (Bun is highly recommended):

   ```bash
   bun install
   ```

   Alternatively, you can use npm:

   ```bash
   npm install
   ```

3. Set up your environment variables:
   - Check the `.env.example` file in the backend folder
   - Create your own `.env` file based on the example

4. Spin up a PostgreSQL instance:

   ```bash
   docker run --name my-postgres -e POSTGRES_PASSWORD=mysecret -p 5432:5432 -d postgres
   ```

5. Check if PostgreSQL is running:

   ```bash
   psql -U postgres -h localhost
   ```

6. Push the database schema:

   ```bash
   bunx prisma db push #npx if npm
   ```

7. Generate Prisma client:

   ```bash
   bunx prisma generate
   ```

8. (Optional) Seed the database with dummy data:

   ```bash
   bunx prisma db seed
   ```

9. Start the backend development server:
   ```bash
   bun run dev
   ```

### Frontend Setup (After backend is running)

1. Open a new terminal and change to the frontend directory:

   ```bash
   cd WEBDEV/SE24UCSE134/frontend
   ```

2. Install dependencies (Bun is highly recommended):

   ```bash
   bun install
   ```

   Alternatively, you can use npm:

   ```bash
   npm install
   ```

3. Set up your environment variables:
   - Check the `.env.example` file in the frontend folder
   - Create your own `.env` file based on the example
   - Make sure the backend URL/port matches your backend configuration

4. Start the frontend development server:
   ```bash
   bun run dev
   ```

---

## Environment Configuration

**Important:** Make sure to check the `.env.example` files in both the `backend`
and `frontend` folders and create your own `.env` files based on them.

**Note:** If you change the backend port, don't forget to update it in the
frontend environment variables as well to ensure proper communication between
the frontend and backend.

**Note:** Both backend and frontend servers need to be running simultaneously
for the application to work properly.
