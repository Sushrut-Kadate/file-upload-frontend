import { useEffect, useState } from 'react'
import { LayoutGrid, RefreshCw, Inbox } from 'lucide-react'
import { getAllFiles, deleteFile, type DBFile } from '@/lib/api'
import FileCard from '@/components/upload/FileCard'
import { cn } from '@/lib/utils'

type Filter = 'all' | 'images' | 'documents'

export default function DashboardPage() {
  const [files, setFiles] = useState<DBFile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<Filter>('all')
  const [refreshing, setRefreshing] = useState(false)

  const fetchFiles = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true)
    else setLoading(true)
    setError(null)
    try {
      const data = await getAllFiles()
      setFiles(data)
    } catch (err: any) {
      setError('Could not load files. Is the backend running?')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchFiles()
  }, [])

  const handleDelete = async (id: string) => {
    try {
      await deleteFile(id)
      setFiles((prev) => prev.filter((f) => f.id !== id))
    } catch (err) {
      alert('Failed to delete file. Please try again.')
    }
  }

  const filteredFiles = files.filter((f) => {
    if (filter === 'images') return f.fileType.startsWith('image/')
    if (filter === 'documents') return !f.fileType.startsWith('image/')
    return true
  })

  const tabs: { key: Filter; label: string }[] = [
    { key: 'all', label: `All (${files.length})` },
    {
      key: 'images',
      label: `Images (${files.filter((f) => f.fileType.startsWith('image/')).length})`,
    },
    {
      key: 'documents',
      label: `Documents (${files.filter((f) => !f.fileType.startsWith('image/')).length})`,
    },
  ]

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <LayoutGrid className="w-5 h-5 text-primary" />
            <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Manage your uploaded files
          </p>
        </div>
        <button
          onClick={() => fetchFiles(true)}
          disabled={refreshing}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground text-sm transition-colors"
        >
          <RefreshCw className={cn('w-3.5 h-3.5', refreshing && 'animate-spin')} />
          Refresh
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1 p-1 bg-surface border border-border rounded-lg w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={cn(
              'px-3 py-1.5 rounded-md text-sm font-medium transition-all',
              filter === tab.key
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* States */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-surface border border-border rounded-xl overflow-hidden animate-pulse"
            >
              <div className="aspect-video bg-muted" />
              <div className="p-3 space-y-2">
                <div className="h-3 bg-muted rounded w-3/4" />
                <div className="h-2 bg-muted rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="text-center py-16 space-y-2">
          <p className="text-destructive font-medium">{error}</p>
          <button
            onClick={() => fetchFiles()}
            className="text-sm text-primary hover:underline"
          >
            Try again
          </button>
        </div>
      )}

      {!loading && !error && filteredFiles.length === 0 && (
        <div className="text-center py-16 space-y-3">
          <Inbox className="w-12 h-12 text-muted-foreground mx-auto" />
          <p className="text-muted-foreground text-sm">
            {filter === 'all' ? 'No files uploaded yet' : `No ${filter} found`}
          </p>
        </div>
      )}

      {!loading && !error && filteredFiles.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFiles.map((file) => (
            <FileCard key={file.id} file={file} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  )
}
