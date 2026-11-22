'use client';

import React, { useState, useRef } from 'react';
import { Plus, Trash2, Image as ImageIcon, Upload, X, Check, Star, Search, Maximize2, Layers } from 'lucide-react';
import { PhotoItem, CategoryItem } from '@/types/catalog';

interface PhotoManagerProps {
  photos: PhotoItem[];
  categories: CategoryItem[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  onAddPhoto: (photo: PhotoItem) => void;
  onAddMultiplePhotos: (photos: PhotoItem[]) => void;
  onDeletePhoto: (id: string) => void;
  onSetAsCategoryCover: (categoryId: string, imageUrl: string) => void;
}

export default function PhotoManager({
  photos,
  categories,
  selectedCategory,
  onSelectCategory,
  onAddPhoto,
  onAddMultiplePhotos,
  onDeletePhoto,
  onSetAsCategoryCover,
}: PhotoManagerProps) {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [photoTitle, setPhotoTitle] = useState('');
  const [targetCategory, setTargetCategory] = useState(selectedCategory === 'ALL' ? (categories[0]?.id || 'WEDDINGS') : selectedCategory);
  const [photoUrl, setPhotoUrl] = useState('');
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [lightboxPhoto, setLightboxPhoto] = useState<PhotoItem | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter photos
  const filteredPhotos = photos.filter((p) => {
    const matchesCat = selectedCategory === 'ALL' || p.category === selectedCategory;
    const matchesSearch = !searchQuery.trim() || p.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Handle multi-file upload
  const handleMultipleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newPreviews: string[] = [];
    const filesArray = Array.from(files);

    let loadedCount = 0;
    filesArray.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        const result = loadEvent.target?.result as string;
        if (result) {
          newPreviews.push(result);
        }
        loadedCount++;
        if (loadedCount === filesArray.length) {
          setPreviewImages((prev) => [...prev, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const itemsToAdd: PhotoItem[] = [];

    // If local files were selected
    if (previewImages.length > 0) {
      previewImages.forEach((imgData, idx) => {
        itemsToAdd.push({
          id: `PHOTO_${Date.now()}_${idx}`,
          title: photoTitle.trim() ? (previewImages.length === 1 ? photoTitle.trim() : `${photoTitle.trim()} #${idx + 1}`) : `Studio Frame #${Date.now().toString().slice(-4)}`,
          category: targetCategory,
          img: imgData,
          date: new Date().toISOString().split('T')[0],
        });
      });
    } else if (photoUrl.trim()) {
      // Direct URL
      itemsToAdd.push({
        id: `PHOTO_${Date.now()}`,
        title: photoTitle.trim() || 'Master Wedding Portrait',
        category: targetCategory,
        img: photoUrl.trim(),
        date: new Date().toISOString().split('T')[0],
      });
    }

    if (itemsToAdd.length > 0) {
      onAddMultiplePhotos(itemsToAdd);
      setIsUploadOpen(false);
      resetUploadForm();
    }
  };

  const resetUploadForm = () => {
    setPhotoTitle('');
    setPhotoUrl('');
    setPreviewImages([]);
  };

  return (
    <div className="space-y-8">
      
      {/* Top Banner & Upload Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-brand-darkCard p-6 rounded-2xl border border-brand-borderDark shadow-xl">
        <div>
          <span className="text-brand-gold font-cinzel tracking-widest text-xs font-semibold uppercase block mb-1">
            IMAGE REPOSITORY
          </span>
          <h2 className="font-cinzel text-2xl font-light text-white">
            Photo Gallery Manager
          </h2>
          <p className="text-xs text-brand-muted mt-1">
            Add unlimited client photos to categories, delete unwanted frames, or set any photo as cover.
          </p>
        </div>

        <button
          onClick={() => {
            setTargetCategory(selectedCategory === 'ALL' ? (categories[0]?.id || 'WEDDINGS') : selectedCategory);
            setIsUploadOpen(true);
          }}
          className="flex items-center gap-2 px-5 py-3 bg-brand-gold text-brand-charcoal hover:bg-brand-goldHover font-cinzel text-xs tracking-wider uppercase font-bold rounded-lg shadow-xl transition-all self-start sm:self-auto hover:scale-105"
        >
          <Plus className="w-4 h-4" /> UPLOAD PHOTOS
        </button>
      </div>

      {/* Filter Bar & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-brand-charcoal p-4 rounded-xl border border-brand-borderDark">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          <button
            onClick={() => onSelectCategory('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-cinzel tracking-wider whitespace-nowrap transition-colors ${
              selectedCategory === 'ALL'
                ? 'bg-brand-gold text-brand-charcoal font-bold'
                : 'bg-brand-darkCard text-brand-muted hover:text-white'
            }`}
          >
            All Categories ({photos.length})
          </button>

          {categories.map((cat) => {
            const count = photos.filter((p) => p.category === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-cinzel tracking-wider whitespace-nowrap transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-brand-gold text-brand-charcoal font-bold'
                    : 'bg-brand-darkCard text-brand-muted hover:text-white'
                }`}
              >
                {cat.title} ({count})
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-brand-gold absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search frames by title..."
            className="w-full bg-brand-darkCard border border-brand-borderDark rounded-lg pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-brand-gold"
          />
        </div>
      </div>

      {/* Photos Grid */}
      {filteredPhotos.length === 0 ? (
        <div className="bg-brand-darkCard border border-dashed border-brand-borderDark rounded-2xl p-16 text-center">
          <ImageIcon className="w-12 h-12 text-brand-gold/40 mx-auto mb-3" />
          <h3 className="font-cinzel text-lg text-white font-medium mb-1">
            No Photos Found in this Category
          </h3>
          <p className="text-xs text-brand-muted mb-6">
            Upload new high-resolution frames to populate this portfolio.
          </p>
          <button
            onClick={() => {
              setTargetCategory(selectedCategory === 'ALL' ? (categories[0]?.id || 'WEDDINGS') : selectedCategory);
              setIsUploadOpen(true);
            }}
            className="px-5 py-2.5 bg-brand-gold text-brand-charcoal font-cinzel text-xs font-bold uppercase rounded-lg shadow inline-flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" /> Upload First Photo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredPhotos.map((photo) => (
            <div
              key={photo.id}
              className="bg-brand-darkCard border border-brand-borderDark rounded-xl overflow-hidden shadow-lg group relative flex flex-col justify-between"
            >
              {/* Photo Display */}
              <div className="relative aspect-[4/5] overflow-hidden bg-brand-charcoal cursor-pointer">
                <img
                  src={photo.img}
                  alt={photo.title}
                  onClick={() => setLightboxPhoto(photo)}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Category Badge */}
                <span className="absolute top-2 left-2 bg-brand-charcoal/90 text-brand-gold text-[9px] font-cinzel font-semibold px-2 py-0.5 rounded border border-brand-gold/30">
                  {photo.category}
                </span>

                {/* Lightbox Trigger */}
                <button
                  onClick={() => setLightboxPhoto(photo)}
                  className="absolute top-2 right-2 bg-black/70 hover:bg-brand-gold hover:text-brand-charcoal text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  title="View Fullscreen"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>

                <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              {/* Photo Details & Actions */}
              <div className="p-3 bg-brand-darkCard">
                <h4 className="text-xs font-serif text-white font-medium truncate mb-2" title={photo.title}>
                  {photo.title}
                </h4>

                <div className="flex items-center justify-between gap-1 pt-2 border-t border-brand-borderDark/60">
                  {/* Set As Cover Button */}
                  <button
                    onClick={() => {
                      onSetAsCategoryCover(photo.category, photo.img);
                      alert(`Set as front cover for "${photo.category}"!`);
                    }}
                    className="flex items-center gap-1 text-[10px] text-brand-gold hover:text-brand-goldLight transition-colors font-cinzel"
                    title="Set this photo as the Category Front Cover"
                  >
                    <Star className="w-3 h-3 fill-brand-gold" /> Make Cover
                  </button>

                  {/* Delete Photo */}
                  <button
                    onClick={() => {
                      if (confirm(`Delete photo "${photo.title}"?`)) {
                        onDeletePhoto(photo.id);
                      }
                    }}
                    className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-colors"
                    title="Delete Photo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* MODAL: UPLOAD PHOTOS MODAL */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-xl w-full bg-brand-darkCard border border-brand-gold/50 rounded-2xl p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsUploadOpen(false)}
              className="absolute top-5 right-5 text-brand-muted hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="mb-6">
              <span className="text-xs font-cinzel text-brand-gold uppercase tracking-widest font-semibold block mb-1">
                STUDIO REPOSITORY
              </span>
              <h3 className="font-cinzel text-2xl text-white font-medium">
                Upload Photos to Category
              </h3>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-cinzel text-brand-goldLight uppercase font-semibold mb-1.5">
                  Select Target Category *
                </label>
                <select
                  value={targetCategory}
                  onChange={(e) => setTargetCategory(e.target.value)}
                  className="w-full bg-brand-charcoal border border-brand-borderDark rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-gold"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title} ({c.id})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-cinzel text-brand-goldLight uppercase font-semibold mb-1.5">
                  Photo Title / Caption (Optional)
                </label>
                <input
                  type="text"
                  value={photoTitle}
                  onChange={(e) => setPhotoTitle(e.target.value)}
                  placeholder="e.g. Royal Jaimala Twilight Stage"
                  className="w-full bg-brand-charcoal border border-brand-borderDark rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-gold"
                />
              </div>

              {/* Upload Source: Multi-file or URL */}
              <div>
                <label className="block text-xs font-cinzel text-brand-goldLight uppercase font-semibold mb-1.5">
                  Upload Image Files or Paste URL
                </label>

                {/* Drag and Drop Zone */}
                <input
                  type="file"
                  multiple
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleMultipleFiles}
                  className="hidden"
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-brand-gold/40 hover:border-brand-gold bg-brand-charcoal/50 rounded-xl p-8 text-center cursor-pointer transition-all hover:bg-brand-charcoal"
                >
                  <Upload className="w-8 h-8 text-brand-gold mx-auto mb-2" />
                  <p className="text-xs text-brand-ivory font-cinzel font-semibold uppercase tracking-wider mb-1">
                    Click to select photos from device
                  </p>
                  <p className="text-[11px] text-brand-muted">
                    Supports multiple JPG, PNG, WEBP files simultaneously
                  </p>
                </div>

                <div className="flex items-center gap-3 my-3">
                  <div className="flex-1 h-[1px] bg-brand-borderDark" />
                  <span className="text-[10px] text-brand-muted font-cinzel uppercase">OR PASTE URL</span>
                  <div className="flex-1 h-[1px] bg-brand-borderDark" />
                </div>

                <input
                  type="text"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  placeholder="Paste direct image URL (https://...)"
                  className="w-full bg-brand-charcoal border border-brand-borderDark rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-gold"
                />
              </div>

              {/* Previews if local files picked */}
              {previewImages.length > 0 && (
                <div>
                  <span className="text-xs font-cinzel text-brand-goldLight uppercase block mb-2">
                    Selected Files ({previewImages.length} images ready)
                  </span>
                  <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto p-1 bg-brand-charcoal rounded-lg">
                    {previewImages.map((src, idx) => (
                      <div key={idx} className="relative aspect-square rounded overflow-hidden border border-brand-borderDark">
                        <img src={src} alt="Preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setPreviewImages(previewImages.filter((_, i) => i !== idx))}
                          className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-brand-borderDark">
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(false)}
                  className="px-5 py-2.5 bg-brand-charcoal text-brand-muted hover:text-white text-xs font-cinzel rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={previewImages.length === 0 && !photoUrl.trim()}
                  className="px-6 py-2.5 bg-brand-gold text-brand-charcoal hover:bg-brand-goldHover disabled:opacity-50 font-cinzel text-xs tracking-wider uppercase font-bold rounded-lg shadow-lg flex items-center gap-2"
                >
                  <Check className="w-4 h-4" /> Save to Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FULLSCREEN PREVIEW LIGHTBOX */}
      {lightboxPhoto && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-4">
          <button
            onClick={() => setLightboxPhoto(null)}
            className="absolute top-6 right-6 text-white hover:text-brand-gold transition-colors p-2"
          >
            <X className="w-8 h-8" />
          </button>
          
          <div className="max-w-4xl max-h-[85vh] flex flex-col items-center">
            <img
              src={lightboxPhoto.img}
              alt={lightboxPhoto.title}
              className="max-w-full max-h-[75vh] object-contain rounded-xl border border-brand-gold/60 shadow-2xl"
            />
            <div className="mt-4 text-center">
              <span className="text-xs font-cinzel text-brand-gold tracking-widest uppercase block mb-1">
                Category: {lightboxPhoto.category}
              </span>
              <h3 className="text-xl font-serif text-white">
                {lightboxPhoto.title}
              </h3>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}