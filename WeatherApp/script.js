var input = document.getElementById("input");
var btn = document.getElementById("btn");
var temperature;
var id;
var isDay;
var mes;
var error = document.getElementById("error-city");


btn.addEventListener("click",function(){
  if(input.value=="")
  {
    alert("City Field Can't be empty");
  }
  else
  getData();
})

function getData(){
  var search = input.value;
  fetch("https://dataservice.accuweather.com/locations/v1/cities/search?apikey=OJcWl6wOA7Lyd4sqLQPhGWPCH19BVxaU&q=" + search+"")
  .then(res => res.json())
  .then(
    function(d){
      error.style.display="none";
        id = d[0].Country.ID;
      setTimeout(weather(d[0].Key),0);
      
    }
  )
  .catch(()=>{
    error.style.display="block";
    })
}

function weather(loc_key)
{
  fetch("https://dataservice.accuweather.com/currentconditions/v1/"+loc_key+"?apikey=OJcWl6wOA7Lyd4sqLQPhGWPCH19BVxaU")
  .then(res => res.json())
  .then(
    function (d){
        mes = d[0].WeatherText;
        isDay = d[0].IsDayTime;
        temperature = d[0].Temperature.Metric.Value;
        Append();
    }
  )
}

function Append()
{
  var result_div = document.getElementById("results-div");
  var div = document.createElement("div");
  var city = document.createElement("p");
  var id_div = document.createElement("div");
  var temperature_div = document.createElement("div");
  var temp_h2 = document.createElement("h2");
  var degree = document.createElement("div");
  var celsius = document.createElement("p");
  var icon = document.createElement("i");
  var message = document.createElement("p");
  div.classList.add("result");
  city.classList.add("city");
  id_div.classList.add("id");
  temperature_div.classList.add("temperature-div");
  temp_h2.classList.add("temperature");
  degree.classList.add("degree");
  celsius.classList.add("celsius");
  icon.classList.add("icon");
  message.classList.add("message");
  celsius.innerHTML = "C";
  city.innerHTML = input.value;
  id_div.innerHTML = id;
  temp_h2.innerHTML = temperature;
  if(isDay)
  {
    icon.classList.add("fa","fa-sun-o");
  }
  else{
    icon.classList.add("fa","fa-moon-o");
  }
  message.innerHTML = mes;
  div.appendChild(city);
  div.appendChild(id_div);
  div.appendChild(temperature_div);
  temperature_div.appendChild(temp_h2);
  temperature_div.appendChild(degree);
  temperature_div.appendChild(celsius);
  div.appendChild(icon);
  div.appendChild(message);
  result_div.appendChild(div);
  input.value = "";
}