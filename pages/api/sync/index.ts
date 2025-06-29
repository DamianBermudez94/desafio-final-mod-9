import type { NextApiRequest, NextApiResponse } from "next";
import { airtableBase } from "lib/airtable";
import { productsIndex } from "lib/algolia";

//sincroniza las bases de datos de airtable y algolia
//se ejecuta periodicamente desde un cron
export default function (req: NextApiRequest, res: NextApiResponse) {
  airtableBase("Furniture")
    .select()
    .eachPage(
      async function page(records, fetchNextPage) {
        // This function (`page`) will get called for each page of records.

        const objects = records.map((r) => {
          //console.log("soy los campos de la base",r.fields);
          //console.log("soy el object id",r.id);

          return {
            objectID: r.id,
            ...r.fields,
          };
        });
        //console.log("soy los campos de la base",objects);
        await productsIndex.saveObjects(objects);
        fetchNextPage();
      },
      function done(err) {
        if (err) {
          console.error(err);
          return;
        }
      }
    );
  res.send({ message: "todo salio ok" });
}