'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Plus,
  Trash2,
  Image as ImageIcon,
  Upload,
  X,
  Check,
  Star,
  Search,
  Maximize2,
  Layers,
  Loader2,
  FolderOpen,
  Camera,
  Clipboard,
  Link as LinkIcon,
  HardDrive
} from 'lucide-react';
import { PhotoItem, CategoryItem } from '@/types/catalog';
import { uploadImageFile } from '@/lib/catalogService';

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
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgressText, setUploadProgressText] = useState('');
  const [photoTitle, setPhotoTitle] = useState('');
  const [targetCategory, setTargetCategory] = useState(
    selectedCategory === 'ALL' ? (categories[0]?.id || 'WEDDINGS') : selectedCategory
  );
  const [photoUrl, setPhotoUrl] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [lightboxPhoto, setLightboxPhoto] = useState<PhotoItem | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Hidden Input Refs for different picker modes
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const fileManagerInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Filter photos
  const filteredPhotos = photos.filter((p) => {
    const matchesCat = selectedCategory === 'ALL' || p.category === selectedCategory;
    const matchesSearch =
      !searchQuery.trim() || p.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Universal File Processor (Works for Gallery, File Manager, SD Card, Drag-Drop, Clipboard)
  const processFiles = (files: FileList | File[]) => {
    const filesArray = Array.from(files).filter(
      (f) =>
        f.type.startsWith('image/') ||
        /\.(jpg|jpeg|png|webp|heic|heif|jfif|avif|bmp|tiff|raw|dng|cr2|nef)$/i.test(f.name)
    );

    if (filesArray.length === 0) return;

    setSelectedFiles((prev) => [...prev, ...filesArray]);

    const newPreviews: string[] = [];
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

  // Clipboard Paste Support (Ctrl+V)
  useEffect(() => {
    if (!isUploadOpen) return;

    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      const pastedFiles: File[] = [];
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const blob = items[i].getAsFile();
          if (blob) {
            pastedFiles.push(blob);
          }
        }
      }

      if (pastedFiles.length > 0) {
        processFiles(pastedFiles);
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [isUploadOpen]);

  // Drag and Drop Handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      const itemsToAdd: PhotoItem[] = [];

      // If local files were selected, upload to Firebase Storage or Base64
      if (selectedFiles.length > 0) {
        for (let i = 0; i < selectedFiles.length; i++) {
          const file = selectedFiles[i];
          setUploadProgressText(`Uploading ${i + 1} of ${selectedFiles.length}...`);
          const uploadedUrl = await uploadImageFile(file, `photos/${targetCategory}`);
          itemsToAdd.push({
            id: `PHOTO_${Date.now()}_${i}`,
            title: photoTitle.trim()
              ? selectedFiles.length === 1
                ? photoTitle.trim()
                : `${photoTitle.trim()} #${i + 1}`
              : `Studio Frame #${Date.now().toString().slice(-4)}_${i + 1}`,
            category: targetCategory,
            img: uploadedUrl,
            date: new Date().toISOString().split('T')[0],
          });
        }
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
    } catch (err) {
      console.error('Error during photo upload:', err);
      alert('Upload failed. Please check network/files.');
    } finally {
      setIsUploading(false);
      setUploadProgressText('');
    }
  };

  const resetUploadForm = () => {
    setPhotoTitle('');
    setPhotoUrl('');
    setSelectedFiles([]);
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
            Upload from Phone Gallery, File Manager, SD Card, or paste directly.
          </p>
        </div>

        <button
          onClick={() => {
            setTargetCategory(
              selectedCategory === 'ALL' ? (categories[0]?.id || 'WEDDINGS') : selectedCategory
            );
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
            Upload new high-resolution frames from Gallery or File Manager.
          </p>
          <button
            onClick={() => {
              setTargetCategory(
                selectedCategory === 'ALL' ? (categories[0]?.id || 'WEDDINGS') : selectedCategory
              );
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
                <h4
                  className="text-xs font-serif text-white font-medium truncate mb-2"
                  title={photo.title}
                >
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

      {/* MODAL: UNIVERSAL UPLOAD PHOTOS MODAL */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-brand-darkCard border border-brand-gold/50 rounded-2xl p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
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
              <p className="text-xs text-brand-muted mt-1">
                Choose photos from your Phone Gallery, File Manager, SD Card, Camera, or Drag & Drop.
              </p>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-6">
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
                  Photo Title / Series Name (Optional)
                </label>
                <input
                  type="text"
                  value={photoTitle}
                  onChange={(e) => setPhotoTitle(e.target.value)}
                  placeholder="e.g. Royal Jaimala Twilight Stage"
                  className="w-full bg-brand-charcoal border border-brand-borderDark rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-gold"
                />
              </div>

              {/* Hidden System Pickers */}
              {/* 1. Universal / File Manager Picker (All files / SD Card / Internal memory) */}
              <input
                type="file"
                multiple
                ref={fileManagerInputRef}
                accept="*/*"
                onChange={(e) => e.target.files && processFiles(e.target.files)}
                className="hidden"
              />

              {/* 2. Gallery / Photos Picker */}
              <input
                type="file"
                multiple
                ref={galleryInputRef}
                accept="image/*, .jpg, .jpeg, .png, .webp, .heic, .heif, .jfif, .avif, .bmp, .tiff"
                onChange={(e) => e.target.files && processFiles(e.target.files)}
                className="hidden"
              />

              {/* 3. Camera Direct */}
              <input
                type="file"
                ref={cameraInputRef}
                accept="image/*"
                capture="environment"
                onChange={(e) => e.target.files && processFiles(e.target.files)}
                className="hidden"
              />

              {/* Multi-Source Picker Buttons */}
              <div>
                <label className="block text-xs font-cinzel text-brand-goldLight uppercase font-semibold mb-2">
                  Choose Where To Upload From:
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                  {/* Option 1: File Manager / Internal Storage */}
                  <button
                    type="button"
                    onClick={() => fileManagerInputRef.current?.click()}
                    className="p-3.5 bg-brand-charcoal hover:bg-brand-darkerCard border border-brand-gold/40 hover:border-brand-gold rounded-xl flex flex-col items-center justify-center gap-1.5 text-center transition-all group shadow"
                  >
                    <FolderOpen className="w-5 h-5 text-brand-gold group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-cinzel font-semibold text-white">File Manager</span>
                    <span className="text-[10px] text-brand-muted">SD Card / Files App</span>
                  </button>

                  {/* Option 2: Phone Gallery */}
                  <button
                    type="button"
                    onClick={() => galleryInputRef.current?.click()}
                    className="p-3.5 bg-brand-charcoal hover:bg-brand-darkerCard border border-brand-gold/40 hover:border-brand-gold rounded-xl flex flex-col items-center justify-center gap-1.5 text-center transition-all group shadow"
                  >
                    <ImageIcon className="w-5 h-5 text-brand-gold group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-cinzel font-semibold text-white">Photo Gallery</span>
                    <span className="text-[10px] text-brand-muted">Photos / Albums</span>
                  </button>

                  {/* Option 3: Live Camera */}
                  <button
                    type="button"
                    onClick={() => cameraInputRef.current?.click()}
                    className="p-3.5 bg-brand-charcoal hover:bg-brand-darkerCard border border-brand-gold/40 hover:border-brand-gold rounded-xl flex flex-col items-center justify-center gap-1.5 text-center transition-all group shadow col-span-2 sm:col-span-1"
                  >
                    <Camera className="w-5 h-5 text-brand-gold group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-cinzel font-semibold text-white">Camera Snap</span>
                    <span className="text-[10px] text-brand-muted">Instant Backstage Photo</span>
                  </button>
                </div>

                {/* Drag and Drop Zone */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileManagerInputRef.current?.click()}
                  className={`border-2 border-dashed ${
                    isDragging ? 'border-brand-gold bg-brand-gold/15 scale-[1.01]' : 'border-brand-borderDark hover:border-brand-gold/60 bg-brand-charcoal/50'
                  } rounded-xl p-6 text-center cursor-pointer transition-all`}
                >
                  <Upload className="w-7 h-7 text-brand-gold mx-auto mb-2" />
                  <p className="text-xs text-brand-ivory font-cinzel font-semibold uppercase tracking-wider mb-0.5">
                    Drag & Drop Photos Here, or Tap to Browse
                  </p>
                  <p className="text-[11px] text-brand-muted flex items-center justify-center gap-2 mt-1">
                    <Clipboard className="w-3.5 h-3.5 text-brand-gold" /> Or simply press <strong>Ctrl + V</strong> to paste from clipboard
                  </p>
                </div>

                {/* Direct Image URL Option */}
                <div className="flex items-center gap-3 my-3">
                  <div className="flex-1 h-[1px] bg-brand-borderDark" />
                  <span className="text-[10px] text-brand-muted font-cinzel uppercase">OR PASTE WEB LINK</span>
                  <div className="flex-1 h-[1px] bg-brand-borderDark" />
                </div>

                <div className="relative">
                  <LinkIcon className="w-4 h-4 text-brand-gold absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    placeholder="Paste direct image link (https://...)"
                    className="w-full bg-brand-charcoal border border-brand-borderDark rounded-lg pl-9 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-gold"
                  />
                </div>
              </div>

              {/* Previews of Selected Files */}
              {previewImages.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-cinzel text-brand-goldLight uppercase font-semibold">
                      Selected Files ({previewImages.length} images ready to upload)
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFiles([]);
                        setPreviewImages([]);
                      }}
                      className="text-[11px] text-red-400 hover:underline"
                    >
                      Clear All
                    </button>
                  </div>

                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-52 overflow-y-auto p-2 bg-brand-charcoal rounded-xl border border-brand-borderDark">
                    {previewImages.map((src, idx) => (
                      <div
                        key={idx}
                        className="relative aspect-square rounded-lg overflow-hidden border border-brand-borderDark group"
                      >
                        <img src={src} alt="Preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => {
                            setPreviewImages(previewImages.filter((_, i) => i !== idx));
                            setSelectedFiles(selectedFiles.filter((_, i) => i !== idx));
                          }}
                          className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 shadow"
                          title="Remove this photo"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Form Buttons */}
              <div className="flex items-center justify-between gap-3 pt-4 border-t border-brand-borderDark">
                <span className="text-xs text-brand-muted font-sans">
                  {uploadProgressText || `${previewImages.length} items queued`}
                </span>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsUploadOpen(false)}
                    className="px-5 py-2.5 bg-brand-charcoal text-brand-muted hover:text-white text-xs font-cinzel rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUploading || (previewImages.length === 0 && !photoUrl.trim())}
                    className="px-6 py-2.5 bg-brand-gold text-brand-charcoal hover:bg-brand-goldHover disabled:opacity-50 font-cinzel text-xs tracking-wider uppercase font-bold rounded-lg shadow-xl flex items-center gap-2 transition-transform hover:scale-105"
                  >
                    {isUploading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Check className="w-4 h-4" />
                    )}
                    <span>
                      {isUploading
                        ? uploadProgressText || 'Uploading to Cloud...'
                        : `Upload ${previewImages.length > 0 ? `(${previewImages.length})` : ''}`}
                    </span>
                  </button>
                </div>
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
              <h3 className="text-xl font-serif text-white">{lightboxPhoto.title}</h3>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}