let map;
let userLat;
let userLng;

let markers = [];
let allResults = [];
let drawInterval = null;
let currentPick = null;

function initMap(lat, lng) {
    map = new google.maps.Map(
        document.getElementById("map"),
        {
            center: { lat, lng },
            zoom: 15
        }
    );

    new google.maps.Marker({
        position: { lat, lng },
        map,
        title: "目前位置"
    });
}

navigator.geolocation.getCurrentPosition(
    pos => {

        userLat = pos.coords.latitude;
        userLng = pos.coords.longitude;

        locationText.textContent =
            "📍 已取得目前位置";

        initMap(userLat, userLng);
    },
    err => {
        alert("無法取得定位");
    }
);

distance.oninput = e => {
    distanceText.textContent =
        (e.target.value / 1000).toFixed(1) + " km";
};

rating.oninput = e => {
    ratingText.textContent =
        e.target.value + " ★";
};

reviews.oninput = e => {
    reviewText.textContent =
        e.target.value;
};

document
.querySelectorAll(".tag")
.forEach(tag => {

    tag.addEventListener(
        "click",
        () => {
            tag.classList.toggle("active");
        }
    );

});

function clearMarkers() {

    markers.forEach(m => m.setMap(null));

    markers = [];
}

function calculateDistance(place) {

    const userLocation =
        new google.maps.LatLng(
            userLat,
            userLng
        );

    return Math.round(
        google.maps.geometry.spherical.computeDistanceBetween(
            userLocation,
            place.geometry.location
        )
    );
}

searchBtn.onclick = () => {
    if(drawInterval){
        clearInterval(drawInterval);
        drawInterval = null;
    }

    currentPick = null;

    randomBtn.textContent =
        "🤔 幫我決定";

    if (!map) return;

    const selected =
        [
            ...document.querySelectorAll(
                ".tag.active"
            )
        ];

    if (selected.length === 0) {

        alert("請至少選擇一個美食項目");

        return;
    }

    restaurantList.innerHTML =
        "<p>搜尋中...</p>";

    clearMarkers();

    allResults = [];

    const service =
        new google.maps.places.PlacesService(
            map
        );

    const uniquePlaces = new Map();

    let pending = selected.length;

    selected.forEach(tag => {

        service.textSearch(
            {
                query: tag.dataset.query,
                location:
                    new google.maps.LatLng(
                        userLat,
                        userLng
                    ),
                radius: 5000
            },
            (results, status) => {

                if (
                    status === "OK" &&
                    results
                ) {

                    results.forEach(place => {

                        const realDistance =
                            calculateDistance(
                                place
                            );

                        if (
                            realDistance >
                            +distance.value
                        ) {
                            return;
                        }

                        if (
                            (place.rating || 0) <
                            +rating.value
                        ) {
                            return;
                        }

                        if (
                            (place.user_ratings_total || 0) <
                            +reviews.value
                        ) {
                            return;
                        }

                        place.distanceMeters =
                            realDistance;

                        uniquePlaces.set(
                            place.place_id,
                            place
                        );
                    });
                }

                pending--;

                if (pending === 0) {

                    allResults =
                        [
                            ...uniquePlaces.values()
                        ];

                    allResults.sort(
                        (a, b) =>
                            a.distanceMeters -
                            b.distanceMeters
                    );

                    allResults =
                        allResults.slice(0, 10);

                    renderResults();
                }
            }
        );
    });
};

function renderResults() {

    restaurantList.innerHTML = "";

    if (allResults.length === 0) {

        restaurantList.innerHTML =
            `
            <div class="restaurant-card">
                <h3>找不到符合條件的餐廳</h3>
                <p>請放寬距離、評分或評論數條件</p>
            </div>
            `;

        return;
    }

    allResults.forEach(
        (place, index) => {

            const marker =
                new google.maps.Marker(
                    {
                        position:
                            place.geometry.location,
                        map,
                        title:
                            place.name
                    }
                );

            markers.push(marker);

            const card =
                document.createElement(
                    "div"
                );

            card.className =
                "restaurant-card";

            const distanceTextValue =
                place.distanceMeters < 1000
                    ? `${place.distanceMeters}m`
                    : `${(
                        place.distanceMeters /
                        1000
                    ).toFixed(1)}km`;

            const photoUrl =
                place.photos?.length
                ? place.photos[0].getUrl({
                      maxWidth: 300,
                      maxHeight: 200
                  })
                : "";

            card.innerHTML = `
<img
 class="restaurant-photo"
 src="${photoUrl}"
>

<div class="restaurant-info">

    <h4>${place.name}</h4>

    <div>
        ⭐ ${place.rating || "N/A"}
        (${place.user_ratings_total || 0})
    </div>

    <div>
        📍 ${distanceTextValue}
    </div>

    <div class="restaurant-address">
        ${place.formatted_address || place.vicinity || ""}
    </div>

</div>
`;

            card.addEventListener(
                "click",
                () => {

                    map.panTo(
                        place.geometry.location
                    );

                    map.setZoom(17);
                    window.scrollTo({
                        top: 0,
                        behavior: "smooth"
                    });

                    document
                        .querySelectorAll(
                            ".restaurant-card"
                        )
                        .forEach(c =>
                            c.classList.remove(
                                "active-card"
                            )
                        );

                    card.classList.add(
                        "active-card"
                    );
                }
            );

            marker.addListener(
                "click",
                () => {

                    card.click();

                    card.scrollIntoView({
                        behavior:
                            "smooth",
                        block:
                            "center"
                    });
                }
            );

            restaurantList.appendChild(
                card
            );
        }
    );
}

randomBtn.onclick = () => {

    if(allResults.length === 0){

        alert("請先搜尋餐廳");

        return;
    }

    startDraw();

};
function startDraw(){

    let counter = 0;

    drawInterval = setInterval(() => {
        if(drawInterval) return;
        const randomIndex =
            Math.floor(
                Math.random() *
                allResults.length
            );

        currentPick =
            allResults[randomIndex];

        randomBtn.textContent =
            `🎲 ${currentPick.name}`;

        counter++;

        if(counter >= 30){

            clearInterval(drawInterval);

            drawInterval = null;

            randomBtn.textContent =
                `🎉 今天吃：${currentPick.name}`;

            setTimeout(() => {

                alert(
                    `🎉 今天吃：\n${currentPick.name}`
                );

            },300);

        }

    },100);

}
