// store credit and debit
// get the debit and credit
// store the history 
// get the history
// display history
// delete history
// eventlistner for the add button
// eventlistener for the submit button
// eventlistener for the cross button 
// eventlistener for the delete button

var add = document.getElementById("add");
var submit_button =  document.getElementById("Enter-button");
var input_div = document.getElementById("Enter-div");
var cross_input = document.getElementById("Enter-icon");
var credit = document.getElementById("credit-value");
var debit = document.getElementById("debit-value");


var credit_value = GetCredit();
credit.innerHTML = "$" +credit_value;

var debit_value = GetDebit();
debit.innerHTML = "$" +debit_value;

UpdateProgressbar();
var id = localStorage.getItem("id");
if(id)
{
  id = id*1;
}
else{
  localStorage.setItem("id",1);
  id=1;
}

var histories = GetHistory();
histories.forEach(function(history){
  DisplayHistory(history.text,history.amount,history.id);
})



add.addEventListener("click",function(){
  input_div.style.display = "block";
  add.style.display = "none";
  var list = document.getElementById("list");
  list.style.height="30%";
})

cross_input.addEventListener("click",function(){
  add.style.display = "block";
  input_div.style.display = "none";
  var list = document.getElementById("list");
  list.style.height="50%";
})

submit_button.addEventListener("click",function(){
  var text_input = document.getElementById("Enter-input1");
  var amount_input = document.getElementById("Enter-input2");

  var text = text_input.value;
  var amount = amount_input.value;
  if(isNaN(amount)){
    alert("Please Provide valid Amount");
  }
  else
  {
    if(amount=="" || text=="")
    {
      alert("Both Fields are neccessary");
    }
    else{
        if(amount<0)
    {
        
        DisplayHistory(text,amount,id);
        StoreHistory(text,amount);
        amount = -amount;
        StoreCredit(amount);
        credit_value = credit_value *1 + amount *1 ;
        credit.innerHTML="";
        credit.innerHTML = "$" +credit_value;
    }
    else
    {
        DisplayHistory(text,amount,id);
        StoreHistory(text,amount);
        StoreDebit(amount);
        debit_value = debit_value *1 + amount *1;
        debit.innerHTML="";
        debit.innerHTML = "$" + debit_value;
    }
    }
    
    text_input.value ="";
    amount_input.value ="";
      UpdateProgressbar();
  }
  
})


function DisplayHistory(text,amount,id)
{
  var list = document.getElementById("list");
  var li = document.createElement("li")
  var item_div = document.createElement("div")
  var history_text_div = document.createElement("div")
  var text_p = document.createElement("p")
  var amount_p = document.createElement("p")
  var icon = document.createElement("i");
  
  history_text_div.appendChild(text_p);
  history_text_div.appendChild(amount_p);
  item_div.appendChild(history_text_div);
  item_div.appendChild(icon);
  li.appendChild(item_div);
  list.appendChild(li);

  
  text_p.classList.add("text");
  history_text_div.classList.add("history-text-div");
  item_div.classList.add("item-div");
  if(amount>0)
  {
      amount_p.classList.add("item-amount");
      li.classList.add("history-item");
  }
  else
  {
      amount_p.classList.add("item-amount1");
      li.classList.add("history-item1");
  }
  
  icon.classList.add("icon", "fa", "fa-trash");
  text_p.innerHTML = text;

console.log(amount);
var temp_amount = amount;
  icon.addEventListener("click",function(){
      if(temp_amount<0)
      {
        StoreCredit(temp_amount *1);
        credit_value = credit_value *1 + temp_amount *1 ;
        credit.innerHTML="";
        credit.innerHTML = "$" +credit_value;
      }
      else{
        StoreDebit(-temp_amount);
        debit_value = debit_value *1 - temp_amount *1;
        debit.innerHTML="";
        debit.innerHTML = "$" + debit_value;
      }
      DeleteHistory(id);
    li.style.display = "none";
    UpdateProgressbar();
  })

  if(amount<0)
  {
      amount = -amount;
      amount_p.innerHTML = "-" + "$" + amount;
  }
  else{
    amount_p.innerHTML = "+" + "$" + amount;
  }

  
}

// Utility functions

function GetCredit()
{
  var credit = localStorage.getItem("credit");
  if(credit)
  return credit *1;
  else{
    localStorage.setItem("credit",0);
    return 0;
  }
}

function GetDebit()
{
  var debit = localStorage.getItem("debit");
  if(debit)
  return debit *1;
  else{
    localStorage.setItem("debit",0);
    return 0;
  }
}

function StoreCredit(creditAmount)
{
  var beforeAmount = GetCredit();
  beforeAmount = beforeAmount *1;
  beforeAmount = beforeAmount + creditAmount;
  localStorage.setItem("credit",beforeAmount);
}

function StoreDebit(debitAmount)
{
  var beforeAmount = GetDebit();
  beforeAmount = beforeAmount *1;
  beforeAmount = beforeAmount *1 + debitAmount *1;
  localStorage.setItem("debit",beforeAmount);
}

// Get History
function GetHistory()
{
  var history = localStorage.getItem("history");
  if(history)
  {
    history = JSON.parse(history);
    return history;
  }
  else{
    return [];
  }
}

//Store History

function StoreHistory(text,amount)
{
  var history = {
    text: text,
    amount: amount,
    id: id++
  }
  var pastHistory = GetHistory();
  pastHistory.push(history);
  pastHistory = JSON.stringify(pastHistory);
  localStorage.setItem("history",pastHistory);
  localStorage.setItem("id",id);
}

// delete history
function DeleteHistory(id)
{
  var histories = GetHistory();
  for(var i=0;i<histories.length;i++)
  {
    if(histories[i].id === id)
    {
      histories.splice(i,1);
      break;
    }
  }
  histories = JSON.stringify(histories);
  localStorage.setItem("history",histories);
}

//Update Progress Bar
 
function UpdateProgressbar()
{
  var filled = document.getElementById("filled-progress-bar");
  var progress = document.getElementById("progress-expense");
  credit_value = credit_value *1;
  debit_value = debit_value *1;
  if(debit_value >= credit_value)
  {
    var difference_profit = debit_value - credit_value;
    let percentage = (difference_profit / debit_value) *100;
    filled.style.backgroundColor = "limegreen";
    filled.style.width = percentage + "%";
    progress.innerHTML = "$" + difference_profit;
  }
  else
  {
     var diffrence_loss = credit_value - debit_value;
     let percentage = (diffrence_loss / credit_value) *100;
     filled.style.backgroundColor = "red";
     filled.style.width = percentage +"%";
     progress.innerHTML = "$" + diffrence_loss;
  }
  if(credit_value===0 && debit_value ===0)
  {
    filled.style.width = "0";
  }
}