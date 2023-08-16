/** Representation of a card as understood by Archidekt. */
export class ArchidektCard {
    quantity: number;
    name: string;
    setName: string;
    collectorNumber: string;
    language: string;
    condition: string;
    variant: string;

    constructor(
            quantity: number,
            name: string,
            setName: string,
            collectorNumber: string,
            language: string,
            condition: string,
            variant: string) {
        this.quantity = quantity;
        this.name = name;
        this.setName = setName;
        this.collectorNumber = collectorNumber;
        this.language = language;
        this.condition = condition;
        this.variant = variant;
    }

    /** Dumps this object as an object literal to serialize nicely with csv-stringify. */
    intoObject() {
        return {
            Quantity: this.quantity,
            Name: this.name,
            'Set Name': this.setName,
            'Collector Number': this.collectorNumber,
            'Foil/Variant': this.variant,
            Condition: this.condition,
            Language: this.language,
        }
    }
}
