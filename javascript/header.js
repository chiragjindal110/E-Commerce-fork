

function logout(){
    window.location.href = "/logout";
}
if(document.getElementById("login-register-btn"))
{
    document.getElementById("login-register-btn").onclick = ()=>{
        var login_signup_back = document.getElementById("login-signup-back");
            login_signup_back.style.display = "flex";
    } 
}
if(document.getElementById("My-orders"))
{
    document.getElementById("My-orders").onclick = ()=>{
        window.location.href = "/myorders";
    } 
}

