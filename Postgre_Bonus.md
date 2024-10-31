# PostgreSQL & Prisma ORM Setup Guide

## Part 1: PostgreSQL Basics

### What is PostgreSQL?
PostgreSQL (often called "Postgres") is a powerful, open-source relational database system with over 30 years of active development. Key features include:
- Strong reliability and data integrity
- Support for complex queries
- Extensible with custom functions and data types
- ACID compliance (Atomicity, Consistency, Isolation, Durability)
- Active community and extensive documentation

### Installation Guide

#### For macOS:
1. Using Homebrew:
```bash
brew install postgresql@15
```
2. Start PostgreSQL service:
```bash
brew services start postgresql@15
```

#### For Windows:
1. Download installer from official website: https://www.postgresql.org/download/windows/
2. Run installer and follow setup wizard
3. Keep note of your superuser (postgres) password
4. Installation includes pgAdmin (GUI tool)

#### For Linux (Ubuntu):
```bash
# Add PostgreSQL repository
sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -

# Update package list
sudo apt-get update

# Install PostgreSQL
sudo apt-get install postgresql postgresql-contrib
```

### Verifying Installation
```bash
# Check PostgreSQL version
psql --version

# Connect to PostgreSQL
psql -U postgres
```

### Creating Database and Tables

#### 1. Connect to PostgreSQL
```bash
psql -U postgres
```

#### 2. Create Database
```sql
CREATE DATABASE todo_app;
```

#### 3. Connect to the Database
```sql
\c todo_app
```

#### 4. Create Tables
```sql
-- Users table
CREATE TABLE users (
    uid SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Todos table
CREATE TABLE todos (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(uid) ON DELETE CASCADE,
    task_text TEXT NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Optional: Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_todos_updated_at
    BEFORE UPDATE ON todos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

### Basic PostgreSQL Commands
```sql
-- List all databases
\l

-- List all tables in current database
\dt

-- Describe table structure
\d table_name

-- Create user
CREATE USER myuser WITH PASSWORD 'mypassword';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE todo_app TO myuser;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO myuser;
```

### Environment Requirements
- Minimum PostgreSQL version: 12 or higher
- Recommended disk space: 100MB minimum for installation
- RAM: 1GB minimum (recommended 2GB+)
- Port 5432 should be available (default PostgreSQL port)

## Part 2: Prisma ORM Setup (Bonus Section)

### What is an ORM?
An Object-Relational Mapping (ORM) is a technique that lets you query and manipulate data from a database using object-oriented programming. Benefits include:
- Type safety
- Automatic SQL query generation
- Database schema management
- Reduced boilerplate code
- Better security (SQL injection prevention)

### Setting Up Prisma

#### 1. Initialize Project and Install Dependencies
```bash
# Initialize a new Node.js project if haven't already
npm init -y

# Install Prisma dependencies
npm install prisma --save-dev
npm install @prisma/client
```

#### 2. Initialize Prisma
```bash
npx prisma init
```

#### 3. Configure Database URL
In `.env` file:
```
DATABASE_URL="postgresql://username:password@localhost:5432/todo_app?schema=public"
```

#### 4. Create Prisma Schema
In `prisma/schema.prisma`:
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  uid       Int      @id @default(autoincrement())
  username  String   @unique
  password  String
  createdAt DateTime @default(now()) @map("created_at")
  todos     Todo[]

  @@map("users")
}

model Todo {
  id          Int      @id @default(autoincrement())
  userId      Int      @map("user_id")
  taskText    String   @map("task_text")
  isCompleted Boolean  @default(false) @map("is_completed")
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")
  user        User     @relation(fields: [userId], references: [uid], onDelete: Cascade)

  @@map("todos")
}
```

#### 5. Create and Apply Migrations
```bash
# Create migration
npx prisma migrate dev --name init

# Apply migration to database
npx prisma migrate deploy
```

#### 6. Generate Prisma Client
```bash
npx prisma generate
```

### Using Prisma in Your Application

#### 1. Create Database Client
```typescript
// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default prisma
```

#### 2. Example Usage
```typescript
// Create a new user
const createUser = async (username: string, hashedPassword: string) => {
  const user = await prisma.user.create({
    data: {
      username,
      password: hashedPassword,
    },
  })
  return user
}

// Create a todo
const createTodo = async (userId: number, taskText: string) => {
  const todo = await prisma.todo.create({
    data: {
      userId,
      taskText,
    },
  })
  return todo
}

// Get user's todos
const getUserTodos = async (userId: number) => {
  const todos = await prisma.todo.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
  return todos
}
```

### Best Practices
1. **Environment Variables**
   - Never commit .env files
   - Use .env.example for template
   - Use different databases for development/production

2. **Migrations**
   - Always review migration files before applying
   - Test migrations on development database first
   - Keep migrations versioned in source control

3. **Connection Management**
   - Use a single PrismaClient instance
   - Implement connection pooling for production
   - Handle connection errors gracefully

### Useful Prisma Commands
```bash
# Format schema
npx prisma format

# Open Prisma Studio (GUI)
npx prisma studio

# Reset database (careful!)
npx prisma reset

# Check migration status
npx prisma migrate status
```
