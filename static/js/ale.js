window.onload = function () {
  document.getElementById("valor-a-convertir").onchange = CheckMinVal;
  document.getElementById("valor-a-convertir2").onchange = CheckMinVal;
  document.getElementById("cambio-e-finanzas-titulo").hidden = true;
}

function ObjetivoPagar(){
  document.getElementById("total-a-recibir-titulo").innerHTML = 'Total a pagar <span style="color: grey">(en pesos uruguayos)</span>';
  document.getElementById("en-los-cambios-recibirias-titulo").innerHTML = "En otros cambios pagarías";
  document.getElementById("cambio-e-finanzas-titulo").hidden = true;
  document.getElementById("valor-a-convertir").value = "";
  document.getElementById("cambio-e-finanzas").innerHTML = "";
  document.getElementById("total-a-recibir").innerHTML = "";
  document.getElementById("en-los-cambios-recibirias").innerText =  "";
  document.getElementById("ganas").innerText = "";
}

function ObjetivoVender(){
  document.getElementById("total-a-recibir-titulo").innerHTML = 'Total a recibir <span style="color: grey">(en pesos uruguayos)</span>';
  document.getElementById("cambio-e-finanzas-titulo").hidden = true;
  document.getElementById("valor-a-convertir2").value = "";
  document.getElementById("en-los-cambios-recibirias-titulo").innerHTML = "En otros cambios recibirías";
  document.getElementById("cambio-e-finanzas").innerHTML = "";
  document.getElementById("total-a-recibir").innerHTML = "";
  document.getElementById("en-los-cambios-recibirias").innerText = "";
  document.getElementById("ganas").innerText = "";
}

// Set custom validity
function CheckMinVal() {
  // leer la tab de venta (default)
  var venta = document.getElementById("pills-home-tab");

  // leer los inputs de los dos forms
  var valor_a_convertir1 = document.getElementById("valor-a-convertir");
  var valor_a_convertir2 = document.getElementById("valor-a-convertir2");

  // leer el atributo "active" de la pestaña de venta para determinar en cual está
  // si esta en venta, el "valor_a_convertir" es el input1
  // si esta en compra, el "valor_a_convertir" es el input2
  if (venta.getAttribute("aria-selected") == "true"){
    var valor_a_convertir = valor_a_convertir1;
  }else{
    var valor_a_convertir = valor_a_convertir2;
  }

  // Pasar a dólar
  //  var interbancario_usd = 43.95
  //  var valor_en_dolares = valor_a_convertir.value / interbancario_usd;

  // si el valor es menor a 5000, mostrar mensaje personalizado
  // si es mayor a 5000, invocar a la funcion "Calculos()"
  // se evalua .value porque si no, no se podria hacer setCustomValidity
  if (valor_a_convertir.value < 5000) {
    let mensaje = "Ingrese un valor mayor a 5000 USD";
    valor_a_convertir.setCustomValidity(mensaje);
  }else{
    valor_a_convertir.setCustomValidity(Calculos());
    valor_a_convertir.setCustomValidity('')
  }
}


function Calculos(){
  // hacer el mismo proceso de verificación para determinar el "valor_a_convertir"
  // agregando un paso mas, y quedandonos solo con el valor numerico
  var venta = document.getElementById("pills-home-tab");
  var valor_a_convertir1 = document.getElementById("valor-a-convertir");
  var valor_a_convertir2 = document.getElementById("valor-a-convertir2");
  if (venta.getAttribute("aria-selected") == "true"){
    var valor_a_convertir = valor_a_convertir1;
    valor_a_convertir = parseInt(valor_a_convertir.value);
  }else{
    var valor_a_convertir = valor_a_convertir2;
    valor_a_convertir = parseInt(valor_a_convertir.value);
  }

  var interbancario_usd = parseFloat(document.getElementById("interbancario-usd").innerHTML)
  var compra_usd = parseFloat(document.getElementById("compra-usd").innerHTML)
  var venta_usd = parseFloat(document.getElementById("venta-usd").innerHTML)

  // calculo de porcentajes en funcion del valor en dólares
  var porcentaje = 0;
  if ((valor_a_convertir < 20000)){
    porcentaje = 0.004;
  }else if((valor_a_convertir >= 20000) && (valor_a_convertir < 40000)){
    porcentaje = 0.00365;
  }else if((valor_a_convertir >= 40000) && (valor_a_convertir < 80000)){
    porcentaje = 0.00335;
  }else if(valor_a_convertir >= 80000){
    porcentaje = 0.003;
  }
  
  // calculos
  if (venta.getAttribute("aria-selected") == "true"){
    var cambio_e_finanzas = (interbancario_usd * ( 1 - porcentaje)).toFixed(5);
    var total_a_recibir = (valor_a_convertir * cambio_e_finanzas).toFixed(2);
    var en_otros_cambios = (valor_a_convertir * compra_usd).toFixed(2);
    var ganas = (total_a_recibir - en_otros_cambios).toFixed(2);
  }else{
    var cambio_e_finanzas = (interbancario_usd * ( 1 + porcentaje)).toFixed(5);
    var total_a_recibir = (valor_a_convertir * cambio_e_finanzas).toFixed(2);
    var en_otros_cambios = (valor_a_convertir * venta_usd).toFixed(2);
    var ganas = (en_otros_cambios - total_a_recibir).toFixed(2);
  }

  // Formatearlos con coma, llamando a la funcion
  total_a_recibir = numberWithCommas(total_a_recibir);
  en_otros_cambios = numberWithCommas(en_otros_cambios);
  ganas = numberWithCommas(ganas);

  // reemplazar el contenido de las celdas con los resultados obtenidos
  document.getElementById("cambio-e-finanzas-titulo").hidden = false;
  document.getElementById("cambio-e-finanzas").innerHTML = cambio_e_finanzas;
  document.getElementById("total-a-recibir").innerHTML = "$ "+ total_a_recibir;
  document.getElementById("en-los-cambios-recibirias").innerText = "$ " + en_otros_cambios;
  document.getElementById("ganas").innerText = "$ " + ganas;
}

// funcion de formatear numeros con coma
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Prevent URL change on submit
var form = document.getElementById("form-submit");
var form2 = document.getElementById("form-submit2");
function handleForm(event) {
  event.preventDefault();
} 
  form.addEventListener('submit', handleForm);
  form2.addEventListener('submit', handleForm);
  