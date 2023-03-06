var apply_btn = document.getElementById("seller-apply-btn");
var seller_enterprise_name = document.getElementById("seller_enterprise_name");
var seller_location = document.getElementById("seller_location");
var seller_gst = document.getElementById("seller_gst");


apply_btn.addEventListener("click",(event)=>{
    if(seller_enterprise_name.value.trim()=="" || seller_location.value.trim()=="" || seller_gst.value.trim()=="")
    {
        alert("fields can't be empty");
    }
    else
    {
        fetch("/addseller",{ method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({name:seller_enterprise_name.value,location:seller_location.value,gst:seller_gst.value})})
        .then(res=>res.json())
        .then((result)=>{
            if(result.status)
            {
                window.location.href= "/sellerrequestpage";
            }
            else{
                alert("something went wrong");
            }
        })
    }
    
})