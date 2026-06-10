
let map;

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
  const lat=pos.coords.latitude;
  const lng=pos.coords.longitude;

  document.getElementById('locationText').textContent='📍 已取得目前位置';
  initMap(lat,lng);
},
(err)=>{
  document.getElementById('locationText').textContent='⚠️ 無法取得定位權限';
  console.log(err);
}
);

distance.oninput=e=>distanceText.textContent=(e.target.value/1000).toFixed(1)+' km';
rating.oninput=e=>ratingText.textContent=e.target.value+' ★';
reviews.oninput=e=>reviewText.textContent=e.target.value;
