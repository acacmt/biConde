//MAPA
var map;
var infowindow;
function myMap() {
    var mapCanvas = document.getElementById("map");
    var mapOptions = {
        center: new google.maps.LatLng(41.353733, -8.747602),
        zoom: 14
    }

    map = new google.maps.Map(mapCanvas, mapOptions);
    map.setMapTypeId(google.maps.MapTypeId.SATELLITE);
}
$(document).ready(function () {
    // INITIALIZE FIREBASE
    var config = {
        apiKey: "AIzaSyAX5M219NABJtvuxrHtuMWQ0yOGhfe8uc8",
        authDomain: "biconde-2fe83.firebaseapp.com",
        databaseURL: "https://biconde-2fe83.firebaseio.com",
        storageBucket: "biconde-2fe83.appspot.com",
        messagingSenderId: "581056433304"
    };
    //firebase.initializeApp(config);

    var ref = firebase.database().ref().child("Locais");

    ref.on('value', snap => {
        for (var i = 0; i < snap.val().length; i++) {
            var lat = snap.val()[i].latitude;
            var lng = snap.val()[i].longitude;
            var nome = snap.val()[i].nome;
            var txt = snap.val()[i].bicicletas;
            var txt1 = snap.val()[i].livres;

            var latLng = { lat: lat, lng: lng };
            //console.log(latLng)
            // Creating a marker and putting it on the map
            var marker = new google.maps.Marker({
                position: latLng,
                map: map,
                title: nome,
                icon: 'img/marker.png'
            });
            marker.setMap(map);
           
            // Evento que dá instrução à API para estar alerta ao click no marcador.
            // Define o conteúdo e abre a Info Window.
            google.maps.event.addListener(marker, 'click', function () {
                // Variável que define a estrutura do HTML a inserir na Info Window.
                var Content = '<div id="iw_container">' +
                    '<div class="iw_title">' + nome + '</div>'
                    + '<div>' + '<p>' + 'Bicicletas:' + txt1 + '/' + txt + '</p>' + '</div>'
                    + '<div id="id_reserva">' + '<button id="reserva">' + 'Reservar' + '</button>' + '</div>' + '</div>';
                
                infowindow = new google.maps.InfoWindow({
                    content: Content
                });
                // O conteúdo da variável Content é inserido na Info Window.
                infoWindow.setContent(Content);

                // A Info Window é aberta com um click no marcador.
                infoWindow.open(map, marker);

                // var infoWindow = new google.maps.InfoWindow({ map: map });

            });
        }
    })
    
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            infoWindow = new google.maps.InfoWindow({ map: map });
            infoWindow.setPosition(pos);
            infoWindow.setContent('Você está aqui!');
            //map.setCenter(pos);
          }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
          });
        } else {
          // Browser doesn't support Geolocation
          handleLocationError(false, infoWindow, map.getCenter());
        }
        
        function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
                              'Error: The Geolocation service failed.' :
                              'Error: Your browser doesn\'t support geolocation.');
      }
});