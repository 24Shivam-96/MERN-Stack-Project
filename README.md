# MERN Todo App - Frontend

A modern, full-stack todo application built with React, Node.js, Express, and MongoDB.

## Features

- **Authentication System**: User registration and login
- **Todo Management**: Create, read, update, and delete todos
- **Real-time Updates**: Socket.io integration for real-time collaboration
- **Responsive Design**: Beautiful UI with Tailwind CSS
- **Modern Stack**: React 19, Vite, Express, MongoDB

## Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS, Socket.io-client
- **Backend**: Node.js, Express.js, MongoDB, Socket.io
- **Authentication**: JWT tokens, bcryptjs
- **Deployment**: Netlify (Frontend), Render (Backend)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB database

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mern-todo-app-main
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   npm run install:backend

   # Install frontend dependencies
   npm run install:frontend
   ```

3. **Environment Setup**

   Create a `.env` file in the root directory:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   NODE_ENV=development
   ```

4. **Start the development servers**

   ```bash
   # Terminal 1: Start the backend server
   npm run dev

   # Terminal 2: Start the frontend development server
   cd frontend
   npm run dev
   ```

   The application will be available at:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable React components
│   │   ├── Auth.jsx        # Authentication component
│   │   ├── TodoList.jsx    # Todo list component
│   │   └── TodoItem.jsx    # Individual todo item component
│   ├── App.jsx             # Main application component
│   ├── main.jsx            # Application entry point
│   └── index.css           # Global styles
├── index.html              # HTML template
└── vite.config.js          # Vite configuration
```

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the app for production
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint

## Deployment

### Frontend (Netlify)

1. Build the frontend:
   ```bash
   npm run build:frontend
   ```

2. Deploy the `frontend/dist` folder to Netlify

### Backend (Render)

1. Deploy the backend code to Render
2. Set environment variables in Render dashboard
3. Update the frontend API calls to point to your deployed backend URL

## API Endpoints

- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/todos` - Get all todos for authenticated user
- `POST /api/todos` - Create a new todo
- `PATCH /api/todos/:id` - Update a todo
- `DELETE /api/todos/:id` - Delete a todo

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.
