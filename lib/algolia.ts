import algoliasearch from "algoliasearch";

const client = algoliasearch(
  process.env.ALGOLIA_APP_ID,
  process.env.ALGOLIA_ADMIN_API_KEY
);

export const  productsIndex = client.initIndex("products");
console.log("soy algolia",productsIndex);


