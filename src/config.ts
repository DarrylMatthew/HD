export interface SiteConfig {
  language: string
  siteTitle: string
  siteDescription: string
}

export interface NavigationLink {
  label: string
  target: string
}

export interface NavigationConfig {
  brandName: string
  links: NavigationLink[]
}

export interface HeroConfig {
  imagePath: string
  eyebrow: string
  titleLine: string
  titleEmphasis: string
  subtitleLine1: string
  subtitleLine2: string
  ctaText: string
  ctaTargetId: string
}

export interface ProductConfig {
  name: string
  description: string
  sizes: { label: string; price: string }[]
  image: string
}

export interface MenuConfig {
  sectionLabel: string
  title: string
  subtitle: string
  products: ProductConfig[]
  cateringTitle: string
  cateringDescription: string
  cateringCta: string
}

export interface OrderConfig {
  sectionLabel: string
  title: string
  subtitle: string
  image: string
  whatsappNumber: string
}

// ======== ORDERING PAGE TYPES ========

export interface OrderingSizeOption {
  label: string
  price: number
}

export interface OrderingAddonOption {
  label: string
  price: number
}

export interface OrderingCategory {
  id: string
  name: string
  image: string
  description: string
  startingPrice: number
  sizes: OrderingSizeOption[]
  addons: OrderingAddonOption[]
  dustingOptions: string[]
  toppers: OrderingAddonOption[]
  hasCustomText: boolean
  customTextPricePerChar: number
  isTBD: boolean
}

export interface PickupLocation {
  id: string
  name: string
  address: string
}

export interface OrderingPageConfig {
  sectionLabel: string
  title: string
  subtitle: string
  whatsappNumber: string
  categories: OrderingCategory[]
  pickupLocations: PickupLocation[]
}

export interface GalleryConfig {
  sectionLabel: string
  title: string
  images: string[]
}

export interface FooterConfig {
  brandName: string
  brandTagline: string
  columns: { heading: string; links: { label: string; href: string }[] }[]
  copyright: string
}

// ======== HANGRI DESSERT CONFIGURATION ========

export const siteConfig: SiteConfig = {
  language: "en",
  siteTitle: "Hangri Dessert | Artisanal Tiramisu & Panna Cotta",
  siteDescription: "Handcrafted tiramisu and panna cotta made with love. Order online for delivery or pickup.",
}

export const navigationConfig: NavigationConfig = {
  brandName: "Hangri Dessert",
  links: [
    { label: "Menu", target: "#ordering" },
    { label: "Order", target: "#order-grid" },
    { label: "Gallery", target: "#gallery" },
  ],
}

export const heroConfig: HeroConfig = {
  imagePath: "/images/hero-bg.jpg",
  eyebrow: "Handcrafted with Love",
  titleLine: "Artisanal",
  titleEmphasis: "Desserts",
  subtitleLine1: "Small-batch tiramisu and panna cotta,",
  subtitleLine2: "made fresh using the finest ingredients.",
  ctaText: "Explore Menu",
  ctaTargetId: "#ordering",
}

export const menuConfig: MenuConfig = {
  sectionLabel: "Our Menu",
  title: "Handcrafted with Love",
  subtitle: "Each dessert is made to order using premium ingredients and time-honored recipes.",
  products: [
    {
      name: "Classic Tiramisu",
      description: "Layers of coffee-soaked ladyfingers and velvety mascarpone cream, finished with a dusting of premium cocoa powder. Our signature recipe.",
      sizes: [
        { label: "Small (8oz)", price: "$XX" },
        { label: "Regular (16oz)", price: "$XX" },
        { label: "Large (32oz)", price: "$XX" },
      ],
      image: "/images/tiramisu-regular.jpg",
    },
    {
      name: "Lemon Tiramisu",
      description: "A bright, citrusy twist on the classic. Lemon-infused mascarpone with delicate ladyfingers and a zesty lemon curd finish.",
      sizes: [
        { label: "Small (8oz)", price: "$XX" },
        { label: "Regular (16oz)", price: "$XX" },
        { label: "Large (32oz)", price: "$XX" },
      ],
      image: "/images/lemon-tiramisu.jpg",
    },
    {
      name: "Panna Cotta",
      description: "Silky Italian custard made with fresh cream and vanilla, topped with a seasonal berry compote. Elegant and irresistible.",
      sizes: [
        { label: "Single Jar", price: "$XX" },
        { label: "Set of 4", price: "$XX" },
        { label: "Set of 6", price: "$XX" },
      ],
      image: "/images/panna-cotta.jpg",
    },
  ],
  cateringTitle: "Catering & Bulk Orders",
  cateringDescription: "Planning an event? We offer beautiful dessert spreads for parties, weddings, corporate events, and special celebrations. Custom portions available.",
  cateringCta: "Inquire for Catering",
}

export const orderConfig: OrderConfig = {
  sectionLabel: "Place Your Order",
  title: "Order Your Favorites",
  subtitle: "Fill in the details below and we'll confirm your order via WhatsApp.",
  image: "/images/order-form.jpg",
  whatsappNumber: "+1234567890", // Placeholder - replace with actual number
}

export const orderingPageConfig: OrderingPageConfig = {
  sectionLabel: "Order Online",
  title: "Choose Your Dessert",
  subtitle: "Select a product, customize your order, and send it straight to our WhatsApp.",
  whatsappNumber: "+6282111847742",
  categories: [
    {
      id: "whole-cake",
      name: "Whole Cake",
      image: "/images/whole-cake.png",
      description: "Our signature whole tiramisu cake, perfect for celebrations. Choose your size, add rum, pick a dusting, and personalize with custom text.",
      startingPrice: 265000,
      sizes: [
        { label: "M", price: 265000 },
        { label: "L", price: 275000 },
        { label: "XL", price: 375000 },
      ],
      addons: [
        { label: "No Rum", price: 0 },
        { label: "Add Rum", price: 25000 },
      ],
      dustingOptions: ["Plain", "Happy Birthday", "Happy Anniversary", "Congrats"],
      toppers: [
        { label: "No Topper", price: 0 },
        { label: "Happy Birthday", price: 15000 },
        { label: "Happy Anniversary", price: 15000 },
        { label: "Congrats", price: 15000 },
      ],
      hasCustomText: true,
      customTextPricePerChar: 3000,
      isTBD: false,
    },
    {
      id: "tiramisu-bowl",
      name: "Tiramisu Bowl",
      image: "/images/tiramisu-bowl.png",
      description: "Individual servings of our classic tiramisu in a bowl — perfect for gifting or personal indulgence.",
      startingPrice: 30000,
      sizes: [],
      addons: [
        { label: "No Rum", price: 0 },
        { label: "Add Rum", price: 5000 },
      ],
      dustingOptions: [],
      toppers: [
        { label: "No Topper", price: 0 },
        { label: "Happy Birthday", price: 15000 },
        { label: "Happy Anniversary", price: 15000 },
        { label: "Congrats", price: 15000 },
      ],
      hasCustomText: false,
      customTextPricePerChar: 0,
      isTBD: false,
    },
    {
      id: "tiramisu-dessert-box",
      name: "Tiramisu Dessert Box",
      image: "/images/dessert-box.png",
      description: "Beautifully packaged tiramisu dessert boxes, ideal for events, gatherings, or a luxurious treat at home.",
      startingPrice: 0,
      sizes: [],
      addons: [],
      dustingOptions: [],
      toppers: [],
      hasCustomText: false,
      customTextPricePerChar: 0,
      isTBD: true,
    },
    {
      id: "panna-cotta",
      name: "Panna Cotta",
      image: "/images/panna-cotta-product.png",
      description: "Silky Italian panna cotta made with fresh cream and vanilla, topped with seasonal fruit compote.",
      startingPrice: 0,
      sizes: [],
      addons: [],
      dustingOptions: [],
      toppers: [],
      hasCustomText: false,
      customTextPricePerChar: 0,
      isTBD: true,
    },
    {
      id: "additional-category",
      name: "More Coming Soon",
      image: "/images/additional-dessert.png",
      description: "We're always creating new delights. Stay tuned for exciting new additions to our dessert menu!",
      startingPrice: 0,
      sizes: [],
      addons: [],
      dustingOptions: [],
      toppers: [],
      hasCustomText: false,
      customTextPricePerChar: 0,
      isTBD: true,
    },
  ],
  pickupLocations: [
    {
      id: "bsd",
      name: "Hangri Dessert BSD",
      address: "Jl. Raflesia No.C1/3 Blok C1, RT.1/RW.10, Lengkong Gudang, Kec. Serpong, Kota Tangerang Selatan, Banten 15310",
    },
    {
      id: "tambora",
      name: "Hangri Dessert Tambora (Jakarta)",
      address: "Jln. Tanah Sereal 11 gang FF 1 no. 21 RT. 03/011 (Pagar Hitam), RT.3/RW.11, Tanah Sereal, Kec. Tambora, Kota Jakarta Barat, DKI Jakarta 11210",
    },
  ],
}

export const galleryConfig: GalleryConfig = {
  sectionLabel: "Gallery",
  title: "Our Creations",
  images: [
    "/images/gallery-1.jpg",
    "/images/gallery-2.jpg",
    "/images/gallery-3.jpg",
    "/images/gallery-4.jpg",
    "/images/gallery-5.jpg",
    "/images/tiramisu-large.jpg",
    "/images/order-form.jpg",
    "/images/tiramisu-regular.jpg",
  ],
}

export const footerConfig: FooterConfig = {
  brandName: "Hangri Dessert",
  brandTagline: "Handcrafted sweetness, delivered to your door.",
  columns: [
    {
      heading: "Quick Links",
      links: [
        { label: "Menu", href: "#menu" },
        { label: "Order Now", href: "#order" },
        { label: "Gallery", href: "#gallery" },
      ],
    },
    {
      heading: "Contact",
      links: [
        { label: "WhatsApp", href: "https://wa.me/1234567890" },
        { label: "Instagram", href: "#" },
        { label: "Email Us", href: "mailto:hello@hangridessert.com" },
      ],
    },
    {
      heading: "Order Info",
      links: [
        { label: "Delivery via App", href: "#order" },
        { label: "Self Pickup", href: "#order" },
        { label: "Catering", href: "#menu" },
      ],
    },
  ],
  copyright: "© 2025 Hangri Dessert. All rights reserved.",
}

// ======== TIRAMISU WEDDING CAKE (TWC) CONFIGURATION ========

export interface TWCProductConfig {
  name: string
  description: string
  servingInfo: string
  image: string
}

export interface TWCMenuConfig {
  sectionLabel: string
  title: string
  subtitle: string
  products: TWCProductConfig[]
  bespokeTitle: string
  bespokeDescription: string
  bespokeCta: string
}

export interface TWCConsultationConfig {
  sectionLabel: string
  title: string
  subtitle: string
  description: string
  ctaText: string
  whatsappNumber: string
  features: string[]
}

export interface TWCTheme {
  background: string
  backgroundAlt: string
  foreground: string
  accent: string
  accentLight: string
  card: string
  cardBorder: string
  muted: string
  overlay: string
}

export const twcTheme: TWCTheme = {
  background: "#ffffff",
  backgroundAlt: "#f8f8f8",
  foreground: "#1a1a1a",
  accent: "#c9a96e",
  accentLight: "rgba(201, 169, 110, 0.15)",
  card: "#fafafa",
  cardBorder: "rgba(0, 0, 0, 0.08)",
  muted: "#6b6b6b",
  overlay: "rgba(0, 0, 0, 0.92)",
}

export const twcSiteConfig: SiteConfig = {
  language: "en",
  siteTitle: "Tiramisu Wedding Cake | Luxury Wedding Desserts",
  siteDescription: "Bespoke tiramisu cocktail towers and wedding cakes. Elevate your special day with our luxurious handcrafted desserts.",
}

export const twcNavigationConfig: NavigationConfig = {
  brandName: "TWC",
  links: [
    { label: "Collection", target: "#menu" },
    { label: "Inquire", target: "#order" },
    { label: "Gallery", target: "#gallery" },
  ],
}

export const twcHeroConfig: HeroConfig = {
  imagePath: "/images/twc/twc-hero.png",
  eyebrow: "Luxury Wedding Desserts",
  titleLine: "Tiramisu",
  titleEmphasis: "Wedding Cake",
  subtitleLine1: "Bespoke tiramisu cocktail towers",
  subtitleLine2: "crafted for your unforgettable celebration.",
  ctaText: "Get Free Wedding Cake Sample",
  ctaTargetId: "#order",
}

export const twcMenuConfig: TWCMenuConfig = {
  sectionLabel: "Our Collection",
  title: "Exquisite Creations",
  subtitle: "Each piece is meticulously crafted to be the centrepiece of your celebration. Pricing is tailored to your vision.",
  products: [
    {
      name: "Tiramisu Cocktail Tower",
      description: "A breathtaking tower of hand-crafted tiramisu served in crystal coupe glasses. The ultimate showpiece for your wedding reception, customisable in height and presentation.",
      servingInfo: "Available for 50–300+ guests",
      image: "/images/twc/twc-tower.png",
    },
    {
      name: "Long Cake",
      description: "An elegant elongated tiramisu cake, perfect for the main dessert table. Layers of espresso-kissed ladyfingers and silken mascarpone, finished with edible gold leaf.",
      servingInfo: "Serves 30–80 guests",
      image: "/images/twc/twc-longcake.png",
    },
    {
      name: "Giant Tiramisu Whole Cake",
      description: "A grand tiered tiramisu cake that commands attention. Multiple layers of our signature recipe, beautifully decorated to match your wedding theme and colour palette.",
      servingInfo: "Serves 80–200+ guests",
      image: "/images/twc/twc-wholecake.png",
    },
  ],
  bespokeTitle: "Bespoke Service",
  bespokeDescription: "Every wedding is unique. We work closely with you to design a custom dessert experience that perfectly complements your venue, theme, and vision. From tasting sessions to day-of setup, we handle every detail.",
  bespokeCta: "Start Your Consultation",
}

export const twcConsultationConfig: TWCConsultationConfig = {
  sectionLabel: "Get Started",
  title: "Let's Plan Your Perfect Wedding Dessert",
  subtitle: "Begin with a complimentary consultation to discuss your vision.",
  description: "Our team will guide you through flavour selections, presentation styles, and logistics to create a bespoke dessert experience for your special day.",
  ctaText: "Try the Wedding Cake Tester for Free",
  whatsappNumber: "+0987654321", // Placeholder - replace with actual TWC WhatsApp number
  features: [
    "Complimentary tasting session",
    "Custom flavour & design consultation",
    "Venue visit & setup coordination",
    "Day-of delivery & presentation",
  ],
}

export const twcGalleryConfig: GalleryConfig = {
  sectionLabel: "Portfolio",
  title: "Moments We've Created",
  images: [
    "/images/twc/twc-gallery-1.png",
    "/images/twc/twc-gallery-2.png",
    "/images/twc/twc-gallery-3.png",
    "/images/twc/twc-gallery-4.png",
    "/images/twc/twc-tower.png",
    "/images/twc/twc-wholecake.png",
    "/images/twc/twc-longcake.png",
    "/images/twc/twc-hero.png",
  ],
}

export const twcFooterConfig: FooterConfig = {
  brandName: "Tiramisu Wedding Cake",
  brandTagline: "Elevating your celebration with bespoke dessert artistry.",
  columns: [
    {
      heading: "Explore",
      links: [
        { label: "Collection", href: "#menu" },
        { label: "Portfolio", href: "#gallery" },
        { label: "Inquire", href: "#order" },
      ],
    },
    {
      heading: "Contact",
      links: [
        { label: "WhatsApp", href: "https://wa.me/0987654321" },
        { label: "Instagram", href: "#" },
        { label: "Email Us", href: "mailto:hello@tiramisuweddingcake.com" },
      ],
    },
    {
      heading: "Services",
      links: [
        { label: "Wedding Cakes", href: "#menu" },
        { label: "Cocktail Towers", href: "#menu" },
        { label: "Bespoke Design", href: "#order" },
      ],
    },
  ],
  copyright: "© 2025 Tiramisu Wedding Cake. All rights reserved.",
}
