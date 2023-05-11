hayUsuarioLogueado = false;

const api_url = "https://dwallet.develotion.com";

var nav = document.querySelector("ion-nav");
// var nav = "";

window.addEventListener("load", inicializar);

function inicializar(){

    // Router
    document.querySelector("#router").addEventListener("ionRouteDidChange", navegacion);

    //Creamos los eventos para cada boton
    // document.querySelector("#btnMenuHome").addEventListener("click", cargarSecciones);
    // document.querySelector("#btnMenuRegistro").addEventListener("click", cargarSecciones);
    // document.querySelector("#btnMenuLogin").addEventListener("click", cargarSecciones);
    // document.querySelector("#btnMenuLogout").addEventListener("click", cargarSecciones);
    document.querySelector("#btnMenuLogout").addEventListener("click", menuLogoutHandler);

    // Funcionalidades
    document.querySelector("#btnLoginSubmit").addEventListener("click", realizarLogin);
    document.querySelector("#btnRegistroSubmit").addEventListener("click", realizarRegistro);
    document.querySelector("#btnGastoSubmit").addEventListener("click", agregarGasto);
    document.querySelector("#btnIngresoSubmit").addEventListener("click", agregarIngreso);

    document.querySelector("#btnCompartir").addEventListener("click", compartirApp);





    
    activarUsuarioLogeado();
}

/******************************
 * Asuntos de navegacion/ionic
 ******************************/

function navegar(pantalla) {
    nav.push(pantalla);
}

function cerrarMenu() {
    document.querySelector("#menu").close();
}

function navegacion(event){
    const pantalla = event.detail.to;
    ocultarPantallas();
    if(pantalla === "/"){
        mostrarHome();
    } else if(pantalla === "/login"){
        mostrarLogin();
    }else if(pantalla === "/registro"){
        mostrarRegistro();
    } else if(pantalla === "/gasto"){
        mostrarGasto();
    } else if(pantalla === "/ingreso"){
        mostrarIngreso();
    } else if(pantalla === "/movimientos"){
        mostrarMovimientos();
    } else if(pantalla === "/montos"){
        mostrarMontos();
    } else if(pantalla === "/mapa"){
        mostrarMapa();
    }
}


function ocultarPantallas(){
    document.querySelector("#pantalla-login").style.display = "none";
    document.querySelector("#pantalla-home").style.display = "none";
    document.querySelector("#pantalla-registro").style.display = "none";
    document.querySelector("#pantalla-logout").style.display = "none";
    document.querySelector("#pantalla-gasto").style.display = "none";
    document.querySelector("#pantalla-ingreso").style.display = "none";
    document.querySelector("#pantalla-movimientos").style.display = "none";
    document.querySelector("#pantalla-montos").style.display = "none";
    document.querySelector("#pantalla-mapa").style.display = "none";



}

function mostrarHome(){
    document.querySelector("#pantalla-home").style.display = 'block';
}

function mostrarLogin(){
    document.querySelector("#pantalla-login").style.display = 'block';
}

function mostrarRegistro(){
    document.querySelector("#pantalla-registro").style.display = 'block';
    cargarDepartamentos();
    cargarCiudades();
}

function mostrarGasto(){
    document.querySelector("#pantalla-gasto").style.display = 'block';
    cargarRubrosGastos();
}

function mostrarIngreso(){
    document.querySelector("#pantalla-ingreso").style.display = 'block';
    cargarRubrosIngreso();
}

function mostrarMovimientos(){
    document.querySelector("#pantalla-movimientos").style.display = 'block';
    cargarMovimientos();
}

function mostrarMontos(){
    document.querySelector("#pantalla-montos").style.display = 'block';
    cargarMontosTotales();
}

function mostrarMapa(){
    document.querySelector("#pantalla-mapa").style.display = 'block';
    cargarPosicionUsuario();
    // getCajerosCercanos();
    // obtenerCajerosApi();
}

function menuLogoutHandler(){
    ocultarPantallas();
    logout();
    // mostrarHome();
}

// LOGOUT
function logout(){
    localStorage.removeItem("usuarioAPP");
    nav = document.querySelector("ion-nav");
    navegar("pantalla-logout");
    nav.popToRoot();
    activarUsuarioLogeado();
}


function activarUsuarioLogeado(){
    if(estaLogeado()){
        
        let usr = localStorage.getItem("usuarioAPP");
        // usr = JSON.parse(usr);

        document.querySelector("#divInicioUsuarioDesconocido").style.display = "none";

        document.querySelector("#divInicioUsuarioLogeado").style.display = "block";        
        document.querySelector("#pMensajeLogeado").innerHTML="Bienvenido a la app de tus finanzas.";


        ocultarOpcionesMenu();
        document.querySelector("#btnMenuLogout").style.display = 'block';
        document.querySelector("#btnMenuHome").style.display = 'block';
        document.querySelector("#btnMenuAgregarGasto").style.display = 'block';
        document.querySelector("#btnMenuAgregarIngreso").style.display = 'block';
        document.querySelector("#btnMenuMovimientos").style.display = 'block';
        document.querySelector("#btnMenuMontos").style.display = 'block';
        document.querySelector("#btnMenuMapa").style.display = 'block';




    }else{

        ocultarOpcionesMenu();
        document.querySelector("#btnMenuLogin").style.display = 'block';
        document.querySelector("#btnMenuRegistro").style.display = 'block';
        document.querySelector("#btnMenuHome").style.display = 'block';

        // document.querySelector("#btnCerrarSesionMenu").style.display = "none";

        document.querySelector("#divInicioUsuarioLogeado").style.display = "none";
        document.querySelector("#divInicioUsuarioDesconocido").style.display = "block";
    }
}

function estaLogeado(){
    if(localStorage.getItem("usuarioAPP")){
        return true;
    }
    return false;    
}

function ocultarOpcionesMenu() {
    document.querySelector("#btnMenuHome").style.display = 'none';
    document.querySelector("#btnMenuLogin").style.display = 'none';
    document.querySelector("#btnMenuRegistro").style.display = 'none';
    document.querySelector("#btnMenuLogout").style.display = 'none';
    document.querySelector("#btnMenuAgregarGasto").style.display = 'none';
    document.querySelector("#btnMenuAgregarIngreso").style.display = 'none';
    document.querySelector("#btnMenuMovimientos").style.display = 'none';
    document.querySelector("#btnMenuMontos").style.display = 'none';
    document.querySelector("#btnMenuMapa").style.display = 'none';

    
}


/******************************
 * LOGIN
 ******************************/

function realizarLogin(){
    let usuario = document.querySelector("#txtUsuarioLogin").value;
    let pass = document.querySelector("#txtPasswordLogin").value;

    let user = {
        "usuario": usuario,
        "password": pass
    }

    loginContraAPI(user);
    nav = document.querySelector("ion-nav");
    navegar("pantalla-home");

    document.querySelector("#txtUsuarioLogin").value = "";
    document.querySelector("#txtPasswordLogin").value = "";

}

function loginContraAPI(unUsuario){
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify(unUsuario);

    var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
    };

    fetch(api_url+"/login.php", requestOptions)
    // .then(response => response.text())
    // .then(result => console.log(result))
    // .catch(error => console.log('error', error));
    .then(response => response.json())
    .then(function(resp){
        if(resp.codigo == 200){
            hayUsuarioLogueado = true;
            // localStorage.setItem("usuarioAPP",JSON.stringify(resp.apiKey));
            localStorage.setItem("usuarioAPP", resp.apiKey);
            localStorage.setItem("idUsuario", resp.id);

            // document.querySelector("pantalla-login").style.display = "none";
            activarUsuarioLogeado();
            document.querySelector("#pLoginMensajes").innerHTML="";
        }else{
            document.querySelector("#pLoginMensajes").style.color = "red";
            document.querySelector("#pLoginMensajes").innerHTML=resp.mensaje;
        }        
    })
    .catch(error => console.log('error', error));
}

/******************************
 * REGISTRO
 ******************************/

function realizarRegistro(){
    try{
        // GENERO UNA NUEVA INSTANCIA EN LA CLASE USUARIO
        let newUser = crearUsuario();
        // VALIDO LOS DATOS DEL NUEVO USUARIO
        validarUsuario(newUser);
        // GUARDO EL NUEVO USUARIO EN LA API
        guardarUsuarioApi(newUser);
    } catch(error){
        document.querySelector("#pMensajeRegistro").style.color = "red";
        document.querySelector("#pMensajeRegistro").innerHTML = error.message;
    }

    // activarUsuarioLogeado();
    // loginContraAPI(newUser);
    // nav = document.querySelector("ion-nav");
    // navegar("pantalla-home");
}

function crearUsuario(){
    let usuario = document.querySelector("#txtUsuarioRegistro").value;
    let password = document.querySelector("#txtPasswordRegistro").value;
    let idDepartamento = Number(document.querySelector("#slcDepartamentoRegistro").value);
    let idCiudad = Number(document.querySelector("#slcCiudadRegistro").value);

    return new Usuario(usuario,password,idDepartamento,idCiudad);
}

function validarUsuario(usuario){

    if(usuario.usuario === "") {
        throw new Error("El usuario no puede estar vacío");
    }
    if(usuario.password==="" || usuario.password.trim().length<8 || usuario.password.trim().length>20 ){
        throw new Error("La contraseña es obligatorio y debe tener entre ocho y veinte caracteres");
    }
    if(usuario.idDepartamento === "") {
        throw new Error("El departamento no puede estar vacío");
    }        
    if(usuario.idCiudad === "") {
        throw new Error("La ciudad no puede estar vacía");
    }        
       
}

function guardarUsuarioApi(unUsuario){
    
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify(unUsuario),    
        redirect: 'follow'
    };

    fetch(api_url+"/usuarios.php", requestOptions)
    .then((resp) => resp.json())    
    .then(function(response){
        if(response.codigo=="200"){
            document.querySelector("#pMensajeRegistro").style.color = "green";
            document.querySelector("#pMensajeRegistro").innerHTML="Registro correcto";
            localStorage.setItem("usuarioAPP",JSON.stringify(response.apiKey));
            activarUsuarioLogeado();
        }else{
            document.querySelector("#pMensajeRegistro").style.color = "red";
            document.querySelector("#pMensajeRegistro").innerHTML=response.mensaje;
        }
    })
    .catch(error => console.log(error));
}

// CARGAR SLC DEPARTAMENTOS 
async function cargarDepartamentos(){
    // defino lista de departamentos :
    var departamentos = await getDepartamentosApi();
    var slcDepartamentos = document.getElementById("slcDepartamentoRegistro");

    for(let i = 0; i <= departamentos.length; i++){
        let departamento = departamentos[i];
        let option = "<ion-select-option value='"+departamento.id+"'>"+departamento.nombre+"</ion-select-option>";
        slcDepartamentos.innerHTML += option;
    }
}

// OBTENER DEPARTAMENTOS API
async function  getDepartamentosApi(){
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    // var urlencoded = new URLSearchParams();

    var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    // body: urlencoded,
    redirect: 'follow'
    };

    return await fetch(api_url+"/departamentos.php", requestOptions)
    .then(response => response.json())
    .then(result => JSON.parse(JSON.stringify(result.departamentos)))
    .catch(error => JSON.parse(JSON.stringify(error)))
}

// CARGAR SLC CIUDADES
async function cargarCiudades(){
    var ciudades = await getCiudadesApi();
    var slcCiudades = document.getElementById("slcCiudadRegistro");

    for(let i = 0; i <= ciudades.length; i++){
        let ciudad = ciudades[i];
        let option = "<ion-select-option value='"+ciudad.id+"'>"+ciudad.nombre+"</ion-select-option>";
        slcCiudades.innerHTML += option;
    }
}

// OBTENER CIUDADES API
async function getCiudadesApi(){

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
    };

    return await fetch(api_url+"/ciudades.php", requestOptions)
    .then(response => response.json())
    .then(result => JSON.parse(JSON.stringify(result.ciudades)))
    .catch(error => JSON.parse(JSON.stringify(error)))
}

/******************************
 * GASTOS
 ******************************/


// CARGAR SLC RUBRIOS 
async function cargarRubrosGastos(){
    // defino lista de departamentos :
    var rubros = await getRubrosApi();
    var slcRubros = document.getElementById("slcRubroGasto");

    for(let i = 0; i <= 5; i++){
        let rubro = rubros[i];
        let option = "<ion-select-option value='"+rubro.id+"'>"+rubro.nombre+"</ion-select-option>";
        slcRubros.innerHTML += option;
    }
}

// OBTENER RUBROS API
async function  getRubrosApi(){
    let user = localStorage.getItem("usuarioAPP");
    // user = JSON.parse(user);
    // console.log(user);
    // console.log(`${user}`);

    // console.log(JSON.stringify(user));
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("apikey", `${user}`);
    // var urlencoded = new URLSearchParams();

    var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    // body: urlencoded,
    redirect: 'follow'
    };

    return await fetch(api_url+"/rubros.php", requestOptions)
    .then(response => response.json())
    .then(result => JSON.parse(JSON.stringify(result.rubros)))
    .catch(error => JSON.parse(JSON.stringify(error)))
}

function agregarGasto(){
    let laApiKey = localStorage.getItem("usuarioAPP");
    let elUserId = localStorage.getItem("idUsuario");

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("apikey", `${laApiKey}`);

    var raw = JSON.stringify({
    "idUsuario": Number(elUserId),
    "concepto": document.querySelector("#txtConceptoGasto").value,
    "categoria": Number(document.querySelector("#slcRubroGasto").value),
    "total": document.querySelector("#txtTotalGasto").value,
    "medio": document.querySelector("#slcMedioGasto").value,
    "fecha": document.querySelector("#txtFechaGasto").value
    });

    var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
    };

    fetch(api_url+"/movimientos.php", requestOptions)
    .then((resp) => resp.json())
    .then(function(response){
        if(response.codigo==200){
            document.querySelector("#pMensajeAgregarGasto").style.color = "green";
            document.querySelector("#pMensajeAgregarGasto").innerHTML=response.mensaje;
        }else{
            document.querySelector("#pMensajeAgregarGasto").style.color = "red";
            document.querySelector("#pMensajeAgregarGasto").innerHTML=response.error;
        }
    })
    .catch(error => console.log('error', error));


    document.querySelector("#txtConceptoGasto").value = "";
    document.querySelector("#slcRubroGasto").value = "";
    document.querySelector("#slcMedioGasto").value = "";
    document.querySelector("#txtTotalGasto").value = "";
    document.querySelector("#txtFechaGasto").value = "";

}

/******************************
 * INGRESOS
 ******************************/


// CARGAR SLC RUBRIOS 
async function cargarRubrosIngreso(){
    // defino lista de departamentos :
    var rubros = await getRubrosApi();
    var slcRubros = document.getElementById("slcRubroIngreso");

    for(let i = 6; i <= 11; i++){
        let rubro = rubros[i];
        let option = "<ion-select-option value='"+rubro.id+"'>"+rubro.nombre+"</ion-select-option>";
        slcRubros.innerHTML += option;
    }
}

function agregarIngreso(){
    let laApiKey = localStorage.getItem("usuarioAPP");
    let elUserId = localStorage.getItem("idUsuario");

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("apikey", `${laApiKey}`);

    var raw = JSON.stringify({
    "idUsuario": Number(elUserId),
    "concepto": document.querySelector("#txtConceptoIngreso").value,
    "categoria": Number(document.querySelector("#slcRubroIngreso").value),
    "total": document.querySelector("#txtTotalIngreso").value,
    "medio": document.querySelector("#slcMedioIngreso").value,
    "fecha": document.querySelector("#txtFechaIngreso").value
    });

    var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
    };

    fetch(api_url+"/movimientos.php", requestOptions)
    .then((resp) => resp.json())
    .then(function(response){
        if(response.codigo==200){
            document.querySelector("#pMensajeAgregarIngreso").style.color = "green";
            document.querySelector("#pMensajeAgregarIngreso").innerHTML=response.mensaje;
        }else{
            document.querySelector("#pMensajeAgregarIngreso").style.color = "red";
            document.querySelector("#pMensajeAgregarIngreso").innerHTML=response.error;
        }
    })
    .catch(error => console.log('error', error));


    document.querySelector("#txtConceptoIngreso").value = "";
    document.querySelector("#slcRubroIngreso").value = "";
    document.querySelector("#slcMedioIngreso").value = "";
    document.querySelector("#txtTotalIngreso").value = "";
    document.querySelector("#txtFechaIngreso").value = "";
}

/******************************
 * LISTAR MOVIMIENTOS
 ******************************/



async function obtenerMovimientosApi(){
    let laApiKey = localStorage.getItem("usuarioAPP");
    let elUserId = localStorage.getItem("idUsuario");

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("apikey", `${laApiKey}`);

    var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
    };

    return await fetch(api_url+"/movimientos.php?idUsuario="+elUserId, requestOptions)
    .then(response => response.json())
    .then(result => JSON.parse(JSON.stringify(result.movimientos)))
    .catch(error => JSON.parse(JSON.stringify(error)))
}

async function cargarMovimientos(){
    let movimientos = await obtenerMovimientosApi();
    let divMovimientos = document.querySelector("#divMovimientos");

    for(let i = 0 ; i < movimientos.length ; i++){
        let movimiento = movimientos[i];
        let card ="<ion-card><ion-card-header><ion-card-title>"+movimiento.concepto+" - $ "+movimiento.total+"</ion-card-title><ion-card-subtitle>"+movimiento.medio+"</ion-card-subtitle></ion-card-header><ion-card-content>"+movimiento.fecha+"</ion-card-content><ion-button id='"+movimiento.id+"' class='btnEliminarMovimiento' >Eliminar</ion-button></ion-card>";
        divMovimientos.innerHTML += card;
    }

    let botones = document.querySelectorAll(".btnEliminarMovimiento");
    botones.forEach(element => {
        element.addEventListener("click", eliminarMovimientoApi(this.id))
    })
}

async function cargarMovimientosPorTipo(){
    document.querySelector("#divMovimientos").style.display = 'none';
    document.querySelector("#divGastos").style.display = 'none';
    document.querySelector("#divIngresos").style.display = 'none';

    let divGastos = document.querySelector("#divGastos");
    let divIngresos = document.querySelector("#divIngresos");

    let tipoMov = document.querySelector("#slcTipoMovimiento").value;
    let movimientos = await obtenerMovimientosApi();

    if(tipoMov == "Gasto"){
        divGastos.innerHTML = "";
        divGastos.style.display = 'block';
        for(let i = 0; i<movimientos.length;i++){
            let movimiento = movimientos[i];
            if(movimiento.categoria <= 6){
                let card ="<ion-card><ion-card-header><ion-card-title>"+movimiento.concepto+" - $ "+movimiento.total+"</ion-card-title><ion-card-subtitle>"+movimiento.medio+"</ion-card-subtitle></ion-card-header><ion-card-content>"+movimiento.fecha+"</ion-card-content><ion-button id='"+movimiento.id+"' class='btnEliminarMovimiento' >Eliminar</ion-button></ion-card>";
                divGastos.innerHTML += card;
            }
        }
    } else if(tipoMov == "Ingreso"){
        divIngresos.innerHTML = "";
        divIngresos.style.display = 'block';
        for(let i = 0; i<movimientos.length;i++){
            let movimiento = movimientos[i];
            if(movimiento.categoria > 6){
                let card ="<ion-card><ion-card-header><ion-card-title>"+movimiento.concepto+" - $ "+movimiento.total+"</ion-card-title><ion-card-subtitle>"+movimiento.medio+"</ion-card-subtitle></ion-card-header><ion-card-content>"+movimiento.fecha+"</ion-card-content><ion-button id='"+movimiento.id+"' class='btnEliminarMovimiento' >Eliminar</ion-button></ion-card>";
                divIngresos.innerHTML += card;
            }
        }
    }
    
}

function eliminarMovimientoApi(idMov){
    let laApiKey = localStorage.getItem("usuarioAPP");

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("apikey", `${laApiKey}`);

    var raw = JSON.stringify({
    "idMovimiento": idMov
    });

    var requestOptions = {
    method: 'DELETE',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
    };

    fetch(api_url+"/movimientos.php", requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
}

async function cargarMontosTotales(){
    let movimientos = await obtenerMovimientosApi();
    let gastos = 0;
    let ingresos = 0;

    for(let i = 0 ; i < movimientos.length ; i++){
        let movimiento = movimientos[i];
        if(movimiento.categoria <= 6){
            gastos += movimiento.total;
        }else if(movimiento.categoria > 6){
            ingresos += movimiento.total;
        }
    }

    let total = ingresos - gastos;

    document.querySelector("#txtTotalIngresos").innerHTML = "   $"+ingresos;
    document.querySelector("#txtTotalGastos").innerHTML = "   $"+gastos;
    document.querySelector("#txtSaldoRestante").innerHTML = "   $"+total;


}

/******************************
 * MAPA CAJEROS
 ******************************/

let posUsu = null;
let map = null;
let distAux = 1;

async function obtenerCajerosApi(){
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    // var urlencoded = new URLSearchParams();

    var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    // body: urlencoded,
    redirect: 'follow'
    };

    return await fetch(api_url+"/cajeros.php", requestOptions)
    .then(response => response.json())
    .then(result => JSON.parse(JSON.stringify(result.cajeros)))
    .catch(error => JSON.parse(JSON.stringify(error)))
}

function cargarPosicionUsuario() {
    window.navigator.geolocation.getCurrentPosition(obtenerUbicacionBrowser,errorObtenerUbicacionBrowser);
}

function obtenerUbicacionBrowser(pos){
    posUsu = {
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        accuracy: pos.coords.accuracy
    };
    inicializarMapa();

    // dibujarDistanciaEntreDosPuntos([posUsu.latitude, posUsu.longitude], [-34.903816878014354, -56.19059048108193]);
}

function inicializarMapa() {
    
    map = L.map('contenedorMapa').setView([posUsu.latitude, posUsu.longitude], 13);

    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWNhaWFmYSIsImEiOiJjanh4cThybXgwMjl6M2RvemNjNjI1MDJ5In0.BKUxkp2V210uiAM4Pd2YWw', {
    //L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        id: 'mapbox/streets-v11',
        accessToken: 'your.mapbox.access.token'
    }).addTo(map);

    dibujarPosicionUsuario();
    agregarCajerosAlMapa();

    map.on("click", onMapa);
}

function dibujarPosicionUsuario() {
    L.marker([posUsu.latitude, posUsu.longitude]).addTo(map).bindPopup("Tu ubicación").on('click', onMapa);
}

function onMapa(e){
    console.log(e);
}

function errorObtenerUbicacionBrowser () {
    //definimos una ubicacion por defecto
    alert("Ocurrió un error al obtener la posición del usuario");
    posUsu = {
        latitude: -34.903816878014354,
        longitude: -56.19059048108193
    };
    inicializarMapa();
}

function calcularDistanciaEntrePuntos(puntoInicial, puntoFinal) {
    // Dividimos entre 1000 para pasar de m a km.
    let distancia = Number(map.distance(puntoInicial, puntoFinal) / 1000).toFixed(2);
    return distancia;
}


async function agregarCajerosAlMapa(){

    let cajeros = await obtenerCajerosApi();
    // console.log(cajeros);
    let disponible = "";
    let depositos = "";

    for(let i=0; i < cajeros.length; i++){
        let cajero = cajeros[i];
        let distancia = calcularDistanciaEntrePuntos([posUsu.latitude, posUsu.longitude], [cajero.latitud, cajero.longitud]);

        if(cajero.disponible == 1){
            disponible =  "si";
        }else{
            disponible = "no";
        }

        if(cajero.depositos == 1){
            depositos = "si";
        }else{
            depositos = "no";
        }

        if(distancia <= distAux){
            L.marker([cajero.latitud, cajero.longitud]).addTo(map).bindPopup("Cajero, Disponible: "+disponible+", Depositos: "+depositos);
        }
    }
}

// import { Share } from '@capacitor/share';

async function compartirApp(){
    await Share.share({
        title: 'Proyecto Taller ORT',
        text: 'Obligatorio taller de dispositivos móviles',
        url: 'https://dwallet.develotion.com/site/',
        // dialogTitle: 'Share with buddies',
      });
}