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
    logo: img("warehouse,logo,brand", 200, 200),
    photos: [img("prop,warehouse,storage", 700, 460), img("furniture,storage,shelves", 700, 460), img("antique,shop,interior", 700, 460)],
  },
  {
    id: "st2", name: "Kalakriti Set Props", location: "Aarey Colony, Film City",
    address: "Shed 12, Kalakriti Compound, Aarey Colony Road, Goregaon East, Mumbai 400065",
    phone: "+91 98330 44556", whatsapp: "919833044556", email: "kalakriti.sets@gmail.com",
    hours: "9:30 AM – 8:00 PM · Mon–Sun", totalProps: 340, rating: 4.6,
    logo: img("furniture,workshop,logo", 200, 200),
    photos: [img("vintage,furniture,warehouse", 700, 460), img("props,storage,industrial", 700, 460), img("wooden,furniture,workshop", 700, 460)],
  },
  {
    id: "st3", name: "Rangbhoomi Rentals", location: "Filmistan Lane, Goregaon East",
    address: "12/A Rangbhoomi Estate, Filmistan Lane, Goregaon East, Mumbai 400065",
    phone: "+91 90040 77889", whatsapp: "919004077889", email: "rangbhoomi.rentals@gmail.com",
    hours: "10:00 AM – 7:00 PM · Mon–Sat", totalProps: 178, rating: 4.7,
    logo: img("antique,store,logo", 200, 200),
    photos: [img("antique,decor,shop", 700, 460), img("chandelier,store,interior", 700, 460), img("brass,decor,shelves", 700, 460)],
  },
  {
    id: "st4", name: "Heritage Setworks", location: "Amboli, Andheri West",
    address: "Plot 7, Heritage Compound, Amboli, Andheri West, Mumbai 400058",
    phone: "+91 99870 22334", whatsapp: "919987022334", email: "heritage.setworks@gmail.com",
    hours: "9:00 AM – 6:30 PM · Mon–Sat", totalProps: 265, rating: 4.9,
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
