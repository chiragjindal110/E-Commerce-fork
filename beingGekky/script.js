var bool = true;
function change()
{
  if(bool)
  {
    var slider = document.getElementById("slider");
  slider.style.display = "block";
  var element = document.getElementById("slider-open1");
  element.style.display = "none";
  bool = false;
  }
  else{
    var slider = document.getElementById("slider");
  slider.style.display = "none";
  var element = document.getElementById("slider-open1");
  element.style.display = "block";
  element.style.top = "0";
  bool = true;
  }
  
}