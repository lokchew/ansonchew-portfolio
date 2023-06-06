
// Functions to call when the page finishes loading
document.addEventListener('DOMContentLoaded', () => {
    getProductJson();
    createFooter();
});

async function getProductJson() {
    const response = await fetch('json/products.json');
    const lst = await response.json(); 

    var productsContainer = document.querySelectorAll(".showcase-products");
    productsContainer.forEach(element => {
        var type = element.parentElement.getAttribute("product");
        var formattedType = type.replace("-", " ");
        var showcaseNum = lst[formattedType].length;
        if (productsContainer.length > 1 && lst[formattedType].length > 4) showcaseNum = 4;
        // console.log(showcaseNum)

        var images = "";
        for (var i = 0; i < showcaseNum; i++) {
            var product = lst[formattedType][i];
            images += `
            <div class="showcase-product">
                <div class="showcase-product-img"><div style="background-image: url('image/product/${type}/${product.img[0]}');">
                </div></div>
                <p>${product.name}</p>
                <button>View Details</button>
            </div>
            `
        }
        element.innerHTML = images;
    });
}

function createFooter() {
    var date = new Date;
    var footer = document.createElement("footer");
    footer.innerHTML = `
    <div id="footer-contact">
        <div>
            <p class="contact-header">Contact email:</p>
            <p>ansonchew.study@gmail.com</p>
        </div>
        <div>
            <p class="contact-header">Mobile:</p>
            <p>Avaliable via email</p>
        </div>
    </div>
    <span></span>
    <div id="footer-connect">
        <p>GET IN TOUCH</p>
        <div id="connect-platforms">
            <a style="background-image: url('image/footer/email.png');" href=""></a>
            <a style="background-image: url('image/footer/github.png');" href=""></a>
            <a style="background-image: url('image/footer/linkedin.png');" href=""></a>
        </div>
        <p style="font-size: 12px;">© ${date.getFullYear()}, Anson Chew</p>
    </div>
    `
    document.querySelector("body").appendChild(footer);
}