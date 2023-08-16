import { ArchidektCard } from './archidekt';
import { DeckboxCard } from './deckbox';
import { ErrorCodes } from './errors';
import { panic } from './utils';

const UNSUPPORTED_SET_PARTIAL_NAMES: string[] = [
    ////////////////////////////////////////////////////////////
    // Archidekt Issues
    ////////////////////////////////////////////////////////////

    'Extras: ',   // Archidekt doesn't support tokens
    'Art Series', // Archidekt doesn't support art cards
    'Oversized',  // Archidekt doesn't support oversized cards

    ////////////////////////////////////////////////////////////
    // Deckbox Issues
    ////////////////////////////////////////////////////////////

    'Promo Pack',         // Deckbox doesn't correctly number promo pack cards (set could otherwise
                          // be converted)
    'Friday Night Magic', // Deckbox doesn't provide the year of the promo so it can't be tied back
                          // to its Scryfall set
    'Love your LGS',      // Same reasoning as Friday Night Magic
    'Magic Fest',         // Same reasoning as Friday Night Magic

    ////////////////////////////////////////////////////////////
    // Implementation Issues
    ////////////////////////////////////////////////////////////

    'Surge Foils', // It's hard to differentiate between 40k and 40k Surge Foils. Needs more work to
                   // function correctly to send the ★ to Archidekt
    'War of the Spark Japanese Alternate Art', // Same as Surge Foils
];

const LANGUAGES: { [languageName: string] : string; } = {
    English: 'EN',
    German: 'DE',
    French: 'FR',
    Italian: 'IT',
    Spanish: 'SP',
    Portuguese: 'PT',
    Japanese: 'JP',
    Chinese: 'CS',
    Russian: 'RU',
    Korean: 'KR',
    'Traditional Chinese': 'CT',
};

const CONDITIONS: { [conditionName: string] : string; } = {
    Mint: 'NM',
    'Near Mint': 'NM',
    'Good (Lightly Played)': 'LP',
    Played: 'MP',
    'Heavily Played': 'HP',
    Poor: 'D',
};

/**
 * Some sets (i.e. art cards and tokens) are supported by Deckbox and not Archidekt. This returns
 * whether or not Archidekt can handle a given set.
 */
function isSupportedSet(cardName: string, setName: string): boolean {
    for (const partial of UNSUPPORTED_SET_PARTIAL_NAMES) {
        if (setName.includes(partial)) {
            return false;
        }
    }
    return true;
}

function convertSetName(name: string): string {
    return name
        .replace(/Magic (\d{4}) Core Set/, "Magic $1")
        .replace(/Modern Masters (\d{4}) Edition/, "Modern Masters $1")
        .replace("Secret Lair Drop Series", "Secret Lair Drop")
        .replace("Warhammer 40,000", "Warhammer 40,000 Commander") // INCORRECT FOR SURGE FOILS
        .replace('30th Anniversary Promos', '30th Anniversary Misc Promos');
}

/**
 * Required because Deckbox does not output properly accented names.
 *
 * NOTE: This would need to be improved to cover ALL cards with interesting characters in their
 *       names for a production-ready version.
 */
function convertName(name: string): string {
    if (name === 'Jotun Grunt') {
        return 'Jötun Grunt';
    }
    return name;
}

/**
 * Convert between the full language names Deckbox uses and the abbreviations that Archidekt uses.
 */
function convertLanguage(language: string): string {
    if (!(language in LANGUAGES)) {
        panic(`Unknown language name: ${language}`, ErrorCodes.UNKNOWN_LANGUAGE);
    }
    return LANGUAGES[language];
}

/**
 * Convert between the condition explanations Deckbox uses and the abbreviations that Archidekt
 * uses.
 */
function convertCondition(condition: string): string {
    if (condition === 'Mint') {
        console.warn("Archidect does not support 'Mint' condition. Using NM.");
    } else if (!(condition in CONDITIONS)) {
        panic(`Unknown condition: ${condition}`, ErrorCodes.UNKNOWN_CONDITION);
    }
    return CONDITIONS[condition];
}

/**
 * Figure out a variant from the properties of the Deckbox card.
 *
 * NOTE: This should likely combine the various specialty parameters from Deckbox into a Variant. It
 *       dependes what Archidekt can accept in their CSV.
 */
function convertVariant(isFoil: boolean): string {
    if (isFoil) {
        return 'Foil';
    }
    return 'Normal';
}

/**
 * Convert a card from its Deckbox representation to its Archidekt representation.
 *
 * Returns null if there are any warning-level incompatibilities during conversion.
 * Invariant-breaking incompatibilities will simply exit early.
 *
 * Note: Deckbox does not properly number cards with multiple arts in the same set (i.e. Antiquities
 *       Urzatron Lands). This makes it impossible to convert them for import into Archidekt, and is
 *       unlikely to be fixed by them.
 * Note: The only way to differentiate between normal printings and Surge Foils of Warhammer 40,000
 *       cards is the unicode ★ in the collector number or the "Surge Foil" value in the Printing
 *       Notes field. Given I only have 1 card like this, I'm going to punt on it.
 * Note: Deckbox does not provide the year associated with "Friday Night Magic" promos, so they
 *       can't be tied to their actual Scryfall set without doing a lookup of some sort. I don't
 *       feel like constructing a table of all FNM promos right now.
 */
export function convertCard(deckboxCard: DeckboxCard): ArchidektCard | null {
    if (!isSupportedSet(deckboxCard.name, deckboxCard.setName)) {
        console.warn(
            `Archidect does not support set ${deckboxCard.setName}. Dropping ${deckboxCard.name}`);
        return null;
    }
    return new ArchidektCard(
        deckboxCard.quantity,
        convertName(deckboxCard.name),
        convertSetName(deckboxCard.setName),
        deckboxCard.collectorNumber,
        convertLanguage(deckboxCard.language),
        convertCondition(deckboxCard.condition),
        convertVariant(deckboxCard.foil));
}
