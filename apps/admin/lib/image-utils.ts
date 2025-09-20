import { put, del } from '@vercel/blob'

interface SaveImageParams {
  buffer: Buffer
  filename: string
  baseDir: string // Not used with blob storage, kept for compatibility
}

interface SaveImageResult {
  success: boolean
  imageUrl?: string
  error?: string
}

/**
 * Save an image to Vercel Blob Storage
 * This works in both development and production serverless environments
 */
export async function saveImageToBothDirectories({
  buffer,
  filename,
  baseDir // Not used but kept for compatibility
}: SaveImageParams): Promise<SaveImageResult> {
  try {
    console.log(`📁 Uploading image to Vercel Blob Storage: ${filename}`)
    
    // Create a unique path for the vehicle images
    const path = `vehicles/${filename}`
    
    // Upload to Vercel Blob Storage
    const blob = await put(path, buffer, {
      access: 'public',
      addRandomSuffix: false, // We already add timestamps to filenames
      cacheControlMaxAge: 31536000, // 1 year cache
    })
    
    console.log(`✅ Image uploaded successfully: ${blob.url}`)
    
    return {
      success: true,
      imageUrl: blob.url
    }
  } catch (error) {
    console.error('❌ Failed to upload image to Blob Storage:', error)
    
    // If Vercel Blob Storage is not configured, return a placeholder
    if (error instanceof Error && error.message.includes('BLOB_READ_WRITE_TOKEN')) {
      console.warn('⚠️ Vercel Blob Storage not configured. Using placeholder image.')
      return {
        success: false,
        imageUrl: '/placeholder-car.jpg',
        error: 'Vercel Blob Storage not configured. Please set BLOB_READ_WRITE_TOKEN environment variable.'
      }
    }
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}

/**
 * Delete an image from Vercel Blob Storage
 */
export async function deleteImageFromBothDirectories(
  filenameOrUrl: string,
  baseDir: string // Not used but kept for compatibility
): Promise<SaveImageResult> {
  try {
    // If it's a full URL from Blob Storage, use it directly
    // Otherwise, construct the path
    const url = filenameOrUrl.startsWith('http') 
      ? filenameOrUrl 
      : `vehicles/${filenameOrUrl}`
    
    // Delete from Vercel Blob Storage
    await del(url)
    console.log(`🗑️ Image deleted from Blob Storage: ${filenameOrUrl}`)
    
    return {
      success: true
    }
  } catch (error) {
    console.error('❌ Failed to delete image from Blob Storage:', error)
    
    // Don't fail if the image doesn't exist
    if (error instanceof Error && error.message.includes('404')) {
      console.log(`Image not found in Blob Storage: ${filenameOrUrl}`)
      return {
        success: true
      }
    }
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}

/**
 * Helper function to check if Blob Storage is configured
 */
export function isBlobStorageConfigured(): boolean {
  return !!process.env.BLOB_READ_WRITE_TOKEN
}