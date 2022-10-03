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
const preferenceData={
    items: [
        {
          title: productData.Name,
          description: productData.Description,
          picture_url: productData.Images.url,
          quantity:1,
          currency_id: "ARS" as Currency,
          unit_price:productData.Unit_cost,
        },
      ],
      back_urls: {
        success: "https://damianbermudezdev.es",
      },
      external_reference: orderId,
      notification_url:"https://dwf-m9-desafio-final.vercel.app/api/ipn/mercadopago?topic=merchant_order&id=5878055498" 
    }
    console.log("soy la preferencia data",preferenceData);
    
    const res = await mercadopago.preferences.create(preferenceData);
    return res.response;
  }