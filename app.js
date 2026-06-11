let map,userLat,userLng,markers=[],allResults=[];

function initMap(lat,lng){
 map=new google.maps.Map(document.getElementById('map'),{center:{lat,lng},zoom:15});
 new google.maps.Marker({position:{lat,lng},map,title:'目前位置'});
}

navigator.geolocation.getCurrentPosition(pos=>{
 userLat=pos.coords.latitude;
 userLng=pos.coords.longitude;
 locationText.textContent='📍 已取得目前位置';
 initMap(userLat,userLng);
});

distance.oninput=e=>distanceText.textContent=(e.target.value/1000).toFixed(1)+' km';
rating.oninput=e=>ratingText.textContent=e.target.value+' ★';
reviews.oninput=e=>reviewText.textContent=e.target.value;

document.querySelectorAll('.tag').forEach(tag=>{
 tag.addEventListener('click',()=>tag.classList.toggle('active'));
});

searchBtn.onclick=()=>{
 if(!map)return;
 restaurantList.innerHTML='搜尋中...';
 allResults=[];
 markers.forEach(m=>m.setMap(null));
 markers=[];

 const selected=[...document.querySelectorAll('.tag.active')];
 if(selected.length===0){alert('請至少選一個美食項目');return;}

 const service=new google.maps.places.PlacesService(map);
 const unique=new Map();
 let pending=selected.length;

 selected.forEach(tag=>{
   service.textSearch({
      query:tag.dataset.query,
      location:new google.maps.LatLng(userLat,userLng),
      radius:+distance.value
   },(results,status)=>{
      if(status==='OK' && results){
         results.forEach(r=>{
           if((r.rating||0) < +rating.value) return;
           if((r.user_ratings_total||0) < +reviews.value) return;
           unique.set(r.place_id,r);
         });
      }
      pending--;
      if(pending===0){
        allResults=[...unique.values()].slice(0,10);
        renderResults();
      }
   });
 });
};

function renderResults(){
 restaurantList.innerHTML='';
 allResults.forEach(r=>{
   const marker=new google.maps.Marker({map,position:r.geometry.location,title:r.name});
   markers.push(marker);

   const div=document.createElement('div');
   div.className='restaurant-card';
   div.innerHTML=`<div><h4>${r.name}</h4><p>⭐ ${r.rating||'N/A'}</p><p>📝 ${r.user_ratings_total||0}</p><p>${r.formatted_address||r.vicinity||''}</p></div>`;
   restaurantList.appendChild(div);
 });
}

randomBtn.onclick=()=>{
 if(allResults.length===0){alert('請先搜尋餐廳');return;}
 const pick=allResults[Math.floor(Math.random()*allResults.length)];
 alert('🎉 今天吃：\n'+pick.name);
};