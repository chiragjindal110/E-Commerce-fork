var your_orders_div = document.getElementById("your_orders_div");
fetch("/getsellerorders",{method:'GET'})
.then(result=>result.json())
.then((orders)=>{
    //try{
        console.log(orders);
        orders.forEach((order)=>{
            AppendOrders(order);
        })
    //}
    // catch(error)
    // {
    //     alert("Something Went Wrong!!")
    // }
})

function AppendOrders(order){
    var cart_item_div = document.createElement("div");
    var product_image = document.createElement("img");
    var product_details_div = document.createElement("div");
    var product_name = document.createElement("h1");
    var quantity_div = document.createElement("div");
    var quantity = document.createElement("p");
    var product_price = document.createElement("h1");
    var order_status = document.createElement("h1");
    var order_date = document.createElement("p");
    var customer_address = document.createElement("p");

    quantity.innerText = "Order Quantity: "+order.quantity * 1 + "Kgs";
    product_name.innerText = order.product_name;
    product_image.setAttribute("src", order.product_pic);
    product_price.innerText = `₹${order.item_value}`;
    customer_address.innerText = "Cutomer Address: " + order.customer_address;
    var status = order_status;
    status = JSON.parse(order.status);
    order_status.innerText = status.status;
    order_status.style.color = "green";
    order_date.innerText = "Order Placed on: "+order.order_time.split("T")[0];

    product_image.style.minWidth = "250px ";
    product_image.style.maxWidth = "250px ";
    product_image.style.minHeight = "250px ";
    product_image.style.maxHeight = "250px ";
    cart_item_div.classList.add("cart-item-div");
    product_image.classList.add("product-image");
    product_details_div.classList.add("product-details-div");
    product_name.classList.add("order-product-name");
    quantity_div.classList.add("quantity-div");
    quantity.classList.add("quantity");
    product_price.classList.add("product-price");

    quantity_div.appendChild(quantity);
    product_details_div.appendChild(product_name)
    product_details_div.appendChild(quantity_div);
    product_details_div.appendChild(customer_address);
    product_details_div.appendChild(order_status);
    product_details_div.appendChild(order_date);
    
    cart_item_div.appendChild(product_image);
    cart_item_div.appendChild(product_details_div);
    cart_item_div.appendChild(product_price);
    your_orders_div.appendChild(cart_item_div);

}