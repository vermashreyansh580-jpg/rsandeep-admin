import { db, storage, isConfigValid } from './firebase';
import { collection, onSnapshot, query, doc, setDoc, deleteDoc, writeBatch } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { CategoryItem, PhotoItem } from '@/types/catalog';

/**
 * Uploads a raw image file directly to Firebase Cloud Storage,
 * or falls back to Base64 dataURL if Firebase is not connected.
 */
export async function uploadImageFile(file: File, folder: string): Promise<string> {
  if (isConfigValid && storage) {
    try {
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const storageRef = ref(storage, `${folder}/${Date.now()}_${sanitizedName}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(snapshot.ref);
      return downloadUrl;
    } catch (err) {
      console.warn('Firebase Storage upload failed, falling back to local dataURL:', err);
    }
  }

  // Fallback to Base64 FileReader
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = (e) => reject(e);
    reader.readAsDataURL(file);
  });
}

/**
 * Real-time listener for Categories from Cloud Firestore
 */
export function subscribeToCategories(
  fallback: CategoryItem[],
  onUpdate: (categories: CategoryItem[]) => void
) {
  if (isConfigValid && db) {
    try {
      const q = query(collection(db, 'categories'));
      return onSnapshot(
        q,
        (snapshot) => {
          if (!snapshot.empty) {
            const list: CategoryItem[] = [];
            snapshot.forEach((docSnap) => {
              const data = docSnap.data() as CategoryItem;
              list.push({ ...data, id: docSnap.id });
            });
            onUpdate(list);
            localStorage.setItem('rsandeep_categories', JSON.stringify(list));
          } else {
            loadLocalCategories(fallback, onUpdate);
          }
        },
        (error) => {
          console.warn('Firestore categories listener error:', error);
          loadLocalCategories(fallback, onUpdate);
        }
      );
    } catch (e) {
      console.warn('Firestore subscription failed:', e);
    }
  }

  return loadLocalCategories(fallback, onUpdate);
}

function loadLocalCategories(
  fallback: CategoryItem[],
  onUpdate: (categories: CategoryItem[]) => void
) {
  if (typeof window === 'undefined') return () => {};

  const saved = localStorage.getItem('rsandeep_categories');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        onUpdate(parsed);
      } else {
        onUpdate(fallback);
      }
    } catch (e) {
      onUpdate(fallback);
    }
  } else {
    onUpdate(fallback);
  }

  const handleStorage = (e: StorageEvent) => {
    if (e.key === 'rsandeep_categories' && e.newValue) {
      try {
        const parsed = JSON.parse(e.newValue);
        if (Array.isArray(parsed) && parsed.length > 0) {
          onUpdate(parsed);
        }
      } catch (err) {}
    }
  };

  window.addEventListener('storage', handleStorage);
  return () => window.removeEventListener('storage', handleStorage);
}

/**
 * Real-time listener for Photos from Cloud Firestore
 */
export function subscribeToPhotos(
  fallback: PhotoItem[],
  onUpdate: (photos: PhotoItem[]) => void
) {
  if (isConfigValid && db) {
    try {
      const q = query(collection(db, 'photos'));
      return onSnapshot(
        q,
        (snapshot) => {
          if (!snapshot.empty) {
            const list: PhotoItem[] = [];
            snapshot.forEach((docSnap) => {
              const data = docSnap.data() as PhotoItem;
              list.push({ ...data, id: docSnap.id });
            });
            onUpdate(list);
            localStorage.setItem('rsandeep_portfolio', JSON.stringify(list));
          } else {
            loadLocalPhotos(fallback, onUpdate);
          }
        },
        (error) => {
          console.warn('Firestore photos listener error:', error);
          loadLocalPhotos(fallback, onUpdate);
        }
      );
    } catch (e) {
      console.warn('Firestore subscription failed:', e);
    }
  }

  return loadLocalPhotos(fallback, onUpdate);
}

function loadLocalPhotos(
  fallback: PhotoItem[],
  onUpdate: (photos: PhotoItem[]) => void
) {
  if (typeof window === 'undefined') return () => {};

  const saved = localStorage.getItem('rsandeep_portfolio');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        onUpdate(parsed);
      } else {
        onUpdate(fallback);
      }
    } catch (e) {
      onUpdate(fallback);
    }
  } else {
    onUpdate(fallback);
  }

  const handleStorage = (e: StorageEvent) => {
    if (e.key === 'rsandeep_portfolio' && e.newValue) {
      try {
        const parsed = JSON.parse(e.newValue);
        if (Array.isArray(parsed) && parsed.length > 0) {
          onUpdate(parsed);
        }
      } catch (err) {}
    }
  };

  window.addEventListener('storage', handleStorage);
  return () => window.removeEventListener('storage', handleStorage);
}

/**
 * Save / Update a Category to Cloud Firestore
 */
export async function syncCategoryToFirestore(category: CategoryItem) {
  if (isConfigValid && db) {
    try {
      const docRef = doc(db, 'categories', category.id);
      await setDoc(docRef, category, { merge: true });
    } catch (err) {
      console.warn('Failed to sync category to Firestore:', err);
    }
  }
}

/**
 * Delete a Category from Cloud Firestore
 */
export async function removeCategoryFromFirestore(categoryId: string) {
  if (isConfigValid && db) {
    try {
      const docRef = doc(db, 'categories', categoryId);
      await deleteDoc(docRef);
    } catch (err) {
      console.warn('Failed to delete category from Firestore:', err);
    }
  }
}

/**
 * Save / Update a Photo to Cloud Firestore
 */
export async function syncPhotoToFirestore(photo: PhotoItem) {
  if (isConfigValid && db) {
    try {
      const docRef = doc(db, 'photos', photo.id);
      await setDoc(docRef, photo, { merge: true });
    } catch (err) {
      console.warn('Failed to sync photo to Firestore:', err);
    }
  }
}

/**
 * Delete a Photo from Cloud Firestore
 */
export async function removePhotoFromFirestore(photoId: string) {
  if (isConfigValid && db) {
    try {
      const docRef = doc(db, 'photos', photoId);
      await deleteDoc(docRef);
    } catch (err) {
      console.warn('Failed to delete photo from Firestore:', err);
    }
  }
}

/**
 * One-click batch sync of all local categories & photos to Firestore
 */
export async function pushAllToFirestore(categories: CategoryItem[], photos: PhotoItem[]) {
  if (isConfigValid && db) {
    const firestore = db;
    try {
      const batch = writeBatch(firestore);
      categories.forEach((cat) => {
        const ref = doc(firestore, 'categories', cat.id);
        batch.set(ref, cat, { merge: true });
      });
      photos.forEach((photo) => {
        const ref = doc(firestore, 'photos', photo.id);
        batch.set(ref, photo, { merge: true });
      });
      await batch.commit();
      return true;
    } catch (err) {
      console.error('Batch commit to Firestore failed:', err);
      return false;
    }
  }
  return false;
}
