'use client';

import React, { useState, useRef } from 'react';
import { Plus, Trash2, Edit3, Image as ImageIcon, Sparkles, ArrowRight, Upload, X, Check, Loader2 } from 'lucide-react';
import { CategoryItem } from '@/types/catalog';
import { uploadImageFile } from '@/lib/catalogService';

interface CategoryManagerProps {
  categories: CategoryItem[];
  photoCounts: Record<string, number>;
  onAddCategory: (category: CategoryItem) => void;
  onUpdateCategory: (category: CategoryItem, oldId?: string) => void;
  onDeleteCategory: (id: string) => void;
  onSelectCategoryForPhotos: (id: string) => void;
}

export default function CategoryManager({
  categories,
  photoCounts,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
  onSelectCategoryForPhotos,
}: CategoryManagerProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // New Category Form State
  const [newTitle, setNewTitle] = useState('');
  const [newTag, setNewTag] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newBadge, setNewBadge] = useState('');
  const [newImage, setNewImage] = useState('');
  const [imagePreview, setImagePreview] = useState('');

  // Edit Category Modal State (Name, Tag, Badge, Description, Cover)
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editTag, setEditTag] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editBadge, setEditBadge] = useState('');
  const [editImage, setEditImage] = useState('');
  const [editPreview, setEditPreview] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  // Handle local file selection for new category
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      try {
        const url = await uploadImageFile(file, 'categories');
        setNewImage(url);
        setImagePreview(url);
      } catch (err) {
        console.error(err);
      } finally {
        setIsUploading(false);
      }
    }
  };

  // Handle local file selection for editing category
  const handleEditFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      try {
        const url = await uploadImageFile(file, 'categories');
        setEditImage(url);
        setEditPreview(url);
      } catch (err) {
        console.error(err);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const id = newTitle
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '_')
      .slice(0, 20);

    const created: CategoryItem = {
      id: id || `CAT_${Date.now()}`,
      title: newTitle.trim(),
      tag: newTag.trim() || 'FEATURED COLLECTION',
      desc: newDesc.trim() || 'Curated high-definition master frames and cinematic moments.',
      badge: newBadge.trim() || undefined,
      image: newImage.trim() || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
      frames: '0 Master Frames',
    };

    onAddCategory(created);
    setIsCreateOpen(false);
    resetCreateForm();
  };

  const resetCreateForm = () => {
    setNewTitle('');
    setNewTag('');
    setNewDesc('');
    setNewBadge('');
    setNewImage('');
    setImagePreview('');
  };

  const openEditModal = (cat: CategoryItem) => {
    setEditingCategory(cat);
    setEditTitle(cat.title);
    setEditTag(cat.tag || '');
    setEditDesc(cat.desc || '');
    setEditBadge(cat.badge || '');
    setEditImage(cat.image);
    setEditPreview(cat.image);
  };

  const handleSaveEditCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory || !editTitle.trim()) return;

    const updated: CategoryItem = {
      ...editingCategory,
      title: editTitle.trim(),
      tag: editTag.trim() || 'FEATURED COLLECTION',
      desc: editDesc.trim(),
      badge: editBadge.trim() || undefined,
      image: editImage.trim() || editingCategory.image,
    };

    onUpdateCategory(updated, editingCategory.id);
    setEditingCategory(null);
  };

  return (
    <div className="space-y-8">
      
      {/* Top Banner & Create Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-brand-darkCard p-6 rounded-2xl border border-brand-borderDark shadow-xl">
        <div>
          <span className="text-brand-gold font-cinzel tracking-widest text-xs font-semibold uppercase block mb-1">
            PORTFOLIO STRUCTURE
          </span>
          <h2 className="font-cinzel text-2xl font-light text-white">
            Category & Front Cover Management
          </h2>
          <p className="text-xs text-brand-muted mt-1">
            Create new categories, edit category names & descriptions, or replace front cover images anytime.
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-2 px-5 py-3 bg-brand-gold text-brand-charcoal hover:bg-brand-goldHover font-cinzel text-xs tracking-wider uppercase font-bold rounded-lg shadow-xl transition-all self-start sm:self-auto hover:scale-105"
        >
          <Plus className="w-4 h-4" /> CREATE NEW CATEGORY
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => {
          const count = photoCounts[cat.id] || 0;

          return (
            <div
              key={cat.id}
              className="bg-brand-darkCard border border-brand-borderDark rounded-xl overflow-hidden shadow-xl gold-shimmer-border flex flex-col justify-between group"
            >
              <div>
                {/* Front Cover Image */}
                <div className="relative h-56 overflow-hidden bg-brand-charcoal">
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal via-brand-charcoal/20 to-transparent" />
                  
                  {/* Category ID Badge */}
                  <span className="absolute top-3 left-3 bg-brand-charcoal/90 text-brand-gold text-[10px] font-mono px-2 py-1 rounded border border-brand-gold/40">
                    ID: {cat.id}
                  </span>

                  {cat.badge && (
                    <span className="absolute top-3 right-3 bg-brand-gold text-brand-charcoal text-[9px] font-cinzel font-bold px-2 py-1 rounded shadow">
                      {cat.badge}
                    </span>
                  )}

                  {/* Edit Category Details Floating Button */}
                  <button
                    onClick={() => openEditModal(cat)}
                    className="absolute bottom-3 right-3 bg-brand-darkCard/90 hover:bg-brand-gold hover:text-brand-charcoal text-brand-goldLight text-xs px-3 py-1.5 rounded-lg border border-brand-gold/50 shadow flex items-center gap-1.5 transition-colors font-cinzel tracking-wider"
                    title="Edit Category Name & Details"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Edit Category
                  </button>
                </div>

                {/* Content */}
                <div className="p-5">
                  <span className="text-[10px] font-cinzel text-brand-gold tracking-widest uppercase font-semibold block mb-1">
                    {cat.tag || 'PORTFOLIO COLLECTION'}
                  </span>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h3 className="font-serif text-xl text-white font-medium">
                      {cat.title}
                    </h3>
                    <button
                      onClick={() => openEditModal(cat)}
                      className="text-brand-muted hover:text-brand-gold p-1"
                      title="Edit Category Name"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-xs text-brand-muted line-clamp-2 mb-3">
                    {cat.desc}
                  </p>
                  <div className="flex items-center justify-between text-xs text-brand-muted pt-3 border-t border-brand-borderDark/60">
                    <span>Total Photos: <strong className="text-brand-goldLight">{count} Frames</strong></span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-5 pt-0 flex items-center justify-between gap-3">
                <button
                  onClick={() => onSelectCategoryForPhotos(cat.id)}
                  className="flex-1 py-2.5 bg-brand-charcoal border border-brand-gold/40 hover:border-brand-gold text-brand-gold text-xs font-cinzel tracking-wider uppercase font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5"
                >
                  <ImageIcon className="w-3.5 h-3.5" /> Manage Photos ({count})
                </button>

                <button
                  onClick={() => openEditModal(cat)}
                  className="p-2.5 bg-brand-charcoal hover:bg-brand-darkCard text-brand-gold border border-brand-borderDark rounded-lg transition-colors"
                  title="Edit Category Name & Front Image"
                >
                  <Edit3 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    if (confirm(`Are you sure you want to delete category "${cat.title}" and all its photos?`)) {
                      onDeleteCategory(cat.id);
                    }
                  }}
                  className="p-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg transition-colors"
                  title="Delete Category"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* MODAL 1: CREATE CATEGORY MODAL */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-xl w-full bg-brand-darkCard border border-brand-gold/50 rounded-2xl p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsCreateOpen(false)}
              className="absolute top-5 right-5 text-brand-muted hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="mb-6">
              <span className="text-xs font-cinzel text-brand-gold uppercase tracking-widest font-semibold block mb-1">
                NEW STUDIO SECTION
              </span>
              <h3 className="font-cinzel text-2xl text-white font-medium">
                Create New Category
              </h3>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-cinzel text-brand-goldLight uppercase font-semibold mb-1.5">
                  Category Name / Title *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Haldi & Sangeet Moments"
                  className="w-full bg-brand-charcoal border border-brand-borderDark rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-cinzel text-brand-goldLight uppercase font-semibold mb-1.5">
                    Tag / Subtitle
                  </label>
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="e.g. CEREMONIES & SMILES"
                    className="w-full bg-brand-charcoal border border-brand-borderDark rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-cinzel text-brand-goldLight uppercase font-semibold mb-1.5">
                    Badge (Optional)
                  </label>
                  <input
                    type="text"
                    value={newBadge}
                    onChange={(e) => setNewBadge(e.target.value)}
                    placeholder="e.g. SPECIALTY • ₹8,500"
                    className="w-full bg-brand-charcoal border border-brand-borderDark rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-cinzel text-brand-goldLight uppercase font-semibold mb-1.5">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Describe this category's style, shoot format, or details..."
                  className="w-full bg-brand-charcoal border border-brand-borderDark rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-gold"
                />
              </div>

              {/* Front Cover Image Picker */}
              <div>
                <label className="block text-xs font-cinzel text-brand-goldLight uppercase font-semibold mb-1.5">
                  Front Cover Image *
                </label>
                
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newImage}
                    onChange={(e) => {
                      setNewImage(e.target.value);
                      setImagePreview(e.target.value);
                    }}
                    placeholder="Paste image URL (https://...)"
                    className="flex-1 bg-brand-charcoal border border-brand-borderDark rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-gold"
                  />
                  
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    disabled={isUploading}
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-brand-charcoal border border-brand-gold/60 hover:bg-brand-gold hover:text-brand-charcoal text-brand-gold text-xs font-cinzel tracking-wider rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap"
                  >
                    {isUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                    <span>{isUploading ? 'Uploading...' : 'Upload File'}</span>
                  </button>
                </div>

                {/* Preview */}
                {imagePreview && (
                  <div className="h-40 rounded-xl overflow-hidden border border-brand-gold/40 relative">
                    <img
                      src={imagePreview}
                      alt="Cover Preview"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-2 left-2 bg-black/80 text-[10px] text-brand-gold px-2 py-1 rounded">
                      Front Cover Preview
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-brand-borderDark">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-5 py-2.5 bg-brand-charcoal text-brand-muted hover:text-white text-xs font-cinzel tracking-wider rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-brand-gold text-brand-charcoal hover:bg-brand-goldHover font-cinzel text-xs tracking-wider uppercase font-bold rounded-lg shadow-lg flex items-center gap-2"
                >
                  <Check className="w-4 h-4" /> Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: FULL EDIT CATEGORY (NAME, TAG, BADGE, DESC & COVER IMAGE) */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-xl w-full bg-brand-darkCard border border-brand-gold/50 rounded-2xl p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setEditingCategory(null)}
              className="absolute top-5 right-5 text-brand-muted hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="mb-5">
              <span className="text-xs font-cinzel text-brand-gold uppercase tracking-widest font-semibold block mb-1">
                EDIT CATEGORY DETAILS
              </span>
              <h3 className="font-cinzel text-2xl text-white font-medium">
                Modify Category: {editingCategory.title}
              </h3>
              <p className="text-xs text-brand-muted mt-1">
                Update the category name, subtitle, description, or change the front cover photo.
              </p>
            </div>

            <form onSubmit={handleSaveEditCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-cinzel text-brand-goldLight uppercase font-semibold mb-1.5">
                  Category Name / Title *
                </label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="e.g. Weddings & Mandapam"
                  className="w-full bg-brand-charcoal border border-brand-borderDark rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-cinzel text-brand-goldLight uppercase font-semibold mb-1.5">
                    Tag / Subtitle
                  </label>
                  <input
                    type="text"
                    value={editTag}
                    onChange={(e) => setEditTag(e.target.value)}
                    placeholder="e.g. HERITAGE & CANDID"
                    className="w-full bg-brand-charcoal border border-brand-borderDark rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-cinzel text-brand-goldLight uppercase font-semibold mb-1.5">
                    Badge (Optional)
                  </label>
                  <input
                    type="text"
                    value={editBadge}
                    onChange={(e) => setEditBadge(e.target.value)}
                    placeholder="e.g. SPECIALTY • ₹6,500"
                    className="w-full bg-brand-charcoal border border-brand-borderDark rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-cinzel text-brand-goldLight uppercase font-semibold mb-1.5">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  placeholder="Short description of this category..."
                  className="w-full bg-brand-charcoal border border-brand-borderDark rounded-lg px-4 py-2 text-xs text-white focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-cinzel text-brand-goldLight uppercase font-semibold mb-1.5">
                  Front Cover Photo
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={editImage}
                    onChange={(e) => {
                      setEditImage(e.target.value);
                      setEditPreview(e.target.value);
                    }}
                    placeholder="https://..."
                    className="flex-1 bg-brand-charcoal border border-brand-borderDark rounded-lg px-4 py-2 text-xs text-white focus:outline-none focus:border-brand-gold"
                  />
                  
                  <input
                    type="file"
                    ref={editFileInputRef}
                    accept="image/*"
                    onChange={handleEditFileChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    disabled={isUploading}
                    onClick={() => editFileInputRef.current?.click()}
                    className="px-3 py-2 bg-brand-charcoal border border-brand-gold/60 text-brand-gold text-xs font-cinzel rounded-lg flex items-center gap-1 hover:bg-brand-gold hover:text-brand-charcoal transition-colors shrink-0"
                  >
                    {isUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                    <span>{isUploading ? 'Uploading...' : 'Upload'}</span>
                  </button>
                </div>

                {/* Live Preview */}
                {editPreview && (
                  <div className="h-40 rounded-xl overflow-hidden border border-brand-gold/40 relative">
                    <img
                      src={editPreview}
                      alt="Cover Preview"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-2 left-2 bg-black/80 text-[10px] text-brand-gold px-2 py-0.5 rounded">
                      Front Cover Preview
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-brand-borderDark">
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="px-4 py-2 bg-brand-charcoal text-brand-muted hover:text-white text-xs font-cinzel rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-brand-gold text-brand-charcoal hover:bg-brand-goldHover font-cinzel text-xs font-bold uppercase rounded-lg shadow flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" /> Save Category Updates
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}