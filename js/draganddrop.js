
function mannageDragAndDrop()
{
	console.log("Mannaging drag and drop");
	// Permito drag and drop en los contenedores.
	todos.sortable({
		connectWith: "div",
		helper : 'clone',
	});
	inprogress.sortable({
		connectWith: "div",
		helper : 'clone',
	});
	done.sortable({
		connectWith: "div",
		helper : 'clone'
	});

	// Evento se cambia el orden dentro de una misma columna
	$( ".task-column" ).on( "sortstop", function( event, ui ) 
	{
		thiscolumn = $(this);
		thiscolumnStatus = thiscolumn.attr("data-tasks-status");

		var draggedObject = ui.item;
		var taskID = draggedObject.attr("data-task-id");
		
		//console.log("se ha terminado de ordenar")
		//Cambio de orden de las tarjetas que tiene la tarea.
		// y los voy acumulando en un array para enviar.
		cardsPosition = new Array();
		thiscolumn.find('.task-container').each(function(i, el)
		{
			thisCard = $(this);
			thisCard.attr('data-task-order', i);
			//console.log(i);
			var thisId = $(this).attr('data-task-id');
			var thisPos = $(this).attr('data-task-order');
			cardsPosition[i]={position: thisPos, id: thisId};
			i++;
		});

		// Convertir array a string para mandar a get.
		cardsPosition = JSON.stringify(cardsPosition);

		console.log(cardsPosition);
		//console.log(cardsPosition);
		token = $("#token").val();
		// Ejecuto Ajax enviando nuevo orden a la bd
		$.ajax(
		{
			url: baseurl+"app/tasks/"+taskID+"/changeorder/"+cardsPosition,
			crossOrigin: true,
			type: 'GET',
			dataType: 'json',
			//data: {neworder: cardsPosition},

			success: function(){
				//console.log("Se grabo el nuevo orden en la base de datos");
			}
		});

	});

	
	// Evento: se droppea una tarjeta en otra columina.
	$(".task-column").on( "sortreceive", function( event, ui ) 
	{
		//Leo parámetros de ésta columna.
		thiscolumn = $(this);
		thiscolumnStatus = thiscolumn.attr("data-tasks-status");
		
		// Cambio de status a la tarea
		var draggedObject = ui.item;
		draggedObject.attr("data-task-status",thiscolumnStatus);
		var draggedObjecNewtStatus = draggedObject.attr("data-task-status");
		//console.log(draggedObjecNewtStatus);

		// Ejecuto Ajax enviando el nuevo stado a la bd.
		var taskID = draggedObject.attr("data-task-id");
		var changeStatusRoute = baseurl+"tasks/"+taskID+"/changestatus/"+draggedObjecNewtStatus;
		
		var changeStatus =  $.get(changeStatusRoute, function(res)
		{
			//console.log("cambiado a In Progress");
		});

		//Cambio de orden de las tarjetas que tiene la tarea.
		// y los voy acumulando en un array para enviar.
		cardsPosition = new Array();
		thiscolumn.find('.task-container').each(function(i, el)
		{
			thisCard = $(this);
			thisCard.attr('data-task-order', i);
			//console.log(i);
			var thisId = $(this).attr('data-task-id');
			var thisPos = $(this).attr('data-task-order');
			cardsPosition[i]={position: thisPos, id: thisId};
			i++;
		});

		//console.log(cardsPosition);
		token = $("#token").val();

		// Convertir array a string para mandar a get.
		cardsPosition = JSON.stringify(cardsPosition);
		console.log(cardsPosition);
		// Ejecuto Ajax enviando nuevo orden a la bd
		$.ajax(
		{
			url: baseurl+"app/tasks/"+taskID+"/changeorder/"+cardsPosition,
			crossOrigin: true,
			type: 'GET',
			dataType: 'json',
			//data: {neworder: cardsPosition},

			success: function(){
				//console.log("oks");
			}
		});

	});


}