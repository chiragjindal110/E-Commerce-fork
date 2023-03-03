var ms = 0,sec = 0,min =0;
var stopwatch = document.getElementById("stopwatch");
var startbtn = document.getElementById("start-btn");
var outer_start_btn = document.getElementById("outer-start-btn");
var outer_lap_btn = document.getElementById("outer-lap-btn");
var outer_reset_btn = document.getElementById("outer-reset-btn");
var outer_stop_btn = document.getElementById("outer-stop-btn");
var list = document.getElementById("lap-list");
var timeout  = null;
var id =1;

function start()
{
  outer_start_btn.style.display = "none";
  outer_lap_btn.style.display = "block";
  outer_stop_btn.style.display = "block";
  outer_reset_btn.style.display = "none";
  timeout = setTimeout(function (){
          ms = parseInt(ms);
          sec = parseInt(sec);
          min = parseInt(min);
      ms = ms+1;
      if(ms==100)
      {
        sec = sec +1;
        ms=0;
      }
      if(sec==60)
      {
        min = min+1;
        sec=0;
      }
      if(ms<10)
      {
        ms = "0" + ms;
      }
      if(min<10)
      min = "0" + min;
      if(sec<10)
      sec = "0" + sec;
      stopwatch.innerHTML = min + " : " + sec + " : " + ms;
      start();

},10);
}

function stop()
{
  clearTimeout(timeout);
  outer_start_btn.style.display = "block";
  outer_lap_btn.style.display = "none";
  outer_reset_btn.style.display = "block";
  outer_stop_btn.style.display = "none";
}

function reset()
{
  stopwatch.innerHTML = "00 : 00 : 00";
  ms=0;
  sec=0;
  min=0;
  list.innerHTML="";
}

function lap()
{
  lap.disabled = true;
  
  var li = document.createElement("li");
  var div = document.createElement("div");
  var lapCount = document.createElement("p");
  var time = document.createElement("p");
  li.appendChild(div);
  div.appendChild(lapCount);
  div.appendChild(time);
  list.appendChild(li);
  lapCount.innerHTML = "Lap" + id++;
  time.innerHTML = stopwatch.innerHTML;
  li.classList.add("list-item");
  div.classList.add("item-div");
}