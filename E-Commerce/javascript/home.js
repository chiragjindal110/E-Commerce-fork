localStorage.setItem("index", JSON.stringify({ start: 5, end: 9 }));

var products_list;
fetch("/getProducts", { method: "POST" })
    .then(res => res.json())
    .then((d) => {
        products_list = d;
        for (let i = 0; i <= 4; i++) {
            console.log(i,d[i]);
            AppendProduct(d[i]);
        }
    })


function AppendProduct(product) {
    var p = document.createElement("div");
    p.classList.add("product");
    p.setAttribute("id", product.id);
    var image = document.createElement("img");
    image.setAttribute("src", product.src);
    image.setAttribute("width", "250px");
    image.setAttribute("height", "200px")
    var product_name = document.createElement("h2");
    product_name.classList.add("product-name");
    product_name.innerText = product.name;
    var btns = document.createElement("div");
    var description_btn = document.createElement("button");
    description_btn.classList.add("description-btn");
    description_btn.innerText = "View Details";
    var add_to_cart_btn = document.createElement("button");
    add_to_cart_btn.classList.add("add-to-cart");
    add_to_cart_btn.innerText = "Add to cart";
    btns.appendChild(description_btn);
    btns.appendChild(add_to_cart_btn);

    var products = document.getElementById("products");
    p.appendChild(image)
    p.appendChild(product_name)
    p.appendChild(btns);
    products.append(p);

    var description_outer_div = document.createElement("div");
    description_outer_div.classList.add("description_outer_div");
    var description_div = document.createElement("div");
    description_div.classList.add("description_div");
    var descr_inner_div = document.createElement("div");
    descr_inner_div.classList.add("description_inner_div");
    var description_image = document.createElement("img");
    var description_name = document.createElement("h2");
    var description_descr = document.createElement("p");
    var description_close = document.createElement("i");

    description_image.setAttribute("src",product.src);
    description_image.setAttribute("width","350px");
    description_image.setAttribute("height","250px");
    description_name.innerText = product.name;
    description_descr.innerText = product.description;
    description_close.classList.add("fa","fa-close","descr_close");
    description_div.appendChild(description_close);
    descr_inner_div.appendChild(description_image);
    descr_inner_div.appendChild(description_name);
    descr_inner_div.appendChild(description_descr);
    description_div.appendChild(descr_inner_div);
    description_outer_div.appendChild(description_div);
    document.body.append(description_outer_div);

    description_btn.onclick =()=>{
        description_outer_div.style.display = "flex";
    }
    description_close.onclick = ()=>{
        description_outer_div.style.display = "none";
    }


}

var load_more = document.getElementById("load_more");
load_more.onclick = () => {
    var index = JSON.parse(localStorage.getItem("index"));
    var i = index.start, j;
    if (i < products_list.length) {
        if (index.end > products_list.length) {
            j = products_list.length - 1;
        }
        else { j = index.end; }
        for (; i <= j; i++) {
            AppendProduct(products_list[i]);
        }
        if (index.end < products_list.length - 1) {
            index.start += 5;
            index.end += 5;
            localStorage.setItem("index", JSON.stringify({ start: index.start, end: index.end }));
        }
        else {
            load_more.style.display = "none";
        }

    }

}