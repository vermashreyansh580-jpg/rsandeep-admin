'use client';

import React, { useState, useEffect } from 'react';
import AuthGate from '@/components/AuthGate';
import AdminHeader from '@/components/AdminHeader';
import CategoryManager from '@/components/CategoryManager';
import PhotoManager from '@/components/PhotoManager';
import SyncExportModal from '@/components/SyncExportModal';
import { CategoryItem, PhotoItem, defaultCategories, defaultPhotos } from '@/types/catalog';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [categories, setCategories] = useState<CategoryItem[]>(defaultCategories);
  const [photos, setPhotos] = useState<PhotoItem[]>(defaultPhotos);
  const [activeTab, setActiveTab] = useState<'categories' | 'photos'>('categories');
  const [selectedCategoryForPhotos, setSelectedCategoryForPhotos] = useState<string>('ALL');
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const auth = localStorage.getItem('rsandeep_admin_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }

    const savedCats = localStorage.getItem('rsandeep_categories');
    if (savedCats) {
      try {
        const parsed = JSON.parse(savedCats);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCategories(parsed);
        }
      } catch (e) {}
    }

    const savedPhotos = localStorage.getItem('rsandeep_portfolio');
    if (savedPhotos) {
      try {
        const parsed = JSON.parse(savedPhotos);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setPhotos(parsed);
        }
      } catch (e) {}
    }

    setIsLoaded(true);
  }, []);

  // Persist to localStorage whenever state changes after initial load
  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem('rsandeep_categories', JSON.stringify(categories));
    localStorage.setItem('rsandeep_portfolio', JSON.stringify(photos));
  }, [categories, photos, isLoaded]);

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
  };

  const handleUpdateCategory = (updatedCat: CategoryItem) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === updatedCat.id ? updatedCat : c))
    );
  };

  const handleDeleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    setPhotos((prev) => prev.filter((p) => p.category !== id));
  };

  // Photo Handlers
  const handleAddPhoto = (photo: PhotoItem) => {
    setPhotos((prev) => [photo, ...prev]);
  };

  const handleAddMultiplePhotos = (newPhotos: PhotoItem[]) => {
    setPhotos((prev) => [...newPhotos, ...prev]);
  };

  const handleDeletePhoto = (id: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
  };

  const handleSetAsCategoryCover = (categoryId: string, imageUrl: string) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === categoryId ? { ...cat, image: imageUrl } : cat))
    );
  };

  const handleSelectCategoryForPhotos = (id: string) => {
    setSelectedCategoryForPhotos(id);
    setActiveTab('photos');
  };

  const handleImportCatalog = (importedCats: CategoryItem[], importedPhotos: PhotoItem[]) => {
    setCategories(importedCats);
    setPhotos(importedPhotos);
  };

  const handleResetDefaults = () => {
    setCategories(defaultCategories);
    setPhotos(defaultPhotos);
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