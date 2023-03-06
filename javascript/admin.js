document.getElementById("submit").addEventListener("click",()=>{
    
    var password = document.getElementById("password-input").value;
    if(password.trim()=="")
    {
        alert("password field can't be empty");
    }
    else{
        window.location.href = `/verifyadmin?password=${password}`
    }
})