export const getImageUrl = (thumb: string | null | undefined): string | null => {
  if (!thumb || thumb.trim() === '') return null;
  
  // Nếu đã là full URL (Cloudinary hoặc domain khác), trả về trực tiếp
  if (thumb.startsWith('http://') || thumb.startsWith('https://')) {
    return thumb;
  }
  
  const cleanThumb = thumb.replace(/^\/+|\/+$/g, '').trim();
  if (!cleanThumb) return null;
  
  // Nếu là path từ Cloudinary (vd: xing-ecommerce/j42phgkanoj9krmodwby.jpg)
  // Dùng Cloudinary base URL
  const cloudinaryCloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'diwaihxke';
  return `https://res.cloudinary.com/${cloudinaryCloudName}/image/upload/${cleanThumb}`;
};