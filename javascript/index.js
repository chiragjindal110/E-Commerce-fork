var login_text = document.getElementById("login-text");
var signup_text = document.getElementById("signup-text");
var login = document.getElementById("login");
var signup = document.getElementById("signup");

login_text.onclick = () => {
    login.style.display = "none";
    signup.style.display = "flex";
}

signup_text.onclick = () => {
    login.style.display = "flex";
    signup.style.display = "none";
}

var login_submit = document.getElementById('login-submit');
var signup_submit = document.getElementById('signup-submit');

var login_email = document.getElementById('login-email');
login_submit.onclick = () => {
    var login_password = document.getElementById('login-password');
    fetch('/authenticate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: login_password.value, email: login_email.value }) })
        .then(res => res.json())
        .then((d) => {
            if (d.flag) {
                window.location.href = "/home";
            }
            else
                alert("No such profile found");
        })
}


signup_submit.onclick = () => {
    var username = document.getElementById('signup-name');
    var email = document.getElementById('signup-email');
    var password = document.getElementById('signup-password');
    var phone = document.getElementById('signup-phone');
    if (username.value.trim() == "" || email.value.trim() == "" || password.value.trim() == "" || phone.value =="") {
        alert("Fields can't be empty");
    }
    else {
        fetch('/validate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: username.value, email: email.value, password: password.value,phone:phone.value }) })
            .then(res => res.json())
            .then((d) => {
                if (d.flag) {
                    console.log("hiiii");
                    window.location.href = "/verifyMessagePage";
                }
                else {
                    alert("already exists");
                }
            })
    }
}

var skip = document.getElementById('continue');
skip.onclick = ()=>{
    window.location.href = "/skip";
}

// var forgot_password = document.getElementById("forgot-password");
// forgot_password.addEventListener("click",()=>{
//     if(login_email.value.trim()=="")
//     {
//         alert("Please Enter Email FIrst");
//     }
//     else{
//         fetch("/forgotpassword",{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:login_email.value})})
//         .then(res=>res.json())
//         .then((result)=>{
//             if(result.status){
//                 alert("Email has been sent to you,Kindly change your password from there");
//             }
//             else{
//                 alert("Email doesn't Exists");
//             }
//         })
//     }
// })