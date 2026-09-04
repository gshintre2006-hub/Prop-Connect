import {
  ClipboardList, CheckCircle2, Package, Truck, Home as HomeIcon, Check,
} from "lucide-react";
import { img } from "./tokens";

/* ---------------------------------------------------------------------- */
/*  MOCK DATA                                                               */
/* ---------------------------------------------------------------------- */
export const CATEGORIES = [
  "Furniture", "Decor", "Kitchen", "Office", "Electronics", "Industrial",
  "Medical", "Military", "Garden", "Festival", "Religious", "Vehicles",
  "Vintage", "Period Props", "Miscellaneous",
];

export const STORES = [
  {
    id: "st1", name: "Kohinoor Prop House", location: "Aarey Road, Film City",
    address: "Gate No. 4, Aarey Road, Near Filmistan, Goregaon East, Mumbai 400065",
    phone: "+91 98200 11122", whatsapp: "919820011122", email: "kohinoor.props@gmail.com",
    hours: "9:00 AM – 7:30 PM · Mon–Sat", totalProps: 214, rating: 4.8,
    lat: 19.1602, lng: 72.8503,
    logo: img("warehouse,logo,brand", 200, 200),
    photos: [img("prop,warehouse,storage", 700, 460), img("furniture,storage,shelves", 700, 460), img("antique,shop,interior", 700, 460)],
  },
  {
    id: "st2", name: "Kalakriti Set Props", location: "Aarey Colony, Film City",
    address: "Shed 12, Kalakriti Compound, Aarey Colony Road, Goregaon East, Mumbai 400065",
    phone: "+91 98330 44556", whatsapp: "919833044556", email: "kalakriti.sets@gmail.com",
    hours: "9:30 AM – 8:00 PM · Mon–Sun", totalProps: 340, rating: 4.6,
    lat: 19.1712, lng: 72.8666,
    logo: img("furniture,workshop,logo", 200, 200),
    photos: [img("vintage,furniture,warehouse", 700, 460), img("props,storage,industrial", 700, 460), img("wooden,furniture,workshop", 700, 460)],
  },
  {
    id: "st3", name: "Rangbhoomi Rentals", location: "Filmistan Lane, Goregaon East",
    address: "12/A Rangbhoomi Estate, Filmistan Lane, Goregaon East, Mumbai 400065",
    phone: "+91 90040 77889", whatsapp: "919004077889", email: "rangbhoomi.rentals@gmail.com",
    hours: "10:00 AM – 7:00 PM · Mon–Sat", totalProps: 178, rating: 4.7,
    lat: 19.1571, lng: 72.8452,
    logo: img("antique,store,logo", 200, 200),
    photos: [img("antique,decor,shop", 700, 460), img("chandelier,store,interior", 700, 460), img("brass,decor,shelves", 700, 460)],
  },
  {
    id: "st4", name: "Heritage Setworks", location: "Amboli, Andheri West",
    address: "Plot 7, Heritage Compound, Amboli, Andheri West, Mumbai 400058",
    phone: "+91 99870 22334", whatsapp: "919987022334", email: "heritage.setworks@gmail.com",
    hours: "9:00 AM – 6:30 PM · Mon–Sat", totalProps: 265, rating: 4.9,
    lat: 19.1284, lng: 72.8395,
    logo: img("vintage,workshop,logo", 200, 200),
    photos: [img("period,furniture,storage", 700, 460), img("vehicle,prop,garage", 700, 460), img("military,prop,storage", 700, 460)],
  },
];

export const PROPS = [
  { id: "p1", name: "Chesterfield Leather Sofa", category: "Furniture", material: "Genuine Leather, Teak Frame", style: "Colonial", era: "1960s", finish: "Oxblood Polish", color: "Oxblood Brown", h: `3'0"`, w: `6'2"`, d: `2'8"`, seat: `1'5"`, weight: "58 kg", price: 2800, deposit: 12000, qty: 3, available: true, storeId: "st1", img: img("chesterfield,leather,sofa") },
  { id: "p2", name: "Brass Arc Floor Lamp", category: "Decor", material: "Brass, Marble Base", style: "Mid-Century", era: "1970s", finish: "Antique Brass", color: "Gold", h: `6'6"`, w: `1'8"`, d: `1'8"`, weight: "9 kg", price: 650, deposit: 2500, qty: 6, available: true, storeId: "st2", img: img("brass,arc,floorlamp") },
  { id: "p3", name: "Industrial Console Table", category: "Industrial", material: "Reclaimed Iron & Pinewood", style: "Industrial", era: "1980s", finish: "Matte Black", color: "Black / Natural Wood", h: `2'6"`, w: `4'0"`, d: `1'4"`, weight: "34 kg", price: 1100, deposit: 4000, qty: 4, available: true, storeId: "st1", img: img("industrial,console,table") },
  { id: "p4", name: "Vintage Steamer Trunk", category: "Vintage", material: "Wood & Leather Strap", style: "Colonial Travel", era: "1940s", finish: "Weathered Brown", color: "Brown", h: `1'6"`, w: `2'8"`, d: `1'6"`, weight: "14 kg", price: 500, deposit: 1800, qty: 8, available: true, storeId: "st4", img: img("vintage,steamer,trunk") },
  { id: "p5", name: "Crystal Tiered Chandelier", category: "Decor", material: "Crystal Glass, Brass Frame", style: "Royal", era: "1950s", finish: "Polished Brass", color: "Clear / Gold", h: `3'4"`, w: `2'2"`, d: `2'2"`, weight: "22 kg", price: 3200, deposit: 15000, qty: 2, available: false, storeId: "st3", img: img("crystal,tiered,chandelier") },
  { id: "p6", name: "Solid Teak Dining Table", category: "Furniture", material: "Solid Teak Wood", style: "Traditional", era: "1970s", finish: "Natural Teak", color: "Honey Brown", h: `2'6"`, w: `6'0"`, d: `3'0"`, weight: "62 kg", price: 1800, deposit: 6000, qty: 3, available: true, storeId: "st2", img: img("teak,wooden,diningtable") },
  { id: "p7", name: "Rattan Peacock Chair", category: "Vintage", material: "Natural Rattan", style: "Bohemian", era: "1960s", finish: "Natural Cane", color: "Beige", h: `5'4"`, w: `3'2"`, d: `2'6"`, seat: `1'4"`, weight: "11 kg", price: 900, deposit: 3000, qty: 5, available: true, storeId: "st3", img: img("rattan,peacock,chair") },
  { id: "p8", name: "Rotary Dial Telephone", category: "Electronics", material: "Bakelite", style: "Retro", era: "1965", finish: "Glossy Black", color: "Black", h: `0'8"`, w: `0'9"`, d: `1'0"`, weight: "1.5 kg", price: 220, deposit: 800, qty: 12, available: true, storeId: "st1", img: img("rotary,vintage,telephone") },
  { id: "p9", name: "Royal Enfield Bullet (Vintage)", category: "Vehicles", material: "Steel, Chrome", style: "Classic", era: "1978", finish: "Matte Olive", color: "Olive Green", h: `3'9"`, w: `2'2"`, d: `7'0"`, weight: "170 kg", price: 4500, deposit: 25000, qty: 1, available: true, storeId: "st4", img: img("royal,enfield,motorcycle") },
  { id: "p10", name: "Brass Temple Bell Set", category: "Religious", material: "Brass", style: "Traditional", era: "Contemporary", finish: "Polished Brass", color: "Gold", h: `1'2"`, w: `0'8"`, d: `0'8"`, weight: "3 kg", price: 300, deposit: 1000, qty: 10, available: true, storeId: "st3", img: img("brass,temple,bell") },
  { id: "p11", name: "Underwood Typewriter", category: "Office", material: "Cast Iron & Steel", style: "Vintage Office", era: "1950s", finish: "Matte Black", color: "Black", h: `0'10"`, w: `1'2"`, d: `1'1"`, weight: "12 kg", price: 400, deposit: 1500, qty: 6, available: true, storeId: "st1", img: img("vintage,typewriter,antique") },
  { id: "p12", name: "Wrought Iron Garden Bench", category: "Garden", material: "Wrought Iron", style: "Victorian", era: "Reproduction", finish: "Weathered Green", color: "Forest Green", h: `2'10"`, w: `4'6"`, d: `1'10"`, seat: `1'5"`, weight: "40 kg", price: 750, deposit: 2500, qty: 4, available: true, storeId: "st4", img: img("wrought,iron,gardenbench") },
  { id: "p13", name: "Copper Kitchen Cookware Set", category: "Kitchen", material: "Hammered Copper", style: "Rustic", era: "1980s", finish: "Polished Copper", color: "Copper", h: `0'10"`, w: `1'6"`, d: `1'2"`, weight: "6 kg", price: 350, deposit: 1200, qty: 9, available: true, storeId: "st2", img: img("copper,kitchen,cookware") },
  { id: "p14", name: "Vintage Medical Cabinet", category: "Medical", material: "Wood & Glass", style: "Clinical Retro", era: "1950s", finish: "White Enamel", color: "White", h: `5'6"`, w: `2'8"`, d: `1'4"`, weight: "48 kg", price: 1200, deposit: 4500, qty: 2, available: true, storeId: "st1", img: img("vintage,medical,cabinet") },
  { id: "p15", name: "WWII Style Ammunition Crate", category: "Military", material: "Pinewood & Iron", style: "Wartime", era: "Reproduction", finish: "Stencilled Olive", color: "Olive", h: `1'2"`, w: `2'0"`, d: `1'2"`, weight: "10 kg", price: 300, deposit: 1000, qty: 14, available: true, storeId: "st4", img: img("military,ammo,crate") },
  { id: "p16", name: "Brass Festival Lantern Set", category: "Festival", material: "Brass & Coloured Glass", style: "Festive", era: "Contemporary", finish: "Antique Brass", color: "Multicolour", h: `1'4"`, w: `0'10"`, d: `0'10"`, weight: "2 kg", price: 260, deposit: 900, qty: 20, available: true, storeId: "st3", img: img("festival,lantern,brass") },
  { id: "p17", name: "Mughal Era Brass Hookah", category: "Period Props", material: "Brass & Wood", style: "Mughal", era: "Period Reproduction", finish: "Antique Gold", color: "Gold", h: `1'8"`, w: `0'10"`, d: `0'10"`, weight: "4 kg", price: 480, deposit: 1800, qty: 5, available: true, storeId: "st3", img: img("hookah,brass,antique") },
  { id: "p18", name: "Antique Globe on Stand", category: "Miscellaneous", material: "Wood & Brass", style: "Explorer", era: "1960s", finish: "Weathered Oak", color: "Multicolour", h: `3'0"`, w: `1'4"`, d: `1'4"`, weight: "8 kg", price: 400, deposit: 1500, qty: 6, available: true, storeId: "st2", img: img("antique,globe,stand") },

  { id: "p19", name: "Roll-Top Writing Desk", category: "Furniture", material: "Oak & Brass", style: "Colonial", era: "1930s", finish: "Waxed Oak", color: "Warm Brown", h: `3'8"`, w: `4'0"`, d: `2'2"`, weight: "55 kg", price: 1600, deposit: 6000, qty: 2, available: true, storeId: "st2" },
  { id: "p20", name: "Hand-Knotted Persian Rug", category: "Decor", material: "Hand-knotted Wool", style: "Traditional", era: "1970s", finish: "Natural Dyes", color: "Deep Red / Indigo", h: `0'1"`, w: `9'0"`, d: `6'0"`, weight: "14 kg", price: 1400, deposit: 5000, qty: 4, available: true, storeId: "st3" },
  { id: "p21", name: "Cast-Iron Wood Stove", category: "Kitchen", material: "Cast Iron", style: "Rustic", era: "1940s", finish: "Blackened Iron", color: "Black", h: `3'2"`, w: `2'0"`, d: `1'8"`, weight: "70 kg", price: 1100, deposit: 4000, qty: 2, available: true, storeId: "st4" },
  { id: "p22", name: "Enamel Storage Jar Set", category: "Kitchen", material: "Enamelware", style: "Vintage Kitchen", era: "1950s", finish: "Chipped White Enamel", color: "White / Blue", h: `0'10"`, w: `1'2"`, d: `0'8"`, weight: "4 kg", price: 240, deposit: 800, qty: 12, available: true, storeId: "st2" },
  { id: "p23", name: "Banker's Desk Lamp", category: "Office", material: "Brass & Glass Shade", style: "Traditional", era: "1940s", finish: "Antique Brass", color: "Green / Gold", h: `1'2"`, w: `0'9"`, d: `0'7"`, weight: "2 kg", price: 300, deposit: 1100, qty: 8, available: true, storeId: "st1" },
  { id: "p24", name: "Oak Filing Cabinet", category: "Office", material: "Solid Oak", style: "Vintage Office", era: "1950s", finish: "Natural Oak", color: "Honey Brown", h: `4'4"`, w: `1'6"`, d: `2'0"`, weight: "46 kg", price: 900, deposit: 3200, qty: 3, available: true, storeId: "st1" },
  { id: "p25", name: "Valve Table Radio", category: "Electronics", material: "Walnut Veneer", style: "Art Deco", era: "1940s", finish: "French Polish", color: "Walnut Brown", h: `1'0"`, w: `1'8"`, d: `0'10"`, weight: "6 kg", price: 450, deposit: 1600, qty: 5, available: true, storeId: "st3" },
  { id: "p26", name: "Super 8 Film Projector", category: "Electronics", material: "Die-cast Metal", style: "Retro", era: "1970s", finish: "Grey Hammertone", color: "Grey", h: `1'0"`, w: `1'2"`, d: `0'8"`, weight: "5 kg", price: 500, deposit: 2000, qty: 4, available: true, storeId: "st1" },
  { id: "p27", name: "Factory Cart Coffee Table", category: "Industrial", material: "Reclaimed Wood & Iron", style: "Industrial", era: "Reproduction", finish: "Distressed", color: "Rust / Brown", h: `1'6"`, w: `3'6"`, d: `2'0"`, weight: "38 kg", price: 1000, deposit: 3500, qty: 3, available: true, storeId: "st1" },
  { id: "p28", name: "Riveted Steel Locker Bank", category: "Industrial", material: "Riveted Steel", style: "Industrial", era: "1950s", finish: "Chipped Grey Paint", color: "Grey-Green", h: `5'10"`, w: `3'0"`, d: `1'6"`, weight: "60 kg", price: 950, deposit: 3500, qty: 2, available: true, storeId: "st4" },
  { id: "p29", name: "Enamel Examination Table", category: "Medical", material: "Steel & Enamel", style: "Clinical Retro", era: "1950s", finish: "White Enamel", color: "White / Chrome", h: `2'8"`, w: `6'0"`, d: `2'0"`, weight: "42 kg", price: 1300, deposit: 4800, qty: 2, available: false, storeId: "st1" },
  { id: "p30", name: "Apothecary Bottle Collection", category: "Medical", material: "Glass & Cork", style: "Victorian", era: "Reproduction", finish: "Aged Glass", color: "Amber / Clear", h: `0'9"`, w: `1'6"`, d: `0'8"`, weight: "5 kg", price: 380, deposit: 1400, qty: 6, available: true, storeId: "st3" },
  { id: "p31", name: "Field Telephone Set", category: "Military", material: "Bakelite & Canvas", style: "Wartime", era: "1940s", finish: "Olive Drab", color: "Olive", h: `0'8"`, w: `0'10"`, d: `0'6"`, weight: "3 kg", price: 350, deposit: 1300, qty: 6, available: true, storeId: "st4" },
  { id: "p32", name: "Folding Campaign Cot", category: "Military", material: "Canvas & Beechwood", style: "Wartime", era: "Reproduction", finish: "Raw Timber", color: "Khaki", h: `1'4"`, w: `6'2"`, d: `2'6"`, weight: "9 kg", price: 300, deposit: 1100, qty: 8, available: true, storeId: "st4" },
  { id: "p33", name: "Terracotta Urn Planter (Pair)", category: "Garden", material: "Terracotta", style: "Mediterranean", era: "Contemporary", finish: "Weathered Clay", color: "Terracotta", h: `2'6"`, w: `1'8"`, d: `1'8"`, weight: "22 kg", price: 400, deposit: 1500, qty: 5, available: true, storeId: "st3" },
  { id: "p34", name: "Teak Steamer Deck Chair", category: "Garden", material: "Teak & Canvas", style: "Colonial", era: "1930s", finish: "Oiled Teak", color: "Honey / Cream", h: `3'0"`, w: `2'0"`, d: `4'6"`, seat: `1'2"`, weight: "12 kg", price: 550, deposit: 2000, qty: 6, available: true, storeId: "st2" },
  { id: "p35", name: "Marigold Garland Strings (Bulk)", category: "Festival", material: "Silk Flowers", style: "Festive", era: "Contemporary", finish: "Matte", color: "Orange / Yellow", h: `0'4"`, w: `8'0"`, d: `0'4"`, weight: "1 kg", price: 180, deposit: 600, qty: 30, available: true, storeId: "st3" },
  { id: "p36", name: "Brass Diya Floor Stand", category: "Festival", material: "Brass", style: "Traditional", era: "Contemporary", finish: "Polished Brass", color: "Gold", h: `3'6"`, w: `1'2"`, d: `1'2"`, weight: "6 kg", price: 320, deposit: 1200, qty: 8, available: true, storeId: "st3" },
  { id: "p37", name: "Carved Temple Doorframe", category: "Religious", material: "Carved Teak", style: "Traditional", era: "Antique Reproduction", finish: "Dark Wax", color: "Deep Brown", h: `7'6"`, w: `4'6"`, d: `0'8"`, weight: "65 kg", price: 1600, deposit: 6500, qty: 2, available: true, storeId: "st4" },
  { id: "p38", name: "Silver Puja Thali Set", category: "Religious", material: "Silver-plated Brass", style: "Traditional", era: "Contemporary", finish: "Polished Silver", color: "Silver", h: `0'3"`, w: `1'4"`, d: `1'4"`, weight: "2 kg", price: 300, deposit: 1200, qty: 10, available: true, storeId: "st3" },
  { id: "p39", name: "Ambassador Car (1972)", category: "Vehicles", material: "Steel", style: "Classic", era: "1972", finish: "Cream Duco", color: "Cream", h: `5'0"`, w: `5'6"`, d: `14'8"`, weight: "1200 kg", price: 6500, deposit: 40000, qty: 1, available: false, storeId: "st4" },
  { id: "p40", name: "Wooden Handcart (Thela)", category: "Vehicles", material: "Sal Wood & Iron", style: "Utility", era: "Reproduction", finish: "Raw Timber", color: "Brown", h: `3'6"`, w: `4'0"`, d: `7'0"`, weight: "55 kg", price: 500, deposit: 1800, qty: 3, available: true, storeId: "st4" },
  { id: "p41", name: "Bakelite Wall Clock", category: "Vintage", material: "Bakelite", style: "Art Deco", era: "1950s", finish: "Glossy", color: "Cream / Black", h: `1'0"`, w: `1'0"`, d: `0'4"`, weight: "2 kg", price: 260, deposit: 900, qty: 7, available: true, storeId: "st2" },
  { id: "p42", name: "Colonial Planter's Chair", category: "Period Props", material: "Teak & Cane", style: "Colonial", era: "Period Reproduction", finish: "Oiled Teak", color: "Honey Brown", h: `3'4"`, w: `2'4"`, d: `5'0"`, seat: `1'3"`, weight: "16 kg", price: 950, deposit: 3500, qty: 4, available: true, storeId: "st2" },
  { id: "p43", name: "Brass Paandaan Box", category: "Period Props", material: "Engraved Brass", style: "Mughal", era: "Period Reproduction", finish: "Antique Gold", color: "Gold", h: `0'8"`, w: `1'0"`, d: `0'10"`, weight: "3 kg", price: 320, deposit: 1200, qty: 6, available: true, storeId: "st3" },
  { id: "p44", name: "Faux Taxidermy Stag Mount", category: "Miscellaneous", material: "Faux Taxidermy", style: "Colonial", era: "Reproduction", finish: "Matte", color: "Brown", h: `3'0"`, w: `2'2"`, d: `2'8"`, weight: "7 kg", price: 700, deposit: 2800, qty: 3, available: true, storeId: "st4" },
  { id: "p45", name: "Ship's Brass Porthole", category: "Miscellaneous", material: "Brass & Glass", style: "Nautical", era: "Reproduction", finish: "Polished Brass", color: "Gold", h: `1'8"`, w: `1'8"`, d: `0'6"`, weight: "9 kg", price: 480, deposit: 1800, qty: 5, available: true, storeId: "st1" },
].map((p) => ({
  // image that actually depicts the prop, built from its own name + attributes
  ...p,
  img: img(`${p.name}, ${p.era} ${p.style} ${p.material}, ${p.color}`),
}));

export const storeById = (id) => STORES.find((s) => s.id === id);

/* ---------------------------------------------------------------------- */
/*  RENTAL JOURNEY STEPS                                                   */
/* ---------------------------------------------------------------------- */
export const JOURNEY_STEPS = [
  { key: "requested", label: "Requested", icon: ClipboardList },
  { key: "confirmed", label: "Confirmed", icon: CheckCircle2 },
  { key: "packed", label: "Packed", icon: Package },
  { key: "dispatched", label: "Dispatched", icon: Truck },
  { key: "inuse", label: "In Use", icon: HomeIcon },
  { key: "returned", label: "Returned", icon: Check },
];

/* ---------------------------------------------------------------------- */
/*  CUSTOMER REVIEWS                                                       */
/* ---------------------------------------------------------------------- */
export const REVIEWS = [
  { id: "r1", name: "Meera Nair", role: "Production Designer · Feature Film", rating: 5, quote: "What used to take my team three days of driving between Aarey stores now takes twenty minutes on PropConnect. Dimensions are accurate, availability is live." },
  { id: "r2", name: "Rohan Deshpande", role: "Art Director · Web Series", rating: 5, quote: "The moodboard plus prop suggestions saved a whole recce. I shortlisted a period living-room set the night before the shoot." },
  { id: "r3", name: "Anjali Rao", role: "Set Decorator · Ad Films", rating: 4, quote: "Booking across four different stores in one cart, with one delivery, is the feature I didn't know I needed." },
  { id: "r4", name: "Faizan Qureshi", role: "Line Producer", rating: 5, quote: "Tracking every rented item from packed to returned means fewer frantic calls on wrap day. Deposit reconciliation is finally clean." },
];
