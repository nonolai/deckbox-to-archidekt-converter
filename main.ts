/**
 * Utility to convert a Deckbox collection export CSV to a CSV suitable for importing the same
 * collection into Archidekt.
 *
 * When importing into Archidekt, use 7 columns in the following order:
 * 
 * Quantity, Name, Set Name, Collector Number, Foil/Variant, Condition, Language
 *
 * Usage:
 *   npx ts-node main.ts <input file> <output file>
 */

import { parse } from 'csv-parse';
import { stringify } from 'csv-stringify';

import { ArchidektCard } from './archidekt';
import { Args } from './args';
import { convertCard } from './convert';
import { DeckboxCard, DECKBOX_CSV_PARSE_OPTIONS } from './deckbox';
import { ErrorCodes } from './errors';
import { panic } from './utils';

import * as fs from 'fs';

function dumpCSV(outputFile: string, cards: ArchidektCard[]) {
    const objs = 
    stringify(
        cards.map(card => card.intoObject()),
        { header: true },
        (err: Error | undefined, data: string) => {
            if (err) {
                panic(err, ErrorCodes.FAILED_TO_SERIALIZE);
            }
            fs.writeFile(outputFile, data, (err: Error | null) => {
                if (err) {
                    panic(err, ErrorCodes.FAILED_TO_WRITE);
                }
            });
        });
}

function main(args: Args) {
    let cards: ArchidektCard[] = [];
    fs.createReadStream(args.inputFile)
        .pipe(parse(DECKBOX_CSV_PARSE_OPTIONS))
        .on('data', (row: DeckboxCard) => {
            const converted = convertCard(row);
            if (converted) {
                cards.push(converted);
            }
        })
        .on('end', (_: any) => dumpCSV(args.outputFile, cards));
}

main(Args.parseArgs());
