import mercadopago from "mercadopago";
import {Currency} from "mercadopago/shared/currency"
mercadopago.configure({
    access_token:process.env.MP_SECRET
});
export async function getMerchantOrder(id) {
    const res = await mercadopago.merchant_orders.get(id);
    return res.body;
}
// Creamos un preferencia de compra
export async function generatePreference(productData,orderId) {
  //console.log("soy la data antes de la preferencia",productData.unit_price);
  
const preferenceData={
    items: [
        {
          title: productData.Name,
          description: productData.Description,
          picture_url: productData.Images.url,
          quantity:1,
          currency_id: "ARS" as Currency,
          unit_price:productData.unit_price,
        },
      ],
      back_urls: {
        success: "https://damianbermudezdev.es",
      },
      external_reference: orderId,
      notification_url:"https://dwf-m9-desafio-final.vercel.app/ipn/mercadopago?topic=merchant_order&id=6026542508" 
    }
    //console.log("soy la preferencia data",preferenceData);
    //console.log("soy la data antes de la preferencia",productData.unit_price);
    
    const res = await mercadopago.preferences.create(preferenceData);
    return res.response;
  }