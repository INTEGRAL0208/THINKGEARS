export const N=(k:number)=>"₦"+(k/100).toLocaleString("en-NG");
export const COLS="sku,name,brand,category,price_kobo,stock,is_sample,(image IS NOT NULL) AS has_image";
