import { useCallback, useState } from 'react'
import { UploadCloud, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { cn, formatFileSize } from '@/lib/utils'
import { uploadFile, uploadMultipleFiles } from '@/lib/api'

interface QueuedFile {
  id: string
  file: File
  status: 'pending' | 'uploading' | 'done' | 'error'
  error?: string
  downloadUrl?: string
}

const MAX_SIZE = 50 * 1024 * 1024 // 50MB

export default function DropZone() {
  const [queue, setQueue] = useState<QueuedFile[]>([])
  const [isDragging, setIsDragging] = useState(false)

  const addFiles = (files: FileList | File[]) => {
    const newFiles: QueuedFile[] = Array.from(files)
      .filter((f) => f.size <= MAX_SIZE)
      .map((f) => ({
        id: `${f.name}-${Date.now()}-${Math.random()}`,
        file: f,
        status: 'pending',
      }))
    setQueue((prev) => [...prev, ...newFiles])
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files)
  }, [])

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const onDragLeave = () => setIsDragging(false)

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) addFiles(e.target.files)
  }

  const removeFromQueue = (id: string) => {
    setQueue((prev) => prev.filter((f) => f.id !== id))
  }

  const uploadAll = async () => {
    const pending = queue.filter((f) => f.status === 'pending')
    if (!pending.length) return

    // Upload one by one to track individual status
    for (const item of pending) {
      setQueue((prev) =>
        prev.map((f) => (f.id === item.id ? { ...f, status: 'uploading' } : f))
      )
      try {
        const res = await uploadFile(item.file)
        setQueue((prev) =>
          prev.map((f) =>
            f.id === item.id
              ? { ...f, status: 'done', downloadUrl: res.fileDownloadUri }
              : f
          )
        )
      } catch (err: any) {
        setQueue((prev) =>
          prev.map((f) =>
            f.id === item.id
              ? { ...f, status: 'error', error: err.message || 'Upload failed' }
              : f
          )
        )
      }
    }
  }

  const clearDone = () => {
    setQueue((prev) => prev.filter((f) => f.status !== 'done'))
  }

  const pendingCount = queue.filter((f) => f.status === 'pending').length
  const doneCount = queue.filter((f) => f.status === 'done').length

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        className={cn(
          'relative border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-200',
          isDragging
            ? 'border-primary bg-primary/5 scale-[1.01]'
            : 'border-border hover:border-primary/50 hover:bg-surface'
        )}
        onClick={() => document.getElementById('file-input')?.click()}
      >
        <input
          id="file-input"
          type="file"
          multiple
          className="hidden"
          onChange={onInputChange}
        />
        <div className="flex flex-col items-center gap-3">
          <div
            className={cn(
              'p-4 rounded-full transition-colors',
              isDragging ? 'bg-primary/20' : 'bg-muted'
            )}
          >
            <UploadCloud
              className={cn(
                'w-8 h-8 transition-colors',
                isDragging ? 'text-primary' : 'text-muted-foreground'
              )}
            />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">
              {isDragging ? 'Drop files here' : 'Drag & drop files here'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              or click to browse — max 50MB per file
            </p>
          </div>
        </div>
      </div>

      {/* File Queue */}
      {queue.length > 0 && (
        <div className="space-y-2">
          {queue.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 p-3 rounded-lg bg-surface border border-border animate-slide-up"
            >
              {/* Status Icon */}
              <div className="shrink-0">
                {item.status === 'pending' && (
                  <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center text-xs font-mono font-bold text-muted-foreground">
                    {item.file.name.split('.').pop()?.toUpperCase().slice(0, 3)}
                  </div>
                )}
                {item.status === 'uploading' && (
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                )}
                {item.status === 'done' && (
                  <CheckCircle className="w-8 h-8 text-green-500" />
                )}
                {item.status === 'error' && (
                  <AlertCircle className="w-8 h-8 text-destructive" />
                )}
              </div>

              {/* File Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {item.file.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(item.file.size)}
                  {item.status === 'done' && (
                    <a
                      href={item.downloadUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="ml-2 text-primary hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      View file ↗
                    </a>
                  )}
                  {item.status === 'error' && (
                    <span className="ml-2 text-destructive">{item.error}</span>
                  )}
                </p>
              </div>

              {/* Remove */}
              {item.status !== 'uploading' && (
                <button
                  onClick={() => removeFromQueue(item.id)}
                  className="shrink-0 p-1 rounded hover:bg-muted transition-colors"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              )}
            </div>
          ))}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-1">
            {pendingCount > 0 && (
              <button
                onClick={uploadAll}
                className="flex-1 py-2 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Upload {pendingCount} file{pendingCount > 1 ? 's' : ''}
              </button>
            )}
            {doneCount > 0 && (
              <button
                onClick={clearDone}
                className="py-2 px-4 rounded-lg bg-muted text-muted-foreground text-sm font-medium hover:text-foreground transition-colors"
              >
                Clear done
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
