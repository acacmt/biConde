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

    //OCULTAÇÃO/MUDANÇAS CONFORME O LOGIN/LOGOUT
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            //LOGIN
            //User is signed in.

            //Esconde a janela Modal de iniciar sessão
            $('#login-modal').modal('hide');

            // $("#enviar").click(function () {
            //     alert("Enviado!!!")
            // });

            //Fecha a janela Modal dos contactos ao clicar no botão fechar
            $("#fechar").click(function () {
                $('#myModal').modal('hide');
            });

            //Altera a cor dos icons
            $('#lock').css("color", "#83bde3");
            $('#lock2').css("color", "#83bde3");

            //Permite o acesso aos icons locais e contacto
            $('#lock1').unbind("click");
            $('#lock3').unbind("click");

            //Permite o acesso aos botões da navbar dos locais e contacto
            $('#li_contactos').unbind("click");
            $('#li_locais').unbind("click");

            //Apresenta o email da pessoa logada
            $('#perfil').text(user.email);

            //
            $('#li_login').hide();
            $('#perfil').show();

            //Altera o icon Iniciar Sessão para o Terminar Sessão
            $("#change_text").html('<a href="" id="btnLogout"><i class="material-icons">exit_to_app</i><br>Terminar Sessão</a>');

            //Termina sessão ao clicar no botão
            $("#btnLogout").click(function () {
                logout();
            });

            $("#reserva").click(function () {
                console.log("CARREHUEI");
                $("#id_reserva").html('<p>Tem até 40 minutos para efectuar o levantamento da sua reserva!</p>');
                //$("#id_reserva").text("Tem até 40 minutos para efectuar o levantamento da sua reserva!");
                $("#id_reserva").css("color", "green");
            });

        } else {
            //LOGOUT
            // No user is signed in.

            //Altera a cor dos icons 
            $('#lock').css("color", "#d2dce8");
            $('#lock2').css("color", "#d2dce8");

            //Bloqueia o acesso aos icons locais e contacto
            $('#lock1').click(function (e) {
                e.preventDefault();
                alert('Inicie sessão ou registe-se para aceder!');
            })
            $('#lock3').click(function (e) {
                e.preventDefault();
                alert('Inicie sessão ou registe-se para aceder!');
            })

            //Bloqueia o acesso aos botões da navbar dos locais e contacto
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
})