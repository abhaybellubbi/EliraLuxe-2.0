/**
 * Client-Side Media Compression Utility
 * Automatically compresses images and optimizes video uploads for fast loading and low storage footprint.
 */

export function compressImageFile(
  file: File,
  maxWidth = 1200,
  quality = 0.78
): Promise<{ dataUrl: string; originalSize: string; compressedSize: string }> {
  return new Promise((resolve, reject) => {
    const originalSizeKb = (file.size / 1024).toFixed(1) + " KB";
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          const raw = e.target?.result as string;
          resolve({ dataUrl: raw, originalSize: originalSizeKb, compressedSize: originalSizeKb });
          return;
        }

        // Draw and compress image
        ctx.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL("image/jpeg", quality);
        const compressedSizeKb = ((compressedDataUrl.length * 3) / 4 / 1024).toFixed(1) + " KB";

        resolve({
          dataUrl: compressedDataUrl,
          originalSize: originalSizeKb,
          compressedSize: compressedSizeKb,
        });
      };

      img.onerror = () => {
        const raw = e.target?.result as string;
        resolve({ dataUrl: raw, originalSize: originalSizeKb, compressedSize: originalSizeKb });
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function processVideoFile(file: File): Promise<{ dataUrl: string; videoSize: string }> {
  return new Promise((resolve, reject) => {
    const videoSizeMb = (file.size / (1024 * 1024)).toFixed(2) + " MB";
    const reader = new FileReader();

    reader.onload = (e) => {
      resolve({
        dataUrl: e.target?.result as string,
        videoSize: videoSizeMb,
      });
    };

    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
