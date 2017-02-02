
baseurl = "http://localhost:8000/";
var userID = "";
var userName = "";
var consulta = "";
var ajaxsuccess = false;
var clientProjectsData = "";

var consultedDataProject = false;
//test2@test.com
//baseurl = "http://gabdala.ferozo.com/clean/public/";

$( document ).ready(function() {
	console.log("- Se inicia el documento");
	init();

	checkConection();
	//baseurl = "http://gabdala.ferozo.com/clean/public/";
	
	// Chequeamos si el server de destino soporta CORS
	// ENGLOBAR EN FUNCION CHEQUEOS, QUE VERIFIQUE TAMBN CONEXION	
	var xhr = createCORSRequest('GET', baseurl+"admin/portfolio");
	if (!xhr) {
		console.log(" - CORS  not Suported");
		throw new Error('CORS not supported');
	}else{
		console.log("- CORS Suported");
	}
});

function checkConection()
{		
		// Pregunto por conexión.
		if (navigator.onLine) {
			
			console.log('- Online');
			/*var datosGuardados;
			if(localStorage==undefined){
				console.log("Vaceeoo");
				needLogin();
			} 
			else{
				needLogin();
		 		
				//obtenerActualizados();
			
			}*/
		}	
		else 
		{  
			console.log('- Offline');	
		}
	}



	function init()
	{
		console.log("- Inicio de funcionalidades");
	//Pantalla de login
	loginfunction();

}



function loginfunction()
{
	console.log("- Pantalla de Login");

	submit = $("#loguser");
	email = $(".mail");
	pass = $(".pw");
	
	submit.click(function()
	{
		console.log("- Click enviar login");
		valorEmail = email.val();
		valorPass = pass.val();
		loginroute = baseurl + "app/userlogin/" + valorEmail;

		// Validaciones de login
		if(valorEmail == "" )
		{
			console.log("Debe enviar un mail");
		}
		else if(valorPass == "")
		{
			console.log("Debe ingresar su password");
		}
		else
		{
			console.log("- Se envia login");
			$.ajax(
			{
				crossOrigin: true,
				url: loginroute,
				type: 'GET',
				dataType: 'json',

				success: function(data)
				{
					console.log(data);
					console.log("- Se logueo usuario");
					userID = data[0].id;
					userName = data[0].name;
					

					$( ":mobile-pagecontainer" ).pagecontainer( "change", "#inicio");
					/*$( ":mobile-pagecontainer" ).pagecontainer({
						show: function( event, ui ) {
							console.log("- show");
							pageInicio();
						}
					});*/
					pageInicio();
				}
			});
		}

	});
}

// Funcion automatizada para hace run AJAX request
function callAJAX(url, ajaxmethod, callbackFunction)
{
	if(ajaxmethod == "simple")
	{
		console.log("- Funcion simple de peticiòn AJAX");
		var ajax =  $.get(url, function(res)
		{
			console.log(res);
		})

		.done(function(res) 
		{
			console.log( "- Exito Ajax Carga" );
			consulta = res;
			if(callbackFunction = "projects" )
			{
				renderProjects(consulta);
			}			
		})

		.fail(function()
		{ 
			console.log( "- Error en carga Ajax" );
		})
	}
	else if (ajaxmethod == "complete")
	{
		console.log("Completo");
	}
}


// -----------------------------------------------------------------------
// Pagina de inicio.
function pageInicio()
{
	$("#saludo").text("Bienvenido, "+userName );
	console.log("- Mostrando página proyectos");
	var route = baseurl+"app/projects/" + userID;
	if(!consultedDataProject)
	{
		console.log("- Consulto datos de proyectos por primera vez");
		callAJAX(route, "simple", "projects");
	}
	else
	{
		console.log("- Datos ya consultados, no vuelvo a hacer ajax")
	}
	
}

// Render de proyectos.
// -----------------------------------------------------------------------

function renderProjects(consulta)
{
	console.log(" - Render de proyectos");
	clientProjectsData = consulta;
	tablaDatos = $("#proyectos");
	tablaDatos.empty();

	$(clientProjectsData).each(function(key, value)
	{
		tablaDatos.append('<div class="projectContainer" data-project-id="'+value.id+'">'+value.title+'</div>');
	});

	$(".projectContainer").click(function()
	{
		projectID = $(this).attr("data-project-id")
		console.log("- Project Id extraido: "+ projectID);
		renderPhases(clientProjectsData, projectID);
	});
}


// Render de Fases pro proyeceto
function renderPhases(clientProjectsData, projectID)
{
	console.log("- Render de fases");
	console.log(projectID);
	projectArrayPosition = projectID - 1;
	console.log(projectArrayPosition);
	var thisProject = clientProjectsData[projectArrayPosition];

	$("#tituloProject").text(thisProject.title);
	$( ":mobile-pagecontainer" ).pagecontainer( "change", "#projectDetail");

	var projectPhases = thisProject.phases;
	var faesContainer = $("#Fases");
	$(projectPhases).each(function(key, value)
	{
		faesContainer.append('<div class="phaseContainer" data-phase-id="'+value.id+'">'+value.title+'</div>');
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

