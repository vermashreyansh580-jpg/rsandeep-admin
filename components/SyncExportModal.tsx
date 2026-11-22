'use client';

import React, { useRef } from 'react';
import { X, Download, Upload, RefreshCw, CheckCircle2, ShieldCheck, Database } from 'lucide-react';
import { CategoryItem, PhotoItem, defaultCategories, defaultPhotos } from '@/types/catalog';

interface SyncExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: CategoryItem[];
  photos: PhotoItem[];
  onImportCatalog: (categories: CategoryItem[], photos: PhotoItem[]) => void;
  onResetDefaults: () => void;
}

export default function SyncExportModal({
  isOpen,
  onClose,
  categories,
  photos,
  onImportCatalog,
  onResetDefaults,
}: SyncExportModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Sync to localStorage
  const handleSyncToLive = () => {
    localStorage.setItem('rsandeep_categories', JSON.stringify(categories));
    localStorage.setItem('rsandeep_portfolio', JSON.stringify(photos));
    alert('✅ Catalog successfully synchronized to the live website! Refresh the main website tab to see all latest categories and photos.');
  };

  // Export JSON file
  const handleExportJSON = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      studio: 'R Sandeep Photography',
      version: '2.0',
      categories,
      photos,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `rsandeep_catalog_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Import JSON file
  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (readEvent) => {
        try {
          const parsed = JSON.parse(readEvent.target?.result as string);
          if (parsed && Array.isArray(parsed.categories) && Array.isArray(parsed.photos)) {
            onImportCatalog(parsed.categories, parsed.photos);
            alert('✅ Backup catalog imported successfully!');
            onClose();
          } else {
            alert('❌ Invalid catalog backup format.');
          }
        } catch (err) {
          alert('❌ Failed to parse JSON file.');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-brand-darkCard border border-brand-gold/60 rounded-2xl p-6 sm:p-8 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-brand-muted hover:text-white"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <Database className="w-4 h-4 text-brand-gold" />
            <span className="text-xs font-cinzel text-brand-gold uppercase tracking-widest font-semibold">
              DATA ENGINE & BACKUP
            </span>
          </div>
          <h3 className="font-cinzel text-2xl text-white font-medium">
            Sync & Export Studio CMS
          </h3>
          <p className="text-xs text-brand-muted mt-1">
            Publish all changes to the live website or backup your entire catalog.
          </p>
        </div>

        <div className="space-y-4">
          
          {/* 1. Sync to Live Website */}
          <div className="p-4 bg-brand-charcoal border border-brand-gold/40 rounded-xl flex items-center justify-between gap-4">
            <div>
              <h4 className="text-xs font-cinzel text-brand-goldLight font-bold uppercase tracking-wider mb-0.5">
                Sync to Live Website
              </h4>
              <p className="text-[11px] text-brand-muted">
                Push all current categories & photos to live storage.
              </p>
            </div>
            <button
              onClick={handleSyncToLive}
              className="px-4 py-2 bg-brand-gold text-brand-charcoal hover:bg-brand-goldHover font-cinzel text-xs font-bold uppercase rounded-lg shadow whitespace-nowrap"
            >
              Sync Now
            </button>
          </div>

          {/* 2. Download JSON Backup */}
          <div className="p-4 bg-brand-charcoal border border-brand-borderDark rounded-xl flex items-center justify-between gap-4">
            <div>
              <h4 className="text-xs font-cinzel text-white font-bold uppercase tracking-wider mb-0.5">
                Download JSON Backup
              </h4>
              <p className="text-[11px] text-brand-muted">
                Export catalog.json to keep a safe offline copy.
              </p>
            </div>
            <button
              onClick={handleExportJSON}
              className="px-4 py-2 bg-brand-darkerCard border border-brand-borderDark hover:border-brand-gold text-brand-gold text-xs font-cinzel font-semibold uppercase rounded-lg flex items-center gap-1.5 whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5" /> Export
            </button>
          </div>

          {/* 3. Restore / Import JSON */}
          <div className="p-4 bg-brand-charcoal border border-brand-borderDark rounded-xl flex items-center justify-between gap-4">
            <div>
              <h4 className="text-xs font-cinzel text-white font-bold uppercase tracking-wider mb-0.5">
                Import JSON Backup
              </h4>
              <p className="text-[11px] text-brand-muted">
                Restore categories & photos from a saved JSON file.
              </p>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              onChange={handleFileImport}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-brand-darkerCard border border-brand-borderDark hover:border-brand-gold text-brand-gold text-xs font-cinzel font-semibold uppercase rounded-lg flex items-center gap-1.5 whitespace-nowrap"
            >
              <Upload className="w-3.5 h-3.5" /> Import
            </button>
          </div>

          {/* 4. Reset Defaults */}
          <div className="pt-2">
            <button
              onClick={() => {
                if (confirm('Are you sure you want to restore default starter categories and photos? All custom additions will be reset.')) {
                  onResetDefaults();
                  alert('Restored starter catalog!');
                  onClose();
                }
              }}
              className="w-full py-2.5 text-xs text-red-400 hover:text-red-300 font-cinzel tracking-wider uppercase transition-colors"
            >
              Reset to Original Starter Catalog
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}