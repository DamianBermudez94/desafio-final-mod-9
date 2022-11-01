import mercadopago from "mercadopago";
import {Currency} from "mercadopago/shared/currency"
mercadopago.configure({
    access_token:process.env.MP_SECRET
});


//Busca una merchant order en Mp
export async function getMerchantOrder(id) {
  const res = await mercadopago.merchant_orders.get(id);
  console.log("soy la respuesta del merchar orders",res);
  
  return res.response;
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
      notification_url:"https://webhook.site/f5664f90-788f-4c21-9b00-a0e344321149"
      //notification_url:"https://dwf-m9-desafio-final.vercel.app/ipn/mercadopago?topic=merchant_order&id=6219077058" 
    }
    const res = await mercadopago.preferences.create(preferenceData);
    console.log("se ha creado una nueva referencia",res);
    
    return res.response;
  }