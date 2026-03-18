const rooms = [
{id:"A",name:"Room A",capacity:4},
{id:"B",name:"Room B",capacity:6},
{id:"C",name:"Room C",capacity:8}
]

const slots = ["9-10","10-11","11-12","12-1"]

let bookings = JSON.parse(localStorage.getItem("bookings")) || {}

const roomsDiv = document.getElementById("rooms")
const summary = document.getElementById("summary")
const dateInput = document.getElementById("date")
const filter = document.getElementById("filter")

function save(){
localStorage.setItem("bookings",JSON.stringify(bookings))
}

function key(room,slot,date){
return room+"-"+slot+"-"+date
}

function showToast(message,type){
const toast = document.getElementById("toast")

toast.className = ""
toast.offsetHeight

toast.innerText = message
toast.className = "show " + type

setTimeout(()=>{
toast.className = ""
},2000)
}

function renderRooms(){
roomsDiv.innerHTML=""

const date = dateInput.value
const cap = filter.value

rooms.forEach(room=>{

if(cap!="all" && room.capacity < cap) return

const div = document.createElement("div")
div.className="room"

const title = document.createElement("h3")
title.innerText = room.name

const capText = document.createElement("p")
capText.innerText = "Capacity: "+room.capacity

div.appendChild(title)
div.appendChild(capText)

slots.forEach(slot=>{

const k = key(room.id,slot,date)

const btn = document.createElement("button")
btn.innerText = slot

if(bookings[k]){

btn.className="booked"

btn.onclick=function(){
delete bookings[k]
save()
render()
showToast("Booking cancelled","error")
}

}else{

btn.className="available"

btn.onclick=function(){

if(confirm("Book "+room.name+" "+slot+" ?")){

let name = prompt("Enter your name:")
if(!name) return

bookings[k] = name
save()
render()

showToast("Booked by " + name,"success")
}
}
}

div.appendChild(btn)
})

roomsDiv.appendChild(div)
})
}

function renderSummary(){
summary.innerHTML=""

for(let k in bookings){
const li = document.createElement("li")
li.innerText = bookings[k] + " → " + k.replaceAll("-"," ")
summary.appendChild(li)
}
}

function render(){
renderRooms()
renderSummary()
}

dateInput.value = new Date().toISOString().split("T")[0]

filter.onchange = render
dateInput.onchange = render

render()

function toggleTheme(){
document.body.classList.toggle("dark")
localStorage.setItem("theme",document.body.classList.contains("dark"))
}

if(localStorage.getItem("theme") === "true"){
document.body.classList.add("dark")
}