import type { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "lib/middleware/middlewares";
import { orderProductById } from "lib/controllers/order";
import methods from "micro-method-router";

async function postHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  userData
) {
  const { productId } = req.query as any;
  try {
    const response = await orderProductById({
      productId,
      userId: userData.userId,
    });
    res.send(response);
  } catch (error) {
    res.send({ message: error });
  }
}

const handler = methods({
  post: postHandler,
});

export default authMiddleware(handler);