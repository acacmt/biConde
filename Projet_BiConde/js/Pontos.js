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

    var ref = firebase.database().ref().child("Locais");

    ref.on('value', snap => {
        for (var i = 0; i < snap.val().length; i++) {
            var lat = snap.val()[i].latitude;
            var lng = snap.val()[i].longitude;
            var nome = snap.val()[i].nome;
            var txt = snap.val()[i].bicicletas;
            var txt1 = snap.val()[i].livres;

            var latLng = { lat: lat, lng: lng };

            // Cria o marcador
            var marker = new google.maps.Marker({
                position: latLng,
                map: map,
                title: nome,
                icon: 'img/marker.png'
            });
            //Adiciona-o no mapa
            marker.setMap(map);

            // Evento que dá instrução à API para estar alerta ao click no marcador.
            // Define o conteúdo e abre a Info Window.
            google.maps.event.addListener(marker, 'click', function () {
                

                var latLng2;

                for (var k = 0; k < snap.val().length; k++) {

                    if ($(this)[0].title == snap.val()[k].nome) {
                        var lat2 = snap.val()[k].latitude;
                        var lng2 = snap.val()[k].longitude;
                        var nome2 = snap.val()[k].nome;
                        var txt2 = snap.val()[k].bicicletas;
                        var txt12 = snap.val()[k].livres;

                        latLng2 = { lat: lat2, lng: lng2 };
                        //console.log(latLng2)
                        // Variável que define a estrutura do HTML a inserir na Info Window.
                        var Content = '<div id="iw_container">' +
                            '<div class="iw_title">' + nome2 + '</div>'
                            + '<div>' + '<p class="atualizar">' + 'Bicicletas:' + txt12 + '/' + txt2 + '</p>' + '</div>'
                            + '<div id="id_reserva">' + '<button class="reserva" value="' + k + '">' + 'Reservar' + '</button>' + '</div>' + '</div>';

                        break;
                    }

                }

                infowindow = new google.maps.InfoWindow({
                    content: Content
                });
                // O conteúdo da variável Content é inserido na Info Window.
                infoWindow.setContent(Content);

                // A Info Window é aberta com um click no marcador.
                infoWindow.open(map, marker);
                infoWindow.setPosition(latLng2)

            });
        }
    })

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            infoWindow = new google.maps.InfoWindow({ map: map });
            infoWindow.setPosition(pos);
            infoWindow.setContent('Você está aqui!');
            //map.setCenter(pos);
        }, function () {
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

