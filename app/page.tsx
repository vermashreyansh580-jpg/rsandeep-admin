'use client';

import React, { useState, useEffect } from 'react';
import AuthGate from '@/components/AuthGate';
import AdminHeader from '@/components/AdminHeader';
import CategoryManager from '@/components/CategoryManager';
import PhotoManager from '@/components/PhotoManager';
import SyncExportModal from '@/components/SyncExportModal';
import { CategoryItem, PhotoItem, defaultCategories, defaultPhotos } from '@/types/catalog';
import { isConfigValid } from '@/lib/firebase';
import {
  subscribeToCategories,
  subscribeToPhotos,
  syncCategoryToFirestore,
  removeCategoryFromFirestore,
  syncPhotoToFirestore,
  removePhotoFromFirestore,
  pushAllToFirestore,
} from '@/lib/catalogService';
import { Cloud, HardDrive } from 'lucide-react';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [categories, setCategories] = useState<CategoryItem[]>(defaultCategories);
  const [photos, setPhotos] = useState<PhotoItem[]>(defaultPhotos);
  const [activeTab, setActiveTab] = useState<'categories' | 'photos'>('categories');
  const [selectedCategoryForPhotos, setSelectedCategoryForPhotos] = useState<string>('ALL');
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Check auth and subscribe to Cloud Firestore
  useEffect(() => {
    const auth = localStorage.getItem('rsandeep_admin_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }

    const unsubCategories = subscribeToCategories(defaultCategories, setCategories);
    const unsubPhotos = subscribeToPhotos(defaultPhotos, setPhotos);
    setIsLoaded(true);

    return () => {
      if (typeof unsubCategories === 'function') unsubCategories();
      if (typeof unsubPhotos === 'function') unsubPhotos();
    };
  }, []);

  // Compute photo counts per category
  const photoCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    categories.forEach((cat) => {
      counts[cat.id] = photos.filter((p) => p.category === cat.id).length;
    });
    return counts;
  }, [categories, photos]);

  // Category Handlers
  const handleAddCategory = (newCat: CategoryItem) => {
    setCategories((prev) => [newCat, ...prev]);
    localStorage.setItem('rsandeep_categories', JSON.stringify([newCat, ...categories]));
    syncCategoryToFirestore(newCat);
  };

  const handleUpdateCategory = (updatedCat: CategoryItem, oldId?: string) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === (oldId || updatedCat.id) ? updatedCat : c))
    );
    const updatedList = categories.map((c) =>
      c.id === (oldId || updatedCat.id) ? updatedCat : c
    );
    localStorage.setItem('rsandeep_categories', JSON.stringify(updatedList));
    syncCategoryToFirestore(updatedCat);
  };

  const handleDeleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    setPhotos((prev) => prev.filter((p) => p.category !== id));
    
    const remainingCats = categories.filter((c) => c.id !== id);
    const remainingPhotos = photos.filter((p) => p.category !== id);
    localStorage.setItem('rsandeep_categories', JSON.stringify(remainingCats));
    localStorage.setItem('rsandeep_portfolio', JSON.stringify(remainingPhotos));
    
    removeCategoryFromFirestore(id);
  };

  // Photo Handlers
  const handleAddPhoto = (photo: PhotoItem) => {
    setPhotos((prev) => [photo, ...prev]);
    localStorage.setItem('rsandeep_portfolio', JSON.stringify([photo, ...photos]));
    syncPhotoToFirestore(photo);
  };

  const handleAddMultiplePhotos = (newPhotos: PhotoItem[]) => {
    setPhotos((prev) => [...newPhotos, ...prev]);
    const updated = [...newPhotos, ...photos];
    localStorage.setItem('rsandeep_portfolio', JSON.stringify(updated));
    newPhotos.forEach((p) => syncPhotoToFirestore(p));
  };

  const handleDeletePhoto = (id: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
    const remaining = photos.filter((p) => p.id !== id);
    localStorage.setItem('rsandeep_portfolio', JSON.stringify(remaining));
    removePhotoFromFirestore(id);
  };

  const handleSetAsCategoryCover = (categoryId: string, imageUrl: string) => {
    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.id === categoryId) {
          const updated = { ...cat, image: imageUrl };
          syncCategoryToFirestore(updated);
          return updated;
        }
        return cat;
      })
    );
    const updated = categories.map((cat) =>
      cat.id === categoryId ? { ...cat, image: imageUrl } : cat
    );
    localStorage.setItem('rsandeep_categories', JSON.stringify(updated));
  };

  const handleSelectCategoryForPhotos = (id: string) => {
    setSelectedCategoryForPhotos(id);
    setActiveTab('photos');
  };

  const handleImportCatalog = (importedCats: CategoryItem[], importedPhotos: PhotoItem[]) => {
    setCategories(importedCats);
    setPhotos(importedPhotos);
    localStorage.setItem('rsandeep_categories', JSON.stringify(importedCats));
    localStorage.setItem('rsandeep_portfolio', JSON.stringify(importedPhotos));
    pushAllToFirestore(importedCats, importedPhotos);
  };

  const handleResetDefaults = () => {
    setCategories(defaultCategories);
    setPhotos(defaultPhotos);
    localStorage.setItem('rsandeep_categories', JSON.stringify(defaultCategories));
    localStorage.setItem('rsandeep_portfolio', JSON.stringify(defaultPhotos));
    pushAllToFirestore(defaultCategories, defaultPhotos);
  };

  const handleLogout = () => {
    localStorage.removeItem('rsandeep_admin_auth');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <AuthGate onUnlock={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-brand-charcoal text-brand-ivory flex flex-col justify-between">
      <div>
        {/* Top Header */}
        <AdminHeader
          totalCategories={categories.length}
          totalPhotos={photos.length}
          onOpenSyncModal={() => setIsSyncModalOpen(true)}
          onLogout={handleLogout}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Live Cloud / Storage Status Pill */}
        <div className="bg-brand-darkerCard border-b border-brand-borderDark/80 px-4 sm:px-8 py-2 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isConfigValid ? (
              <span className="flex items-center gap-1.5 text-emerald-400 font-semibold font-cinzel text-[11px]">
                <Cloud className="w-3.5 h-3.5" /> Firebase Cloud Active (Real-Time Firestore & Storage)
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-brand-goldLight text-[11px]">
                <HardDrive className="w-3.5 h-3.5 text-brand-gold" /> Local Cache Mode Active (Ready for Firebase credentials)
              </span>
            )}
          </div>

          <span className="text-[11px] text-brand-muted hidden sm:inline">
            Directly connected to Client Website <strong className="text-brand-ivory">rsandeep</strong>
          </span>
        </div>

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
          {activeTab === 'categories' ? (
            <CategoryManager
              categories={categories}
              photoCounts={photoCounts}
              onAddCategory={handleAddCategory}
              onUpdateCategory={handleUpdateCategory}
              onDeleteCategory={handleDeleteCategory}
              onSelectCategoryForPhotos={handleSelectCategoryForPhotos}
            />
          ) : (
            <PhotoManager
              photos={photos}
              categories={categories}
              selectedCategory={selectedCategoryForPhotos}
              onSelectCategory={setSelectedCategoryForPhotos}
              onAddPhoto={handleAddPhoto}
              onAddMultiplePhotos={handleAddMultiplePhotos}
              onDeletePhoto={handleDeletePhoto}
              onSetAsCategoryCover={handleSetAsCategoryCover}
            />
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-brand-borderDark/60 py-6 px-8 text-center text-xs text-brand-muted">
        <p className="font-cinzel tracking-wider text-brand-goldLight">
          R Sandeep Photography & Cinema — Official Studio Content Management System
        </p>
        <p className="text-[11px] text-brand-muted/70 mt-1">
          Head Office: Pratap Market, Golghar, Gorakhpur • Branch: Siswa Bazar, Maharajganj
        </p>
      </footer>

      {/* Sync & Export Modal */}
      <SyncExportModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        categories={categories}
        photos={photos}
        onImportCatalog={handleImportCatalog}
        onResetDefaults={handleResetDefaults}
      />
    </div>
  );
}