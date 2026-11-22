'use client';

import React from 'react';
import { Crown, LogOut, RefreshCw, Download, Layers, Image as ImageIcon, ExternalLink } from 'lucide-react';

interface AdminHeaderProps {
  totalCategories: number;
  totalPhotos: number;
  onOpenSyncModal: () => void;
  onLogout: () => void;
  activeTab: 'categories' | 'photos';
  onTabChange: (tab: 'categories' | 'photos') => void;
}

export default function AdminHeader({
  totalCategories,
  totalPhotos,
  onOpenSyncModal,
  onLogout,
  activeTab,
  onTabChange,
}: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-brand-darkCard/95 backdrop-blur-md border-b border-brand-borderDark shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        
        {/* Brand & Studio Identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border border-brand-gold flex items-center justify-center bg-brand-charcoal text-brand-gold font-cinzel font-bold text-base shadow">
            RS
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-cinzel text-lg tracking-[0.15em] font-bold text-white block">
                R SANDEEP CMS
              </span>
              <span className="bg-brand-gold/15 text-brand-gold text-[10px] font-cinzel font-bold px-2 py-0.5 rounded border border-brand-gold/30">
                OFFICIAL ADMIN
              </span>
            </div>
            <span className="text-[10px] text-brand-muted font-sans block">
              Gorakhpur & Maharajganj Portfolio Engine
            </span>
          </div>
        </div>

        {/* Tab Switcher: Categories vs Photos */}
        <div className="flex items-center bg-brand-charcoal p-1 rounded-xl border border-brand-borderDark">
          <button
            onClick={() => onTabChange('categories')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-cinzel tracking-wider font-semibold uppercase transition-all ${
              activeTab === 'categories'
                ? 'bg-brand-gold text-brand-charcoal shadow-lg font-bold'
                : 'text-brand-muted hover:text-brand-ivory'
            }`}
          >
            <Layers className="w-3.5 h-3.5" /> Categories ({totalCategories})
          </button>
          
          <button
            onClick={() => onTabChange('photos')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-cinzel tracking-wider font-semibold uppercase transition-all ${
              activeTab === 'photos'
                ? 'bg-brand-gold text-brand-charcoal shadow-lg font-bold'
                : 'text-brand-muted hover:text-brand-ivory'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" /> Photo Catalog ({totalPhotos})
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenSyncModal}
            className="flex items-center gap-1.5 px-3 py-2 bg-brand-charcoal border border-brand-gold/40 hover:border-brand-gold text-brand-gold text-xs font-cinzel tracking-wider font-semibold rounded-lg transition-colors"
            title="Sync with Live Website or Backup Data"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sync & Export</span>
          </button>

          <a
            href="http://localhost:3000"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 bg-brand-charcoal border border-brand-borderDark hover:border-brand-gold text-brand-ivory hover:text-brand-gold text-xs font-cinzel tracking-wider rounded-lg transition-colors"
            title="Preview Live Website"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden md:inline">View Website</span>
          </a>

          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-cinzel tracking-wider rounded-lg transition-colors"
            title="Lock / Logout CMS"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>

      </div>
    </header>
  );
}