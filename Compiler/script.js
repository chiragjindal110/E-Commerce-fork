var btn = document.getElementById("Compile-btn");
var text = document.getElementById("text");
var select = document.getElementById("select");
var key;
function setup(){
      var code = text.value;
      console.log(code);
      var selected = select.value;
      var data ={
      "code" : code+"" , langId : selected+""
       }
    let options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(data)
      }
      console.log(options);
    return options;
}



btn.addEventListener("click",function(){
  btn.disabled = true;
  let options = setup();
  call(options);
})

function call(options){
  fetch("https://codequotient.com/api/executeCode",options)
  .then(res => res.json())
  .then(function(data){
    console.log(data);
    key = data;
    setTimeout(request,3000);
  })
}

function request()
{
    fetch("https://codequotient.com/api/codeResult/" + key.codeId)
    .then(res => res.json())
    .then(
      function(d)
      {
        console.log(JSON.parse(d.data));
        var output = document.getElementById("output-div");
        var s = JSON.parse(d.data).output;
        if(s!="")
        output.innerHTML = s;
        else{
          output.innerHTML = JSON.parse(d.data).errors;
        }
        btn.disabled = false;
      }
    );  
  

}



