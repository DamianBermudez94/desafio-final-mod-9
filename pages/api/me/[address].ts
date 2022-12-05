import type { NextApiRequest, NextApiResponse } from "next";
import {
  authMiddleware,
  querySchemaMiddleware,
  schemaMiddleware,
} from "lib/middlewares";
import { patchUserAddressData } from "lib/controllers/user";
import methods from "micro-method-router";
import * as yup from "yup";

let bodySchema = yup
  .object()
  .shape({
    email: yup.string().email(),
    address: yup.string(),
    
  })
  .noUnknown(true)
  .strict();
let querySchema = yup
  .string()
  .matches(/(email|address)/, "la url debe ser /email o /address");
console.log("soy el bodySchema",bodySchema);

async function patchHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  userData
) {
  const { address } = req.query;
  const data = req.body;
console.log("soy la direccion y la data",address);

  if (data[address as string]) {
    const userNewData = await patchUserAddressData({
      userId: userData.userId,
      address,
      data,
    });
   
    
    res.send(userNewData);
    console.log("soy la data nueva",userNewData);
  } else {
    res.status(400).send("los datos del body deben coincidir con la url");
  }
}

const patchHandlerValidated = querySchemaMiddleware(
  querySchema,
  schemaMiddleware(bodySchema, patchHandler)
);
const handler = methods({
  patch: patchHandlerValidated,
});

export default authMiddleware(handler);