
let map;
let userLat;
let userLng;
let markers=[];

function initMap(lat,lng){
  map = new google.maps.Map(document.getElementById('map'),{
    center:{lat,lng},
    zoom:15
  });

  new google.maps.Marker({
    position:{lat,lng},
    map:map,
    title:'目前位置'
  });
}

navigator.geolocation.getCurrentPosition(
(pos)=>{
  userLat=pos.coords.latitude;
  userLng=pos.coords.longitude;

  document.getElementById('locationText').textContent='📍 已取得目前位置';
  initMap(userLat,userLng);
},
(err)=>{
  document.getElementById('locationText').textContent='⚠️ 無法取得定位權限';
  console.log(err);
}
);

distance.oninput=e=>distanceText.textContent=(e.target.value/1000).toFixed(1)+' km';
rating.oninput=e=>ratingText.textContent=e.target.value+' ★';
reviews.oninput=e=>reviewText.textContent=e.target.value;

document.getElementById("searchBtn").addEventListener("click",searchRestaurants);

function searchRestaurants(){

  if(!map){
    alert("地圖尚未初始化");
    return;
  }

  clearMarkers();

  const service = new google.maps.places.PlacesService(map);

  service.nearbySearch({
    location:{lat:userLat,lng:userLng},
    radius:Number(document.getElementById("distance").value),
    type:"restaurant"
  },handleResults);
}

function handleResults(results,status){

  if(status!==google.maps.places.PlacesServiceStatus.OK){
    console.log(status);
    alert("搜尋失敗："+status);
    return;
  }

  const minRating = Number(document.getElementById("rating").value);
  const minReviews = Number(document.getElementById("reviews").value);

  const list=document.getElementById("restaurantList");
  list.innerHTML="";

  results
  .filter(p=>(p.rating||0)>=minRating)
  .filter(p=>(p.user_ratings_total||0)>=minReviews)
  .slice(0,10)
  .forEach(place=>{

    const marker=new google.maps.Marker({
      map,
      position:place.geometry.location,
      title:place.name
    });

    markers.push(marker);

    const card=document.createElement("div");
    card.className="restaurant-card";

    card.innerHTML=`
      <h3>${place.name}</h3>
      <p>⭐ ${place.rating ?? "N/A"}</p>
      <p>📝 ${place.user_ratings_total ?? 0}</p>
      <p>${place.vicinity ?? ""}</p>
    `;

    list.appendChild(card);
  });
}

function clearMarkers(){
  markers.forEach(m=>m.setMap(null));
  markers=[];
}
