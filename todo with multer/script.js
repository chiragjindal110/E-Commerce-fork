var input = document.getElementById("add");
var bt1 = document.getElementById("bt1");
var parent = document.getElementById("list");
var id =1;


// function to bring the existing data from the server
function displayTheData()
{
  fetch('/home',{method: "POST",headers:{'Content-Type': 'application/json'}})
  .then(res => res.json())
  .then(function (d){
    JSON.parse(d).forEach(function(value){
      console.log(value);
      appendchild(value.todo,value.id,value.isComplete,value.src);
      id = value.id;
      id++;
    })
  })
}
displayTheData();  

// eventlistener for the insert button
bt1.addEventListener("click",function (){
  var upload = document.getElementById("upload");
  var content = new FormData();
  var picname = upload.files[0];
  content.append("id",id);
  content.append("todo",input.value);
  content.append("isComplete",false);
  content.append("src","");
  content.append("picname",picname);

  // let content ={
  // body : JSON.stringify({todo:input.value,id:id,isComplete:false})
  // }
  fetch("/store",{method:"POST",body:content})
  .then(d => d.json())
  .then(function (data){
    var value = input.value;

  if(value!="" && picname)
  {
    appendchild(value,id,'false',data.src); // appending the note to the list
  }
  input.value="";
  id++;
  })
  .catch(()=>{console.log("hello");})
});


input.addEventListener("keyup", function(event)
{
  if(event.key === 'Enter')
  {
    var upload = document.getElementById("upload");
  var content = new FormData();
  var picname = upload.files[0];
  content.append("id",id);
  content.append("todo",input.value);
  content.append("isComplete",false);
  content.append("src","");
  content.append("picname",picname);

  // let content ={
  // body : JSON.stringify({todo:input.value,id:id,isComplete:false})
  // }
  fetch("/store",{method:"POST",body:content})
  .then(d => d.json())
  .then(function (data){
    var value = input.value;

  if(value!="")
  {
    appendchild(value,id,'false',data.src); // appending the note to the list
  }
  input.value="";
  id++;
  })
  .catch(()=>{console.log("hello");})
  }
  
})


// function to append child
function appendchild(value,id1,isComplete,src)
{
    // initializing all the required elements 
    var div = document.createElement("div");// parent element of below elements
    var deleteButton = document.createElement("button");
    var editButton = document.createElement("button");
    var content_div = document.createElement("div");
    var p = document.createElement("p");
    p.innerText = value; // assigning the value of note
    var updateInput = document.createElement("input");
    var updateButton = document.createElement("button");
    var deleteicon = document.createElement("i");
    var editicon = document.createElement("i");
    var updateicon = document.createElement("i");
    var completed = document.createElement("input");
    completed.setAttribute("type","checkbox");
    var label = document.createElement("label");
    label.setAttribute("id",id1);
    label.setAttribute("for",id1);
    label.innerText="completed";
    completed_div = document.createElement("div");
    completed_div.appendChild(completed);
    completed_div.appendChild(label);
    var image = document.createElement("img");
    image.setAttribute("src",src);
    image.setAttribute("height","50px");
    image.setAttribute("width","50px");
    console.log(isComplete);
    
    if(isComplete === 'true')
    {
      p.style.textDecoration = "line-through";
      completed.setAttribute("checked","");
    }

    //parent element of element "div"
    var li = document.createElement("li");
    
    // neccessary styling over the elements
    updateInput.style.display = "none";
    updateButton.style.display = "none";

    //setting required attributes
    content_div.classList.add("content");
    div.classList.add("items-div");
    updateInput.setAttribute("value",value);
    updateButton.classList.add("update");
    deleteButton.classList.add("delete");
    editButton.classList.add("edit");
    deleteicon.classList.add("fa","fa-trash");
    deleteButton.appendChild(deleteicon);
    editicon.classList.add("fa","fa-edit");
    editButton.appendChild(editicon);
    updateicon.classList.add("fa", "fa-check");
    updateButton.appendChild(updateicon);
    content_div.appendChild(p);


    //EventListener for the edit button
    editButton.addEventListener("click",function (){
      updateInput.style.display = "block";
    updateButton.style.display = "block";
    editButton.style.display = "none";
    p.style.display = "none";
    })
    
    // EventListener for the delete button
    deleteButton.addEventListener("click",function (){
          var  parent = li.parentElement;
          deletenotes(id1);
          parent.removeChild(li);
          
    });

    // EventListner for the update button
    updateButton.addEventListener("click",function (){
          var value1 = updateInput.value;
          Updatenotes(id1,value1);
          p.innerText = value1;
          p.style.display = "block";
          editButton.style.display = "block";
          updateButton.style.display = "none";
          updateInput.style.display = "none";
    });
    updateInput.addEventListener("keyup",function (event){
      if(event.code === "Enter")
      {
        var value1 = updateInput.value;
          console.log(id1);
          Updatenotes(id1,value1);
          p.innerText = value1;
          p.style.display = "block";
          editButton.style.display = "block";
          updateButton.style.display = "none";
          updateInput.style.display = "none";
      }
    })

    completed.addEventListener("click",function(){
      if(isComplete ==='false')
      {
          StoreIsComplete(id1,true);
          p.style.textDecoration = "line-through";
          isComplete = 'true';
      }
      else
      {
        StoreIsComplete(id1,false);
        p.style.textDecoration ="none";
        isComplete = 'false';
      }
      

    })
    
    // appending all the elements of each note to the parent element "div"
    div.appendChild(image);
    div.appendChild(deleteButton);
    div.appendChild(content_div);
    div.appendChild(updateInput);
    div.appendChild(updateButton);
    div.appendChild(editButton);
    

    li.appendChild(div);   // assigning div to the list item
    li.appendChild(completed_div);
    parent.appendChild(li);// assigning list item to the ordered list

    
    
}


// update in Server
function Updatenotes(i,after)
{
  console.log(after);
  console.log(typeof after);
  fetch('/update',{method: "POST",headers:{'Content-Type': 'application/json'},body: JSON.stringify({id: i,update:after})})
}

//function to delete from Server
function deletenotes(i)
{
    fetch('/delete',{method: "POST",headers:{'Content-Type': 'application/json'},body: JSON.stringify({id: i})})
    
}

function StoreIsComplete(id,isComplete)
{
    console.log(typeof isComplete,isComplete);
    id = id+"";
    console.log(typeof id,id);
    if(isComplete)
    fetch('/complete',{method: "POST",headers:{'Content-Type': 'application/json'},body: JSON.stringify({id: id,isComplete:'true'})})
    else
    fetch('/complete',{method: "POST",headers:{'Content-Type': 'application/json'},body: JSON.stringify({id: id,isComplete:'false'})})
}