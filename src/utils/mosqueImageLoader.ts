import { MosquePhotoSet } from "../types";

// In-memory image element cache
const imageCache = new Map<string, HTMLImageElement>();
const loadPromises = new Map<string, Promise<HTMLImageElement | null>>();

/**
 * Load an image from URL or Data URL with caching
 */
export function loadMosqueImage(src?: string): Promise<HTMLImageElement | null> {
  if (!src) return Promise.resolve(null);
  
  if (imageCache.has(src)) {
    const cached = imageCache.get(src)!;
    if (cached.complete && cached.naturalWidth > 0) {
      return Promise.resolve(cached);
    }
  }

  if (loadPromises.has(src)) {
    return loadPromises.get(src)!;
  }

  const promise = new Promise<HTMLImageElement | null>((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      imageCache.set(src, img);
      resolve(img);
    };
    img.onerror = () => {
      console.warn("Could not load mosque image:", src);
      resolve(null);
    };
    img.src = src;
  });

  loadPromises.set(src, promise);
  return promise;
}

/**
 * Synchronous getter from cache if already loaded
 */
export function getCachedMosqueImage(src?: string): HTMLImageElement | null {
  if (!src) return null;
  const cached = imageCache.get(src);
  if (cached && cached.complete && cached.naturalWidth > 0) {
    return cached;
  }
  return null;
}

/**
 * Preload all mosque photos in a photo set
 */
export async function preloadMosquePhotoSet(photos: MosquePhotoSet): Promise<{
  nabawi: HTMLImageElement | null;
  haram: HTMLImageElement | null;
  aqsa: HTMLImageElement | null;
  zayed: HTMLImageElement | null;
}> {
  const [nabawi, haram, aqsa, zayed] = await Promise.all([
    loadMosqueImage(photos.nabawi),
    loadMosqueImage(photos.haram),
    loadMosqueImage(photos.aqsa),
    loadMosqueImage(photos.zayed),
  ]);

  return { nabawi, haram, aqsa, zayed };
}

export const DEFAULT_MOSQUE_PHOTOS: MosquePhotoSet = {
  nabawi: "/images/mosques/nabawi.jpg",
  haram: "/images/mosques/haram.jpg",
  aqsa: "/images/mosques/aqsa.jpg",
  zayed: "/images/mosques/zayed.jpg",
};
