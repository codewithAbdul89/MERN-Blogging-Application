# Abdul's Blogging Platform

A full-stack MERN blogging platform built to bring together modern frontend development, backend APIs, authentication, database management, rich-text editing, file uploads, and server-state management.

The project is built as a practical learning project and focuses on building a complete application rather than only individual features.

---

## ✨ Features

### 🔐 Authentication & User Accounts

- User registration and login
- JWT-based authentication
- Short-lived access tokens
- Refresh-token based authentication
- HTTP-only cookies
- Email verification
- Forgot-password and reset-password flow
- Change password
- Google authentication
- Protected routes
- Profile management
- Profile picture upload

### 📝 Blogging

- Create blog posts
- Save blogs as drafts
- Publish and unpublish blogs
- Edit existing blogs
- Featured images
- Categories
- Tags
- Rich-text blog editor
- Blog search
- Category filtering
- Pagination / infinite loading
- Public blog pages

### ❤️ Social Features

- Like and unlike blogs
- Bookmark and remove bookmarks
- View liked blogs
- View bookmarked blogs
- Comments
- Comment replies
- Comment editing
- Comment deletion
- Pinned comments
- Hidden comments
- Reply counts

### 👤 User & Dashboard

- User profiles
- Profile statistics
- Dashboard overview
- My Blogs
- Draft blogs
- Published blogs
- Liked blogs
- Bookmarked blogs
- Profile completion flow

### 🎨 UI & UX

- Responsive design
- Tailwind CSS
- Dark/light theme support
- Framer Motion animations
- Toast notifications
- Reusable UI components
- Responsive rich-text editor
- Loading and error states

### 🛡️ Security & Backend Features

- Password hashing with bcrypt
- JWT authentication
- HTTP-only refresh-token cookies
- Request validation
- Rate limiting
- CORS configuration
- File upload validation
- Cloudinary image storage
- Sanitization of rendered blog HTML
- Centralized error handling

---

# 🛠️ Tech Stack

## Frontend

| Technology | Purpose |
|---|---|
| React | UI development |
| Vite | Frontend build tool |
| Tailwind CSS | Styling and responsive UI |
| React Router DOM | Routing |
| Redux Toolkit | Client-side state management |
| TanStack React Query | Server-state management and caching |
| React Hook Form | Form handling |
| Zod | Schema validation |
| Axios | API communication |
| Tiptap | Rich-text editor |
| DOMPurify | HTML sanitization |
| Framer Motion | Animations |
| React Hot Toast | Notifications |
| React Icons | Icons |
| Tailwind Merge | Managing dynamic Tailwind classes |

## Backend

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express.js | Backend/API framework |
| MongoDB | Database |
| Mongoose | MongoDB ODM |
| JWT | Authentication |
| bcrypt | Password hashing |
| Axios | HTTP requests |
| Multer | File uploads |
| Cloudinary | Image storage |
| Nodemailer | Email functionality |
| Google Auth Library | Google authentication |
| Express Validator | Request validation |
| Express Rate Limit | Rate limiting |
| Cookie Parser | Cookie handling |
| Node Cron | Scheduled tasks |
| Streamifier | File stream handling |
| Express Async Handler | Async request handling |

---

# 📁 Project Structure

```text
project-root/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   └── server.js
│   │
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── app/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── constants/
│   │   ├── context/
│   │   ├── features/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   └── package.json
│
└── README.md
```

---

# 🧠 Frontend Architecture

The frontend follows a feature-oriented structure.

```text
src/
├── api/
├── app/
├── components/
├── constants/
├── context/
├── features/
│   ├── auth/
│   ├── blog/
│   ├── category/
│   ├── comment/
│   └── user/
├── hooks/
├── layouts/
├── pages/
├── routes/
└── utils/
```

The application separates **client state** from **server state**.

### Redux Toolkit

Redux Toolkit is mainly used for application/client state such as authentication and current-user information.

### TanStack React Query

TanStack React Query is used for server data such as:

- Blogs
- Comments
- Categories
- User data
- Mutations
- Cache management
- Optimistic updates

This separation keeps server data from being unnecessarily duplicated inside Redux.

---

# 🔑 Authentication Flow

The application uses an access-token and refresh-token architecture.

```text
User Login
    │
    ▼
Backend verifies credentials
    │
    ├── Access Token
    │
    └── Refresh Token → HTTP-only Cookie
             │
             ▼
        Browser Cookie
```

When the access token expires:

```text
API Request
    │
    ▼
401 Unauthorized
    │
    ▼
Refresh Token Request
    │
    ▼
New Access Token
    │
    ▼
Retry Original Request
```

The refresh token is not directly accessible through JavaScript because it is stored in an HTTP-only cookie.

---

# 📝 Rich Text Editor

Blog content is written using **Tiptap**.

The editor supports rich formatting such as:

- Headings
- Bold
- Italic
- Lists
- Quotes
- Links
- Other StarterKit features

Blog HTML is sanitized with **DOMPurify** before being rendered to users.

---

# 🖼️ Image Uploads

Images are uploaded through the backend.

```text
React Frontend
      │
      ▼
Multipart/Form Data
      │
      ▼
Multer
      │
      ▼
File Validation
      │
      ▼
Cloudinary
      │
      ▼
Image URL / Public ID
      │
      ▼
MongoDB
```

Cloudinary is used for storing uploaded images instead of storing image files directly inside MongoDB.

---

# ⚙️ Environment Variables

Environment variables are required for both the frontend and backend.

## Backend

Create:

```text
backend/.env
```

Example:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string

JWT_ACCESS_SECRET=your_access_token_secret
JWT_REFRESH_SECRET=your_refresh_token_secret

CLIENT_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

EMAIL_USER=your_email
EMAIL_PASS=your_email_password

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=your_google_redirect_uri
```

> Use the exact variable names expected by your backend implementation. Never commit real secrets to GitHub.

## Frontend

Create:

```text
frontend/.env
```

Example:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

For production, replace the local backend URL with the deployed API URL.

---

# 🚀 Local Development

## 1. Clone the repository

```bash
git clone YOUR_REPOSITORY_URL
cd YOUR_REPOSITORY_FOLDER
```

## 2. Install backend dependencies

```bash
cd backend
npm install
```

## 3. Configure backend environment variables

Create the backend `.env` file and add the required values.

## 4. Start the backend

```bash
npm start
```

The backend runs using the configured server port.

## 5. Install frontend dependencies

Open another terminal:

```bash
cd frontend
npm install
```

## 6. Configure frontend environment variables

Create:

```text
frontend/.env
```

and set:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## 7. Start the frontend

```bash
npm run dev
```

Vite will provide the local development URL in the terminal.

---

# 📦 Production Build

Build the frontend with:

```bash
npm run build
```

Preview the production build locally with:

```bash
npm run preview
```

Before deployment, it is also useful to run:

```bash
npm run lint
```

---

# 🧪 Development Scripts

## Backend

```bash
npm start
```

Starts the backend using Nodemon.

## Frontend

```bash
npm run dev
```

Starts the Vite development server.

```bash
npm run build
```

Creates the production build.

```bash
npm run preview
```

Previews the production build.

```bash
npm run lint
```

Runs ESLint.

---

# 🗄️ Database

The application uses **MongoDB** with **Mongoose**.

Main data areas include:

```text
Users
Blogs
Categories
Comments
Likes
Bookmarks
```

Blog documents contain information such as titles, content, categories, tags, authors, featured images, publication status, likes, bookmarks, views, and comment counts.

---

# 🔒 Security Considerations

The application includes several security-related measures:

- Password hashing with bcrypt
- JWT-based authentication
- HTTP-only refresh-token cookies
- Request validation
- Rate limiting
- CORS configuration
- Uploaded-file validation
- HTML sanitization
- Protected frontend routes
- Protected backend routes
- Environment variables for sensitive configuration

Sensitive credentials should never be committed to the repository.

---

# 📚 What I Learned

This project has been one of my main learning experiences in full-stack development.

While building it, I learned how different technologies work together instead of studying each technology in isolation.

Some of the concepts I practiced include:

- REST API development
- MongoDB database design
- Mongoose
- JWT authentication
- Refresh-token authentication
- OAuth / Google authentication
- HTTP-only cookies
- React architecture
- Redux Toolkit
- Server-state management
- Query caching
- Optimistic updates
- Form handling
- Schema validation
- Rich-text editing
- File uploads
- Cloudinary
- Email services
- Responsive UI
- Error handling
- Security considerations
- Production-oriented project structure

One of the biggest lessons from the project has been that building a real application is not only about making individual features work. The frontend, backend, database, authentication, validation, security, and user experience all have to work together.

---

# 🎯 Future Improvements

Some areas I would like to continue improving include:

- More advanced search
- Improved performance and caching
- More comprehensive testing
- Additional security improvements
- Better monitoring and logging
- More advanced blog discovery features
- Further UI/UX improvements
- Cloud deployment and production optimization

---

# 👨‍💻 About Me

I am **Abdul Rehman**, a BS Computer Science student from Faisalabad, Pakistan, interested in software development, web technologies, and learning by building real projects.

This blogging platform is one part of my development journey, and I plan to continue improving it as I learn more.

---

## 📬 Connect With Me

- GitHub: https://github.com/codewithAbdul89
- LinkedIn: https://www.linkedin.com/in/abdul-rehman-826136353/

---

## ⭐ If You Find This Project Interesting

Feel free to explore the code, learn from the implementation, or use the project as inspiration for your own learning.

**Built with React, Node.js, Express, MongoDB, and a lot of debugging. 🚀**
