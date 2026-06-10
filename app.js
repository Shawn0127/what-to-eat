
let map,userLat,userLng,markers=[];

function initMap(lat,lng){
 map=new google.maps.Map(document.getElementById('map'),{center:{lat,lng},zoom:15});
 new google.maps.Marker({position:{lat,lng},map,title:'目前位置'});
}

navigator.geolocation.getCurrentPosition(pos=>{
 userLat=pos.coords.latitude;
 userLng=pos.coords.longitude;
 locationText.textContent='📍 已取得目前位置';
 initMap(userLat,userLng);
},()=>locationText.textContent='⚠️ 無法取得定位');

distance.oninput=e=>distanceText.textContent=(e.target.value/1000).toFixed(1)+' km';
rating.oninput=e=>ratingText.textContent=e.target.value+' ★';
reviews.oninput=e=>reviewText.textContent=e.target.value;

document.querySelectorAll('.tag').forEach(t=>t.onclick=()=>t.classList.toggle('active'));

searchBtn.onclick=()=>{
 if(!map)return;
 clearMarkers();
 const service=new google.maps.places.PlacesService(map);
 service.nearbySearch({
  location:{lat:userLat,lng:userLng},
  radius:+distance.value,
  type:'restaurant'
 },(results,status)=>{
   if(status!==google.maps.places.PlacesServiceStatus.OK){alert(status);return;}
   restaurantList.innerHTML='';
   results.filter(r=>(r.rating||0)>=+rating.value)
   .filter(r=>(r.user_ratings_total||0)>=+reviews.value)
   .slice(0,10)
   .forEach(r=>{
      const m=new google.maps.Marker({map,position:r.geometry.location,title:r.name});
      markers.push(m);
      const div=document.createElement('div');
      div.className='restaurant-card';
      div.innerHTML=`<img src="https://picsum.photos/120?random=${Math.random()}"><div class="info"><h4>${r.name}</h4><p>⭐ ${r.rating||'N/A'}</p><p>📝 ${r.user_ratings_total||0}</p><p>${r.vicinity||''}</p></div>`;
      restaurantList.appendChild(div);
   });
 });
};

randomBtn.onclick=()=>{
 const cards=document.querySelectorAll('.restaurant-card h4');
 if(cards.length===0){alert('請先搜尋餐廳');return;}
 const pick=cards[Math.floor(Math.random()*cards.length)].textContent;
 alert('🎉 今天吃：\n'+pick);
};

function clearMarkers(){markers.forEach(m=>m.setMap(null));markers=[];}
