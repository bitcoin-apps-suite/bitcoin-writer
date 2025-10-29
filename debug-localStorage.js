// Debug script to check localStorage contents
console.log('=== localStorage Debug ===');
console.log('Total items:', localStorage.length);

for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  if (key && key.startsWith('worktree_chain_')) {
    console.log('Found worktree chain:', key);
    try {
      const data = JSON.parse(localStorage.getItem(key));
      console.log('Chain data:', {
        documentId: data.documentId,
        totalVersions: data.totalVersions,
        versionsCount: data.versions?.length,
        versions: data.versions?.map(v => ({
          version: v.metadata.version,
          hasContent: !!v.content,
          contentLength: v.content?.length,
          contentPreview: v.content?.substring(0, 50) + '...'
        }))
      });
    } catch (e) {
      console.error('Failed to parse chain data:', e);
    }
  }
}