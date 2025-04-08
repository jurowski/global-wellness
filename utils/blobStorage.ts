import { put, del } from '@vercel/blob';

export interface BlobUploadOptions {
  contentType?: string;
}

// In test mode, we'll store artifacts locally instead of in blob storage
const isTestMode = process.env.NODE_ENV === 'test';

export async function uploadToBlob(
  data: Buffer | string,
  filename: string,
  options: BlobUploadOptions = {}
): Promise<string> {
  if (isTestMode) {
    // In test mode, save to local file system
    const fs = await import('fs');
    const path = await import('path');
    const testArtifactsDir = path.join(process.cwd(), 'test-artifacts');
    
    // Ensure directory exists
    if (!fs.existsSync(testArtifactsDir)) {
      fs.mkdirSync(testArtifactsDir, { recursive: true });
    }
    
    const filePath = path.join(testArtifactsDir, filename);
    fs.writeFileSync(filePath, data);
    return `file://${filePath}`;
  }

  // In production, use blob storage
  const blob = await put(filename, data, {
    access: 'public',
    contentType: options.contentType || 'application/octet-stream',
  });
  return blob.url;
}

export async function deleteFromBlob(url: string): Promise<void> {
  if (isTestMode) {
    // In test mode, delete local file
    const fs = await import('fs');
    const path = await import('path');
    const filePath = url.replace('file://', '');
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    return;
  }

  // In production, delete from blob storage
  await del(url);
}

export async function uploadTestArtifact(
  data: Buffer,
  testName: string,
  type: 'screenshot' | 'error' | 'log'
): Promise<string> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `test-artifacts/${type}/${testName}-${timestamp}.${type === 'log' ? 'txt' : 'png'}`;
  return uploadToBlob(data, filename, {
    contentType: type === 'log' ? 'text/plain' : 'image/png',
  });
} 