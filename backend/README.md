# The Blog App - Backend API

This is the backend API for The Blog App, providing a robust RESTful service for blog management with user authentication, content creation, and social interactions.

## 📋 Table of Contents

- [API Overview](#api-overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Authentication](#authentication)
- [Database Models](#database-models)
- [Development Setup](#development-setup)

## 🔍 API Overview

This backend API provides all the necessary endpoints for a full-featured blog application, including:

- User authentication (register, login, logout)
- User profile management
- Blog post CRUD operations
- Social interactions (likes, dislikes, comments)
- Content search functionality

## 🛠️ Tech Stack

- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **MongoDB**: NoSQL database
- **Mongoose**: ODM for MongoDB
- **JWT**: Authentication mechanism
- **bcrypt**: Password hashing
- **sanitize-html**: Content sanitization
- **cookie-parser**: Cookie handling
- **dotenv**: Environment variable management

## 📁 Project Structure

```
src/
├── config/          # Configuration files
│   └── db.js        # Database connection setup
├── controller/      # Request handlers
│   ├── auth.controller.js    # Authentication logic
│   ├── blog.controller.js    # Blog operations
│   └── user.controller.js    # User profile operations
├── middleware/      # Custom middleware
│   └── authMiddleware.js     # JWT authentication middleware
├── models/          # Database schemas
│   ├── blog.model.js        # Blog schema
│   └── user.model.js        # User schema
├── routes/          # API routes
│   ├── auth.route.js        # Authentication routes
│   ├── blog.route.js        # Blog routes
│   └── user.route.js        # User routes
├── utils/           # Utility functions
│   └── generateToken.js     # JWT token generation
└── server.js        # Main application entry point
```

## 📚 API Documentation

### Base URL

```
http://localhost:10000/api/v1
```

### Authentication Endpoints

#### Register a new user

```
POST /auth/register
```

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "success": true,
  "message": "User registered successfully",
  "_id": "user_id",
  "name": "John Doe",
  "email": "john@example.com"
}
```

#### Login

```
POST /auth/login
```

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "success": true,
  "message": "User logged in successfully",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "bio": "User bio",
    "socials": {
      "linkedin": "https://linkedin.com/in/johndoe",
      "instagram": "https://instagram.com/johndoe",
      "x": "https://x.com/johndoe"
    },
    "lastLogin": "2023-06-15T10:30:00.000Z"
  }
}
```

#### Logout

```
POST /auth/logout
```

**Response:**

```json
{
  "message": "User logged out successfully"
}
```

### User Endpoints

#### Get Current User Profile

```
GET /users/profile
```

**Response:**

```json
{
  "_id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "bio": "User bio",
  "socials": {
    "linkedin": "https://linkedin.com/in/johndoe",
    "instagram": "https://instagram.com/johndoe",
    "x": "https://x.com/johndoe"
  },
  "lastLogin": "2023-06-15T10:30:00.000Z"
}
```

#### Update User Profile

```
PUT /users/completeprofile
```

**Request Body:**

```json
{
  "name": "John Doe Updated",
  "bio": "Updated bio information",
  "socials": {
    "linkedin": "https://linkedin.com/in/johndoe",
    "instagram": "https://instagram.com/johndoe",
    "x": "https://x.com/johndoe"
  }
}
```

**Response:**

```json
{
  "_id": "user_id",
  "name": "John Doe Updated",
  "email": "john@example.com",
  "bio": "Updated bio information",
  "socials": {
    "linkedin": "https://linkedin.com/in/johndoe",
    "instagram": "https://instagram.com/johndoe",
    "x": "https://x.com/johndoe"
  },
  "lastLogin": "2023-06-15T10:30:00.000Z"
}
```

### Blog Endpoints

#### Get All Blogs

```
GET /blogs
```

**Query Parameters:**

- `search`: Optional search term for full-text search

**Response:**

```json
[
  {
    "_id": "blog_id",
    "title": "Blog Title",
    "content": "Blog content...",
    "author": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "likes": ["user_id1", "user_id2"],
    "dislikes": ["user_id3"],
    "comments": [
      {
        "_id": "comment_id",
        "user": {
          "_id": "user_id",
          "name": "Jane Doe"
        },
        "text": "Great post!",
        "createdAt": "2023-06-16T14:20:00.000Z"
      }
    ],
    "createdAt": "2023-06-15T10:30:00.000Z",
    "updatedAt": "2023-06-16T14:20:00.000Z",
    "likesCount": 2,
    "dislikesCount": 1,
    "commentsCount": 1
  }
]
```

#### Create a Blog

```
POST /blogs
```

**Request Body:**

```json
{
  "title": "New Blog Post",
  "content": "<p>This is the content of my blog post.</p>"
}
```

**Response:**

```json
{
  "_id": "blog_id",
  "title": "New Blog Post",
  "content": "<p>This is the content of my blog post.</p>",
  "author": "user_id",
  "likes": [],
  "dislikes": [],
  "comments": [],
  "createdAt": "2023-06-17T09:45:00.000Z",
  "updatedAt": "2023-06-17T09:45:00.000Z"
}
```

#### Like a Blog

```
PUT /blogs/:id/like
```

**Response:**

```json
{
  "message": "Blog liked successfully",
  "likes": ["user_id1", "user_id2"],
  "dislikes": ["user_id3"],
  "likesCount": 2,
  "dislikesCount": 1
}
```

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication, stored in HTTP-only cookies. Protected routes are secured using the `protect` middleware, which verifies the token from either:

1. The `jwt` cookie
2. The `Authorization` header (format: `Bearer <token>`)

If authentication fails, a 401 Unauthorized response is returned.

## 📊 Database Models

### User Model

The User model includes fields for basic user information, social media links, and virtual fields for relationships with blogs:

- **name**: String (required)
- **email**: String (required, unique)
- **password**: String (required, hidden from queries)
- **bio**: String
- **socials**: Object with LinkedIn, Instagram, and X/Twitter links
- **lastLogin**: Date

### Blog Model

The Blog model represents blog posts with content, author information, and social interactions:

- **title**: String (required)
- **content**: String (required, sanitized HTML)
- **author**: Reference to User model
- **likes**: Array of User references
- **dislikes**: Array of User references
- **comments**: Array of embedded documents with user reference, text, and timestamp

## 🚀 Development Setup

### Prerequisites

- Node.js (v14 or higher)
- MongoDB

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the root directory with:
   ```
   PORT=10000
   MONGO_URL=mongodb://localhost:27017/
   DB_NAME=blog_app
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRES=7d
   NODE_ENV=development
   ```

3. Start the development server:
   ```bash
   npm run backend
   ```

4. The API will be available at `http://localhost:10000`

## 🧪 Testing

You can test the API using the included Postman collection:

```
The-Blog-App[Backend Diaries].postman_collection.json
```

Import this file into Postman to access pre-configured API requests for testing all endpoints.