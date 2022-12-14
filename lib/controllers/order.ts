import { generatePreference, getMerchantOrder } from "lib/mercadopago";
import { sendMail } from "lib/sendgrid";
import { Order } from "lib/models/order";
import { getProductById } from "./products";
import { getUserData } from "./user";

export async function generateOrder(data) {
  //creo una orden de compra con estado pendiente
  const order = await Order.createNewOrder({
    ...data,
    status: "pending",
    createdAt: new Date(),
  });
  return order;
}

export async function getOrderById(id: string) {
  const order = new Order(id);
  await order.pull();

  if (order.data) {
    return order.data;
  } else {
    throw "La orden no existe";
  }
}
export async function getUserOrders(userId: string) {
  const userOrders = await Order.getUserOrdersById(userId);
  return userOrders;
}

export async function orderProductById({ productId, userId }) {
  const product = await getProductById(productId);

  if (!product) {
    throw "El producto no existe";
  }

  try {
    const user = await getUserData(userId);
    console.log("soy el user",user);
    
    const orderData = { user, productData: product };
    const order = await generateOrder(orderData);
    console.log("Soy la orden del usuario",order);

    //un vez creada la orden genero la preferencia en mercadoPago
    const preference = await generatePreference(product, order.id);

    //retorno el url de pago
    return { url: preference.init_point, orderId: order.id };
  } catch (error) {
    return error;
  }
}

//cambia el status de la orden a cerrado y manda el mail al user y al interno
async function handlePaidOrder(order) {

  const orderId = order.external_reference;

  const myOrder = new Order(orderId);
  
  
  await myOrder.pull();
  myOrder.data.status = "closed";
  await myOrder.push();

  const mail = {
    message: `Tu pago de $${myOrder.data.productData.unit_price} por la compra de ${myOrder.data.productData.Name} ha sido acreditado, gracias por tu compra`,
    from: process.env.SENDGRID_EMAIL,
    to: myOrder.data.user.email,
    subject: "Pago exitoso",
  };
  await sendMail(mail);

  const mail2 = {
    message: `Se recibio un pago de $${myOrder.data.productData.unit_price} por la compra de ${myOrder.data.productData.Name}, numero de orden ${myOrder.id} `,
    from: process.env.SENDGRID_EMAIL,
    to: "ecommerce@ventas.com",
    subject: "Pago exitoso",
  };
  await sendMail(mail2);
  return "compra exitosa";
}

async function handleInProcessOrder(order) {
  const orderId = order.external_reference;
  const myOrder = new Order(orderId);
  await myOrder.pull();
  const mail = {
    message: `Tu pago de $${myOrder.data.productData.unit_price} por la compra de ${myOrder.data.productData.Name} esta siendo procesado, te avisaremos por mail cuando se haga efectivo`,
    from: process.env.SENDGRID_EMAIL,
    to: myOrder.data.user.email,
    subject: "Pago pendiente",
  };
  await sendMail(mail);
  return "pago en proceso";
}

export async function orderPaymentNotification(
  id: string
): Promise<string | boolean> {
  //objeto con las funciones a ejecutar segun el order status
  const actions = {
    paid: handlePaidOrder,
    payment_in_process: handleInProcessOrder,
  };
  const order = await getMerchantOrder(id);


  const action = actions[order.order_status];
  
  
  return action ? await action(order) : false;
}
