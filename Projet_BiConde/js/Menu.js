//MAPA
var map;
function myMap() {
    var mapCanvas = document.getElementById("map");
    var mapOptions = {
        center: new google.maps.LatLng(41.353733, -8.747602),
        zoom: 14
    }

    //var infoWindow;
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
    firebase.initializeApp(config);

    var ref = firebase.database().ref().child("Locais");

    ref.on('value', snap => {
        for (var i = 0; i < snap.val().length; i++) {
            var lat = snap.val()[i].latitude;
            var lng = snap.val()[i].longitude;
            var nome = snap.val()[i].nome;


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
                var name = snap.val()[i].nome;
                var txt = snap.val()[i].bicicletas;
                var txt1 = snap.val()[i].livres;
                var Content = '<div id="iw_container">' +
                    '<div class="iw_title">' + name + '<p>' + 'Bicicletas:' + txt1 + '/' + txt + '</p>' + '<button id="reserva">' + 'Reservar' + '</button>' + '</div>';
                var infowindow = new google.maps.InfoWindow({
                    content: Content
                });
                // O conteúdo da variável iwContent é inserido na Info Window.
                infoWindow.setContent(Content);

                // A Info Window é aberta com um click no marcador.
                infoWindow.open(map, marker);

                // var infoWindow = new google.maps.InfoWindow({ map: map });

            });
        }




        //    // (function (marker, data) {
        //       var contentString  = '<div id="content"><div id="siteNotice"></div>' + 
        //       '<h4>' + 'fghjk' + '</h4>'+'</div></div>';
        //       var infowindow = new google.maps.InfoWindow({
        //       content: contentString
        //     });
        //       // Attaching a click event to the current marker
        //       google.maps.event.addListener(marker, "click", function (e) {
        //           console.log("ghjkk")
        //           //infoWindow.setContent(InfoWindow);
        //           infoWindow.open(map, marker);
        //       });
        //  // })
    })
    
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            var infoWindow = new google.maps.InfoWindow({ map: map });
            infoWindow.setPosition(pos);
            infoWindow.setContent('Você está aqui!');
            map.setCenter(pos);
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
      
      //INVOCAÇÃO DAS FUNÇÕES 
      $("#btnregisto").click(function () {
          createUser();
      });
      $("#btnLogin").click(function () {
          login();
      });
      
      //FUNÇÃO CRIAR UMA CONTA
      function createUser() {
        var email = $('#register_email').val();
        var password = $('#register_password').val();
        console.log(email, password)

        firebase.auth().createUserWithEmailAndPassword(email, password).catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log("code:" + errorCode + "message:" + errorMessage)
            if (errorCode == 'auth/weak-password') {
                alert('As palavras-passe têm de ter, no mínimo, 6 carateres!');
            }
            else if (errorCode == 'auth/email-already-in-use') {
                alert('Já alguém tem este endereço de e-mail. Experimente outro!');
            }
            else if (errorCode == 'auth/invalid-email') {
                alert('Introduza um endereço de e-mail válido!');
            }
            else if (errorCode == 'auth/operation-not-allowed') {
                alert('Não é possível elaborar o registo de momento!');
            }
        });
    }

    //FUNÇÃO INICIAR SESSÃO
    function login() {
        var email = $('#login_email').val();
        var password = $('#login_password').val();
        firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log("code:" + errorCode + "message:" + errorMessage)
            if (errorCode == 'auth/invalid-email') {
                alert('Dados incorretos!');
            }
            else if (errorCode == 'auth/wrong-password') {
                alert('Dados incorretos!');
            }
            else if (errorCode == 'auth/user-not-found') {
                alert('Dados incorretos!');
            }
            else {
                console.log("code:" + errorCode + "message:" + errorMessage)
            }
        })
    }

    //OCULTAÇÃO DOS ICONS CONFORME O LOGIN/LOGOUT
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.

            $('#login-modal').modal('hide');

            // $("#enviar").click(function () {
            //     alert("Enviado!!!")
            // });

            $("#fechar").click(function () {
                $('#myModal').modal('hide');
            });

            //altera a cor dos icons
            $('#lock').css("color", "#83bde3");
            $('#lock2').css("color", "#83bde3");

            //permite o acesso aos icons locais e contacto
            $('#lock1').unbind("click");
            $('#lock3').unbind("click");

            //permite o acesso aos botões da navbar dos locais e contacto
            $('#li_contactos').unbind("click");
            $('#li_locais').unbind("click");

            //apresenta o email da pessoa logada
            $('#perfil').text(user.email);


            $('#li_login').hide();
            $('#perfil').show();


            $("#change_text").html('<a href="" id="btnLogout"><i class="material-icons">exit_to_app</i><br>Terminar Sessão</a>');

            $("#btnLogout").click(function () {
                logout();
            });

            $("#reserva").click(function () {

            });


        } else {
            // No user is signed in.

            //altera a cor dos icons 
            $('#lock').css("color", "#d2dce8");
            $('#lock2').css("color", "#d2dce8");

            //bloqueia o acesso aos icons locais e contacto
            $('#lock1').click(function (e) {
                e.preventDefault();
                alert('Inicie sessão ou registe-se para aceder!');
            })
            $('#lock3').click(function (e) {
                e.preventDefault();
                alert('Inicie sessão ou registe-se para aceder!');
            })

            //bloqueia o acesso aos botões da navbar dos locais e contacto
            $('#li_locais').click(function (e) {
                e.preventDefault();
                alert('Inicie sessão ou registe-se para aceder!');
            })
            $('#li_contactos').click(function (e) {
                e.preventDefault();
                alert('Inicie sessão ou registe-se para aceder!');
            })

            $('#li_login').show();
            $('#perfil').hide();
        }
    });

    //FUNÇÃO FECHAR SESSÃO
    function logout() {
        firebase.auth().signOut().then(function () {
            // Sign-out successful.
            //direciona o utilizador para a página inicial
            window.location = "Menu.html";
        }, function (error) {
            // An error happened.
        });
    }




    //IMPORTAÇÃO DOS DADOS DO MAPA



})