import { ErrorCodes } from './errors';
import { panic } from './utils';

/** Arguments to the application. */
export class Args {
    inputFile: string;
    outputFile: string;

    private constructor(inputFile: string, outputFile: string) {
        this.inputFile = inputFile;
        this.outputFile = outputFile;
    }

    public static parseArgs(): Args {
        if (process.argv.length !== 4) {
            panic('Usage: npx ts-node main.ts <input file> <output file>', ErrorCodes.MISSING_ARG);
        }
        return new Args(process.argv[2], process.argv[3]);
    }
}

