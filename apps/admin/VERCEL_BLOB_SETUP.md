# Vercel Blob Storage Setup Guide

## Why Vercel Blob Storage?

The admin dashboard needs a place to store vehicle images. Since the app runs in a serverless environment (Vercel), we cannot save files to the local filesystem. Vercel Blob Storage provides a simple solution for storing and serving images.

## Setup Instructions

### 1. Create a Blob Store

1. Go to your Vercel Dashboard
2. Navigate to the "Storage" tab
3. Click "Create Store"
4. Select "Blob" as the storage type
5. Choose a name for your store (e.g., "flyrentals-images")
6. Select your preferred region
7. Click "Create"

### 2. Get Your Token

1. After creating the store, click on it
2. Go to the ".env.local" tab
3. Copy the `BLOB_READ_WRITE_TOKEN` value

### 3. Add to Environment Variables

#### For Local Development:
Create a `.env.local` file in the `apps/admin` directory:
```env
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_xxxxxxxxxxxxxxxxx"
```

#### For Production (Vercel):
1. Go to your project settings in Vercel
2. Navigate to "Environment Variables"
3. Add a new variable:
   - Name: `BLOB_READ_WRITE_TOKEN`
   - Value: Your token from step 2
   - Environment: Production (and Preview if needed)

### 4. Deploy

After adding the environment variable, redeploy your application for the changes to take effect.

## Testing

To verify the setup is working:
1. Go to the Admin Dashboard
2. Navigate to Fleet > Add New Vehicle
3. Upload a primary image
4. Save the vehicle
5. The image should be uploaded and displayed correctly

## Troubleshooting

### "Image storage not configured" Error
- Ensure the `BLOB_READ_WRITE_TOKEN` environment variable is set
- Check that the token is valid and has not expired
- Verify the token has read and write permissions

### Images Not Displaying
- Check the browser console for errors
- Ensure the image URLs are using the Vercel Blob Storage domain
- Verify the images were uploaded successfully in the Vercel Dashboard

### Rate Limits
Vercel Blob Storage has usage limits based on your plan:
- Hobby: 1GB storage, 1GB bandwidth/month
- Pro: 100GB storage, 100GB bandwidth/month
- Enterprise: Custom limits

## Alternative Solutions

If you prefer not to use Vercel Blob Storage, you can modify the `apps/admin/lib/image-utils.ts` file to use:
- AWS S3
- Cloudinary
- UploadThing
- Any other cloud storage provider

Just replace the `@vercel/blob` import and update the upload/delete functions accordingly.
