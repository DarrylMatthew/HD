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

// A menu group shown as a heading on the ordering page (e.g. "Whole Cakes").
// Categories reference a group via groupId; groups render in array order.
export interface OrderingGroup {
  id: string
  name: string
  description: string
}

export interface OrderingCategory {
  id: string
  groupId: string
  name: string
  // Per-item photo. To add/replace a photo, drop a file in /public/images with
  // this exact name — no code change needed. Until the file exists, the UI shows
  // `imageFallback` (so the site never displays a broken image).
  image: string
  imageFallback?: string
  // CSS object-position for this item's photos (e.g. "center 70%" to shift down).
  // Defaults to "center center" when omitted.
  imagePosition?: string
  description: string
  startingPrice: number
  sizes: OrderingSizeOption[]
  addons: OrderingAddonOption[]
  // Sauce choice (e.g. panna cotta): pick exactly 1, free. Empty = no sauce step.
  sauces: string[]
  dustingOptions: string[]
  toppers: OrderingAddonOption[]
  // Optional extras, multi-select checkboxes (e.g. "Knife + Lighter + Candle").
  extras: OrderingAddonOption[]
  hasCustomText: boolean
  customTextPricePerChar: number
  isTBD: boolean
}

export interface PickupLocation {
  id: string
  name: string
  // Short label used in the navbar "Location" dropdown (e.g. "BSD", "Jakarta").
  shortLabel: string
  address: string
  mapsUrl: string
  // Default / normal-day hours, 24h "HH:MM". Used for any date the Sheet has no
  // row for (and as the fallback if the Sheet can't load). Set these to your usual hours.
  openTime: string  // e.g. "10:00"
  closeTime: string // e.g. "20:00"
}

export interface OrderingPageConfig {
  sectionLabel: string
  title: string
  subtitle: string
  whatsappNumber: string
  groups: OrderingGroup[]
  categories: OrderingCategory[]
  pickupLocations: PickupLocation[]
  // Published Google Sheet CSV URL for per-date pickup hours.
  // In the Sheet: File -> Share -> Publish to web -> (whole doc) -> CSV, paste the link here.
  // Leave "" to skip the Sheet and use each location's openTime/closeTime as fixed hours.
  pickupHoursSheetUrl: string
  // Published Google Sheet CSV URL for seasonal/extra menu items (e.g. festive hampers).
  // Add a tab named "Menu" to the same spreadsheet with the header row:
  //   group, name, description, price, image, active
  // Rows with active = yes/y/true/1 appear on the site under their "group" heading,
  // no redeploy needed. Leave "" to disable.
  menuSheetUrl: string
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
  titleLine: "The Best Tiramisu",
  titleEmphasis: "in Town",
  // Subtitle temporarily removed per owner request — leave "" to hide it.
  subtitleLine1: "",
  subtitleLine2: "",
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

// Shared option sets so each menu item below stays short.
const NO_TOPPER_OPTIONS: OrderingAddonOption[] = [
  { label: "No Topper", price: 0 },
  { label: "Happy Birthday", price: 15000 },
  { label: "Happy Anniversary", price: 15000 },
  { label: "Congrats", price: 15000 },
]
const RUM_CAKE: OrderingAddonOption[] = [
  { label: "No Rum", price: 0 },
  { label: "Add Rum", price: 25000 },
]
const RUM_CUP_200: OrderingAddonOption[] = [
  { label: "No Rum", price: 0 },
  { label: "Add Rum", price: 5000 },
]
const RUM_BOX_500: OrderingAddonOption[] = [
  { label: "No Rum", price: 0 },
  { label: "Add Rum", price: 10000 },
]
const WHOLE_CAKE_SIZES = [
  { label: "M", price: 265000 },
  { label: "L", price: 275000 },
  { label: "XL", price: 375000 },
]
// "with Ladyfingers" = same sizes, +Rp 100.000 on every size.
const WHOLE_CAKE_LADYFINGERS_SIZES = WHOLE_CAKE_SIZES.map((s) => ({ label: s.label, price: s.price + 100000 }))
const WHOLE_CAKE_DUSTINGS = ["Plain", "Happy Birthday", "Happy Anniversary", "Congrats"]
const WHOLE_CAKE_EXTRAS: OrderingAddonOption[] = [
  { label: "Knife + Lighter + Candle", price: 1000 },
]
const PANNA_COTTA_SAUCES = ["Strawberry", "Blueberry", "Lemon"]
// Most categories have no sauce/extras step; spread this to keep items short.
const NO_OPTIONS = { sauces: [] as string[], dustingOptions: [] as string[], extras: [] as OrderingAddonOption[], hasCustomText: false, customTextPricePerChar: 0, isTBD: false }

export const orderingPageConfig: OrderingPageConfig = {
  sectionLabel: "Order Online",
  title: "Choose Your Dessert",
  subtitle: "Select a product, customize your order, and send it straight to our WhatsApp.",
  whatsappNumber: "+6282111847742",
  groups: [
    { id: "whole-cakes", name: "Whole Cakes", description: "Our signature whole tiramisu cakes, perfect for celebrations. Choose your size, add rum, pick a dusting, and personalize with custom text." },
    { id: "classic-tiramisu", name: "Classic Tiramisu", description: "Coffee-soaked ladyfingers and velvety mascarpone cream, finished with premium cocoa powder. Our signature recipe." },
    { id: "sakura-tiramisu", name: "Sakura Tiramisu", description: "Our sakura edition — classic tiramisu layered with a luscious strawberry sauce for a fresh, fruity finish." },
    { id: "lemon-tiramisu", name: "Lemon Tiramisu", description: "A bright, citrusy twist on the classic. Lemon-infused mascarpone with delicate ladyfingers and a zesty lemon curd finish." },
    { id: "panna-cotta", name: "Panna Cotta", description: "Silky Italian panna cotta made with fresh cream and real fruit sauce — choose strawberry, blueberry, or lemon." },
  ],
  categories: [
    // --- Whole Cakes ---
    {
      id: "whole-cake",
      groupId: "whole-cakes",
      name: "Tiramisu Whole Cake",
      image: "/images/whole-cake.jpg",
      imageFallback: "/images/whole-cake.png",
      imagePosition: "center 75%",
      description: "Our signature whole tiramisu cake, perfect for celebrations. Choose your size, add rum, pick a dusting, and personalize with custom text.",
      startingPrice: 265000,
      sizes: WHOLE_CAKE_SIZES,
      addons: RUM_CAKE,
      sauces: [],
      dustingOptions: WHOLE_CAKE_DUSTINGS,
      toppers: NO_TOPPER_OPTIONS,
      extras: WHOLE_CAKE_EXTRAS,
      hasCustomText: true,
      customTextPricePerChar: 3000,
      isTBD: false,
    },
    {
      id: "whole-cake-ladyfingers",
      groupId: "whole-cakes",
      name: "Tiramisu Whole Cake with Ladyfingers",
      image: "/images/whole-cake-ladyfingers.jpg",
      imageFallback: "/images/whole-cake.jpg",
      imagePosition: "center 70%",
      description: "The same signature whole cake, wrapped and crowned with ladyfinger biscuits for a striking presentation.",
      startingPrice: 365000,
      sizes: WHOLE_CAKE_LADYFINGERS_SIZES,
      addons: RUM_CAKE,
      sauces: [],
      dustingOptions: WHOLE_CAKE_DUSTINGS,
      toppers: NO_TOPPER_OPTIONS,
      extras: WHOLE_CAKE_EXTRAS,
      hasCustomText: true,
      customTextPricePerChar: 3000,
      isTBD: false,
    },
    // --- Classic Tiramisu ---
    {
      id: "classic-200",
      groupId: "classic-tiramisu",
      name: "Classic Tiramisu 200ml",
      image: "/images/classic-tiramisu-200.jpg",
      imageFallback: "/images/tiramisu-bowl.png",
      description: "Our classic tiramisu in a personal 200ml cup — perfect for gifting or personal indulgence.",
      startingPrice: 30000,
      sizes: [],
      addons: RUM_CUP_200,
      toppers: NO_TOPPER_OPTIONS,
      ...NO_OPTIONS,
    },
    {
      id: "classic-500",
      groupId: "classic-tiramisu",
      name: "Classic Tiramisu 500ml",
      image: "/images/classic-tiramisu-500.jpg",
      imageFallback: "/images/dessert-box.png",
      imagePosition: "center 70%",
      description: "Classic tiramisu in a 500ml rectangle dessert box — ideal for sharing, events, or a luxurious treat at home.",
      startingPrice: 88000,
      sizes: [],
      addons: RUM_BOX_500,
      toppers: NO_TOPPER_OPTIONS,
      ...NO_OPTIONS,
    },
    // --- Sakura Tiramisu --- (temporary images until sakura photos are added)
    {
      id: "sakura-200",
      groupId: "sakura-tiramisu",
      name: "Sakura Tiramisu 200ml",
      image: "/images/sakura-tiramisu-200.jpg",
      imageFallback: "/images/tiramisu-bowl.png",
      description: "Sakura edition tiramisu with a luscious strawberry layer, in a personal 200ml cup.",
      startingPrice: 30000,
      sizes: [],
      addons: RUM_CUP_200,
      toppers: NO_TOPPER_OPTIONS,
      ...NO_OPTIONS,
    },
    {
      id: "sakura-500",
      groupId: "sakura-tiramisu",
      name: "Sakura Tiramisu 500ml",
      image: "/images/sakura-tiramisu-500.jpg",
      imageFallback: "/images/dessert-box.png",
      description: "Sakura edition tiramisu with a luscious strawberry layer, in a 500ml rectangle dessert box.",
      startingPrice: 88000,
      sizes: [],
      addons: RUM_BOX_500,
      toppers: NO_TOPPER_OPTIONS,
      ...NO_OPTIONS,
    },
    // --- Lemon Tiramisu ---
    {
      id: "lemon-200",
      groupId: "lemon-tiramisu",
      name: "Lemon Tiramisu 200ml",
      image: "/images/lemon-tiramisu-200.jpg",
      imageFallback: "/images/lemon-tiramisu.jpg",
      description: "Lemon-infused mascarpone with delicate ladyfingers and a zesty lemon curd finish, in a personal 200ml cup.",
      startingPrice: 30000,
      sizes: [],
      addons: [],
      toppers: NO_TOPPER_OPTIONS,
      ...NO_OPTIONS,
    },
    {
      id: "lemon-500",
      groupId: "lemon-tiramisu",
      name: "Lemon Tiramisu 500ml",
      image: "/images/lemon-tiramisu-500.jpg",
      imageFallback: "/images/lemon-tiramisu.jpg",
      description: "Lemon-infused mascarpone with delicate ladyfingers and a zesty lemon curd finish, in a 500ml rectangle dessert box.",
      startingPrice: 88000,
      sizes: [],
      addons: [],
      toppers: NO_TOPPER_OPTIONS,
      ...NO_OPTIONS,
    },
    // --- Panna Cotta ---
    {
      id: "panna-cotta-200",
      groupId: "panna-cotta",
      name: "Panna Cotta 200ml",
      image: "/images/panna-cotta-200.jpg",
      imageFallback: "/images/panna-cotta-product.png",
      imagePosition: "center 65%",
      description: "Silky panna cotta with real fruit sauce — choose strawberry, blueberry, or lemon. Personal 200ml cup.",
      startingPrice: 27000,
      sizes: [],
      addons: [],
      toppers: NO_TOPPER_OPTIONS,
      ...NO_OPTIONS,
      sauces: PANNA_COTTA_SAUCES,
    },
    {
      id: "panna-cotta-500",
      groupId: "panna-cotta",
      name: "Panna Cotta 500ml",
      image: "/images/panna-cotta-500.jpg",
      imageFallback: "/images/panna-cotta.jpg",
      description: "Silky panna cotta with real fruit sauce — choose strawberry, blueberry, or lemon. 500ml rectangle dessert box.",
      startingPrice: 88000,
      sizes: [],
      addons: [],
      toppers: NO_TOPPER_OPTIONS,
      ...NO_OPTIONS,
      sauces: PANNA_COTTA_SAUCES,
    },
  ],
  pickupLocations: [
    {
      id: "bsd",
      name: "Hangri Dessert BSD",
      shortLabel: "BSD",
      address: "Jl. Raflesia, Puspita Loka C1/3 BSD",
      mapsUrl: "https://maps.app.goo.gl/mexz1iNXws7hxW8B7",
      openTime: "06:00",
      closeTime: "24:00",
    },
    {
      id: "tambora",
      name: "Hangri Dessert Tambora (Jakarta)",
      shortLabel: "Jakarta",
      address: "Jln. Tanah Sereal 11 gang FF 1 no. 21 RT. 03/011 (Pagar Hitam), Tanah Sereal, Tambora, Jakarta Barat",
      mapsUrl: "https://maps.app.goo.gl/NhB1eqqY1MU9iH5z8",
      openTime: "06:00",
      closeTime: "24:00",
    },
  ],
  pickupHoursSheetUrl: "https://docs.google.com/spreadsheets/d/1FJxREcJnsdOLyfy1saimebMXzmt6Ub6_BTCTuzyB6pM/gviz/tq?tqx=out:csv",
  // Seasonal items tab in the same spreadsheet (tab must be named "Menu").
  menuSheetUrl: "https://docs.google.com/spreadsheets/d/1FJxREcJnsdOLyfy1saimebMXzmt6Ub6_BTCTuzyB6pM/gviz/tq?tqx=out:csv&sheet=Menu",
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
