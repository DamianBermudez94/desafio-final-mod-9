import type { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "lib/middleware";
import { orderProductById } from "lib/controllers/order";
import methods from "micro-method-router";

async function postHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  userData
) {
  const { productId } = req.query as any;
  console.log("Soy el product id",productId);
  
  try {
    const response = await orderProductById({
      productId,
      userId: userData.userId,
    });
    console.log("Soy la orden creada",response);
    
    res.send(response);
  } catch (error) {
    res.send({ message: error });
  }
}

const handler = methods({
  post: postHandler,
});

export default authMiddleware(handler);