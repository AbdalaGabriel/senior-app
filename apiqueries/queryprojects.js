console.log("おはようございます");
console.log("- Pedido de datos a la API");
var baseurl = "http://gabrielabdala.com/test/public/";
var route = baseurl+"/admin/portfolio";
tablaDatos = $("#proyectos");
console.log(route);
//Petición AJAX a la API.
var consulta =  $.get(route, function(res)
{
	console.log(res);
	$(res).each(function(key, value)
	{
		tablaDatos.append('<tr><td><img width:"30" height="30" src="/uploads/projects/'+value.cover_image+'"></td><td>'+value.title+'<br/><a href="#" class="quickEdit" data-toggle="modal" data-target="#quickedit-project" data-id="'+value.id+'">Quick Edit</a></td> <td>'+value.urlfriendly+'</td><td class="post-categories" data-id="'+value.id+'">-</td><td><a href=baseurl+"admin/portfolio/en/'+value.id+'/edit" data-id="'+value.id+'">Versión en inglés</a></td><td><a href=baseurl+"admin/portfolio/'+value.id+'/edit" data-id="'+value.id+'">Editar</a></td><td><a href="#" class="delete" data-toggle="modal" data-target="#delete-this-project" data-id="'+value.id+'">Eliminar</button></td></tr>');
		celdaCategorias = $(".post-categories[data-id='"+value.id+"']");
		var categories = value.categories;

		if(categories == undefined)
		{
			celdaCategorias.append('<p href="#">No tiene categorias</p>');
		}
		else
		{
			var large = categories.length;
				//large = large-1
				for (var i = 0; i < large; i++) 
				{
					celdaCategorias.append('<a href="#">'+categories[i].title+'</a>');
				}
			}
		});
})

.done(function() 
{
	console.log( "- Exito Ajax Carga" );
	defineListerner();
})

.fail(function()
{ 
	console.log( "Error en carga Ajax" );
})