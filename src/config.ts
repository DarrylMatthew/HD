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
  // When true, list/card prices omit the "From " prefix even though the item
  // has multiple sizes (e.g. whole cakes, which are priced per size).
  hideFromPrefix?: boolean
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
      description: "Coffee-soaked ladyfingers layered with velvety mascarpone cream and dusted with cocoa powder. Crafted using only premium, honest ingredients.",
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
  whatsappNumber: "+6282111847742",
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
  { label: "M (Ø16cm, 6 layers)", price: 265000 },
  { label: "L (Ø20cm, 4 layers)", price: 275000 },
  { label: "XL (Ø20cm, 6 layers)", price: 375000 },
]
// "with Ladyfingers" = same sizes, +Rp 100.000 on every size.
const WHOLE_CAKE_LADYFINGERS_SIZES = WHOLE_CAKE_SIZES.map((s) => ({ label: s.label, price: s.price + 100000 }))
const WHOLE_CAKE_DUSTINGS = ["Plain", "Happy Birthday", "Happy Anniversary", "Congrats"]
const WHOLE_CAKE_EXTRAS: OrderingAddonOption[] = [
  { label: "Knife + Lighter + Candle", price: 1000 },
  { label: "Cooler Bag", price: 25000 },
  { label: "Custom Greeting Card", price: 5000 },
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
    { id: "whole-cakes", name: "Whole Cakes", description: "Our signature whole tiramisu cakes, perfect for every celebration. Choose your preferred size, rum option, cocoa dusting, and personalized message." },
    { id: "classic-tiramisu", name: "Classic Tiramisu", description: "Coffee-soaked ladyfingers layered with velvety mascarpone cream and dusted with cocoa powder. Crafted using only premium, honest ingredients." },
    { id: "sakura-tiramisu", name: "Sakura Tiramisu", description: "Classic tiramisu with a twist: Extra layers of luscious mixed berries sauce for a fun, fruity finish." },
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
      description: "Our signature whole tiramisu cake, perfect for every celebration. Choose your preferred size, rum option, cocoa dusting, and personalized message.",
      startingPrice: 265000,
      hideFromPrefix: true,
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
      image: "/images/Tiramisu Ladyfingers.jpeg",
      imageFallback: "/images/whole-cake.jpg",
      imagePosition: "center 80%",
      description: "The same signature whole cake, wrapped and crowned with ladyfinger biscuits for a striking presentation.",
      startingPrice: 365000,
      hideFromPrefix: true,
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
    {
      id: "whole-cake-acrylic",
      groupId: "whole-cakes",
      name: "Tiramisu Whole Cake in Acrylic Case 18x18cm",
      image: "/images/wholecakeAcrylic.jpg",
      imageFallback: "/images/whole-cake.jpg",
      imagePosition: "center 47%",
      description: "Our signature whole tiramisu cake presented in an elegant 18x18cm acrylic case. Add rum, pick a dusting, and personalize with custom text.",
      startingPrice: 285000,
      hideFromPrefix: true,
      sizes: [],
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
      id: "oval-whole-cake",
      groupId: "whole-cakes",
      name: "Oval Whole Cake",
      image: "/images/Oval Whole Cake.png",
      imageFallback: "/images/whole-cake.png",
      imagePosition: "center 70%",
      description: "Made for life's biggest moments: Whether you're celebrating love, family, or achievements, our signature Oval Whole Cake brings people together. Presented in a timeless oval glass dish, it's as elegant on the table as it is delicious to share.",
      startingPrice: 2800000,
      hideFromPrefix: true,
      sizes: [],
      addons: [],
      sauces: [],
      dustingOptions: [],
      toppers: [],
      extras: [
        { label: "1 cake assistant & transport", price: 1000000 },
        { label: "Rum", price: 100000 },
        { label: "Custom Greeting Card", price: 5000 },
        { label: "Knife & lighter", price: 0 }
      ],
      hasCustomText: false,
      customTextPricePerChar: 0,
      isTBD: false,
    },
    // --- Classic Tiramisu ---
    {
      id: "classic-200",
      groupId: "classic-tiramisu",
      name: "Classic Tiramisu 200ml",
      image: "/images/classic-tiramisu-200.jpg",
      imageFallback: "/images/tiramisu-bowl.png",
      description: "Our classic tiramisu in a personal 200ml bowl — perfect for gifting or personal indulgence.",
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
      description: "Classic tiramisu in a 500ml acrylic box — ideal for sharing, events, or a luxurious treat at home.",
      startingPrice: 88000,
      sizes: [],
      addons: RUM_BOX_500,
      toppers: NO_TOPPER_OPTIONS,
      ...NO_OPTIONS,
      hasCustomText: true,
      customTextPricePerChar: 8000,
    },
    // --- Sakura Tiramisu --- (temporary images until sakura photos are added)
    {
      id: "sakura-200",
      groupId: "sakura-tiramisu",
      name: "Sakura Tiramisu 200ml",
      image: "/images/sakura200.jpg",
      imageFallback: "/images/tiramisu-bowl.png",
      imagePosition: "center 75%",
      description: "Sakura edition tiramisu with a luscious mixed berries layer, in a personal 200ml bowl.",
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
      image: "/images/cropped500sakura1.png",
      imageFallback: "/images/dessert-box.png",
      imagePosition: "center 60%",
      description: "Sakura edition tiramisu with a luscious mixed berries layer, in a 500ml acrylic box.",
      startingPrice: 88000,
      sizes: [],
      addons: RUM_BOX_500,
      toppers: NO_TOPPER_OPTIONS,
      ...NO_OPTIONS,
      hasCustomText: true,
      customTextPricePerChar: 8000,
    },
    // --- Lemon Tiramisu ---
    {
      id: "lemon-200",
      groupId: "lemon-tiramisu",
      name: "Lemon Tiramisu 200ml",
      image: "/images/lemon200.png",
      imageFallback: "/images/lemon-tiramisu.jpg",
      imagePosition: "center 60%",
      description: "Lemon-infused mascarpone with delicate ladyfingers and a zesty lemon curd finish, in a personal 200ml bowl.",
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
      image: "/images/lemon500.png",
      imageFallback: "/images/lemon-tiramisu.jpg",
      imagePosition: "center 78%",
      description: "Lemon-infused mascarpone with delicate ladyfingers and a zesty lemon curd finish, in a 500ml acrylic box.",
      startingPrice: 88000,
      sizes: [],
      addons: [],
      toppers: NO_TOPPER_OPTIONS,
      ...NO_OPTIONS,
      hasCustomText: true,
      customTextPricePerChar: 8000,
    },
    // --- Panna Cotta ---
    {
      id: "panna-cotta-200",
      groupId: "panna-cotta",
      name: "Panna Cotta 200ml",
      image: "/images/panna-cotta-200.jpg",
      imageFallback: "/images/panna-cotta-product.png",
      imagePosition: "center 65%",
      description: "Silky panna cotta with real fruit sauce — choose strawberry, blueberry, or lemon. Personal 200ml bowl.",
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
      image: "/images/pannacottaIMG_3886.jpg",
      imageFallback: "/images/panna-cotta.jpg",
      imagePosition: "center 75%",
      description: "Silky panna cotta with real fruit sauce — choose strawberry, blueberry, or lemon. 500ml acrylic box.",
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
  brandName: "HANGRI DESSERT",
  brandTagline: "Tiramisu whole cake specialist, ready 24/7",
  columns: [
    {
      heading: "Quick Links",
      links: [
        { label: "Menu", href: "#ordering" },
        { label: "Order Now", href: "#order-grid" },
      ],
    },
    {
      heading: "Contact",
      links: [
        { label: "WhatsApp", href: "https://wa.me/6282111847742" },
        { label: "Instagram", href: "https://www.instagram.com/hangridessert/" },
      ],
    },
  ],
  copyright: "© 2026 Hangri Dessert. All rights reserved.",
}

// ======== TIRAMISU WEDDING CAKE (TWC) CONFIGURATION ========

export interface TWCProductConfig {
  name: string
  // Short italic-serif descriptor shown under the name (deck-style).
  tagline: string
  description: string
  servingInfo: string
  // A few short feature lines shown with grey-circle bullets, as in the deck.
  highlights: string[]
  image: string
  imagePosition?: string
}

export interface TWCStoryConfig {
  eyebrow: string
  title: string
  lead: string
  body: string[]
  image: string
  signatureLine: string
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
  image?: string
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

// Monochrome wedding-cake palette: white, black, and the brand grey #E9E8E9.
// `accent` is black for the light sections; the two dark surfaces (footer + the
// "Bespoke" card) invert to white locally since black would vanish on them.
export const twcTheme: TWCTheme = {
  background: "#ffffff",
  backgroundAlt: "#E9E8E9",
  foreground: "#1a1a1a",
  accent: "#1a1a1a",
  accentLight: "#E9E8E9",
  card: "#fafafa",
  cardBorder: "rgba(0, 0, 0, 0.08)",
  muted: "#6b6b6b",
  overlay: "rgba(0, 0, 0, 0.92)",
}

export const twcSiteConfig: SiteConfig = {
  language: "en",
  siteTitle: "Tiramisu Wedding Cake | Luxury Wedding Desserts",
  siteDescription: "Bespoke tiramisu towers and wedding cakes. Elevate your special day with our luxurious handcrafted desserts.",
}

export const twcNavigationConfig: NavigationConfig = {
  brandName: "TWC",
  links: [
    { label: "Collection", target: "#menu" },
    { label: "Inquire", target: "#order" },
  ],
}

export const twcHeroConfig: HeroConfig = {
  imagePath: "/images/twc/tiramisu-tower.jpg",
  eyebrow: "For couples who break wedding cake traditions",
  titleLine: "Tiramisu",
  titleEmphasis: "Wedding Cake",
  subtitleLine1: "FOR COUPLES WHO BREAK WEDDING CAKE TRADITIONS",
  subtitleLine2: "crafted for your unforgettable celebration.",
  ctaText: "Get a Free Wedding Cake Sample",
  ctaTargetId: "#order",
}

// Editorial "Why Tiramisu" story section, mirroring the brand deck.
export const twcStoryConfig: TWCStoryConfig = {
  eyebrow: "Why Tiramisu",
  title: "This is not just a wedding cake",
  lead: "Dusting the Tiramisu Wedding Cake with cocoa powder symbolises your first act of teamwork as a married couple.",
  body: [
    "A wedding is a sacred celebration, and having something exceptional to mark this once-in-a-lifetime moment makes the experience even more memorable.",
    "Famous for its classic tiramisu, Hangri Dessert is loved across Java Island and Singapore — now reimagined as the centrepiece of your celebration.",
  ],
  image: "/images/Long Sheet Cake.JPG",
  signatureLine: "A sister brand of Hangri Dessert",
}

export const twcMenuConfig: TWCMenuConfig = {
  sectionLabel: "The Collection",
  title: "Signature Centrepieces",
  subtitle: "Each piece is meticulously crafted to be the centrepiece of your celebration. Pricing is tailored to your vision.",
  products: [
    {
      name: "Tiramisu Tower",
      tagline: "The showpiece toast",
      description: "A breathtaking tower of hand-crafted tiramisu served in crystal coupe glasses — the ultimate moment for your wedding toast and for sharing with guests.",
      servingInfo: "5–7 tiers · up to 142 glasses",
      highlights: [
        "Recommended for the wedding toast & guest interaction",
        "Glass or acrylic coupe presentation",
        "Add your preferred toppings",
      ],
      image: "/images/twc/tiramisu-tower.jpg",
    },
    {
      name: "Long Sheet Cake",
      tagline: "For the grand cutting moment",
      description: "An elegant elongated tiramisu cake for the main dessert table — layers of espresso-kissed ladyfingers and silken mascarpone, finished by hand.",
      servingInfo: "Up to 100 × 20 × 8 cm",
      highlights: [
        "Free ribbon, utensils & candles",
        "100% tiramisu or 50% tiramisu / 50% dummy",
        "Available to add your preferred toppings",
      ],
      image: "/images/Long Sheet Cake2.png",
    },
    {
      name: "Giant Whole Cake",
      tagline: "Real tiramisu, grand scale",
      description: "A full, real tiramisu made with premium ingredients and crowned with fresh florals — beautifully styled to match your wedding theme and palette.",
      servingInfo: "From ⌀ 40 cm · scalable",
      highlights: [
        "Full, real tiramisu with premium ingredients",
        "Free ribbon, utensils & candles",
        "Available to add your preferred toppings",
      ],
      image: "/images/Giant Whole Cake.jpg",
      imagePosition: "center 70%",
    },
  ],
  bespokeTitle: "Bespoke Service",
  bespokeDescription: "Every wedding is unique. We work closely with you to design a custom dessert experience that perfectly complements your venue, theme, and vision — from tasting sessions to day-of setup, we handle every detail.",
  bespokeCta: "Start Your Consultation",
}

export const twcConsultationConfig: TWCConsultationConfig = {
  sectionLabel: "Get Started",
  title: "Let's Plan Your Perfect Wedding Dessert",
  subtitle: "Begin with a complimentary consultation to discuss your vision.",
  description: "Our team will guide you through flavour selections, presentation styles, and logistics to create a bespoke dessert experience for your special day.",
  ctaText: "Try the Wedding Cake Tester for Free",
  whatsappNumber: "+6281386337200",
  features: [
    "Complimentary tasting session",
    "Custom flavour & design consultation",
    "Venue visit & setup coordination",
    "Day-of delivery & presentation",
  ],
  image: "/images/Close up - Glass.jpg",
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
        { label: "Inquire", href: "#order" },
      ],
    },
    {
      heading: "Contact",
      links: [
        { label: "WhatsApp", href: "https://wa.me/6281386337200" },
        { label: "Instagram", href: "https://www.instagram.com/tiramisuweddingcake/" },
      ],
    },
    {
      heading: "Services",
      links: [
        { label: "Wedding Cakes", href: "#menu" },
        { label: "Tiramisu Towers", href: "#menu" },
        { label: "Bespoke Design", href: "#order" },
      ],
    },
  ],
  copyright: "© 2026 Tiramisu Wedding Cake. All rights reserved.",
}
