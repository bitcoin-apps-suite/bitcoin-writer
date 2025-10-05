// Cleanup utility to remove empty or test documents from localStorage

export const cleanupEmptyDocuments = () => {
  const documentsKey = 'bitcoin_writer_documents';
  const storedDocs = localStorage.getItem(documentsKey);
  
  if (!storedDocs) {
    console.log('No documents found to clean');
    return 0;
  }
  
  try {
    const documents = JSON.parse(storedDocs);
    const originalCount = documents.length;
    
    // Filter out empty/test documents
    const cleanedDocs = documents.filter((doc: any) => {
      // Keep document only if it has meaningful content
      if (!doc.content || doc.content.trim() === '') return false;
      if (doc.content === '<p><br></p>') return false;
      if (doc.content === '<p>Start writing...</p>') return false;
      if (doc.title === 'Untitled Document' && (!doc.content || doc.content.length < 50)) return false;
      
      // Remove obvious test documents
      const testPatterns = [
        /^test$/i,
        /^asdf/i,
        /^qwerty/i,
        /^bhvjfsbgdfhjksgbdfjkfghdjkghbgkjsdhfbnsd/i,
        /^[a-z]{1,5}$/i, // Single repeated characters or very short nonsense
        /^undefined$/i,
        /^null$/i
      ];
      
      for (const pattern of testPatterns) {
        if (pattern.test(doc.title) || pattern.test(doc.content?.replace(/<[^>]*>/g, ''))) {
          return false;
        }
      }
      
      return true;
    });
    
    // Save cleaned documents back to localStorage
    localStorage.setItem(documentsKey, JSON.stringify(cleanedDocs));
    
    const deletedCount = originalCount - cleanedDocs.length;
    console.log(`Cleaned up ${deletedCount} empty/test documents`);
    console.log(`Remaining documents: ${cleanedDocs.length}`);
    
    return deletedCount;
  } catch (error) {
    console.error('Error cleaning documents:', error);
    return 0;
  }
};

// Function to completely clear all documents (use with caution!)
export const clearAllDocuments = () => {
  const confirmed = window.confirm('Are you sure you want to delete ALL local documents? This cannot be undone!');
  if (confirmed) {
    localStorage.removeItem('bitcoin_writer_documents');
    localStorage.removeItem('bitcoin_writer_current_doc');
    console.log('All documents cleared');
    window.location.reload();
  }
};

// Function to delete specific document by ID
export const deleteDocumentById = (docId: string) => {
  const documentsKey = 'bitcoin_writer_documents';
  const storedDocs = localStorage.getItem(documentsKey);
  
  if (!storedDocs) return false;
  
  try {
    const documents = JSON.parse(storedDocs);
    const filteredDocs = documents.filter((doc: any) => doc.id !== docId);
    
    if (filteredDocs.length < documents.length) {
      localStorage.setItem(documentsKey, JSON.stringify(filteredDocs));
      
      // Also clear current doc if it's the one being deleted
      const currentDoc = localStorage.getItem('bitcoin_writer_current_doc');
      if (currentDoc === docId) {
        localStorage.removeItem('bitcoin_writer_current_doc');
      }
      
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting document:', error);
    return false;
  }
};