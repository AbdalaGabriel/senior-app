$( document ).ready(function() {
	console.log("- Se inicia el documento");
	init();
	baseurl = "http://gabdala.ferozo.com/test/public/";

	// Chequeamos si el server de destino soporta CORS
	// ENGLOBAR EN FUNCION CHEQUEOS, QUE VERIFIQUE TAMBN CONEXION	
	var xhr = createCORSRequest('GET', baseurl+"admin/portfolio");
	if (!xhr) {
		console.log("CORS  not Suported");
	  throw new Error('CORS not supported');
	}else{
		console.log("CORS Suported");
	}
});




function init(){
	console.log("- Inicio de funcionalidades");

  // Funcionalidad página proyectos.
  $("#toProjects").click(function()
  {
  	console.log("- Mostrando página proyectos");
  	var route = baseurl+"app/projects";
  	tablaDatos = $("#proyectos");
 
	//Petición AJAX a la API.
	var consulta =  $.get(route, function(res)
	{
		console.log(res);
		
	})

	.done(function() 
	{
		console.log( "- Exito Ajax Carga" );
	})

	.fail(function()
	{ 
		console.log( "Error en carga Ajax" );
	})
});

}










// -----------------------------------------------------------------------
// Funcion para saber si server de destino soporta CORS:

function createCORSRequest(method, url) {
  var xhr = new XMLHttpRequest();
  if ("withCredentials" in xhr) {

    // Check if the XMLHttpRequest object has a "withCredentials" property.
    // "withCredentials" only exists on XMLHTTPRequest2 objects.
    xhr.open(method, url, true);

  } else if (typeof XDomainRequest != "undefined") {

    // Otherwise, check if XDomainRequest.
    // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
    xhr = new XDomainRequest();
    xhr.open(method, url);

  } else {

    // Otherwise, CORS is not supported by the browser.
    xhr = null;

  }
  return xhr;
}

