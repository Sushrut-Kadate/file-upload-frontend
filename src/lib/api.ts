const BASE_URL = 'http://localhost:8080'

// ── Types ──────────────────────────────────────────────────────
export interface DBFile {
  id: string
  fileName: string
  fileType: string
  fileUrl: string
  uploadedBy: {
    id: number
    username: string
  }
}

export interface UploadFileResponse {
  fileName: string
  fileDownloadUri: string
  fileType: string
  size: number
}

export interface AuthResponse {
  token: string
  username: string
}

// ── Auth helpers ───────────────────────────────────────────────
export function getToken(): string | null {
  return localStorage.getItem('token')
}

export function getUsername(): string | null {
  return localStorage.getItem('username')
}

export function isLoggedIn(): boolean {
  return !!getToken()
}

export function logout(): void {
  localStorage.removeItem('token')
  localStorage.removeItem('username')
}

// Auth header helper
function authHeaders() {
  return {
    Authorization: `Bearer ${getToken()}`,
  }
}

// ── Register ───────────────────────────────────────────────────
export async function register(
  username: string,
  password: string,
  email: string
): Promise<string> {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, email }),
  })
  if (!res.ok) {
    const error = await res.text()
    throw new Error(error || 'Registration failed')
  }
  return res.text()
}

// ── Login ──────────────────────────────────────────────────────
export async function login(
  username: string,
  password: string
): Promise<AuthResponse> {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
  if (!res.ok) {
    throw new Error('Invalid username or password')
  }
  const data: AuthResponse = await res.json()
  localStorage.setItem('token', data.token)
  localStorage.setItem('username', data.username)
  return data
}

// ── Upload single file ─────────────────────────────────────────
export async function uploadFile(file: File): Promise<UploadFileResponse> {
  const formData = new FormData()
  formData.append('file', file)

  const res = await fetch(`${BASE_URL}/uploadFile`, {
    method: 'POST',
    headers: authHeaders(),
    body: formData,
  })

  if (!res.ok) {
    const error = await res.text()
    throw new Error(error || 'Upload failed')
  }

  return res.json()
}

// ── Upload multiple files ──────────────────────────────────────
export async function uploadMultipleFiles(
  files: File[]
): Promise<UploadFileResponse[]> {
  const formData = new FormData()
  files.forEach((file) => formData.append('files', file))

  const res = await fetch(`${BASE_URL}/uploadMultipleFiles`, {
    method: 'POST',
    headers: authHeaders(),
    body: formData,
  })

  if (!res.ok) {
    const error = await res.text()
    throw new Error(error || 'Upload failed')
  }

  return res.json()
}

// ── Get all files ──────────────────────────────────────────────
export async function getAllFiles(): Promise<DBFile[]> {
  const res = await fetch(`${BASE_URL}/files`, {
    headers: authHeaders(),
  })

  if (!res.ok) {
    throw new Error('Failed to fetch files')
  }

  return res.json()
}

// ── Delete file ────────────────────────────────────────────────
export async function deleteFile(fileId: string): Promise<string> {
  const res = await fetch(`${BASE_URL}/files/${fileId}`, {
    method: 'DELETE',
    headers: authHeaders(),
  })

  if (!res.ok) {
    throw new Error('Failed to delete file')
  }

  return res.text()
}