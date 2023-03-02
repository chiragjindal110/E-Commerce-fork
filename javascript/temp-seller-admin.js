var product_submit_btn = document.getElementById("product-submit-btn");
var product_pic = document.getElementById("product_pic");
product_submit_btn.addEventListener("click", (event) => {
    var product_name = document.getElementById("product-name");
    var product_description = document.getElementById("product-description");
    var product_stock = document.getElementById("product-stock");
    var product_price = document.getElementById("product-price");
    if (product_pic.value=="" || product_description.value.trim() == "" || product_name.value.trim() == "" || product_price.value.trim() == "" || product_price.value.trim() == "") {
        alert("Fields can't be empty");
    }
    else {
        var content = new FormData();
        var picname = product_pic.files[0];
        content.append("product_name", product_name.value);
        content.append("product_description", product_description.value);
        content.append("product_stock", product_stock.value);
        content.append("product_price", product_price.value);
        content.append("picname", picname);
        fetch("/addproduct", { method: 'POST',body:content})
        .then(res=>res.json())
        .then((data)=>{
            if(data.status)
            {
                alert("product added successfully");
            }
            else{
                alert("Something went wrong");
            }
        })
    }
})

product_pic.addEventListener("change",()=>{
    console.log("in change");
    var image = document.getElementById("image");
    var reader = new FileReader();
    console.log(product_pic,product_pic.files);
    reader.readAsDataURL(product_pic.files[0]);
    reader.addEventListener("load",()=>{
        image.style.backgroundImage = `url(${reader.result})`;
        image.style.backgroundSize = "cover";
        image.style.backgroundRepeat= "no-repeat";
        
    })
})