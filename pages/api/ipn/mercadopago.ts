import { getMerchantOrder  } from "lib/mercadopago";
import {Order} from "lib/models/order";
import {User} from "lib/models/user";
import { sendMail } from "lib/sendgrid";
import type { NextApiRequest, NextApiResponse } from "next";

//WebHook que checkea el estado de una orden de compra

  export default async function (req: NextApiRequest, res: NextApiResponse) {
      const { id, topic } = req.query;
      if (topic === "merchant_order") {
        const existOrderMP = await getMerchantOrder(id);
        if (existOrderMP.order_status == "paid") {
          //Es el ID que guardamos como referencia en nuesta DB
          const orderId = existOrderMP.external_reference;
          console.log("soy el order id",orderId);
          
          //En external reference habíamos guardado la referencia al registro de nuesta DB.
          const myOrder = new Order(orderId);
          //Traigo la data de ese registro
          await myOrder.pull();
          //Modifico el campo del estado del pago
          myOrder.data.status = "closed";
          
          //Actualizada la data modificada en nuestra DB
          await myOrder.push();
          const userId = myOrder.data.userId;
          const user = new User(userId);
          //await user.pull();
         const userEmail = user.data.email;
          sendMail(userEmail);
          sendMail({
           
            message: `Tu pago de $${myOrder.data.productData.unit_price} por la compra de ${myOrder.data.productData.Name} ha sido acreditado, gracias por tu compra`,
            from: process.env.SENDGRID_EMAIL,
            to: myOrder.data.user.email,
            subject: "Pago exitoso",
         
          });
          res.send({ payment: true });
        } else {
          res.send({ payment: "pending" });
        }
      } else {
        res.status(400).json({ message: "Hola putines" });
      }
}