import type { ProductText } from "../types";

/**
 * English copy for the catalog, keyed by product slug. Slugs, prices and
 * variants are shared; only the marketing text changes per language.
 * Products without an entry fall back to the Portuguese text.
 */
export const productsEn: Record<string, ProductText> = {
  "camiseta-essencial-pima": {
    name: "Essential Pima Tee",
    tagline: "The basic that lasts for years",
    description:
      "Made from long-staple pima cotton, the Essential feels silky, has a reinforced collar and a straight fit that works from the office to the weekend.",
    features: [
      "100% pima cotton",
      "Reinforced ribbed collar",
      "Combed 30/1 jersey",
      "Machine wash cold",
    ],
  },
  "camiseta-oversized-onda": {
    name: "Wave Oversized Tee",
    tagline: "Exclusive screen-printed graphic",
    description:
      "Roomy fit with dropped shoulders and a wave print applied with water-based screen printing that never cracks or fades.",
    features: ["Oversized fit", "Water-based screen print", "100% organic cotton", "Back print"],
  },
  "henley-manga-longa": {
    name: "Long Sleeve Henley",
    tagline: "Three buttons, timeless style",
    description:
      "This waffle-knit Henley keeps you warm without weighing you down. Corozo buttons and ribbed cuffs give it a premium finish.",
    features: ["Waffle knit", "Corozo buttons", "Ribbed cuffs", "Great for in-between seasons"],
  },
  "camiseta-gola-v-linho": {
    name: "Linen V-Neck Tee",
    tagline: "Cool for hot days",
    description:
      "A breathable linen and cotton blend, perfect for summer. The V-neck has a bias-bound finish and the fabric gets better with every wash.",
    features: ["55% linen, 45% cotton", "Bias-bound V-neck", "Breathable fabric", "Quick drying"],
  },
  "camiseta-listrada-nautica": {
    name: "Nautical Striped Tee",
    tagline: "A Breton classic, revisited",
    description:
      "Fine yarn-dyed stripes, a substantial jersey and a straight hem. A take on the navy classic that pairs with jeans, chinos and shorts.",
    features: ["Yarn-dyed stripes", "Heavy 180 gsm jersey", "Straight hem", "Colorfast"],
  },
  "camiseta-dry-corrida": {
    name: "Dry Running Tee",
    tagline: "Light, dry and UV protected",
    description:
      "Technical fabric with anti-odor treatment and UPF 50+ protection. Flat seams prevent chafing and reflective details help on night runs.",
    features: ["UPF 50+ protection", "Anti-odor treatment", "Flat seams", "Reflective details"],
  },
  "regata-ribana": {
    name: "Ribbed Tank Top",
    tagline: "Body-hugging fit, soft touch",
    description:
      "A ribbed stretch tank that looks great on its own or under an open shirt. Wide straps and a slightly curved hem.",
    features: ["Ribbed knit with elastane", "Wide straps", "Curved hem", "Soft touch"],
  },
  "camiseta-pocket-organica": {
    name: "Organic Pocket Tee",
    tagline: "Chest pocket, certified cotton",
    description:
      "Certified organic cotton, low-water dyeing and a double-stitched chest pocket. Comfortable and responsible.",
    features: [
      "Certified organic cotton",
      "Double-stitched pocket",
      "Low-impact dyeing",
      "Printed label",
    ],
  },
  "moletom-canguru-basico": {
    name: "Basic Kangaroo Hoodie",
    tagline: "Lined hood and kangaroo pocket",
    description:
      "Brushed-back fleece hoodie with a double-lined hood and cotton drawstring. The kangaroo pocket has reinforced openings built to last.",
    features: [
      "Brushed interior",
      "Double-lined hood",
      "Reinforced kangaroo pocket",
      "Ribbed cuffs",
    ],
  },
  "moletom-careca-felpado": {
    name: "Fleece Crewneck Sweatshirt",
    tagline: "Crew neck and relaxed fit",
    description:
      "Crew neck with a V-insert, heavyweight brushed fleece and a ribbed hem. A sweatshirt that gets better every time you wear it.",
    features: ["360 gsm fleece", "V-insert at the neck", "Ribbed hem", "Pre-shrunk"],
  },
  "jaqueta-moletom-ziper": {
    name: "Zip Fleece Jacket",
    tagline: "Two-way metal zipper",
    description:
      "Fleece jacket with a two-way metal zipper, side welt pockets and an adjustable hood. Easy to layer.",
    features: ["Two-way zipper", "Welt pockets", "Adjustable hood", "Brushed lining"],
  },
  "moletom-oversized-college": {
    name: "College Oversized Sweatshirt",
    tagline: "Vintage varsity embroidery",
    description:
      "Inspired by 90s college sweatshirts, with raised front embroidery, a stonewashed finish and a roomy fit.",
    features: ["Raised embroidery", "Stonewashed finish", "Roomy fit", "Dropped shoulders"],
  },
  "cardigan-tricot": {
    name: "Knit Cardigan",
    tagline: "Soft knit with wooden buttons",
    description:
      "Cotton knit cardigan in an English rib stitch with wooden buttons and front pockets. Elegant without giving up comfort.",
    features: ["Cotton knit", "English rib stitch", "Wooden buttons", "Front pockets"],
  },
  "corta-vento-leve": {
    name: "Lightweight Windbreaker",
    tagline: "Packs into its own pocket",
    description:
      "Ultralight nylon windbreaker with water repellency, a hood tucked into the collar and a pocket that doubles as a pouch for your backpack.",
    features: ["Water repellent", "Stowaway hood", "Packs into its pocket", "Just 180 g"],
  },
  "moletom-fleece-polar": {
    name: "Polar Fleece Pullover",
    tagline: "Warm enough for real cold",
    description:
      "High-density polar fleece with a half zip, stand-up collar and chest pocket. It traps heat and dries fast after the rain.",
    features: ["High-density fleece", "Half zip", "Stand-up collar", "Quick drying"],
  },
  "calca-chino-slim": {
    name: "Slim Chino Pants",
    tagline: "Stretch twill, slim cut",
    description:
      "Chinos in peached twill with 2% elastane, a non-slip inner waistband and a hem ready to cuff.",
    features: ["Stretch twill", "Slim cut", "Non-slip waistband", "Slash pockets"],
  },
  "calca-jogger-moletom": {
    name: "Fleece Jogger Pants",
    tagline: "Pajama comfort, street style",
    description:
      "Plush fleece joggers with an elastic drawstring waist and cuffed hems. Zippered back pocket to keep your keys safe.",
    features: ["Plush fleece", "Elastic drawstring waist", "Cuffed hems", "Zippered back pocket"],
  },
  "bermuda-sarja": {
    name: "Twill Shorts",
    tagline: "Just the right length",
    description:
      "Lightweight twill shorts that end above the knee, with side pockets and belt loops. Cool and versatile.",
    features: ["Lightweight twill", "Above the knee", "Belt loops", "Side pockets"],
  },
  "calca-cargo-ripstop": {
    name: "Ripstop Cargo Pants",
    tagline: "Six pockets and tear-resistant fabric",
    description:
      "Cargo pants in tough ripstop with six functional pockets, articulated knees and drawcord-adjustable hems.",
    features: ["Ripstop fabric", "Six pockets", "Articulated knees", "Adjustable hems"],
  },
  "calca-jeans-reta": {
    name: "Straight Jeans",
    tagline: "12 oz denim, medium wash",
    description:
      "Straight-leg jeans in 12 oz denim with a medium, low-water wash. Gold contrast stitching and copper rivets.",
    features: ["12 oz denim", "Sustainable wash", "Straight leg", "Copper rivets"],
  },
  "shorts-corrida": {
    name: "Running Shorts",
    tagline: "With built-in liner shorts",
    description:
      "Running shorts with built-in compression liner, a phone pocket and lightweight, quick-drying fabric.",
    features: ["Compression liner", "Phone pocket", "Quick drying", "Reflective details"],
  },
  "calca-alfaiataria-elastica": {
    name: "Stretch Tailored Trousers",
    tagline: "Dressy look, jogger comfort",
    description:
      "Tailored trousers in a cool-wool-feel fabric, with a hidden elastic waistband and permanent crease. Sharp without the squeeze.",
    features: [
      "Cool wool feel",
      "Hidden elastic waistband",
      "Permanent crease",
      "Wrinkle resistant",
    ],
  },
  "tenis-casual-couro": {
    name: "Leather Casual Sneakers",
    tagline: "Genuine leather, stitched sole",
    description:
      "Minimalist sneakers in genuine leather with a stitched rubber sole, latex insole and breathable lining. They go with everything.",
    features: ["Genuine leather", "Stitched sole", "Latex insole", "Breathable lining"],
  },
  "tenis-corrida-leve": {
    name: "Lightweight Running Shoes",
    tagline: "Responsive cushioning",
    description:
      "High-rebound foam midsole, breathable knit upper and an outsole built for asphalt grip. Only 230 g per shoe.",
    features: ["High-rebound foam", "Knit upper", "8 mm drop", "230 g per shoe"],
  },
  "tenis-canvas-cano-alto": {
    name: "High-Top Canvas Sneakers",
    tagline: "Vulcanized canvas classic",
    description:
      "Durable canvas, rubber toe cap and a vulcanized sole. The high top with metal eyelets adds a retro touch.",
    features: ["Cotton canvas", "Vulcanized sole", "Metal eyelets", "Padded insole"],
  },
  "tenis-slip-on": {
    name: "Slip-On Sneakers",
    tagline: "No laces, on in seconds",
    description:
      "Canvas slip-ons with side elastic gores, soft lining and a flexible rubber sole. Everyday convenience.",
    features: ["Side elastic gores", "Soft lining", "Flexible sole", "Washable"],
  },
  "tenis-trail": {
    name: "Trail Running Shoes",
    tagline: "5 mm lugs for dirt and rock",
    description:
      "Outsole with 5 mm lugs, a rock plate and a water-repellent upper. Ready for the trail.",
    features: ["5 mm lugs", "Rock plate", "Water-repellent upper", "Reinforced toe"],
  },
  "sapatenis-camurca": {
    name: "Suede Casual Shoes",
    tagline: "Soft suede for smart casual",
    description:
      "Suede casual shoes with a natural rubber sole and anatomical insole. From jeans to tailoring.",
    features: ["Genuine suede", "Natural rubber", "Anatomical insole", "Visible stitching"],
  },
  "slide-conforto": {
    name: "Comfort Slides",
    tagline: "Soft post-workout foam",
    description:
      "Slides in high-density injected foam with a padded strap and non-slip sole. Recovery after training.",
    features: ["High-density foam", "Padded strap", "Non-slip", "Water resistant"],
  },
  "bone-dad-hat": {
    name: "Dad Hat",
    tagline: "Curved brim and buckle strap",
    description:
      "Six-panel cap in washed twill with a curved brim and metal buckle strap. Subtle embroidery on the front.",
    features: ["Washed twill", "Six panels", "Metal buckle", "Front embroidery"],
  },
  "bone-trucker": {
    name: "Trucker Cap",
    tagline: "Mesh back for airflow",
    description:
      "Trucker cap with a structured foam front, breathable mesh back and snapback closure. A road-trip classic.",
    features: ["Structured front", "Breathable mesh", "Snapback", "Flat or curved brim"],
  },
  "gorro-tricot": {
    name: "Knit Beanie",
    tagline: "Merino wool that doesn't itch",
    description:
      "Merino wool knit beanie with a fold-over cuff. It regulates temperature and doesn't itch, even on sensitive skin.",
    features: ["Merino wool", "Fold-over cuff", "Itch-free", "One size"],
  },
  "bucket-hat": {
    name: "Bucket Hat",
    tagline: "Reversible for two looks",
    description:
      "Reversible cotton twill bucket hat: one side solid, the other in a contrasting color. Eyelets for ventilation.",
    features: ["Reversible", "Cotton twill", "Ventilation eyelets", "6 cm brim"],
  },
  "viseira-esportiva": {
    name: "Sports Visor",
    tagline: "Sweatband and quick drying",
    description:
      "Lightweight visor with an absorbent inner sweatband, pre-curved brim and hook-and-loop strap. Ideal for running and tennis.",
    features: ["Absorbent sweatband", "Quick drying", "Hook-and-loop strap", "Reflective brim"],
  },
  "mochila-urbana-20l": {
    name: "Urban Backpack 20L",
    tagline: "Padded laptop compartment",
    description:
      'A 20-liter waxed canvas backpack with a padded compartment for laptops up to 15", an organizer front pocket and ergonomic straps.',
    features: ["20 liters", 'Fits 15" laptops', "Waxed canvas", "Ergonomic straps"],
  },
  "mochila-notebook-impermeavel": {
    name: "Waterproof Laptop Backpack",
    tagline: "Sealed zippers and USB port",
    description:
      "TPU-coated fabric, sealed zippers and a USB cable pass-through. Anti-theft back pocket for your phone and documents.",
    features: ["TPU coating", "Sealed zippers", "USB pass-through", "Anti-theft pocket"],
  },
  "pochete-crossbody": {
    name: "Crossbody Belt Bag",
    tagline: "Wear it on the waist or across the body",
    description:
      "Compact belt bag with an adjustable strap to wear on the waist or across the chest. Inner mesh pocket and key clip.",
    features: ["Adjustable strap", "Inner mesh pocket", "Key clip", "Water-resistant fabric"],
  },
  "bolsa-tote-lona": {
    name: "Canvas Tote Bag",
    tagline: "Heavy canvas for every day",
    description:
      "16 oz cotton canvas tote with leather handles, a zippered inner pocket and reinforced bottom. Fits everything, laptop included.",
    features: ["16 oz canvas", "Leather handles", "Zippered pocket", "Reinforced bottom"],
  },
  "mochila-rolltop": {
    name: "Rolltop Backpack",
    tagline: "Expands up to 28L",
    description:
      "Rolltop closure that expands from 22 to 28 liters, straps with a sternum strap and webbing to attach gear.",
    features: ["22 to 28 liters", "Rolltop closure", "Sternum strap", "Attachment webbing"],
  },
  "necessaire-viagem": {
    name: "Travel Toiletry Bag",
    tagline: "Opens up and hangs in the bathroom",
    description:
      "Toiletry bag with a hanging hook, clear dividers and washable lining. Organization for short and long trips.",
    features: ["Hanging hook", "Clear dividers", "Washable lining", "Side handle"],
  },
};
