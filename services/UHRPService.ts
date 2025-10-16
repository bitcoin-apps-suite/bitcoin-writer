import { PrivateKey, Utils } from '@bsv/sdk'

interface UHRPUploadRequest {
  fileSize: number
  retentionPeriod: number
  identityKey: string
}

interface UHRPUploadResponse {
  status: 'success' | 'error'
  uploadURL?: string
  publicURL?: string
  requiredHeaders?: Record<string, string>
  amount?: number
  objectIdentifier?: string
  uhrpUrl?: string
  code?: string
  description?: string
}

interface UHRPFindRequest {
  uhrpUrl: string
  identityKey: string
  limit?: number
  offset?: number
}

interface UHRPFindResponse {
  status: 'success' | 'error'
  data?: {
    name: string
    size: string
    mimeType: string
    expiryTime: number
  }
  code?: string
  description?: string
}

interface UHRPFileMetadata {
  name: string
  size: string
  mimeType: string
  expiryTime: number
  uhrpUrl: string
}

class UHRPService {
  private storageServerUrl: string
  private identityKey: string | null = null

  constructor(storageServerUrl = 'https://storage.bsv.org') {
    this.storageServerUrl = storageServerUrl
  }

  setIdentityKey(identityKey: string) {
    this.identityKey = identityKey
  }

  async requestUpload(fileSize: number, retentionPeriod: number): Promise<UHRPUploadResponse> {
    if (!this.identityKey) {
      return {
        status: 'error',
        code: 'ERR_MISSING_IDENTITY_KEY',
        description: 'Identity key not set. Call setIdentityKey() first.'
      }
    }

    try {
      const response = await fetch(`${this.storageServerUrl}/upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.identityKey}`
        },
        body: JSON.stringify({
          fileSize,
          retentionPeriod
        })
      })

      const result = await response.json()
      
      if (result.status === 'success' && result.uploadURL) {
        const objectIdentifier = this.extractObjectIdentifier(result.uploadURL)
        result.objectIdentifier = objectIdentifier
        result.uhrpUrl = `uhrp://${objectIdentifier}`
      }

      return result
    } catch (error) {
      console.error('[UHRPService] Upload request error:', error)
      return {
        status: 'error',
        code: 'ERR_UPLOAD_REQUEST',
        description: 'Failed to request upload URL from UHRP storage server.'
      }
    }
  }

  async uploadFile(uploadURL: string, file: File, requiredHeaders: Record<string, string>): Promise<boolean> {
    try {
      const headers: Record<string, string> = {
        ...requiredHeaders
      }

      const response = await fetch(uploadURL, {
        method: 'PUT',
        headers,
        body: file
      })

      return response.ok
    } catch (error) {
      console.error('[UHRPService] File upload error:', error)
      return false
    }
  }

  async findFile(uhrpUrl: string, limit?: number, offset?: number): Promise<UHRPFindResponse> {
    if (!this.identityKey) {
      return {
        status: 'error',
        code: 'ERR_MISSING_IDENTITY_KEY',
        description: 'Identity key not set. Call setIdentityKey() first.'
      }
    }

    try {
      const queryParams = new URLSearchParams({
        uhrpUrl
      })

      const response = await fetch(`${this.storageServerUrl}/find?${queryParams}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.identityKey}`,
          'Content-Type': 'application/json'
        }
      })

      return await response.json()
    } catch (error) {
      console.error('[UHRPService] Find file error:', error)
      return {
        status: 'error',
        code: 'ERR_FIND',
        description: 'Failed to find file metadata from UHRP storage server.'
      }
    }
  }

  async resolveUHRPUrl(uhrpUrl: string): Promise<string | null> {
    try {
      const findResult = await this.findFile(uhrpUrl)
      
      if (findResult.status === 'success' && findResult.data) {
        const objectIdentifier = this.extractObjectIdentifierFromUHRP(uhrpUrl)
        return `${this.storageServerUrl}/files/${objectIdentifier}`
      }
      
      return null
    } catch (error) {
      console.error('[UHRPService] UHRP URL resolution error:', error)
      return null
    }
  }

  async uploadDocument(
    content: string | File, 
    filename: string, 
    retentionMinutes: number = 10080
  ): Promise<{ success: boolean; uhrpUrl?: string; error?: string }> {
    try {
      let fileSize: number
      let file: File

      if (typeof content === 'string') {
        const blob = new Blob([content], { type: 'text/plain' })
        fileSize = blob.size
        file = new File([blob], filename, { type: 'text/plain' })
      } else {
        fileSize = content.size
        file = content
      }

      const uploadRequest = await this.requestUpload(fileSize, retentionMinutes)
      
      if (uploadRequest.status !== 'success' || !uploadRequest.uploadURL || !uploadRequest.requiredHeaders) {
        return {
          success: false,
          error: uploadRequest.description || 'Failed to get upload URL'
        }
      }

      const uploadSuccess = await this.uploadFile(
        uploadRequest.uploadURL,
        file,
        uploadRequest.requiredHeaders
      )

      if (!uploadSuccess) {
        return {
          success: false,
          error: 'Failed to upload file to storage server'
        }
      }

      return {
        success: true,
        uhrpUrl: uploadRequest.uhrpUrl
      }
    } catch (error) {
      console.error('[UHRPService] Document upload error:', error)
      return {
        success: false,
        error: 'Unexpected error during document upload'
      }
    }
  }

  async downloadDocument(uhrpUrl: string): Promise<{ success: boolean; content?: string; error?: string }> {
    try {
      const downloadUrl = await this.resolveUHRPUrl(uhrpUrl)
      
      if (!downloadUrl) {
        return {
          success: false,
          error: 'Could not resolve UHRP URL to download URL'
        }
      }

      const response = await fetch(downloadUrl)
      
      if (!response.ok) {
        return {
          success: false,
          error: `Download failed with status: ${response.status}`
        }
      }

      const content = await response.text()
      
      return {
        success: true,
        content
      }
    } catch (error) {
      console.error('[UHRPService] Document download error:', error)
      return {
        success: false,
        error: 'Unexpected error during document download'
      }
    }
  }

  generateObjectIdentifier(): string {
    // Use crypto.getRandomValues for browser compatibility
    const randomBytes = new Uint8Array(16)
    if (typeof window !== 'undefined' && window.crypto) {
      window.crypto.getRandomValues(randomBytes)
    } else {
      // Fallback for non-browser environments
      for (let i = 0; i < 16; i++) {
        randomBytes[i] = Math.floor(Math.random() * 256)
      }
    }
    return Utils.toBase58(Array.from(randomBytes))
  }

  private extractObjectIdentifier(uploadURL: string): string {
    const match = uploadURL.match(/\/([^\/]+)(\?|$)/)
    return match ? match[1] : this.generateObjectIdentifier()
  }

  private extractObjectIdentifierFromUHRP(uhrpUrl: string): string {
    return uhrpUrl.replace('uhrp://', '')
  }

  createUHRPUrl(objectIdentifier: string): string {
    return `uhrp://${objectIdentifier}`
  }

  isValidUHRPUrl(url: string): boolean {
    return url.startsWith('uhrp://') && url.length > 7
  }
}

export default new UHRPService()
export { UHRPService }
export type { UHRPUploadResponse, UHRPFindResponse, UHRPFileMetadata }