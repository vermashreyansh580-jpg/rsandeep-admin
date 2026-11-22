export interface CategoryItem {
  id: string;
  title: string;
  desc: string;
  frames?: string;
  tag?: string;
  image: string;
  badge?: string;
}

export interface PhotoItem {
  id: string;
  title: string;
  category: string;
  img: string;
  date?: string;
  isCover?: boolean;
}

export const defaultCategories: CategoryItem[] = [
  {
    id: 'WEDDINGS',
    title: 'Weddings & Mandapam',
    desc: 'Muhurtham, Jaimala, Pheras & Grand Celebrations',
    frames: '24+ Master Frames',
    tag: 'HERITAGE & CANDID',
    image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'MATERNITY',
    title: 'Maternity Shoots',
    desc: 'Studio & Outdoor with Props & Designer Gowns',
    frames: '14+ Master Frames',
    tag: 'MOTHERHOOD STORIES',
    image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=800&q=80',
    badge: 'SPECIALTY • ₹6,500'
  },
  {
    id: 'PRE-WEDDING',
    title: 'Pre-Wedding Cinema',
    desc: 'Nauka Vihar 2.0 sunset romance & drone films',
    frames: '18+ Master Frames',
    tag: 'LAKESIDE & DESTINATIONS',
    image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'BRIDAL',
    title: 'Bridal Editorial Portraits',
    desc: 'Intricate jewellery, eye framing & lehenga glamour',
    frames: '16+ Master Frames',
    tag: 'FINE-ART EDITORIAL',
    image: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'DRESSES',
    title: 'Dresses & Props Available',
    desc: 'Trail gowns, maternity outfits & creative accessories',
    frames: '14+ Outfits Catalog',
    tag: 'STUDIO WARDROBE RENTAL',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80',
    badge: 'STUDIO WARDROBE'
  },
  {
    id: 'ENGAGEMENT',
    title: 'Engagement & Silver Jubilee',
    desc: 'Ring teasers, 25th anniversary celebrations & events',
    frames: '12+ Master Frames',
    tag: 'CEREMONIES & MILESTONES',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
  }
];

export const defaultPhotos: PhotoItem[] = [
  // WEDDINGS & BRIDAL
  { id: 'w1', title: 'Royal Heritage Muhurtham', category: 'WEDDINGS', img: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=85' },
  { id: 'w2', title: 'Varmala Celebration & Stage Light', category: 'WEDDINGS', img: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85' },
  { id: 'w3', title: 'Editorial Bride Red Lehenga Framing', category: 'BRIDAL', img: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1200&q=85' },
  { id: 'w4', title: 'Intimate Mandapam Pheras Ritual', category: 'WEDDINGS', img: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=85' },
  { id: 'w5', title: 'Grand Temple Entrance Walk', category: 'WEDDINGS', img: 'https://images.unsplash.com/photo-1544078751-58fee2d8a03b?auto=format&fit=crop&w=1200&q=85' },
  { id: 'w6', title: 'Pastel Floral Stage & Haldi Smiles', category: 'BRIDAL', img: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=85' },

  // MATERNITY SHOOTS
  { id: 'm1', title: 'Golden Hour Motherhood Blessing', category: 'MATERNITY', img: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1200&q=85' },
  { id: 'm2', title: 'Floral Studio Maternity Portrait', category: 'MATERNITY', img: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=1200&q=85' },
  { id: 'm3', title: 'Pastel Gown Outdoor Silhouette', category: 'MATERNITY', img: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=1200&q=85' },
  { id: 'm4', title: 'Pure Joy & Baby Milestone Celebration', category: 'MATERNITY', img: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=1200&q=85' },

  // PRE-WEDDINGS
  { id: 'p1', title: 'Nauka Vihar Sunset Romance', category: 'PRE-WEDDING', img: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1200&q=85' },
  { id: 'p2', title: 'Heritage Resort Lawn Twilight', category: 'PRE-WEDDING', img: 'https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?auto=format&fit=crop&w=1200&q=85' },
  { id: 'p3', title: 'Lakeside Embrace & Film Grading', category: 'PRE-WEDDING', img: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1200&q=85' },
  { id: 'p4', title: 'Ramada Luxury Corridor Silhouette', category: 'PRE-WEDDING', img: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=85' },

  // DRESSES AVAILABLE
  { id: 'd1', title: 'Royal Crimson Velvet Trail Gown', category: 'DRESSES', img: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=85' },
  { id: 'd2', title: 'Sky Blue Maternity Ruffle Train', category: 'DRESSES', img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85' },
  { id: 'd3', title: 'Pastel Blush Net Designer Lehenga', category: 'DRESSES', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85' },
  { id: 'd4', title: 'Ivory Shimmer Sangeet Lookbook', category: 'DRESSES', img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=85' },

  // ENGAGEMENTS
  { id: 'e1', title: 'Sarovar Portico Ring Exchange', category: 'ENGAGEMENT', img: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=85' },
  { id: 'e2', title: 'Siswa Bazar Hotel Le Grand Night', category: 'ENGAGEMENT', img: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=85' },
  { id: 'e3', title: '25th Wedding Anniversary Celebration', category: 'ENGAGEMENT', img: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=85' },
];