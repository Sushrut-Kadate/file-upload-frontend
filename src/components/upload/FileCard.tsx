import { useState } from 'react'
import { Trash2, Download, FileText, Image, Film, Archive, File } from 'lucide-react'
import { cn, formatFileSize, getFileExtension, isImageType } from '@/lib/utils'
import type { DBFile } from '@/lib/api'

interface FileCardProps {
  file: DBFile
  onDelete: (id: string) => void
}

function getFileIcon(fileType: string) {
  if (fileType.startsWith('image/')) return Image
  if (fileType.startsWith('video/')) return Film
  if (fileType.includes('pdf') || fileType.includes('text') || fileType.includes('document'))
    return FileText
  if (fileType.includes('zip') || fileType.includes('tar') || fileType.includes('rar'))
    return Archive
  return File
}

export default function FileCard({ file, onDelete }: FileCardProps) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const isImage = isImageType(file.fileType)
  const Icon = getFileIcon(file.fileType)
  const ext = getFileExtension(file.fileName)

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true)
      setTimeout(() => setConfirmDelete(false), 3000)
      return
    }
    setDeleting(true)
    onDelete(file.id)
  }

  return (
    <div className="group relative bg-surface border border-border rounded-xl overflow-hidden hover:border-primary/30 transition-all duration-200 animate-fade-in">
      {/* Preview Area */}
      <div className="aspect-video bg-muted flex items-center justify-center overflow-hidden">
        {isImage ? (
          <img
            src={file.fileUrl}
            alt={file.fileName}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none'
            }}
          />
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Icon className="w-10 h-10 text-muted-foreground" />
            <span className="text-xs font-mono font-bold text-muted-foreground">{ext}</span>
          </div>
        )}
      </div>

      {/* File Info */}
      <div className="p-3 space-y-1">
        <p className="text-sm font-medium text-foreground truncate" title={file.fileName}>
          {file.fileName}
        </p>
        <p className="text-xs text-muted-foreground font-mono">{file.fileType}</p>
      </div>

      {/* Actions */}
      <div className="px-3 pb-3 flex gap-2">
        <a
          href={file.fileUrl}
          download={file.fileName}
          target="_blank"
          rel="noreferrer"
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md bg-muted hover:bg-primary/10 hover:text-primary text-muted-foreground text-xs font-medium transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          Download 
        </a>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className={cn(
            'flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-md text-xs font-medium transition-colors',
            confirmDelete
              ? 'bg-destructive text-white'
              : 'bg-muted hover:bg-destructive/10 hover:text-destructive text-muted-foreground'
          )}
        >
          <Trash2 className="w-3.5 h-3.5" />
          {confirmDelete ? 'Sure?' : 'Delete'}
        </button>
      </div>
    </div>
  )
}
