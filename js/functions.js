
baseurl = "http://localhost:8000/";
var userID = "";
var userName = "";
var consulta = "";
var ajaxsuccess = false;
var clientProjectsData = "";
var firstPhase = "";
var todos = $("#todo-column");
var inprogress = $("#inprogress-column");
var done = $("#done-column");
var newComentForAppended = false;

var consultedDataProject = false;
//test2@test.com
//baseurl = "http://gabdala.ferozo.com/clean/public/";

$( document ).ready(function() {
	console.log("- Se inicia el documento");
	init();

	checkConection();
	initParticles();
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

function initParticles(){
	particlesJS.load('particles-js', 'js/particles/particles.json', function() {
	  console.log('callback - particles.js config loaded');
	});
}

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
function callAJAX(requesturl, ajaxmethod, callbackFunction)
{
	if(ajaxmethod == "simple")
	{
		console.log("- Funcion simple de peticiòn AJAX");
		var ajax =  $.get(requesturl, function(res)
		{
			console.log(res);
		})

		.done(function(res) 
		{
			console.log( "- Exito Ajax Carga" );
			consulta = res;
			if(callbackFunction == "projects" )
			{
				renderProjects(consulta);
			}
			else if(callbackFunction == "blog")
			{
				renderBlog(consulta);
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
		$.ajax(
		{
			url: requesturl,
			crossOrigin: true,
			type: 'GET',
			dataType: 'json',
			//data: {neworder: cardsPosition},

			success: function(res){
				console.log( "- Exito Ajax Carga" );
				consulta = res;
				if(callbackFunction == "cards" )
				{
					renderCards(consulta);
				}
				else if(callbackFunction == "comments")
				{
					newComentForAppended = true;
					renderComments(newComentForAppended);
				}			
			}
		});
	}
}




// -----------------------------------------------------------------------
// Pagina de inicio.
function pageInicio()
{
	$("#saludo").text("Hola, "+userName );
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

	$("#blogButton").click(function()
	{
		routeBlog = baseurl + "app/blog";
		callAJAX(routeBlog, "simple", "blog");
	});
	
}

function renderBlog(consulta)
{
	console.log(" - Render de posteos");
	postsData = consulta;
	postContainer = $("#postsContainer");
	postContainer.empty();
	$(postsData).each(function(key, value)
	{
		postContainer.append('<div class="simplepost-container" data-project-id="'+value.id+'">'+value.title+'</div>');
		
	});
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

	var thisProject = clientProjectsData[thisProjectPosition];

	$("#tituloProject").text(thisProject.title);
	$( ":mobile-pagecontainer" ).pagecontainer( "change", "#projectDetail");

	var projectPhases = thisProject.phases;
	var faesContainer = $("#Fases");
	faesContainer.empty();

	$(projectPhases).each(function(key, value)
	{
		faesContainer.append('<div class="phaseContainer" data-phase-id="'+value.id+'">'+value.title+'</div>');
	});

	// Selecciono primer fase, para apendearle las tarjetas a la pantalla.
	firstPhase = thisProject.phases[0];
	$("#phaseId").val(firstPhase.id);

	// Mi funcion de updateo de tarjetas, recibe la fase activa, con lo cual le envio la primera fase como fase activa.
	updatecards(firstPhase);

}

// Eventos de tarjetas.
function eventsForCards()
{
	console.log("- Eventos para tarjetas.");
	$(".task-container").off();
	$(".task-container").click(function()
	{
		console.log("- Click en tarjeta");
		
		// Extracion y seteo de variables
		cardId = $(this).attr("data-task-id");
		cardPosition = $(this).attr("data-array-position");
		fromPhase = $(this).attr("data-from-phase");
		title = $(this).find("a.titleCard").text();
		description = $(this).find("p.descriptionCard").text();
		cardroute = baseurl+"app/task/"+cardId+"/comments";
		
		// Ajax para ver comentarios
		callAJAX(cardroute, "complete", "cards");
		
		// Cambio de informacion en pantalla de render.
		$("#titleCardPage").text(title);
		$("#descriptionCardPage").text(description);
		$("#thisTaskId").val(cardId);

	});

}

// Render de tarjetas.
function renderCards(consulta)
{
	console.log("- Mostrando detalle de tarjeta");
	renderComments(consulta);

	$( ":mobile-pagecontainer" ).pagecontainer( "change", "#card");
	
	// Saco evento asi no se lo appendea cada vez que entra a la tarjeta y manda multiple cosltas.
	$("#sendComment").off();
	
	$("#sendComment").click(function()
	{
		console.log("Click en enviar comentario");
		newComment = $("#newComment").val();
		if(newComment != ""){
			console.log("- Enviar comentario");
			comentRoute = baseurl+"app/"+userID+"/task/"+cardId+"/"+newComment;
			console.log(comentRoute);
			callAJAX(comentRoute, "complete", "comments");
		}
		else
		{
			console.log("- Comentario vacio, no se envia nada");
		}
	});

 	// por ahora vamos a hacer una llamada ajax par ver comentarios
 	// fijarse luego sin conex, localstorage.

 }

 function renderComments(consulta){
 	console.log(consulta);

 	// SI lo que me llega e suna vairable en true significa que hay un nuevo comentario para apendear
 	// Lo hago via html no es necesario que haga una consulta ajax, si lo q me llega es un objeto json, aahi si.

 	if(newComentForAppended == true)
 	{
 		console.log("- Solo appendeo porque es un nuevo coment de la misma fase..");
 		commentsContainer = $("#cardComments");
 		newComment = $("#newComment").val();
 		$("#newComment").val("");
 		$("#newComment").attr("placeholder","Ingresar comentario");
 		// @TODO: hacer username un eleento html para extraer el nombre, ahora sale de un objeto json.
 		commentsContainer.append('<div class="commentContainer">'+newComment+'<p>by '+userName+'</p> </div>');
 		newComentForAppended = false;

 	}
 	else
 	{
		console.log("- Reset de coments porque llego objeto desde fase.");
		cardId = $("#thisTaskId").val();
		commentsContainer = $("#cardComments");
		commentsContainer.empty();
	 	//console.log("- Se agrego comentario");
	 	if (consulta != "No-comments")
		{
			console.log("- Render comments");
			$(consulta).each(function(key, value)
			{
				commentsContainer.append('<div class="commentContainer">'+value.comment+'<p>by '+value.username+'</p> </div>');
			});
		}
		else
		{
			console.log("- No tiene comentarios");
			commentsContainer.append('<p class="no-coments">Esta tarjeta no tiene comentarios</p>')
		}
	}
 }

// Fncion de limpieza de columnas.
 function cleancolumns()
 {
 	$("#confirm-create-task").off();
 	$("#new-task").off();

 	todos.empty();
 	inprogress.empty();
 	done.empty();
 }

 function updatecards(activephase)
 {
 	console.log( "- Iniciar la carga de tareas" );

	// Limpieza de listeners y contenedores de elementos.
	cleancolumns();
	//console.log( "- Limpieza" );


	// Generación dinámica de ruta en base a la vista de grupo de tareas activa.
	phaseId = activephase.id;
	console.log("Estoy laburando con la fase + " + phaseId);

	// Por cada columna de tareas leo mi objeto data.
	count = 0;
	$(".task-column").each(function(key, value)
	{
		// Fase actual
		phaseId = $("#phaseId").val();
		
		// Datos columna actual
		thisColumn = $(this);
		thisColumnStatus = thisColumn.attr("data-tasks-status");	
		console.log("el status de esta columna es "+ thisColumnStatus);

		// Búsqueda de tareas para éste estado de columna, dentro de ésta fase.
		switch(thisColumnStatus) 
		{
			case "1":
			console.log("Corresponde a: todos")
		        //console.log(activephase);
		        //console.log(activephase["cards"]);
		        //console.log(activephase["cards"]["todos"]);
		        largoTarjetas = activephase["cards"]["todos"].length;
		        thiscards = activephase["cards"]["todos"];
		        console.log("y tiene " + largoTarjetas + "tareas")
		        break;
		        case "2":
		        console.log("Corresponde a: in progress")
		        //console.log(activephase);
		        //console.log(activephase["cards"]);
		        //console.log(activephase["cards"]["inprogress"]);
		        largoTarjetas = activephase["cards"]["inprogress"].length;
		        thiscards = activephase["cards"]["inprogress"];
		        console.log("y tiene " + largoTarjetas + "tareas")
		        break;
		        case "3":
		        console.log("Corresponde a: done")
		        //console.log(activephase);
		        //console.log(activephase["cards"]);
		        //console.log(activephase["cards"]["done"]);
		        largoTarjetas = activephase["cards"]["done"].length;
		        thiscards = activephase["cards"]["done"];
		        console.log("y tiene " + largoTarjetas + "tareas")
		        break;

		        case "4":
		        console.log("Corresponde a: hidden")
		        //console.log(activephase);
		        //console.log(activephase["cards"]);
		        //console.log(activephase["cards"]["hidden"]);
		        largoTarjetas = activephas["cards"]["hidden"].length;
		        thiscards = activephase["cards"]["hidden"];
		        console.log("y tiene " + largoTarjetas + "tareas")
		        break;

		    }

		//largoTarjetas = activephase.cards.length;
		if(largoTarjetas > 0)
		{
			colstatus = thiscards[0].status;
			columnForAppend = $('.task-column[data-tasks-status="'+colstatus+'"]')

			console.log("data no es distinto de null y la columna es ");
			console.log(columnForAppend);
			for(i=0;i<largoTarjetas;i++)
			{
				columnForAppend.append('<div  class="task-container" data-array-position="'+i+'" data-from-phase="'+phaseId+'" data-task-order="'+thiscards[i].task_order+'" data-task-status="'+thiscards[i].status+'" data-task-id="'+thiscards[i].id+'"><span data-status="4" data-id="'+thiscards[i].id+'" class="hidecard">O</span><a class="titleCard" href="#">'+thiscards[i].title+'</a><p class="descriptionCard">'+thiscards[i].description+'</p></div>');							
			}

		}	

		count = count+1;
		//console.log(count);
		if(count == 3){
			console.log("terminaron las consultas, llamo func");
			eventsForCards();
		}
		
	});


	
	mannageDragAndDrop();
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

