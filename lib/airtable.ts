import Airtable from "airtable";
var airtableBase = new Airtable({ apiKey: process.env.AIRTABLE_PRODUCTS_BASE }).base(
  process.env.AIRTABLE_BASE
);

export { airtableBase };


