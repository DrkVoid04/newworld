import product from "../model/ranks.js";



async function cardBuilder(pro) {
    console.log(pro);
    const main = await product.findOne({product_id:pro})
    if(!main){
        console.log("Product not found");
        return;
    }
    const title = main.name
    const desc = main.desc
    const img_1 = main.preview.RankImage
    const img_2 = main.preview.ChatImage
    const img_3 = main.preview.PlayerPreview
    const banner = main.preview.banner
    console.log(banner);
    const product_id = main.product_id
    const old_price = main.price.amount
    const off = main.price.off
    const price = Math.floor(old_price - ((old_price/100)*off))
    let perks_structure = ""
    const perk_array = main.perks
    for (let index = 0; index < perk_array.length; index++) {
        const perks = perk_array[index];
        perks_structure += `<h4>+ ${perks}</h4>`
    }
    return `        <div class="main-banner">
            <img src="${banner}" alt="">
        </div>
        <div class="main-details">
            <h1>${title}</h1>
            <h2>${desc}</h2>
            <h3>Perks</h3>
            ${perks_structure}
            <h3>Previews</h3>
            <div class="image-section">
                <div class="tab-image image"><img src="${img_1}" alt=""></div>
                <div class="chat-image image"><img src="${img_2}" alt=""></div>
            </div>
            <div class="payment-option-mobile payment-option" >
                <div class="details">
                    <div class="off">
                        <h5><b>${off}%</b> off</h5>
                        <h4>₹${old_price}.00</h4>
                    </div>
                    <h1>₹${price}.00</h1>
                </div>
                <button onclick="red('${product_id}')">Buy Now</button>
            </div>
            <div class="payment-option-pc payment-option">
                <div class="details">
                    <div class="off">
                        <h5><b>${off}%</b> off</h5>
                        <h4>₹${old_price}.00</h4>
                    </div>
                    <h1>₹${price}.00</h1>
                </div>
                <button onclick="red('${product_id}')">Buy Now</button>
            </div>
        </div>`
}

export default cardBuilder