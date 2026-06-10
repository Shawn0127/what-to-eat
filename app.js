
document.getElementById('distance').oninput=e=>{
document.getElementById('distanceText').textContent=(e.target.value/1000).toFixed(1)+' km';
};
document.getElementById('rating').oninput=e=>{
document.getElementById('ratingText').textContent=e.target.value+' ★';
};
document.getElementById('reviews').oninput=e=>{
document.getElementById('reviewText').textContent=e.target.value;
};

document.querySelectorAll('.tag').forEach(tag=>{
tag.addEventListener('click',()=>{
tag.classList.toggle('active');
});
});
