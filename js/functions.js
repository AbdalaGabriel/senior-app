
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

	projectPosition = 0;
	$(clientProjectsData).each(function(key, value)
	{
		tablaDatos.append('<div class="projectContainer" data-position="'+projectPosition+'" data-project-id="'+value.id+'">'+value.title+'</div>');
		projectPosition++;
	});

	$(".projectContainer").click(function()
	{
		thisProjectPosition = $(this).attr("data-position")
		console.log("- Posicion extraida: "+ thisProjectPosition);
		renderPhases(clientProjectsData, thisProjectPosition);
	});
}


// Render de Fases pro proyeceto
function renderPhases(clientProjectsData, thisProjectPosition)
{
	console.log("- Render de fases");
	console.log(thisProjectPosition);
	thisProjectPosition;
	console.log(thisProjectPosition);
	var thisProject = clientProjectsData[thisProjectPosition];

	$("#tituloProject").text(thisProject.title);
	$( ":mobile-pagecontainer" ).pagecontainer( "change", "#projectDetail");

	var projectPhases = thisProject.phases;
	var faesContainer = $("#Fases");
	$(projectPhases).each(function(key, value)
	{
		faesContainer.append('<div class="phaseContainer" data-phase-id="'+value.id+'">'+value.title+'</div>');
	});

	updatecards()

}





function updatecards()
{
	console.log( "- Iniciar la carga de tareas" );

	// Limpieza de listeners y contenedores de elementos.
	cleancolumns();
	//console.log( "- Limpieza" );


	// Generación dinámica de ruta en base a la vista de grupo de tareas activa.
	phaseId = $("#phaseId").val();
	taskroute = baseurl+"mis-proyectos/"+projectId+"/phases/"+phaseId+"/tareas";

	// Por cada columna de tareas ejecuto un llamado ajax queme traiga ordenadas mis tarjetas
	$(".task-column").each(function(key, value)
	{
		phaseId = $("#phaseId").val();
		thisColumn = $(this);
		thisColumnStatus = thisColumn.attr("data-tasks-status");
		token = $("#token").val();

		count = 0;
		//console.log("el status de esta columna es "+ thisColumnStatus);

		$.ajax(
		{
			url: baseurl+"phase/"+phaseId+"/tasks/"+thisColumnStatus,
			headers: {'X-CSRF-TOKEN': token},
			type: 'GET',
			dataType: 'json',
			
			success: function(data){
				//console.log("Orden!: ");
				//console.log(data);
				largoTarjetas = data.length;
				if(largoTarjetas > 0)
				{
					colstatus = data[0].status;
					columnForAppend = $('.task-column[data-tasks-status="'+colstatus+'"]')
					
					//console.log("data no es distinto de null y la columna es ");
					//console.log(columnForAppend);
					for(i=0;i<largoTarjetas;i++)
					{
						columnForAppend.append('<div  data-toggle="modal" data-target="#card-detail" class="task-container" data-task-order="'+data[i].task_order+'" data-task-status="'+data[i].status+'" data-task-id="'+data[i].id+'"><span data-status="4" data-id="'+data[i].id+'" class="hidecard">O</span><a href="#">'+data[i].title+'</a>'+data[i].description+'<p></p></div>');		
					}


				}	

				count = count+1;
				//console.log(count);
				if(count == 3){
					//console.log("terminaron las consultas, llamo func");
					eventsForCards();
				}

			}
		});

	});

	// consultar si hay tarjetas de tipo 4 para esta fase;
	projectId = $("#projectId").val();
	$.ajax(
	{
		url: baseurl+"phase/"+phaseId+"/tasks/4",
		headers: {'X-CSRF-TOKEN': token},
		type: 'GET',
		dataType: 'json',

		success: function(data){
				console.log("Ocultas: ");
				largoOcultas = data.length;

				if(largoOcultas > 0){
					$("#hiddenCards").text("Ver tarjetas ocultas de esta fase");

					$("#hiddenCards").attr("href", baseurl+"/mis-proyectos/"+projectId+"/phase/"+phaseId+"/tareas-ocultas");
				}
			}
		});


	// Llamado a listeners
	defineListerner();
	// Declaracion de contenedores de elementos draggeables.
	mannageDragAndDrop();
	//console.log("termino ajax");

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

