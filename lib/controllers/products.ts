import { Product, Producto } from "lib/models/products";
import { connectDB } from "../mongoose";



export async function searchProducts(
  query: string,
  limit: number,
  offset: number,

): Promise<object> {
  //trae los resultados del model
  const hits = await Product.getProductsByQuery({ query, limit, offset });



  const hitsResults = hits.hits as any;



  return {
    results: hitsResults.filter((p) => p.In_stock),
    pagination: {
      results: hitsResults.length,
      offset,
      limit,
      total: hits.nbHits,
    },
  };
}

export async function getProductById(id: string) {
  const product = new Product(id);
  await product.pull();
  return product.data;
}
export async function getAllProductsId() {
  const products = await Product.getAll();
  const ids = products.map((prod) => {
    return prod.objectID;
  });
  return ids;
}
export async function getFeaturedProducts() {
  const hits = await Product.getProductsByQuery({
    query: "",
    limit: 2,
    offset: 0,
  });
  const hitsResults = hits.hits as any;


  return {
    results: hitsResults,
  };
}

// Funcion que guarda productos con mongoDB
// Se creo con la intencion de que maneje los productos que va subiendo el usuario
// y que despues se sincronice con algolia

export async function saveProductToDB({ nombre, precio, descripcion, imagen, tipo, color, enStock }) {
  if (!nombre || !precio || !descripcion || !imagen) {
    throw new Error("Faltan campos obligatorios");
  }
  await connectDB();
  const nuevo = new Producto({ nombre, precio, descripcion, imagen, tipo, color, enStock });
  await nuevo.save();
  return nuevo;
}