import flowerNecklace from "@/assets/product-flower-necklace.jpg";
import blackPendant from "@/assets/product-black-pendant.jpg";
import emeraldEarrings from "@/assets/product-emerald-earrings.jpg";
import cuffBracelet from "@/assets/product-cuff-bracelet.jpg";
import roseNail from "@/assets/product-rose-nail-bracelet.jpg";
import goldNail from "@/assets/product-gold-nail-bracelet.jpg";
import bowEarrings from "@/assets/product-bow-earrings.jpg";
import curveNecklace from "@/assets/product-curve-necklace.jpg";
import waveBangle from "@/assets/product-wave-bangle.jpg";
import chevronRing from "@/assets/product-chevron-ring.jpg";
import butterflyRing from "@/assets/product-butterfly-ring.jpg";
import bowPearlRing from "@/assets/product-bow-pearl-ring.jpg";
import heartRing from "@/assets/product-heart-ring.jpg";
import waveBandRing from "@/assets/product-wave-band-ring.jpg";
import infinityRing from "@/assets/product-infinity-ring.jpg";
import pearlRing from "@/assets/product-pearl-ring.jpg";
import bowBracelet from "@/assets/product-bow-bracelet.jpg";
import mensCableBracelet from "@/assets/product-mens-cable-bracelet.jpg";
import heartPearlBracelet from "@/assets/product-heart-pearl-bracelet.jpg";
import roseSnakeBracelet from "@/assets/product-rose-snake-bracelet.jpg";
import bowSliderBracelet from "@/assets/product-bow-slider-bracelet.jpg";
import leafHerringboneBracelet from "@/assets/product-leaf-herringbone-bracelet.jpg";
import herringboneBracelet from "@/assets/product-herringbone-bracelet.jpg";
import silverTennisBracelet from "@/assets/product-silver-tennis-bracelet.jpg";
import pearlStationBracelet from "@/assets/product-pearl-station-bracelet.jpg";
import idBarBracelet from "@/assets/product-id-bar-bracelet.jpg";
import tennisBeadBracelet from "@/assets/product-tennis-bead-bracelet.jpg";
import baguetteBangle from "@/assets/product-baguette-bangle.jpg";
import emeraldCurbBracelet from "@/assets/product-emerald-curb-bracelet.jpg";
import beadedBangle from "@/assets/product-beaded-bangle.jpg";
import mangalsutraSquare from "@/assets/product-mangalsutra-square.jpg";
import mangalsutraDrop from "@/assets/product-mangalsutra-drop.jpg";
import mangalsutraFloral from "@/assets/product-mangalsutra-floral.jpg";
import baguetteBangleNew from "@/assets/product-baguette-bangle-new.jpg";
import beadedBangleNew from "@/assets/product-beaded-bangle-new.jpg";
import nailBangleNew from "@/assets/product-nail-bangle-new.jpg";
import emeraldBangleNew from "@/assets/product-emerald-bangle-new.jpg";
import cloverBangleNew from "@/assets/product-clover-bangle-new.jpg";
import emeraldSquareBangle from "@/assets/product-emerald-square-bangle.jpg";
import twoToneCuff from "@/assets/product-two-tone-cuff.jpg";
import wavyCutoutBangle from "@/assets/product-wavy-cutout-bangle.jpg";
import paveNailBangle from "@/assets/product-pave-nail-bangle.jpg";
import layeredEmeraldNecklace from "@/assets/product-layered-emerald-necklace.jpg";
import silverBowBangle from "@/assets/product-silver-bow-bangle.jpg";
import multiStoneRoseGoldBangle from "@/assets/product-multi-stone-rose-gold-bangle.jpg";
import goldHerringboneEmeraldNecklace from "@/assets/product-gold-herringbone-emerald-necklace.jpg";
import daintyCutoutGoldBangle from "@/assets/product-dainty-cutout-gold-bangle.jpg";
import goldHerringboneSolitaireNecklace from "@/assets/product-gold-herringbone-solitaire-necklace.jpg";
import goldBeanPendantNecklace from "@/assets/product-gold-bean-pendant-necklace.jpg";
import goldFlowerLeafNecklace from "@/assets/product-gold-flower-leaf-necklace.jpg";
import goldCrystalFlowerNecklace from "@/assets/product-gold-crystal-flower-necklace.jpg";
import eternityMultiRowRing from "@/assets/product-eternity-multi-row-ring.jpg";
import chevronLatticeRing from "@/assets/product-chevron-lattice-ring.jpg";
import goldAureliaLeafRing from "@/assets/product-gold-aurelia-leaf-ring.jpg";
import silverLaurelBypassRing from "@/assets/product-silver-laurel-bypass-ring.jpg";
import goldCloverPaveRing from "@/assets/product-gold-clover-pave-ring.jpg";
import rajputanaRubyBangle from "@/assets/product-rajputana-ruby-bangle.jpg";
import goldLatticeKadli from "@/assets/product-gold-lattice-kadli.jpg";
import mughalEnamelBangle from "@/assets/product-mughal-enamel-bangle.jpg";
import teardropNavratnaKada from "@/assets/product-teardrop-navratna-kada.jpg";
import vanaLeafKada from "@/assets/product-vana-leaf-kada.jpg";
import chokiPayal from "@/assets/product-choki-payal.jpg";
import blackPayal from "@/assets/product-black-payal.jpg";
import tealPurplePayal from "@/assets/product-teal-purple-payal.jpg";
import barGreekBracelet from "@/assets/product-bar-greek-bracelet.jpg";
import goldRopeBracelet from "@/assets/product-gold-rope-bracelet.jpg";
import heartStarsBracelet from "@/assets/product-heart-stars-bracelet.jpg";
import doubleRoseMeshBracelet from "@/assets/product-double-rose-mesh-bracelet.jpg";
import bezelCharmsBracelet from "@/assets/product-bezel-charms-bracelet.jpg";
import halfTennisBead from "@/assets/product-half-tennis-bead.jpg";
import heartHangingCharm from "@/assets/product-heart-hanging-charm.jpg";
import texturedHeartCharm from "@/assets/product-textured-heart-charm.jpg";
import leafHerringboneGold from "@/assets/product-leaf-herringbone-gold.jpg";
import thinTennisSilver from "@/assets/product-thin-tennis-silver.jpg";
import cloverTasselEarrings from "@/assets/product-clover-tassel-earrings.jpg";
import threeTierAmberEarrings from "@/assets/product-three-tier-amber-earrings.jpg";
import wreathPearlFlowerEarrings from "@/assets/product-wreath-pearl-flower-earrings.jpg";

export type Product = {
  id: string;
  name: string;
  category:
    | "Chain Pendants"
    | "Earrings"
    | "Chain Bracelets"
    | "Openable Kada"
    | "Rings"
    | "Mangalsutra"
    | "Bangles"
    | "Anklets";
  image: string;
  tagline: string;
};

export const products: any[] = [
  {
    id: "p1",
    name: "Pétale Drop Chain Pendant",
    category: "Chain Pendants",
    price: 1299,
    image: flowerNecklace,
    tagline: "Pink crystal florals on a delicate gold chain.",
  },
  {
    id: "p2",
    name: "Onyx Cabochon Pendant",
    category: "Chain Pendants",
    price: 1149,
    image: blackPendant,
    tagline: "Black stone in a polished gold bezel.",
  },
  {
    id: "p3",
    name: "Émeraude Drop Earrings",
    category: "Earrings",
    price: 1499,
    image: emeraldEarrings,
    tagline: "Twin emerald-green stones with gold trim.",
  },
  {
    id: "p4",
    name: "Duo-Tone Cuff",
    category: "Openable Kada",
    price: 1899,
    image: cuffBracelet,
    tagline: "Sculpted gold & silver open cuff.",
  },

  {
    id: "p6",
    name: "Gold Nail Openable Kada",
    category: "Openable Kada",
    price: 1599,
    image: goldNail,
    tagline: "Pavé-crystal nail openable kada in classic gold.",
  },
  {
    id: "p7",
    name: "Ribbon Heart Earrings",
    category: "Earrings",
    price: 999,
    image: bowEarrings,
    tagline: "Glossy gold bow with a heart drop.",
  },
  {
    id: "p8",
    name: "Curve Bar Chain Pendant",
    category: "Chain Pendants",
    price: 1199,
    image: curveNecklace,
    tagline: "Minimalist sculpted gold curve.",
  },
  {
    id: "p9",
    name: "Wave Pavé Openable Kada",
    category: "Openable Kada",
    price: 2199,
    image: waveBangle,
    tagline: "Three rows of crystal-set wave detail.",
  },
  {
    id: "p10",
    name: "Triple Chevron Pavé Ring",
    category: "Rings",
    price: 1099,
    image: chevronRing,
    tagline: "Stacked V-form band set with shimmering pavé crystals.",
  },
  {
    id: "p11",
    name: "Papillon Butterfly Ring",
    category: "Rings",
    price: 899,
    image: butterflyRing,
    tagline: "Delicate frosted-gold butterfly on an adjustable band.",
  },
  {
    id: "p12",
    name: "Ribbon & Pearl Ring",
    category: "Rings",
    price: 1199,
    image: bowPearlRing,
    tagline: "Sculpted gold bow centered with a luminous pearl.",
  },
  {
    id: "p13",
    name: "Coeur Heart Ring",
    category: "Rings",
    price: 999,
    image: heartRing,
    tagline: "Polished gold heart with pavé-set twisted shoulders.",
  },
  {
    id: "p14",
    name: "Wave Trio Band",
    category: "Rings",
    price: 1299,
    image: waveBandRing,
    tagline: "Three-row stacked band with a crystal-set wave.",
  },
  {
    id: "p15",
    name: "Infinity Duo Ring",
    category: "Rings",
    price: 1099,
    image: infinityRing,
    tagline: "Two-tone infinity over a sleek polished band.",
  },
  {
    id: "p16",
    name: "Mabé Pearl Ring",
    category: "Rings",
    price: 1399,
    image: pearlRing,
    tagline: "Oversized cultured-look pearl in a gold bezel.",
  },
  {
    id: "p17",
    name: "Ruban Bow Chain Bracelet",
    category: "Chain Bracelets",
    price: 1299,
    image: bowBracelet,
    tagline: "Adjustable snake chain finished with a dainty gold bow.",
  },
  {
    id: "p18",
    name: "Cable Steel Chain Bracelet (Men)",
    category: "Openable Kada",
    price: 1799,
    image: mensCableBracelet,
    tagline: "Two-tone steel cable with a brushed center bar — built for him.",
  },
  {
    id: "p19",
    name: "Heart & Pearl Charm Chain Bracelet",
    category: "Chain Bracelets",
    price: 1399,
    image: heartPearlBracelet,
    tagline: "Rose-gold hearts and freshwater pearls on a curved bar chain.",
  },
  {
    id: "p20",
    name: "Rose Bloom Snake Chain Bracelet",
    category: "Chain Bracelets",
    price: 1499,
    image: roseSnakeBracelet,
    tagline: "Flat snake chain with twin sculpted gold roses.",
  },
  {
    id: "p21",
    name: "Bow Slider Chain Bracelet",
    category: "Chain Bracelets",
    price: 1199,
    image: bowSliderBracelet,
    tagline: "Snake-chain slider with a delicate gold bow — fully adjustable.",
  },
  {
    id: "p22",
    name: "Olive Leaf Herringbone",
    category: "Chain Bracelets",
    price: 1599,
    image: leafHerringboneBracelet,
    tagline: "Herringbone chain centered with an olive-leaf motif.",
  },
  {
    id: "p23",
    name: "Classic Herringbone Chain",
    category: "Chain Bracelets",
    price: 1299,
    image: herringboneBracelet,
    tagline: "Liquid-smooth gold herringbone for everyday stacking.",
  },
  {
    id: "p24",
    name: "Silver Tennis Chain Bracelet",
    category: "Chain Bracelets",
    price: 1899,
    image: silverTennisBracelet,
    tagline: "Single-row crystal tennis line in rhodium-finish steel.",
  },
  {
    id: "p25",
    name: "Pearl Station Chain Bracelet",
    category: "Chain Bracelets",
    price: 1499,
    image: pearlStationBracelet,
    tagline: "Five bezel-set pearls on a fine gold cable chain.",
  },
  {
    id: "p26",
    name: "Pavé ID Bar Chain Bracelet",
    category: "Chain Bracelets",
    price: 1699,
    image: idBarBracelet,
    tagline: "Frosted gold ID bar with crystal pavé on a double chain.",
  },
  {
    id: "p27",
    name: "Tennis & Bead Half-Half",
    category: "Chain Bracelets",
    price: 1599,
    image: tennisBeadBracelet,
    tagline: "Half crystal tennis, half gold bead — modern asymmetry.",
  },
  {
    id: "p28",
    name: "Baguette Crystal Openable Kada",
    category: "Openable Kada",
    price: 1999,
    image: baguetteBangle,
    tagline: "Sleek polished openable kada with baguette-cut crystal inlay.",
  },
  {
    id: "p29",
    name: "Émeraude Curb Chain Bracelet",
    category: "Chain Bracelets",
    price: 1799,
    image: emeraldCurbBracelet,
    tagline: "Bold curb chain centered with an emerald-green baguette.",
  },
  {
    id: "p30",
    name: "Olive Bead Openable Kada",
    category: "Openable Kada",
    price: 1499,
    image: beadedBangle,
    tagline: "Sculpted gold olive beads in a slim everyday openable kada.",
  },
  {
    id: "p31",
    name: "Aurelia Square Mangalsutra",
    category: "Mangalsutra",
    price: 2499,
    image: mangalsutraSquare,
    tagline: "Square pavé pendant with classic black-bead chain.",
  },
  {
    id: "p32",
    name: "Bindu Drop Mangalsutra",
    category: "Mangalsutra",
    price: 2299,
    image: mangalsutraDrop,
    tagline: "Minimal drop pendant on a delicate black-bead chain.",
  },
  {
    id: "p33",
    name: "Anaya Floral Mangalsutra",
    category: "Mangalsutra",
    price: 2699,
    image: mangalsutraFloral,
    tagline: "Pavé floral medallion on a mixed black & gold bead chain.",
  },
  {
    id: "p34",
    name: "Diagonal Baguette Openable Kada",
    category: "Openable Kada",
    price: 1899,
    image: baguetteBangleNew,
    tagline: "Gold openable kada accented with a diagonal row of baguette crystals.",
  },
  {
    id: "p35",
    name: "Textured Beaded Openable Kada",
    category: "Openable Kada",
    price: 1599,
    image: beadedBangleNew,
    tagline: "Classic gold openable kada with a modern beaded texture.",
  },
  {
    id: "p36",
    name: "Wrap Nail Openable Kada",
    category: "Openable Kada",
    price: 1699,
    image: nailBangleNew,
    tagline: "Sculpted nail wrap openable kada in polished gold.",
  },
  {
    id: "p37",
    name: "Emerald & Diamond Openable Kada",
    category: "Openable Kada",
    price: 2199,
    image: emeraldBangleNew,
    tagline: "Elegant gold openable kada featuring alternating emerald and clear stones.",
  },
  {
    id: "p38",
    name: "Clover Cutout Openable Kada",
    category: "Openable Kada",
    price: 2299,
    image: cloverBangleNew,
    tagline: "Wavy gold openable kada with clover cutouts and crystal pavé borders.",
  },
  {
    id: "p39",
    name: "Emerald Center Openable Kada",
    category: "Openable Kada",
    price: 1899,
    image: emeraldSquareBangle,
    tagline:
      "Polished openable kada with a striking rectangular emerald center and pavé crystal band.",
  },
  {
    id: "p40",
    name: "Modern Two-Tone Cuff",
    category: "Openable Kada",
    price: 1799,
    image: twoToneCuff,
    tagline: "Sleek and minimalist two-tone gold and silver cuff.",
  },
  {
    id: "p41",
    name: "Intricate Cutout Openable Kada",
    category: "Openable Kada",
    price: 2199,
    image: wavyCutoutBangle,
    tagline: "Gold openable kada featuring intricate wavy cutouts and delicate pavé details.",
  },
  {
    id: "p42",
    name: "Pavé Wrap Nail Openable Kada",
    category: "Openable Kada",
    price: 1999,
    image: paveNailBangle,
    tagline: "Classic nail wrap design elevated with shimmering pavé crystals.",
  },
  {
    id: "p43",
    name: "Emerald Chain Pendant",
    category: "Chain Pendants",
    price: 1499,
    image: layeredEmeraldNecklace,
    tagline: "Layered herringbone chain adorned with a deep green emerald pendant.",
  },
  {
    id: "p44",
    name: "Luminous Silver Bow Openable Kada",
    category: "Openable Kada",
    price: 1999,
    image: silverBowBangle,
    tagline: "Silver-finish bow openable kada sparkling with micro-pavé crystals.",
  },
  {
    id: "p45",
    name: "Améthyste & Émeraude Openable Kada",
    category: "Openable Kada",
    price: 2199,
    image: multiStoneRoseGoldBangle,
    tagline:
      "Open-work rose gold openable kada centered with purple amethyst and emerald-green stones.",
  },
  {
    id: "p46",
    name: "Herringbone Emerald Chain Pendant",
    category: "Chain Pendants",
    price: 1599,
    image: goldHerringboneEmeraldNecklace,
    tagline: "Sleek gold herringbone chain with a rectangular emerald pendant.",
  },
  {
    id: "p47",
    name: "Dainty Cutout Gold Openable Kada",
    category: "Openable Kada",
    price: 1699,
    image: daintyCutoutGoldBangle,
    tagline: "Delicate open-cutout gold openable kada centered with bezel-set crystals.",
  },
  {
    id: "p48",
    name: "Solitaire Herringbone Chain Pendant",
    category: "Chain Pendants",
    price: 1499,
    image: goldHerringboneSolitaireNecklace,
    tagline: "Gold flat herringbone chain adorned with a shimmering round solitaire pendant.",
  },
  {
    id: "p49",
    name: "Gilded Bean Pavé Pendant",
    category: "Chain Pendants",
    price: 1399,
    image: goldBeanPendantNecklace,
    tagline: "Sleek gold bean pendant lined with shimmering pavé crystals along the curve.",
  },
  {
    id: "p50",
    name: "Gold Floral Leaf Pendant",
    category: "Chain Pendants",
    price: 1299,
    image: goldFlowerLeafNecklace,
    tagline: "Delicate gold five-petal flower outline featuring an intricate inner leaf detail.",
  },
  {
    id: "p51",
    name: "Crystal Bloom Chain Pendant",
    category: "Chain Pendants",
    price: 1499,
    image: goldCrystalFlowerNecklace,
    tagline:
      "Gold herringbone chain featuring a beautiful five-petal flower pendant set with clear crystals.",
  },
  {
    id: "p52",
    name: "Eternity Multi-Row Pavé Ring",
    category: "Rings",
    price: 1399,
    image: eternityMultiRowRing,
    tagline:
      "Dynamic triple-row sterling-finish bypass band encrusted with shimmering micro-pavé crystals.",
  },
  {
    id: "p53",
    name: "Chevron Lattice Pavé Ring",
    category: "Rings",
    price: 1299,
    image: chevronLatticeRing,
    tagline:
      "Rhodium-finished interlaced chevron bands set with brilliant baguette & round-cut crystals.",
  },
  {
    id: "p54",
    name: "Gold Aurelia Leaf Ring",
    category: "Rings",
    price: 1199,
    image: goldAureliaLeafRing,
    tagline:
      "An elegant open-bypass band featuring detailed gold leaf silhouettes in surgical steel.",
  },
  {
    id: "p55",
    name: "Silver Laurel Crystal Bypass Ring",
    category: "Rings",
    price: 1499,
    image: silverLaurelBypassRing,
    tagline:
      "Sparkling leaf contours wrap elegantly around the finger, lined with round and baguette crystals.",
  },
  {
    id: "p56",
    name: "Classic Gold Clover Pavé Ring",
    category: "Rings",
    price: 1249,
    image: goldCloverPaveRing,
    tagline: "Four-leaf clover motif encrusted with premium crystals on a slim polished gold band.",
  },
  {
    id: "p57",
    name: "Rajputana Ruby Checkerboard Bangle",
    category: "Bangles",
    price: 1899,
    image: rajputanaRubyBangle,
    tagline:
      "Traditional gold-plated checkerboard pattern kada adorned with a central square ruby and leaf filigree.",
  },
  {
    id: "p58",
    name: "Mayura Gold Lattice Kadli",
    category: "Bangles",
    price: 1799,
    image: goldLatticeKadli,
    tagline:
      "Intricate cutout gold-plated lattice design centered with a crystal floral bloom and ruby center.",
  },
  {
    id: "p59",
    name: "Nawabi Enamel Gold Kada",
    category: "Bangles",
    price: 1999,
    image: mughalEnamelBangle,
    tagline:
      "Classic dual-split gold band decorated with delicate black enamel geometric frames and inlaid crystals.",
  },
  {
    id: "p60",
    name: "Navratna Teardrop Gold Kada",
    category: "Bangles",
    price: 1699,
    image: teardropNavratnaKada,
    tagline:
      "Elegant slim gold kada featuring stylized teardrop cutout accents set with multi-colored crystals.",
  },
  {
    id: "p61",
    name: "Traditional Gold Leaf Kada",
    category: "Bangles",
    price: 1849,
    image: vanaLeafKada,
    tagline:
      "Exquisite dual-branch leaf patterns encrusted with clear pavé crystals, meeting in a delicate bypass.",
  },
  {
    id: "p62",
    name: "Silver Choki Multi-Stone Payal",
    category: "Anklets",
    price: 1599,
    image: chokiPayal,
    tagline:
      "Classic silver-plated payal decorated with rubies and emeralds on a dainty link chain.",
  },
  {
    id: "p63",
    name: "Silver Black-Beaded Payal",
    category: "Anklets",
    price: 1399,
    image: blackPayal,
    tagline:
      "Sterling silver finish anklet featuring black geometric frame accents and floral bells (ghungroos).",
  },
  {
    id: "p64",
    name: "Silver Multi-Enamel Payal",
    category: "Anklets",
    price: 1499,
    image: tealPurplePayal,
    tagline:
      "Vibrant purple and teal enamel cylinders connected by polished silver chains, complete with delicate ghungroos.",
  },
  {
    id: "p65",
    name: "Grecian Crystal Bar Gold Bracelet",
    category: "Chain Bracelets",
    price: 1699,
    image: barGreekBracelet,
    tagline:
      "Dual anti-tarnish gold chains connected by a crystal-studded rectangular bar with Greek key border details.",
  },
  {
    id: "p66",
    name: "Classic Golden Rope Bracelet",
    category: "Chain Bracelets",
    price: 1199,
    image: goldRopeBracelet,
    tagline:
      "Thick golden rope chain bracelet crafted in premium surgical stainless steel with a high-polish finish.",
  },
  {
    id: "p67",
    name: "Amore Heart & Star Charm Bracelet",
    category: "Chain Bracelets",
    price: 1499,
    image: heartStarsBracelet,
    tagline:
      "Stunning double-layered paperclip and cable chain featuring a central heart charm and engraved star discs.",
  },
  {
    id: "p68",
    name: "Twin Golden Roses Mesh Bracelet",
    category: "Chain Bracelets",
    price: 1599,
    image: doubleRoseMeshBracelet,
    tagline:
      "Delicate golden mesh band featuring twin intricately sculpted golden rose blooms, fully adjustable.",
  },
  {
    id: "p69",
    name: "Lumiere Bezel Crystal Charm Bracelet",
    category: "Chain Bracelets",
    price: 1549,
    image: bezelCharmsBracelet,
    tagline:
      "Double-layered fine golden chain adorned with five shimmering round bezel-set crystal charms.",
  },
  {
    id: "p70",
    name: "Mélange Half-Tennis Gold Bead Bracelet",
    category: "Chain Bracelets",
    price: 1499,
    image: halfTennisBead,
    tagline:
      "Half bezel-set crystal tennis chain, half polished gold beads — elegant and modern asymmetry.",
  },
  {
    id: "p71",
    name: "Amore Golden Pendant Charm Bracelet",
    category: "Chain Bracelets",
    price: 1299,
    image: heartHangingCharm,
    tagline: "Golden textured paperclip chain adorned with an iconic hanging golden heart charm.",
  },
  {
    id: "p72",
    name: "Classic Heart Link Gold Chain Bracelet",
    category: "Chain Bracelets",
    price: 1349,
    image: texturedHeartCharm,
    tagline:
      "Polished golden cable chain centered with five ribbed tubular accents and a central gold heart.",
  },
  {
    id: "p73",
    name: "Botanical Herringbone Branch Gold Bracelet",
    category: "Chain Bracelets",
    price: 1449,
    image: leafHerringboneGold,
    tagline: "Sleek gold herringbone band highlighted by an elegant leaf-branch silhouette.",
  },
  {
    id: "p74",
    name: "Silver Crystal Tennis Line Chain Bracelet",
    category: "Chain Bracelets",
    price: 1599,
    image: thinTennisSilver,
    tagline:
      "Delicate row of brilliant round-cut clear crystals set in a tarnish-resistant steel-finish tennis line.",
  },
  {
    id: "p75",
    name: "Gilded Clover Tassel Drop Earrings",
    category: "Earrings",
    price: 1499,
    image: cloverTasselEarrings,
    tagline:
      "Beautiful golden four-leaf clover stud with micro-pavé accents and matching twin cable chain tassels.",
  },
  {
    id: "p76",
    name: "Amber & Rose Tiered Drop Earrings",
    category: "Earrings",
    price: 1399,
    image: threeTierAmberEarrings,
    tagline: "Three-tiered faceted crystals in warm amber, soft yellow, and champagne-rose tones.",
  },
  {
    id: "p77",
    name: "Jardin Pearl & Wreath Drop Earrings",
    category: "Earrings",
    price: 1599,
    image: wreathPearlFlowerEarrings,
    tagline:
      "Elegant golden rope wreath adorned with a detailed white flower and dangling pearl branch cluster.",
  },
];
