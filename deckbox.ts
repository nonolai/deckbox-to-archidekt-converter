import { CastingContext } from 'csv-parse';

/** string names of the fields in DeckboxCard. Used for to let csv-parse into objects. */
const CSV_HEADERS = [
    'quantity',
    'tradelistQuantity',
    'name',
    'setName',
    'collectorNumber',
    'condition',
    'language',
    'foil',
    'signed',
    'artistProof',
    'alteredArt',
    'misprint',
    'promo',
    'textless',
    'printingID',
    'printingNote',
    'price',
];

/** The shape of a single row in the Deckbox CSV. */
export type DeckboxCard = {
    quantity: number,
    tradelistQuantity: number, // Unused
    name: string,
    setName: string,
    collectorNumber: string,
    condition: string,
    language: string,
    foil: boolean, // 'foil' or empty
    signed: boolean,  // 'signed' or empty
    artistProof: boolean, // 'proof' or empty
    alteredArt: boolean, // 'altered' or empty
    misprint: boolean, // presumably, 'misprint' or empty
    promo: boolean, // presumably, 'promo' or empty
    textless: boolean, // presumably, 'textless' or empty
    printingID: string, // Unused
    printingNote: string, // Unused
    price: string, // Unused
}

/** Fields that actually are just value (true) or empty (false). */
const BOOLEAN_EXISTENCE_FIELDS: (number | string)[] = [
    'foil',
    'signed',
    'artistProof',
    'alteredArt',
    'misprint',
    'promo',
    'textless',
];

/** Options to use with csv-parse to parse the Deckbox CSV. */
export const DECKBOX_CSV_PARSE_OPTIONS = {
    delimiter: ',',
    from_line: 2,
    skip_empty_lines: true,
    columns: CSV_HEADERS,
    cast: (value: string, context: CastingContext) => {
        if (BOOLEAN_EXISTENCE_FIELDS.includes(context.column)) {
            return !!value;
        }
        return value;
    },
};

