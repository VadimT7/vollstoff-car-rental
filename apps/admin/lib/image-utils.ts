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
 * Save an image to both the admin and web app public directories
 * This ensures images are accessible from both applications
 */
export async function saveImageToBothDirectories({
  buffer,
  filename,
  baseDir
}: SaveImageParams): Promise<SaveImageResult> {
  try {
    // Define the directories where we need to save images
    const adminPublicDir = path.join(baseDir, 'public', 'uploads', 'vehicles')
    const webPublicDir = path.join(baseDir, '..', 'web', 'public', 'uploads', 'vehicles')
    
    // Ensure directories exist
    await ensureDirectoryExists(adminPublicDir)
    await ensureDirectoryExists(webPublicDir)
    
    // Define file paths
    const adminFilePath = path.join(adminPublicDir, filename)
    const webFilePath = path.join(webPublicDir, filename)
    
    // Save to both locations
    await fs.promises.writeFile(adminFilePath, buffer)
    await fs.promises.writeFile(webFilePath, buffer)
    
    // Return the public URL (relative to web root)
    const imageUrl = `/uploads/vehicles/${filename}`
    
    console.log(`✅ Image saved successfully to both directories: ${filename}`)
    
    return {
      success: true,
      imageUrl
    }
  } catch (error) {
    console.error('❌ Failed to save image to both directories:', error)
    
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
 * Delete an image from both directories
 */
export async function deleteImageFromBothDirectories(
  filename: string,
  baseDir: string
): Promise<SaveImageResult> {
  try {
    const adminFilePath = path.join(baseDir, 'public', 'uploads', 'vehicles', filename)
    const webFilePath = path.join(baseDir, '..', 'web', 'public', 'uploads', 'vehicles', filename)
    
    // Delete from both locations (ignore errors if files don't exist)
    try {
      await fs.promises.unlink(adminFilePath)
    } catch (error) {
      console.log(`File not found in admin directory: ${adminFilePath}`)
    }
    
    try {
      await fs.promises.unlink(webFilePath)
    } catch (error) {
      console.log(`File not found in web directory: ${webFilePath}`)
    }
    
    console.log(`🗑️ Image deleted from both directories: ${filename}`)
    
    return {
      success: true
    }
  } catch (error) {
    console.error('❌ Failed to delete image from both directories:', error)
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}
