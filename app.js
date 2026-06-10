
let map,userLat,userLng;
document.addEventListener('DOMContentLoaded',()=>{
document.querySelectorAll('.tag').forEach(tag=>tag.addEventListener('click',()=>tag.classList.toggle('active')));
searchBtn.onclick=searchRestaurants;
randomBtn.onclick=randomPick;
});
navigator.geolocation.getCurrentPosition(pos=>{
userLat=pos.coords.latitude;userLng=pos.coords.longitude;
map=new google.maps.Map(document.getElementById('map'),{center:{lat:userLat,lng:userLng},zoom:15});
});
function searchRestaurants(){
const keywords=[...document.querySelectorAll('.tag.active')].map(t=>t.dataset.keyword);
const query=keywords.length?keywords.join(' '):'restaurant';
const service=new google.maps.places.PlacesService(map);
service.textSearch({location:new google.maps.LatLng(userLat,userLng),radius:3000,query},(results,status)=>{
restaurantList.innerHTML='';
if(status!=='OK') return;
results.slice(0,10).forEach(r=>{
const d=document.createElement('div');d.className='card';
d.innerHTML='<b>'+r.name+'</b><br>⭐ '+(r.rating||'N/A');
restaurantList.appendChild(d);
});
});
}
function randomPick(){
const items=[...document.querySelectorAll('.card b')];
if(!items.length){alert('請先搜尋');return;}
alert('今天吃：'+items[Math.floor(Math.random()*items.length)].textContent);
}
