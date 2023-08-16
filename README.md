# deckbox-to-archidekt-convert

## Motivation

Archidekt is my favorite MtG tool, but migration from Deckbox's inventory tool is currently a very painful process. This repo isn't attempting to make a 100% correct converter. Instead, this repo aims to provide a proof-of-concept that hopefully eases the burden on the Archidekt developers to develop an easier migration path in the future.

It was built using TypeScript assuming that 1. JavaScript or TypeScript are what the Archidekt front-end is written in and that 2. it's easier to go from TypeScxript to JavaScript than vice versa.

## Usage

```
% npm install
% npx ts-node main.ts <input file> <output file>
```

Upload output to Archidekt with these 7 columns: Quantity, Name, Set Name, Collector Number, Foil/Variant, Condition, Language.
