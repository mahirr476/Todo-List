# Development Guide - Todo List App

## First steps: 

1. Create a directory format. Discuss together how you want to setup the project structure. 
- There are many ways to set this up, a common way is to have an App folder that holds your 'client' directory (front end directory) and a 'server' directory (nodejs directory)
- both of these will be separate run environments and they should depend on each other for a functioning app
  

## Front-end: 

## Overview
This guide outlines implementing a simple to-do list application with user authentication. The application will consist of three main pages: Login, Dashboard, and User Settings.

## Technology Stack Recommendations

- NextJS
- shadcn/ui

## Page Structure

### 1. Login Page (`/login`)
**Components Required:**
- Login form with:
  - Username input
  - Password input
  - Login button
  - "Register" link (if implementing registration)

**Design Guidelines:**
- Center the login form on the page
- Include form validation for empty fields
- Display error messages for invalid credentials
- Redirect to the dashboard upon successful login

### 2. Navigation Bar
**Components Required:**
- Logo/App name
- Navigation links:
  - Dashboard
  - User Settings
- Logout button (right-aligned)

**Implementation Notes:**
- Navigation bar should be visible on all pages except login
- Use React Router's `Link` components for navigation
- Implement active state styling for current page
- Confirm logout action before processing

### 3. Dashboard Page (`/dashboard`)
**Components Required:**
- Todo List Container
  - Add new todo input field
  - Add button
  - List of todos
  - Each todo item should have:
    - Checkbox for completion
    - Todo text
    - Delete button

**Implementation Notes:**
- Keep the todo input field simple (single-line text)
- Add new todos at the top of the list
- Show visual feedback for completed todos (strikethrough)
- Implement simple animations for adding/removing todos (optional)

### 4. User Settings Page (`/settings`)
**Components Required:**
- User information form:
  - Username input (current username as the default value)
  - Current password input
  - New password input
  - Confirm new password input
  - Save changes button

**Implementation Notes:**
- Include password confirmation validation
- Show success/error messages after save attempt
- Implement form validation for all fields

## API Integration Points (@pitash use this to know what API routes to create, @Samsul will use these routes whenever an API call is needed within a function)
You'll need to integrate with the following API endpoints:
1. Login: POST `/api/auth/login`
2. Logout: POST `/api/auth/logout`
3. Get Todos: GET `/api/todos`
4. Add Todo: POST `/api/todos`
5. Update Todo: PUT `/api/todos/:id`
6. Delete Todo: DELETE `/api/todos/:id`
7. Update User Settings: PUT `/api/user/settings`

## Error Handling
- Implement proper error handling for API calls
- Display user-friendly error messages (Toast opportunity)

--------------------------------

# Backend Development Guide - Todo List App

## Database Structure

### User Table
```sql
CREATE TABLE users (
    uid SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,  -- Store hashed passwords only
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Todo Table
```sql
CREATE TABLE todos (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(uid),
    task_text TEXT NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```


## Implementation Requirements

### Security Requirements
1. Password Hashing
   - Use bcrypt for password hashing
   - Minimum password length: 8 characters

2. Authentication
   - Implement JWT token-based authentication
   - Token expiration: 24 hours
   - Include middleware for protected routes

3. Input Validation
   - Sanitize all input data (optional)
   - Validate username format
   - Enforce password strength requirements

### Error Handling
Implement standard error responses:
```json
{
    "error": {
        "code": "ERROR_CODE",
        "message": "User-friendly error message"
    }
}
```

### Middleware Requirements
1. Authentication Middleware
   - Verify JWT tokens
   - Attach user info to request
   - Handle expired tokens

2. Request Validation Middleware
   - Validate request bodies
   - Sanitize inputs
   - Type checking

## Project Structure
```
src/
├── config/
│   ├── database.js
│   └── jwt.js
├── middlewares/
│   ├── auth.js
│   └── validation.js
├── routes/
│   ├── auth.js
│   ├── todos.js
│   └── user.js
├── controllers/
│   ├── authController.js
│   ├── todoController.js
│   └── userController.js
├── models/
│   ├── User.js
│   └── Todo.js
└── server.js
```

## Implementation Steps
1. Set up project structure and install dependencies
2. Configure database connection
3. Implement database models
4. Create authentication middleware
5. Implement routes in the following order:
   - Authentication (login/logout)
   - Todo CRUD operations
   - User settings updates
6. Add input validation
7. Implement error handling


# Bonus Feature: Toast Notifications with shadcn/ui (For Samsul mainly) 

## Overview
Adding toast notifications will improve user feedback for actions like:
- Successful/failed login
- Todo creation/deletion
- Settings updates
- Error messages

## Setting up shadcn/ui Toast

### 1. Installation
First, install shadcn/ui toast component:
```bash
npx shadcn-ui@latest add toast
```

### 2. Implement Toaster Component
Add the Toaster component to your layout:

```jsx
// src/App.jsx or your root layout
import { Toaster } from "@/components/ui/toaster"

function App() {
  return (
    <>
      {/* Your other components */}
      <Toaster />
    </>
  )
}
```

### 3. Using Toast
Import and use the toast function:

```jsx
import { useToast } from "@/components/ui/use-toast"

export function TodoList() {
  const { toast } = useToast()

  const addTodo = async (task) => {
    try {
      await api.createTodo(task)
      toast({
        title: "Success!",
        description: "Todo added successfully",
        duration: 2000,
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add todo",
      })
    }
  }
}
```

## Recommended Toast Implementation Points

### 1. Authentication
```jsx
// Login success
toast({
  title: "Welcome back!",
  description: "Successfully logged in",
})

// Login error
toast({
  variant: "destructive",
  title: "Login failed",
  description: "Invalid username or password",
})

// Logout
toast({
  title: "Goodbye!",
  description: "Successfully logged out",
})
```

### 2. Todo Operations
```jsx
// Add todo
toast({
  title: "Todo added",
  description: "New task created successfully",
})

// Complete todo
toast({
  title: "Task completed",
  description: "Great job!",
})

// Delete todo
toast({
  variant: "destructive",
  title: "Task deleted",
  description: "Todo removed successfully",
})
```

### 3. Settings Updates
```jsx
// Settings saved
toast({
  title: "Settings updated",
  description: "Your changes have been saved",
})

// Password changed
toast({
  title: "Success",
  description: "Password updated successfully",
})
```

## Creating a Toast Helper (Optional)
For consistent toast styling, consider creating a helper:

```jsx
// src/utils/toast-helper.js
import { useToast } from "@/components/ui/use-toast"

export const useToastHelper = () => {
  const { toast } = useToast()

  return {
    success: (title, description) => {
      toast({
        title,
        description,
        duration: 2000,
      })
    },
    
    error: (title, description) => {
      toast({
        variant: "destructive",
        title,
        description,
        duration: 3000,
      })
    },
    
    info: (title, description) => {
      toast({
        title,
        description,
        variant: "default",
        duration: 2500,
      })
    }
  }
}

// Usage in components:
const TodoItem = () => {
  const toast = useToastHelper()
  
  const handleDelete = async () => {
    try {
      await deleteTodo(id)
      toast.success("Success", "Todo deleted successfully")
    } catch (error) {
      toast.error("Error", "Failed to delete todo")
    }
  }
}
```

## Best Practices

1. **Duration**
   - Success messages: 2000ms
   - Error messages: 3000ms (give users more time to read errors)
   - Keep durations consistent across similar notifications

2. **Message Content**
   - Keep titles short (1-3 words)
   - Descriptions should be clear and concise
   - Use consistent language across all toasts

3. **Variants**
   - Use `default` for neutral information
   - Use `destructive` for errors and destructive actions
   - Be consistent with variant usage

4. **Position**
   - The default bottom-right position works well for most cases
   - Can be customized in the Toaster component if needed

## Tips for Implementation
1. Start with basic success/error toasts first
2. Add more detailed messages once basic functionality is working
3. Consider grouping similar notifications to avoid overwhelming users
4. Test toast visibility with different screen sizes

Remember: Toasts should enhance the user experience, not distract from it. Use them judiciously and ensure they provide valuable feedback to the user.
