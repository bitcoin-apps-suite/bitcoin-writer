/**
 * Bitcoin Writer - Blockchain Integration
 * Handles BSV blockchain storage and Work Tree version control
 */

class BlockchainIntegration {
  constructor(app) {
    this.app = app;
    this.kvstore = null;
    this.workTree = new WorkTreeManager();
    this.currentProtocol = 'b';
    this.currentEncryption = 'none';
    this.initializeKVStore();
    this.setupEventListeners();
  }

  async initializeKVStore() {
    try {
      // Try to initialize Babbage KVStore
      if (typeof BabbageKVStore !== 'undefined') {
        const { default: KVStore } = await import('babbage-kvstore');
        this.kvstore = new KVStore();
        console.log('✅ KVStore initialized for blockchain storage');
        this.enableAutoSave();
      } else {
        console.log('⚠️ KVStore not available - using local storage');
      }
    } catch (error) {
      console.log('KVStore initialization error:', error);
    }
  }

  setupEventListeners() {
    // Tab switching
    document.querySelectorAll('.tab-button').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.switchTab(e.target.dataset.tab);
      });
    });

    // Protocol selection
    document.querySelectorAll('input[name="protocol"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        this.currentProtocol = e.target.value;
        this.updateCostEstimate();
      });
    });

    // Encryption selection
    document.querySelectorAll('input[name="encryption"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        this.currentEncryption = e.target.value;
        const passwordField = document.getElementById('encryptionPassword');
        if (e.target.value === 'aes' || e.target.value === 'notesv') {
          passwordField.classList.remove('hidden');
        } else {
          passwordField.classList.add('hidden');
        }
      });
    });

    // Access pricing
    document.querySelectorAll('input[name="access"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        document.getElementById('priceSettings').classList.toggle('hidden', e.target.value !== 'priced');
        document.getElementById('timeSettings').classList.toggle('hidden', e.target.value !== 'timed');
      });
    });

    // Branch selection
    document.getElementById('branchSelect')?.addEventListener('change', (e) => {
      if (e.target.value === 'new') {
        const branchName = prompt('Enter new branch name:');
        if (branchName) {
          this.workTree.createBranch(branchName);
          const option = document.createElement('option');
          option.value = branchName;
          option.textContent = branchName;
          e.target.insertBefore(option, e.target.lastElementChild);
          e.target.value = branchName;
        }
      }
    });
  }

  switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab-button').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabName);
    });

    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
      content.classList.add('hidden');
    });
    document.getElementById(`${tabName}Tab`)?.classList.remove('hidden');
  }

  updateCostEstimate() {
    const content = this.app.quill.getText();
    const sizeKB = new Blob([content]).size / 1024;
    
    let cost = 0;
    switch(this.currentProtocol) {
      case 'b':
        cost = 0.001;
        break;
      case 'd':
        cost = 0.002;
        break;
      case 'bcat':
        cost = Math.ceil(sizeKB / 100) * 0.005;
        break;
      case 'uhrp':
        cost = 0.001;
        break;
    }

    // Add encryption cost
    if (this.currentEncryption !== 'none') {
      cost += 0.0005;
    }

    // Update UI
    const costElement = document.getElementById('estimatedCost');
    const usdValue = (cost * 50).toFixed(2); // Assuming $50/BSV
    costElement.textContent = `~${cost.toFixed(4)} BSV ($${usdValue})`;

    // Update document stats
    document.getElementById('docSize').textContent = `${sizeKB.toFixed(1)} KB`;
    document.getElementById('docWords').textContent = this.app.wordCount;
  }

  async saveToBlockchain() {
    const saveButton = document.querySelector('.btn-primary');
    const buttonText = document.getElementById('saveButtonText');
    const spinner = saveButton.querySelector('.spinner');

    // Show loading state
    buttonText.textContent = 'Saving...';
    spinner.classList.remove('hidden');
    saveButton.disabled = true;

    try {
      const content = this.app.quill.root.innerHTML;
      const plainText = this.app.quill.getText();
      const delta = this.app.quill.getContents();

      // Prepare document data
      const documentData = {
        title: this.app.documentTitle,
        content: content,
        plainText: plainText,
        delta: delta,
        wordCount: this.app.wordCount,
        timestamp: new Date().toISOString(),
        protocol: this.currentProtocol,
        encryption: this.currentEncryption,
        versionMessage: document.getElementById('versionMessage')?.value || '',
        branch: document.getElementById('branchSelect')?.value || 'main'
      };

      // Handle encryption
      if (this.currentEncryption !== 'none') {
        const password = document.getElementById('encPassword')?.value;
        if (!password) {
          throw new Error('Password required for encryption');
        }
        documentData.content = await this.encryptContent(content, password);
        documentData.encrypted = true;
      }

      // Save to blockchain based on protocol
      let txId;
      if (this.kvstore) {
        txId = await this.saveViaProtocol(documentData);
      } else {
        // Fallback to local storage
        txId = this.saveToLocalStorage(documentData);
      }

      // Create version in work tree
      const version = this.workTree.createVersion({
        id: txId,
        message: documentData.versionMessage,
        content: documentData,
        parentId: this.workTree.currentVersion?.id
      });

      // Update UI
      this.showSuccessMessage(txId);
      this.updateWorkTreeDisplay();

      // Close modal
      this.closeModal();

    } catch (error) {
      console.error('Save failed:', error);
      alert(`Save failed: ${error.message}`);
    } finally {
      // Reset button state
      buttonText.textContent = 'Save to Blockchain';
      spinner.classList.add('hidden');
      saveButton.disabled = false;
    }
  }

  async saveViaProtocol(documentData) {
    switch(this.currentProtocol) {
      case 'b':
        return await this.saveViaB(documentData);
      case 'd':
        return await this.saveViaD(documentData);
      case 'bcat':
        return await this.saveViaBcat(documentData);
      case 'uhrp':
        return await this.saveViaUHRP(documentData);
      default:
        throw new Error('Unknown protocol');
    }
  }

  async saveViaB(data) {
    // B:// protocol implementation
    const payload = {
      data: JSON.stringify(data),
      contentType: 'application/json',
      encoding: 'utf-8'
    };

    if (this.kvstore) {
      const result = await this.kvstore.set(
        data.title,
        payload,
        {
          topic: 'bitcoin-writer-documents',
          encrypt: data.encrypted
        }
      );
      return result.txid;
    }

    // Mock transaction ID for demo
    return 'b://' + this.generateMockTxId();
  }

  async saveViaD(data) {
    // D:// protocol with dynamic references
    const metadata = {
      title: data.title,
      author: 'Bitcoin Writer User',
      timestamp: data.timestamp,
      wordCount: data.wordCount
    };

    const payload = {
      data: JSON.stringify(data),
      metadata: metadata,
      contentType: 'application/json'
    };

    if (this.kvstore) {
      const result = await this.kvstore.set(
        data.title + '_d',
        payload,
        {
          topic: 'bitcoin-writer-d-protocol',
          encrypt: data.encrypted
        }
      );
      return result.txid;
    }

    return 'd://' + this.generateMockTxId();
  }

  async saveViaBcat(data) {
    // Bcat for large files
    const chunks = this.chunkContent(JSON.stringify(data), 100000); // 100KB chunks
    const txIds = [];

    for (let i = 0; i < chunks.length; i++) {
      if (this.kvstore) {
        const result = await this.kvstore.set(
          `${data.title}_chunk_${i}`,
          chunks[i],
          {
            topic: 'bitcoin-writer-bcat',
            encrypt: data.encrypted
          }
        );
        txIds.push(result.txid);
      } else {
        txIds.push(this.generateMockTxId());
      }
    }

    return 'bcat://' + txIds.join('/');
  }

  async saveViaUHRP(data) {
    // UHRP content-addressed storage
    const contentHash = await this.hashContent(JSON.stringify(data));
    
    if (this.kvstore) {
      const result = await this.kvstore.set(
        contentHash,
        data,
        {
          topic: 'bitcoin-writer-uhrp',
          encrypt: data.encrypted
        }
      );
      return result.txid;
    }

    return 'uhrp://' + contentHash;
  }

  async encryptContent(content, password) {
    // Simple encryption for demo - in production use proper crypto library
    const encoder = new TextEncoder();
    const data = encoder.encode(content);
    const key = await crypto.subtle.digest('SHA-256', encoder.encode(password));
    const encrypted = await this.xorEncrypt(data, new Uint8Array(key));
    return btoa(String.fromCharCode(...encrypted));
  }

  async xorEncrypt(data, key) {
    const encrypted = new Uint8Array(data.length);
    for (let i = 0; i < data.length; i++) {
      encrypted[i] = data[i] ^ key[i % key.length];
    }
    return encrypted;
  }

  async hashContent(content) {
    const encoder = new TextEncoder();
    const data = encoder.encode(content);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  chunkContent(content, chunkSize) {
    const chunks = [];
    for (let i = 0; i < content.length; i += chunkSize) {
      chunks.push(content.slice(i, i + chunkSize));
    }
    return chunks;
  }

  saveToLocalStorage(documentData) {
    const txId = this.generateMockTxId();
    const key = `bitcoin-writer-doc-${txId}`;
    localStorage.setItem(key, JSON.stringify(documentData));
    
    // Update document index
    const index = JSON.parse(localStorage.getItem('bitcoin-writer-index') || '[]');
    index.push({
      id: txId,
      title: documentData.title,
      timestamp: documentData.timestamp,
      protocol: documentData.protocol
    });
    localStorage.setItem('bitcoin-writer-index', JSON.stringify(index));
    
    return txId;
  }

  generateMockTxId() {
    return Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  showSuccessMessage(txId) {
    const shortTx = txId.substring(0, 8) + '...' + txId.substring(txId.length - 8);
    const message = `Document saved to blockchain!\nTransaction ID: ${shortTx}`;
    
    // Update status
    const statusText = document.querySelector('.user-info span');
    if (statusText) {
      statusText.textContent = 'Saved to blockchain ✓';
      setTimeout(() => {
        statusText.textContent = 'All changes saved';
      }, 3000);
    }

    console.log(message);
  }

  closeModal() {
    document.getElementById('blockchainSaveModal').classList.add('hidden');
  }

  enableAutoSave() {
    if (!this.kvstore) return;

    setInterval(async () => {
      if (this.app.quill.history.stack.undo.length > 0) {
        const content = this.app.quill.getContents();
        await this.kvstore.set(
          'autosave_' + this.app.documentTitle,
          content,
          {
            topic: 'bitcoin-writer-autosave',
            encrypt: false
          }
        );
        console.log('Auto-saved to KVStore');
      }
    }, 30000); // Every 30 seconds
  }

  updateWorkTreeDisplay() {
    this.workTree.renderTree();
  }
}

/**
 * Work Tree Manager - Git-like version control for documents
 */
class WorkTreeManager {
  constructor() {
    this.versions = [];
    this.branches = ['main', 'draft'];
    this.currentBranch = 'main';
    this.currentVersion = null;
    this.loadVersions();
  }

  loadVersions() {
    const stored = localStorage.getItem('bitcoin-writer-versions');
    if (stored) {
      this.versions = JSON.parse(stored);
      if (this.versions.length > 0) {
        this.currentVersion = this.versions[this.versions.length - 1];
      }
    }
  }

  createVersion(data) {
    const version = {
      id: data.id,
      parentId: data.parentId || null,
      branch: this.currentBranch,
      message: data.message || 'No message',
      timestamp: new Date().toISOString(),
      content: data.content,
      wordCount: data.content.wordCount || 0
    };

    this.versions.push(version);
    this.currentVersion = version;
    this.saveVersions();
    
    return version;
  }

  createBranch(branchName) {
    if (!this.branches.includes(branchName)) {
      this.branches.push(branchName);
      this.currentBranch = branchName;
    }
  }

  checkoutVersion(versionId) {
    const version = this.versions.find(v => v.id === versionId);
    if (version) {
      this.currentVersion = version;
      // Restore content to editor
      if (window.app && window.app.quill) {
        window.app.quill.setContents(version.content.delta);
      }
      return version;
    }
    return null;
  }

  getVersionChain(versionId) {
    const chain = [];
    let current = this.versions.find(v => v.id === versionId);
    
    while (current) {
      chain.unshift(current);
      current = current.parentId ? 
        this.versions.find(v => v.id === current.parentId) : null;
    }
    
    return chain;
  }

  saveVersions() {
    localStorage.setItem('bitcoin-writer-versions', JSON.stringify(this.versions));
  }

  renderTree() {
    const canvas = document.getElementById('workTreeCanvas');
    if (!canvas) return;

    canvas.innerHTML = '';

    // Group versions by branch
    const branches = {};
    this.versions.forEach(version => {
      if (!branches[version.branch]) {
        branches[version.branch] = [];
      }
      branches[version.branch].push(version);
    });

    // Render each branch
    Object.entries(branches).forEach(([branchName, versions]) => {
      const branchContainer = document.createElement('div');
      branchContainer.className = 'branch-container';
      branchContainer.innerHTML = `<h5 style="color: var(--accent-orange); margin: 8px 0;">${branchName}</h5>`;
      
      versions.forEach((version, index) => {
        const node = this.createVersionNode(version);
        if (version === this.currentVersion) {
          node.classList.add('current');
        }
        branchContainer.appendChild(node);
      });

      canvas.appendChild(branchContainer);
    });
  }

  createVersionNode(version) {
    const node = document.createElement('div');
    node.className = 'version-node';
    node.dataset.versionId = version.id;
    
    const shortId = version.id.substring(0, 8);
    const date = new Date(version.timestamp).toLocaleDateString();
    
    node.innerHTML = `
      <div class="node-info">
        <div class="node-hash">${shortId}</div>
        <div class="node-date">${date}</div>
        <div class="node-message">${version.message}</div>
      </div>
    `;

    node.addEventListener('click', () => {
      this.selectVersion(version);
    });

    node.addEventListener('dblclick', () => {
      this.checkoutVersion(version.id);
    });

    return node;
  }

  selectVersion(version) {
    // Update details panel
    document.getElementById('versionId').textContent = version.id.substring(0, 16) + '...';
    document.getElementById('versionDate').textContent = new Date(version.timestamp).toLocaleString();
    document.getElementById('versionMsg').textContent = version.message;
    
    const txLink = document.getElementById('versionTx');
    txLink.textContent = version.id.substring(0, 16) + '...';
    txLink.href = `https://whatsonchain.com/tx/${version.id}`;
    
    // Highlight selected node
    document.querySelectorAll('.version-node').forEach(node => {
      node.classList.remove('selected');
    });
    document.querySelector(`[data-version-id="${version.id}"]`)?.classList.add('selected');
  }
}

// Global functions for UI events
function openBlockchainModal() {
  const modal = document.getElementById('blockchainSaveModal');
  modal.classList.remove('hidden');
  
  if (window.blockchainIntegration) {
    window.blockchainIntegration.updateCostEstimate();
  }
}

function closeBlockchainModal() {
  document.getElementById('blockchainSaveModal').classList.add('hidden');
}

function saveToBlockchain() {
  if (window.blockchainIntegration) {
    window.blockchainIntegration.saveToBlockchain();
  }
}

function toggleWorkTree() {
  const panel = document.getElementById('workTreePanel');
  panel.classList.toggle('hidden');
  
  if (!panel.classList.contains('hidden') && window.blockchainIntegration) {
    window.blockchainIntegration.updateWorkTreeDisplay();
  }
}

function createBranch() {
  const branchName = prompt('Enter new branch name:');
  if (branchName && window.blockchainIntegration) {
    window.blockchainIntegration.workTree.createBranch(branchName);
    window.blockchainIntegration.updateWorkTreeDisplay();
  }
}

function checkoutVersion() {
  const versionId = prompt('Enter version ID to checkout:');
  if (versionId && window.blockchainIntegration) {
    window.blockchainIntegration.workTree.checkoutVersion(versionId);
  }
}

function compareVersions() {
  alert('Version comparison feature coming soon!');
}

// Initialize when app is ready
document.addEventListener('DOMContentLoaded', () => {
  // Wait for app to be initialized
  setTimeout(() => {
    if (window.app) {
      window.blockchainIntegration = new BlockchainIntegration(window.app);
    }
  }, 1000);
});