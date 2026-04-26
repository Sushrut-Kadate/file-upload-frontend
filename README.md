# File Upload Frontend

A modern file management frontend built with React + Vite and TypeScript.

## Tech Stack

- **Framework** - React 18 + TypeScript
- **Build Tool** - Vite
- **Styling** - Tailwind CSS
- **Routing** - React Router DOM
- **Icons** - Lucide React

## Features

- Drag & drop file upload
- Upload single or multiple files
- Dashboard to view all uploaded files
- Image preview in dashboard
- Delete files
- Filter files by type (Images / Documents)
- Responsive dark theme UI

## Prerequisites

Make sure the backend is running before starting the frontend.

Backend Repository — [file-upload-backend](https://github.com/Sushrut-Kadate/file-upload-backend)

## Setup & Installation

**1. Clone the repository**
```bash
git clone https://github.com/Sushrut-Kadate/file-upload-frontend.git
```

**2. Install dependencies**
```bash
cd file-upload-frontend
npm install
```

**3. Run the development server**
```bash
npm run dev
```

Application runs at `http://localhost:5173`

## Backend Connection

Make sure Spring Boot backend is running at `http://localhost:8080` before using the frontend.

## Project Structure

```
src/
├── components/
│   ├── layout/
│   │   └── Navbar.tsx
│   └── upload/
│       ├── DropZone.tsx
│       └── FileCard.tsx
├── lib/
│   ├── api.ts
│   └── utils.ts
├── pages/
│   ├── UploadPage.tsx
│   └── DashboardPage.tsx
├── App.tsx
└── main.tsx
```
