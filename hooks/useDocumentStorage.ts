/**
 * Document Storage Hook for Bitcoin Writer
 * Uses KVStore for persistent document storage
 */

import { useState, useEffect } from 'react'
import { createAppStorage } from '@/lib/storage/kvstore-service'

const storage = createAppStorage('bitcoin-writer')

export interface Document {
  id: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
  tags?: string[]
}

export function useDocumentStorage() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  
  // Load all documents on mount
  useEffect(() => {
    loadDocuments()
  }, [])
  
  /**
   * Load all documents
   */
  async function loadDocuments() {
    setIsLoading(true)
    try {
      const docList = await storage.load('documents') || []
      const docs: Document[] = []
      
      for (const docId of docList) {
        const doc = await storage.load(`doc:${docId}`)
        if (doc) {
          docs.push(doc)
        }
      }
      
      setDocuments(docs)
    } catch (error) {
      console.error('Failed to load documents:', error)
    } finally {
      setIsLoading(false)
    }
  }
  
  /**
   * Save a document
   */
  async function saveDocument(doc: Document): Promise<boolean> {
    setIsSaving(true)
    try {
      // Save document data
      await storage.save(`doc:${doc.id}`, doc)
      
      // Update document list
      const docList = await storage.load('documents') || []
      if (!docList.includes(doc.id)) {
        docList.push(doc.id)
        await storage.save('documents', docList)
      }
      
      // Update local state
      setDocuments(prev => {
        const existing = prev.findIndex(d => d.id === doc.id)
        if (existing >= 0) {
          const updated = [...prev]
          updated[existing] = doc
          return updated
        }
        return [...prev, doc]
      })
      
      return true
    } catch (error) {
      console.error('Failed to save document:', error)
      return false
    } finally {
      setIsSaving(false)
    }
  }
  
  /**
   * Delete a document
   */
  async function deleteDocument(docId: string): Promise<boolean> {
    try {
      // Delete document data
      await storage.delete(`doc:${docId}`)
      
      // Update document list
      const docList = await storage.load('documents') || []
      const filtered = docList.filter((id: string) => id !== docId)
      await storage.save('documents', filtered)
      
      // Update local state
      setDocuments(prev => prev.filter(d => d.id !== docId))
      
      return true
    } catch (error) {
      console.error('Failed to delete document:', error)
      return false
    }
  }
  
  /**
   * Create a new document
   */
  function createNewDocument(): Document {
    const now = new Date().toISOString()
    return {
      id: `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: 'Untitled Document',
      content: '',
      createdAt: now,
      updatedAt: now
    }
  }
  
  return {
    documents,
    isLoading,
    isSaving,
    saveDocument,
    deleteDocument,
    createNewDocument,
    refreshDocuments: loadDocuments
  }
}

// Export for use in components
export default useDocumentStorage