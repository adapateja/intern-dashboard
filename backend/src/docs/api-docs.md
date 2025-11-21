# API Documentation

Base URL: `http://localhost:5000/api`

## Auth

### POST /auth/register
Body (JSON):
- name (string, required)
- email (string, required)
- password (string, min 6)

Response:
- token (JWT)
- user { id, name, email, bio }

### POST /auth/login
Body:
- email
- password

Response:
- token
- user { id, name, email, bio }

## Users

### GET /users/me
Headers:
- Authorization: Bearer <token>

Returns current user profile.

### PUT /users/me
Headers:
- Authorization: Bearer <token>

Body (JSON):
- name (optional)
- bio (optional)

## Tasks

### GET /tasks
Headers:
- Authorization: Bearer <token>

Query params:
- search (optional)
- status: pending | in-progress | completed (optional)

### POST /tasks
Headers:
- Authorization: Bearer <token>

Body:
- title (string, required)
- description (string, optional)
- status (pending|in-progress|completed, optional)

### PUT /tasks/:id
Headers:
- Authorization: Bearer <token>

Body:
- title, description, status (any subset)

### DELETE /tasks/:id
Headers:
- Authorization: Bearer <token>
