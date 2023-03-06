var products_cart = document.getElementById("products-cart");
var order_value = document.getElementById("order-value");
var order_item = document.getElementById("order-item");
var home_btn = document.getElementById("home-btn");
var placeorder = document.getElementById("placeorder-btn");
home_btn.addEventListener("click", () => {
    window.location.href = "/";
})
fetch("/getcart", { method: 'GET' })
    .then(res => res.json())
    .then((result) => {
        result.forEach((product) => {
            AppendProduct(product);
        })


    })

function AppendProduct(product) {
    var cart_item_div = document.createElement("div");
    var product_image = document.createElement("img");
    var product_details_div = document.createElement("div");
    var product_name = document.createElement("h1");
    var seller_name = document.createElement("p");
    var product_description = document.createElement("p");
    var in_stock = document.createElement("h2");
    var quantity_div = document.createElement("div");
    var quantity_decrease_btn = document.createElement("button");
    var quantity = document.createElement("p");
    var quantity_increase_btn = document.createElement("button");
    var remove_btn = document.createElement("button");
    var product_price = document.createElement("h1");

    quantity.innerText = product.quantity * 1;
    product_description.innerText = product.product_description;
    product_name.innerText = product.product_name;
    product_image.setAttribute("src", product.product_pic);
    product_price.innerText = `₹${product.price}/kg`;
    seller_name.innerText = "SELLER: chirag Enterprises";
    if (product.stock > product.quantity) {
        in_stock.innerText = "IN STOCK";
        in_stock.style.color = "green";
    }
    else if(product.stock==0){
        in_stock.innerText = "OUT OF STOCK";
        in_stock.style.color = "red";
        quantity.innerText = product.stock * 1;
        quantity_increase_btn.disabled = true;
    }
    else {
        in_stock.innerText = "NO MORE PRODUCTS CAN BE ADDED";
        in_stock.style.color = "red";
        quantity.innerText = product.stock * 1;
        quantity_increase_btn.disabled = true;
    }

    quantity_decrease_btn.innerText = "-";
    quantity_increase_btn.innerText = "+";
    remove_btn.innerText = "Remove";

    product_image.style.minWidth = "300px ";
    product_image.style.maxWidth = "300px ";
    product_image.style.minHeight = "300px ";
    product_image.style.maxHeight = "300px ";
    product_description.style.marginBottom = "0";
    in_stock.style.marginTop = "0";
    cart_item_div.classList.add("cart-item-div");
    product_image.classList.add("product-image");
    product_details_div.classList.add("product-details-div");
    product_name.classList.add("product-name");
    seller_name.style.margin = "5px 0";
    quantity_div.classList.add("quantity-div");
    quantity_decrease_btn.classList.add("quantity-change-btn", "decrease-btn");
    quantity_increase_btn.classList.add("quantity-change-btn");
    quantity.classList.add("quantity");
    remove_btn.classList.add("remove-btn");
    product_price.classList.add("product-price");

    quantity_div.appendChild(quantity_decrease_btn);
    quantity_div.appendChild(quantity);
    quantity_div.appendChild(quantity_increase_btn);
    product_details_div.appendChild(product_name)
    product_details_div.appendChild(seller_name)
    product_details_div.appendChild(product_description)
    product_details_div.appendChild(in_stock)
    product_details_div.appendChild(quantity_div)
    product_details_div.appendChild(remove_btn);
    cart_item_div.appendChild(product_image);
    cart_item_div.appendChild(product_details_div);
    cart_item_div.appendChild(product_price);
    products_cart.appendChild(cart_item_div);
    console.log(order_value.innerText);
    order_item.innerText = order_item.innerText * 1 + 1;
    order_value.innerText = order_value.innerText * 1 + (product.price * product.quantity);


    quantity_decrease_btn.addEventListener("click", () => {
        fetch("/cartquantitychange", { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ product_id: product.product_id, change: -1 }) })
            .then(res => res.json())
            .then((result) => {
                if (result.status) {
                    quantity.innerText = quantity.innerText * 1 - 1;
                    if (quantity.innerText == 0) {
                        fetch('/removeproductfromcart', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ product_id: product.product_id, }) })
                            .then(res => res.json())
                            .then((result) => {
                                if (result.status) {
                                    products_cart.removeChild(cart_item_div);
                                    order_item.innerText = order_item.innerText * 1 - 1;
                                }
                            })
                    }
                    if (quantity.innerText * 1 + 1 <= product.stock) {
                        in_stock.innerText = "IN STOCK";
                        in_stock.style.color = "green";
                        quantity_increase_btn.disabled = false;
                    }
                    order_value.innerText = order_value.innerText * 1 - product.price * 1;

                }
            })
    })
    quantity_increase_btn.addEventListener("click", () => {
        fetch("/cartquantitychange", { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ product_id: product.product_id, change: 1 }) })
            .then(res => res.json())
            .then((result) => {
                if (result.status) {
                    if (quantity.innerText * 1 + 1 > product.stock) {
                        in_stock.innerText = "NO MORE PRODUCTS CAN BE ADDED";
                        in_stock.style.color = "red";
                        quantity_increase_btn.disabled = true;
                    }
                    quantity.innerText = quantity.innerText * 1 + 1;
                    order_value.innerText = order_value.innerText * 1 + product.price * 1;
                }
            })
    })
    remove_btn.addEventListener("click", () => {
        fetch('/removeproductfromcart', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ product_id: product.product_id, }) })
            .then(res => res.json())
            .then((result) => {
                if (result.status) {
                    products_cart.removeChild(cart_item_div);
                    order_value.innerText = order_value.innerText * 1 - (product.price * product.quantity);
                    order_item.innerText = order_item.innerText * 1 - 1;
                }
            })
    })

}

placeorder.addEventListener("click", () => {
    fetch("/getcart", { method: 'GET' })
        .then(res => res.json())
        .then((result) => {
            localStorage.setItem("products", JSON.stringify(result));
            window.location.href = "/checkout";
        })
})