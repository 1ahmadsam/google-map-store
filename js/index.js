let map;
let infoWindow;
let markers = [];

function initMap() {
  let losAngeles = { lat: 34.06338, lng: -118.35808 };

  map = new google.maps.Map(document.getElementById('map'), {
    center: losAngeles,
    zoom: 8,
  });

  infoWindow = new google.maps.InfoWindow();
  getStores();
}

const searchLocationsNear = (stores) => {
  let bounds = new google.maps.LatLngBounds();
  stores.forEach((store, index) => {
    let latlng = new google.maps.LatLng(
      store.location.coordinates[1],
      store.location.coordinates[0]
    );
    let name = store.storeName;
    let address = store.addressLines[0];
    let postalCode = store.addressLines[1];
    let openStatusText = store.openStatusText;
    let phone = store.phoneNumber;
    bounds.extend(latlng);
    createMarker(latlng, name, address, openStatusText, index + 1, phone);
    setStoresList(address, phone, index + 1, postalCode);
  });
  map.fitBounds(bounds);
};

const createMarker = (
  latlng,
  name,
  address,
  openStatusText,
  storeNumber,
  phone
) => {
  let html = `<div class="store-info-window"><div class="store-info-name">${name}</div>
  <div class="store-info-open-status">${openStatusText}</div>
  <div class="store-info-address"><div class="icon"><i class="fas fa-location-arrow"></i></div><span>${address}</span> </div>
  <div class="store-info-phone"><div class="icon"><i class="fas fa-phone"></i></div><span><a href="tel:${phone}">${phone}</a></span></div>
  `;

  let marker = new google.maps.Marker({
    map: map,
    position: latlng,
    label: `${storeNumber}`,
  });
  google.maps.event.addListener(marker, 'click', function () {
    infoWindow.setContent(html);
    infoWindow.open(map, marker);
  });
  markers.push(marker);
};

const getStores = () => {
  const url = 'http://localhost:3000/api/stores';
  fetch(url)
    .then((response) => {
      if (response.status == 200) {
        return response.json();
      } else {
        throw new Error(response.status);
      }
    })
    .then((data) => {
      searchLocationsNear(data);
      setOnClickListener();
    });
};

const setOnClickListener = () => {
  let storeElements = document.querySelectorAll('.store-container');

  storeElements.forEach((elem, index) => {
    elem.addEventListener('click', () => {
      google.maps.event.trigger(markers[index], 'click');
    });
  });
};

const setStoresList = (address, phone, store, postalCode) => {
  let storeHTML = '';
  storeHTML += `<div class="store-container">
    <div class="store-container-background">
      <div class="store-info-container">
        <div class="store-address">
          <span>${address}</span>
          <span>${postalCode}</span>
        </div>
        <div class="store-phone-number">${phone}</div>
      </div>
      <div class="store-number-container">
        <div class="store-number">${store}</div>
      </div>
    </div>
  </div>`;
  document
    .querySelector('.stores-list')
    .insertAdjacentHTML('beforeend', storeHTML);
};
