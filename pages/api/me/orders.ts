import type { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "lib/middleware/middlewares";
import methods from "micro-method-router";
import { getUserOrders } from "lib/controllers/order";

//endpoint que devuelve la data del user

async function getHandler(req: NextApiRequest, res: NextApiResponse, userData) {
  const orders = await getUserOrders(userData.userId);
  return res.send(orders);
}

const handler = methods({
  get: getHandler,
});

export default authMiddleware(handler);