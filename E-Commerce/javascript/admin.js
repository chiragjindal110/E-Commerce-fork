var image = document.getElementById("image");
var name_product = document.getElementById("name");
var description = document.getElementById("description");
var submit_product = document.getElementById("submit-product");
submit_product.onclick = () => {
    var content = new FormData();
    var image_upload = image.files[0];
    content.append('image', image_upload);
    content.append('name', name_product.value);
    content.append('description', description.value);
    content.append('id',Date.now());
    console.log(image_upload);
    if (name_product.value.trim() == "" || description.value.trim() == " ") {
        alert("Fields can't be empty");
    }
    else {
        fetch("/addProduct", { method: "POST", body: content })
            .then(d => d.json())
            .then((d) => {
                if (d.flag)
                    console.log("product added successfully");
            })
    }
}