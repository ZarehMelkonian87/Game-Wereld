/**
 * Bouwkaarten voor de modus Zeg & Bouw (T-04c, variant A "Bouwopdracht").
 *
 * Elke kaart geeft een thema-doel: "zet N passende dingen neer". Het doel is
 * **soepel** (concept §3/§5): het kind kiest zélf welke passende objecten en
 * waar. Een niet-passend object levert een vriendelijke tip op, geen straf.
 *
 * De objecten komen uit de bestaande strand-set van 12: dolfijn, boot,
 * vuurtoren, vliegtuig, vlieger, bal, parasol, schelp, krab, zandkasteel,
 * handdoek, zon.
 */
export interface ZegBouwCard {
  /** Stabiel id van de bouwkaart. */
  id: string;
  /** Korte thema-naam. */
  theme: string;
  /** Titel op de bouwkaart, bv. "Vaarstrand". */
  title: string;
  /** Kindvriendelijke opdrachttekst (staat ook als tekst, niet alleen audio). */
  prompt: string;
  /** Aantal passende objecten dat nodig is om het doel te halen. */
  goalCount: number;
  /**
   * Toegestane object-id's. Leeg samen met `allowsAnyObject` = vrije keuze
   * (feeststrand): elk object telt mee.
   */
  allowedObjectIds: readonly string[];
  /** True voor het vrije thema (elk object is passend). */
  allowsAnyObject: boolean;
}

export const zegBouwCards: readonly ZegBouwCard[] = [
  {
    id: "build-vaarstrand",
    theme: "vaarstrand",
    title: "Vaarstrand",
    prompt: "Bouw een vaarstrand! Zet 2 dingen die kunnen varen of drijven.",
    goalCount: 2,
    allowedObjectIds: ["boot", "dolfijn", "vuurtoren"],
    allowsAnyObject: false,
  },
  {
    id: "build-dierenstrand",
    theme: "dierenstrand",
    title: "Dierenstrand",
    prompt: "Maak een dierenstrand! Zet 2 dieren of schelpen op het strand.",
    goalCount: 2,
    allowedObjectIds: ["krab", "dolfijn", "schelp"],
    allowsAnyObject: false,
  },
  {
    id: "build-speelstrand",
    theme: "speelstrand",
    title: "Speelstrand",
    prompt: "Maak een speelstrand! Zet 3 speeldingen neer.",
    goalCount: 3,
    allowedObjectIds: ["bal", "vlieger", "zandkasteel", "parasol", "handdoek"],
    allowsAnyObject: false,
  },
  {
    id: "build-luchtstrand",
    theme: "luchtstrand",
    title: "Luchtstrand",
    prompt: "Wat vliegt er boven het strand? Zet 2 dingen in de lucht.",
    goalCount: 2,
    allowedObjectIds: ["vliegtuig", "vlieger", "zon"],
    allowsAnyObject: false,
  },
  {
    id: "build-feeststrand",
    theme: "feeststrand",
    title: "Feeststrand",
    prompt: "Maak jouw mooiste strand! Kies zelf 3 dingen.",
    goalCount: 3,
    allowedObjectIds: [],
    allowsAnyObject: true,
  },
];

/** Of een object bij het thema van de bouwkaart past. */
export const isObjectAllowedOnCard = (card: ZegBouwCard, objectId: string): boolean =>
  card.allowsAnyObject || card.allowedObjectIds.includes(objectId);

/** Aantal unieke passende objecten dat al geplaatst is (dubbel telt één keer). */
export const countMatchingPlacements = (
  card: ZegBouwCard,
  placedObjectIds: readonly string[],
): number => {
  const matching = new Set(
    placedObjectIds.filter((objectId) => isObjectAllowedOnCard(card, objectId)),
  );

  return matching.size;
};

export interface ZegBouwProgress {
  complete: boolean;
  count: number;
  goal: number;
}

export const getBuildCardProgress = (
  card: ZegBouwCard,
  placedObjectIds: readonly string[],
): ZegBouwProgress => {
  const count = Math.min(card.goalCount, countMatchingPlacements(card, placedObjectIds));

  return { complete: count >= card.goalCount, count, goal: card.goalCount };
};

export const isBuildCardComplete = (
  card: ZegBouwCard,
  placedObjectIds: readonly string[],
): boolean => getBuildCardProgress(card, placedObjectIds).complete;

// Kleine, deterministische seeded shuffle (zelfde LCG-aanpak als de andere
// modi, T-29) zodat de kaartvolgorde per ronde varieert maar reproduceerbaar
// is voor een gegeven seed.
const createSeededRandom = (seed: number) => {
  let state = seed % 2_147_483_647;
  if (state <= 0) {
    state += 2_147_483_646;
  }

  return () => {
    state = (state * 16_807) % 2_147_483_647;

    return (state - 1) / 2_147_483_646;
  };
};

/** Geeft de bouwkaarten in een per-ronde geschudde volgorde (T-29-norm). */
export const shuffleBuildCards = (cards: readonly ZegBouwCard[], seed: number): ZegBouwCard[] => {
  const random = createSeededRandom(seed);
  const shuffled = [...cards];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const targetIndex = Math.floor(random() * (index + 1));
    const current = shuffled[index];
    shuffled[index] = shuffled[targetIndex];
    shuffled[targetIndex] = current;
  }

  return shuffled;
};
