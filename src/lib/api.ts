// API base URL - Spring Boot runs on 8080
const BASE_URL = 'http://localhost:8080'

// This matches exactly what our Spring Boot backend returns
export interface DBFile {
  id: string
  fileName: string
  fileType: string
  fileUrl: string
}

// Upload response from backend UploadFileResponse.java
export interface UploadFileResponse {
  fileName: string
  fileDownloadUri: string
  fileType: string
  size: number
}

// ── Upload single file ──────────────────────────────────────────
// POST /uploadFile
export async function uploadFile(file: File): Promise<UploadFileResponse> {
  const formData = new FormData()
  formData.append('file', file)

  const res = await fetch(`${BASE_URL}/uploadFile`, {
    method: 'POST',
    body: formData,
  })

  if (!res.ok) {
    const error = await res.text()
    throw new Error(error || 'Upload failed')
  }

  return res.json()
}

// ── Upload multiple files ───────────────────────────────────────
// POST /uploadMultipleFiles
export async function uploadMultipleFiles(files: File[]): Promise<UploadFileResponse[]> {
  const formData = new FormData()
  files.forEach((file) => formData.append('files', file))

  const res = await fetch(`${BASE_URL}/uploadMultipleFiles`, {
    method: 'POST',
    body: formData,
  })

  if (!res.ok) {
    const error = await res.text()
    throw new Error(error || 'Upload failed')
  }

  return res.json()
}

// ── Get all files ───────────────────────────────────────────────
// GET /files
export async function getAllFiles(): Promise<DBFile[]> {
  const res = await fetch(`${BASE_URL}/files`)

  if (!res.ok) {
    throw new Error('Failed to fetch files')
  }

  return res.json()
}

// ── Delete file ─────────────────────────────────────────────────
// DELETE /files/{fileId}
export async function deleteFile(fileId: string): Promise<string> {
  const res = await fetch(`${BASE_URL}/files/${fileId}`, {
    method: 'DELETE',
  })

  if (!res.ok) {
    throw new Error('Failed to delete file')
  }

  return res.text()
}
