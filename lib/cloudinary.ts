import { v2 as cloudinary } from "cloudinary";

function client() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary credentials are not configured");
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });

  return cloudinary;
}

export async function uploadFile(path: string, file: File) {
  const folder = path.startsWith("documents/")
    ? "portfolio/documents"
    : "portfolio/images";
  const publicId = path
    .replace(/^(images|documents)\//, "")
    .replace(/\.[^.]+$/, "");
  const buffer = Buffer.from(await file.arrayBuffer());

  const result = await new Promise<{ secure_url: string; public_id: string }>(
    (resolve, reject) => {
      const stream = client().uploader.upload_stream(
        {
          folder,
          public_id: publicId,
          resource_type: file.type === "application/pdf" ? "raw" : "image",
        },
        (error, uploaded) => {
          if (error || !uploaded) {
            reject(error ?? new Error("Upload failed"));
            return;
          }
          resolve(uploaded);
        }
      );
      stream.end(buffer);
    }
  );

  return { url: result.secure_url, path: result.public_id };
}
