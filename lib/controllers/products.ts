import { Product } from "lib/models/products";

export async function searchProducts(
  query: string,
  limit: number,
  offset: number,
  
): Promise<object> {
  //trae los resultados del model
  const hits = await Product.getProductsByQuery({ query, limit, offset });
  console.log("soy los hits",hits);
  
  const hitsResults = hits.hits as any;
  console.log("soy los hitsresults",hitsResults);
  
  return {
    results:hitsResults.filter((p)=>p.in_stock),
    pagination: {
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
  //console.log("soy los productos",products);
  
  /*const ids = products.map((prod) => {
    return prod.objectID;
  });
  console.log("soy los products",ids);*/
  
  return products;
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