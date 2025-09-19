import fs from 'fs'
import path from 'path'

interface SaveImageParams {
  buffer: Buffer
  filename: string
  baseDir: string
}

interface SaveImageResult {
  success: boolean
  imageUrl?: string
  error?: string
}

/**
 * Get the correct public directory path based on environment
 */
function getPublicDirectoryPath(): string {
  // In production/serverless environments, use /tmp for temporary files
  if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
    return '/tmp/uploads/vehicles'
  }
  
  // In development, use the local public directory
  const currentDir = process.cwd()
  return path.join(currentDir, 'public', 'uploads', 'vehicles')
}

/**
 * Save an image to the appropriate directory based on environment
 */
export async function saveImageToBothDirectories({
  buffer,
  filename,
  baseDir
}: SaveImageParams): Promise<SaveImageResult> {
  try {
    // Get the correct directory path
    const uploadDir = getPublicDirectoryPath()
    
    console.log(`📁 Using upload directory: ${uploadDir}`)
    
    // Ensure directory exists
    await ensureDirectoryExists(uploadDir)
    
    // Define file path
    const filePath = path.join(uploadDir, filename)
    
    // Save the file
    await fs.promises.writeFile(filePath, buffer)
    
    // Return the public URL
    // In production, we'll need to upload to a CDN or external storage
    // For now, return a placeholder URL that can be handled by the frontend
    const imageUrl = process.env.NODE_ENV === 'production' 
      ? `/uploads/vehicles/${filename}` // This will need to be handled by a CDN
      : `/uploads/vehicles/${filename}`
    
    console.log(`✅ Image saved successfully: ${filename} at ${filePath}`)
    
    return {
      success: true,
      imageUrl
    }
  } catch (error) {
    console.error('❌ Failed to save image:', error)
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}

/**
 * Ensure a directory exists, creating it if necessary
 */
async function ensureDirectoryExists(dirPath: string): Promise<void> {
  try {
    await fs.promises.access(dirPath)
  } catch {
    // Directory doesn't exist, create it
    await fs.promises.mkdir(dirPath, { recursive: true })
    console.log(`📁 Created directory: ${dirPath}`)
  }
}

/**
 * Delete an image from the upload directory
 */
export async function deleteImageFromBothDirectories(
  filename: string,
  baseDir: string
): Promise<SaveImageResult> {
  try {
    const uploadDir = getPublicDirectoryPath()
    const filePath = path.join(uploadDir, filename)
    
    // Delete the file (ignore errors if file doesn't exist)
    try {
      await fs.promises.unlink(filePath)
      console.log(`🗑️ Image deleted: ${filename}`)
    } catch (error) {
      console.log(`File not found: ${filePath}`)
    }
    
    return {
      success: true
    }
  } catch (error) {
    console.error('❌ Failed to delete image:', error)
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}
