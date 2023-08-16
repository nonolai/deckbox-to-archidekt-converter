/** Dump an error and quit the program if something unrecoverable happens. */
export function panic(err: any, code: number) {
    console.error(err);
    process.exit(code);
}

