import type { NextApiRequest, NextApiResponse } from "next";

import { send } from "micro";
import methods from "micro-method-router";
import { getFeaturedProducts } from "lib/controllers/products";

module.exports = methods({
  async get(req: NextApiRequest, res: NextApiResponse) {
    try {
      const product = await getFeaturedProducts();
      return send(res, 200, product);
    } catch (error) {
      return send(res, error.status, { message: error.message });
    }
  },
});