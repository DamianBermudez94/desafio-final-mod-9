import { SearchIndex } from "algoliasearch";
import { productsIndex } from "lib/algolia";


type getProductsProps = {
  query: string;
  limit: number;
  offset: number;

};
// Funcion para conectarnos al indice de algolia.
// Usamos el metodo pull() para obtener los productos por el ID de algolia.
// Usamos el metodo getProductByQuery() y getAll() para buscar o traer todos desde algolia.
export class Product {
  index: SearchIndex;
  data: any;
  id: string;
  constructor(id) {
    this.id = id;
    this.index = productsIndex;
  }
  async pull() {
    const product = await this.index.getObject(this.id);
    this.data = product;

  }

  static async getProductsByQuery({ query, limit, offset }: getProductsProps) {
    const hits = await productsIndex.search(query, {
      length: limit,
      offset,

    });
    console.log("soy los hits", hits);

    return hits;
  }
  static async getAll() {
    let hits = [];
    await productsIndex.browseObjects({
      query: "", // Empty query will match all records

      batch: (batch) => {
        hits = hits.concat(batch);
      },
    });


    return await hits;
  }
}

// Modelo que sirve para modelar como ser van a guardar las imagenes en mongoose
import mongoose, { Schema, model, models } from "mongoose";

const ProductoSchema = new Schema({
  nombre: { type: String, required: true },
  precio: { type: Number, required: true },
  descripcion: { type: String, required: true },
  imagen: { type: String, required: true },
  tipo: { type: String },
  color: { type: String },
  enStock: { type: Boolean, default: true },
}, { timestamps: true });

export const Producto = models.Producto || model("Producto", ProductoSchema);
