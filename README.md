<h1 align="center">📝 NodeScribe — MERN Stack Note-Taking App</h1>

<p align="center">
  <img src="/frontend/public/screenshot-for-readme.png" alt="NodeScribe Demo" width="80%" /> ss
</p>

---
**NodeScribe** is a full-stack note-taking application built using the **MERN stack** — MongoDB, Express.js, React, and Node.js. It allows users to create, update, and delete notes with a clean, responsive UI. 

This project was built as a **hands-on learning experience**, allowing me to explore backend APIs, secure deployment, rate-limiting with Redis, and responsive frontend design with React + Tailwind CSS. It demonstrates concepts applicable in modern web development, from REST APIs and HTTP status codes to CORS, middleware, and environment variable management.

---

## 🚀 Live Demo

> _[Add your deployment link here if available]_  
> Coming soon...

---

 ⚙️ Key Features & Technical Highlights
 <details> NodeScribe is designed to demonstrate a wide range of full-stack development concepts. Below are the core features and technical implementations that showcase real-world best practices in modern web development:

✅ Full-Stack MERN Architecture
Built using the MERN stack: MongoDB (NoSQL database), Express.js (web framework), React.js (frontend library), and Node.js (runtime environment).

Demonstrates clear separation of concerns with a modular folder structure for models, controllers, routes, and middleware.

🧠 RESTful API Design
Implements a fully functional REST API that supports GET, POST, PUT, and DELETE operations for managing notes.

Follows best practices such as idempotent operations, clear HTTP status code usage (e.g., 200 OK, 201 Created, 404 Not Found, 429 Too Many Requests, 500 Internal Server Error), and stateless communication.

Middleware architecture is used for extensibility, allowing custom logic like error handling and request logging.

📚 Rate Limiting with Upstash Redis
Integrates Upstash Redis to implement API rate limiting, ensuring fair usage and protecting the backend from abusive traffic patterns.

Configured to respond with 429 Too Many Requests status when rate limits are exceeded.

Highlights the importance of middleware in handling pre-processing of HTTP requests.

🔐 Environment Variable Management
Uses the dotenv package to securely manage sensitive data such as database credentials and API tokens.

.env file is excluded from version control using .gitignore to prevent accidental credential leaks.

🌐 Cross-Origin Resource Sharing (CORS)
Configures CORS to allow secure cross-origin requests from the frontend to the backend.

Explains browser-enforced security policies and how proper headers are required for accessing APIs from different origins.

🖥️ Responsive Frontend with React, Tailwind CSS, and DaisyUI
The frontend is built using React.js with Vite for faster bundling and hot module replacement.

Styled using Tailwind CSS and DaisyUI, providing a responsive and accessible UI across various screen sizes.

Incorporates React Router for seamless navigation and Axios for structured API communication.

🔄 Development and Tooling Workflow
Uses Nodemon for backend development to automatically reload the server on file changes.

Scripted startup processes via npm run dev for a clean and efficient development experience.

All dependencies are managed via npm with clearly defined devDependencies for tools like Tailwind, PostCSS, and DaisyUI.

💡 Conceptual Understanding Demonstrated
SQL vs NoSQL: Demonstrates practical usage of NoSQL (MongoDB) and explains use cases where it is more suitable than relational databases.

Middleware Patterns: Hands-on implementation of middleware functions for modular and reusable logic in the Express server.

API Security Practices: Usage of .env, rate limiting, and separation of frontend/backend enhances security and maintainability.

Client-Server Interaction: Emulates a real-world flow — frontend sends HTTP requests to REST API → API processes data → response is returned to client.

Component-Based UI Design: Follows modular design patterns using React components for scalability and maintainability.
</details>


## 🧪 Environment Setup

Create a `.env` file in your `/backend` directory with the following:

```env
MONGO_URI=<your_mongo_uri>

UPSTASH_REDIS_REST_URL=<your_upstash_redis_url>
UPSTASH_REDIS_REST_TOKEN=<your_upstash_redis_token>

NODE_ENV=development
```
🔐 Never commit .env to GitHub. Use .gitignore.
---
Project Structure
---

🧰 Getting Started
🔧 Backend Setup
bash
Copy
Edit
cd backend
npm install
npm run dev
Runs the backend on http://localhost:5001

💻 Frontend Setup
bash
Copy
Edit
cd frontend
npm install
npm run dev
Runs the frontend on http://localhost:5173

🧪 API Endpoints
Method	Endpoint	Description
GET	/api/notes	Get all notes
POST	/api/notes	Create a new note
PUT	/api/notes/:id	Update a specific note
DELETE	/api/notes/:id	Delete a specific note

🌍 Deployment
You can deploy NodeScribe easily using:

Frontend → Vercel / Netlify

Backend → Render / Railway / Cyclic

Database → MongoDB Atlas

Rate Limiting → Upstash Redis

A full deployment guide is included in the repo.

---
💡 Inspiration & Credit
Original base project: ThinkBoard by burakorkmez

This version — NodeScribe — enhances the idea with:

Redis-based rate limiting

Polished UI

Beginner-friendly documentation

Scalable structure and naming
---
🤝 Contributing
Feel free to fork, clone, and submit pull requests! For major changes, please open an issue first.

```bash
git clone https://github.com/your-username/nodescribe.git
cd nodescribe
```
Feel free to use, modify, and share.

---


