'use client'

import { useState } from 'react'
import { UploadCloud, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

export default function ExpensesPage() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = async () => {
        const base64 = (reader.result as string).split(',')[1]
        
        const response = await fetch('/api/extract', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64, filename: file.name, mimeType: file.type })
        })

        const data = await response.json()
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to extract receipt')
        }

        if (data.status === 'REFUSE') {
          setError('The uploaded image does not appear to be a receipt.')
        } else if (data.status === 'BLOCK') {
          setError('Security Error: Malicious input detected.')
        } else {
          setResult(data.data)
        }
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 style={{ fontSize: '2rem' }}>Expenses</h1>
          <p style={{ color: 'var(--text)', opacity: 0.8 }}>Log and extract details from your receipts.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ marginBottom: '20px' }}>Upload Receipt</h3>
          
          <div 
            className="upload-zone" 
            onDragOver={(e) => e.preventDefault()} 
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-upload')?.click()}
          >
            <input 
              id="file-upload" 
              type="file" 
              accept="image/*" 
              style={{ display: 'none' }} 
              onChange={(e) => e.target.files && setFile(e.target.files[0])}
            />
            <UploadCloud className="upload-icon" size={48} />
            <h4>{file ? file.name : 'Drag & drop a receipt image here'}</h4>
            <p style={{ fontSize: '0.85rem', opacity: 0.7, marginTop: '8px' }}>
              Supports JPG, PNG (Max 5MB)
            </p>
          </div>

          <button 
            className="btn-primary" 
            style={{ width: '100%', marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '8px' }}
            disabled={!file || loading}
            onClick={handleUpload}
          >
            {loading ? <Loader2 className="animate-spin" /> : 'Extract Details'}
          </button>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ marginBottom: '20px' }}>Extraction Result</h3>
          
          {!result && !error && !loading && (
             <div style={{ textAlign: 'center', opacity: 0.5, padding: '40px 0' }}>
               Upload a receipt to see extracted details here.
             </div>
          )}

          {loading && (
             <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--primary)' }}>
               <Loader2 className="animate-spin" size={40} style={{ margin: '0 auto', marginBottom: '16px' }} />
               <p>Analyzing receipt using Vision AI...</p>
             </div>
          )}

          {error && (
            <div style={{ background: 'rgba(255, 76, 76, 0.1)', border: '1px solid var(--error)', padding: '16px', borderRadius: 'var(--radius-sm)', color: 'var(--error)', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
               <AlertCircle size={20} style={{ flexShrink: 0 }} />
               <div>
                 <strong>Extraction Failed</strong>
                 <p style={{ fontSize: '0.9rem', marginTop: '4px' }}>{error}</p>
               </div>
            </div>
          )}

          {result && (
             <div className="animate-fade-in">
               <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '24px', color: 'var(--success)' }}>
                 <CheckCircle size={24} />
                 <h4 style={{ color: 'var(--success)', margin: 0 }}>Successfully Extracted</h4>
               </div>
               
               <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                 <div>
                   <span style={{ display: 'block', fontSize: '0.85rem', opacity: 0.7, marginBottom: '4px' }}>Amount</span>
                   <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-heading)' }}>{formatCurrency(result.amount)}</div>
                 </div>
                 
                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                   <div>
                     <span style={{ display: 'block', fontSize: '0.85rem', opacity: 0.7, marginBottom: '4px' }}>Date</span>
                     <div style={{ color: 'var(--text-heading)' }}>{result.date || 'N/A'}</div>
                   </div>
                   <div>
                     <span style={{ display: 'block', fontSize: '0.85rem', opacity: 0.7, marginBottom: '4px' }}>Category</span>
                     <div className="badge badge-success">{result.category || 'Uncategorized'}</div>
                   </div>
                 </div>

                 <div>
                   <span style={{ display: 'block', fontSize: '0.85rem', opacity: 0.7, marginBottom: '4px' }}>Description</span>
                   <div style={{ color: 'var(--text-heading)' }}>{result.description || 'No description found'}</div>
                 </div>
               </div>
             </div>
          )}
        </div>
      </div>
    </div>
  )
}
