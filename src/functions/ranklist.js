import product from "../model/ranks.js";
import Category from "../model/category.js";

async function createRanklist(){
// Get active categories first
const categories = await Category.find({isActive: true});
const categoryNames = categories.map(cat => cat.name);

// Get products from active categories, fallback to "rank" for backward compatibility
const array = await product.find({
    $or: [
        {type: {$in: categoryNames}},
        {type: "rank"} // backward compatibility
    ]
});

let hero = ''
   for (let index = 0; index < array.length; index++) {
    const element = array[index];
    const banner = element.preview.banner
    console.log(banner);
    const title = element.name
    const short_desc = element.short_desc
    const product_id = element.product_id
    const old_price = element.price.amount
    const off = element.price.off
    const price = Math.floor(old_price - ((old_price/100)*off))


    const temp = `
      <div class="main2_feature" onclick="redi('${product_id}')">
        <img class="main2_feature_img" alt="Feature Image" src="${banner}">
        <a class="main2_feature_headline">${title}</a>
        <a class="main2_feature_text">${short_desc}</a>
        <span class="prize_box">
          <span class="off"><p class="percent_off"><b>${off}%</b>off</p><p class="old_prize">₹${old_price}</p></span>
          <h1 class="new_prize">₹${price}</h1>
        </span>
        <p class="read_more">Show More <img src="media/svg/arrow.svg" alt=""></p>
      </div>`
    hero = hero + temp
   }
   return hero
}

export default createRanklist;