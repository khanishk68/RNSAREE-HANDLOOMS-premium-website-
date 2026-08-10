export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  banner: string;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAt?: number;
  category: string;
  fabric: string;
  color: string;
  occasion: string;
  description: string;
  story: string;
  care: string[];
  images: string[];
  tags: string[];
  stock: number;
  featured?: boolean;
  bestSeller?: boolean;
  limited?: boolean;
  isNew?: boolean;
};

export type Testimonial = {
  id: string;
  name: string;
  location: string;
  rating: number;
  text: string;
  image: string;
  saree: string;
};

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
  author: string;
};

export type HeroSlide = {
  id: number | string;
  image: string;
  title: string;
  subtitle: string;
};

/**
 * Brand identity — live store details for RN Saree Handlooms, Nellore.
 */
export const BRAND = {
  name: "RN SAREE HANDLOOMS AND DRESS",
  shortName: "RN SAREE",
  quote: "Mana Samskruthi Mana Chenatha",
  quoteTelugu: "మన సంస్కృతి మన చేనేత",
  phone: "+91 90144 47240",
  email: "rnsareehandlooms@gmail.com",
  whatsapp: "919014447240",
  address: "Ramalingapuram, Near Mamatha Nursing Home, Nellore 524003",
  mapsUrl: "https://maps.app.goo.gl/WGzXHESfsF3gZQnCA",
  mapsEmbed:
    "https://www.google.com/maps?q=14.4426518,79.9837302&z=16&output=embed",
  instagram: "",
  facebook: "",
  timings: "Mon – Sat · 10:00 AM – 8:00 PM",
};

/** Real catalogue categories — add banners & products from Admin */
export const categories: Category[] = [
  {
    id: "c-silk",
    name: "Silk",
    slug: "silk",
    description: "Lustrous pure silks woven with generations of devotion.",
    banner: "",
  },
  {
    id: "c-banarasi",
    name: "Banarasi",
    slug: "banarasi",
    description: "Opulent zari weaves from the looms of Varanasi.",
    banner: "",
  },
  {
    id: "c-kanjeevaram",
    name: "Kanjeevaram",
    slug: "kanjeevaram",
    description: "South India's temple of silk — bold borders, sacred motifs.",
    banner: "",
  },
  {
    id: "c-cotton",
    name: "Cotton",
    slug: "cotton",
    description: "Breathable handloom cottons for everyday elegance.",
    banner: "",
  },
  {
    id: "c-designer",
    name: "Designer",
    slug: "designer",
    description: "Contemporary couture rooted in classical craft.",
    banner: "",
  },
  {
    id: "c-bridal",
    name: "Bridal",
    slug: "bridal",
    description: "Heirloom pieces for the most sacred of celebrations.",
    banner: "",
  },
  {
    id: "c-soft-silk",
    name: "Soft Silk",
    slug: "soft-silk",
    description: "Feather-light soft silks that drape like liquid gold.",
    banner: "",
  },
  {
    id: "c-linen",
    name: "Linen",
    slug: "linen",
    description: "Refined linen weaves for modern grace.",
    banner: "",
  },
  {
    id: "c-party",
    name: "Party Wear",
    slug: "party-wear",
    description: "Evening-ready silhouettes with luminous finishes.",
    banner: "",
  },
  {
    id: "c-festival",
    name: "Festival Collection",
    slug: "festival",
    description: "Celebrate every festival in handwoven splendour.",
    banner: "",
  },
  {
    id: "c-new",
    name: "New Arrivals",
    slug: "new-arrivals",
    description: "Fresh from the loom — just arrived.",
    banner: "",
  },
  {
    id: "c-best",
    name: "Best Sellers",
    slug: "best-sellers",
    description: "Beloved classics cherished by our patrons.",
    banner: "",
  },
  {
    id: "c-limited",
    name: "Limited Edition",
    slug: "limited-edition",
    description: "Rare weaves, numbered pieces, once in a lifetime.",
    banner: "",
  },
];

/** Empty — add sarees from Admin → Products */
export const products: Product[] = [];

/** Empty — add reviews from Admin → Testimonials */
export const testimonials: Testimonial[] = [];

/** Empty — publish journal posts from Admin when ready */
export const blogs: BlogPost[] = [];

/** Empty — set homepage slides from Admin → Banners */
export const heroSlides: HeroSlide[] = [];

/** Empty — gallery fills as you add product imagery */
export const galleryImages: string[] = [];

export function getProductBySlug(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(slug: string) {
  if (slug === "new-arrivals") return products.filter((p) => p.isNew);
  if (slug === "best-sellers") return products.filter((p) => p.bestSeller);
  if (slug === "limited-edition") return products.filter((p) => p.limited);
  if (slug === "festival")
    return products.filter(
      (p) => p.category === "festival" || p.occasion === "Festival"
    );
  return products.filter((p) => p.category === slug);
}

export function getRelatedProducts(product: Product, limit = 4) {
  return products
    .filter(
      (p) =>
        p.id !== product.id &&
        (p.category === product.category || p.occasion === product.occasion)
    )
    .slice(0, limit);
}
