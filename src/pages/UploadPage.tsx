import { UploadCloud } from 'lucide-react'
import DropZone from '@/components/upload/DropZone'

export default function UploadPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-slide-up">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <UploadCloud className="w-5 h-5 text-primary" />
          <h1 className="text-xl font-semibold text-foreground">Upload Files</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Upload images and documents — stored securely on Cloudinary
        </p>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Max Size', value: '50 MB' },
          { label: 'Storage', value: 'Cloudinary' },
          { label: 'Formats', value: 'Any' },
        ].map((item) => (
          <div
            key={item.label}
            className="bg-surface border border-border rounded-lg p-3 text-center"
          >
            <p className="text-xs text-muted-foreground">{item.label}</p>
            <p className="text-sm font-semibold text-foreground mt-0.5">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Drop Zone */}
      <DropZone />
    </div>
  )
}
