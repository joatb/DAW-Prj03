"use strict";

// Conté l'arrel del domini per fer les peticions al servidor (http://localhost:8080/...)
var arrel;

/*****************************************
 * POSA A CONTINUACIÓ EL CODI REAPROFITAT *
 *****************************************/

// Afegir línia per article
// Check, pujar, baixar i esborrar article
// Calcular total d'articles i resum de la factura
// Afegir línia article
// Imprimir factura
// 'beforeprint'
// ...
// Botó Check (icona):
//	comprovar que els camps no estiguin buits ni tinguin valors negatius o incorrectes.
//		en cas d'error, generar excepció, mostrar alert i posar focus sobre el camp incorrecte
//	recalcula i mostra subtotal i total
function check(ev) {
	var tr = ev.target.parentElement.parentElement; // tr objectiu de l'acció: ev.target=img; ev.target.parentElement=td; ev.target.parentElement.parentElement=tr;
	try {
		var codi = $(tr).find('td').eq(0);
		var article = $(tr).find('td').eq(1);
		var unitat = $(tr).find('td').eq(2);
		var preu = $(tr).find('td').eq(3);

		var camps = {
			"codi": codi,
			"article": article,
			"unitat": unitat,
			"preu": preu
		};

		for (var camp in camps) { // Comprovació de cada camp
			if ($(camps[camp]).text() == "") { // Si el camp està buit
				$(camps[camp]).focus();
				throw `Camp ${camp}: buit`;
			}
			if (camp != "article") { // Si no és el camp article
				if (parseInt($(camps[camp]).text()) < 0) { // comprova si és un valor negatiu
					$(camps[camp]).focus();
					throw `Camp ${camp}: número negatiu`;
				}
				if (camp == "preu") {
					if (!$(camps[camp]).text().match("^[0-9]+\.[0-9]{1,2}$")) { // comprova que el camp preu -> 0.0 || 0.00
						$(camps[camp]).focus();
						throw `Camp ${camp}: valor incorrecte -> 0.0 o 0.00`;
					}
				}
				else {
					if (!$(camps[camp]).text().match('^[0-9]+$')) { // comprova que el camp codi i unitat tingui com a mínim 1 dígit
						$(camps[camp]).focus();
						throw `Camp ${camp}: valor incorrecte -> com a mínim un dígit`;
					}
				}

			}
		}

		recalcularFinal();

	}
	catch (e) {
		alert(e);
	}

}

// Botó Pujar (icona):
//	intercanvia la línia de la taula amb la línia de sobre (si no és la primera línia)
function pujar(ev) {
	var tr = ev.target.parentElement.parentElement;
	var indexLinia = $(tr).index();

	if (indexLinia > 1) {
		var trPrev = $(tr).prev();
		tr.remove(); // Elimina la fila
		$(trPrev).before(tr); // Torna a insertar la fila eliminada en la nova posició
		//seleccionarFila();
	}
	seleccionarFila();
}

// Botó Pujar (icona):
//	intercanvia la línia de la taula amb la línia de sota (si no és l'última línia)
function baixar(ev) {
	var tr = ev.target.parentElement.parentElement;
	var indexLinia = $(tr).index();
	var indexUltimaLinia = $('table').find('tbody').index(); // Index de l'última fila

	if (indexLinia < indexUltimaLinia - 1) { // si el index de la línia que es vol baixar és més petit que el index de la penúltima línia
		var trNext = $(tr).next(); // Següent fila
		tr.remove(); // Elimina la fila
		$(trNext).after(tr); // Torna a insertar la fila eliminada en la nova posició
		//seleccionarFila();
	}
	seleccionarFila();
}

// Botó Esborrar (icona):
//	preguntar si es vol esborrar l'article, si no, no fer res
//	esborra la línia de la taula
//	recalcula el total
function esborrar(ev) {
	if (confirm("Vols esborrar la línia?")) {
		var tr = ev.target.parentElement.parentElement;
		tr.remove(); // img -> td -> tr (elimina l'element avi)
		recalcularFinal();
	}
}

// Botó Afegir (icona):
//	afegir fila just abans de la fila del total dels articles
//	la casella corresponent a les unitats ha de contenir el valor 0.0
//	les caselles corresponents al preu unitari i al subtotal han de contenir el valor 0.00
//	les caselles corresponents al codi, descripció, unitats i preu
//		han de ser editables i s'hi ha de poder accedir amb el tabulador
//	afegeix les icones de les accions (editar, pujar, baixar i esborrar) en l'última columna
//	afegeix a cada icona el gestor d'esdeveniment corresponent
//	la casella on van les icones ha de ser de classe "nonprintable"
//	 s'ha de posar el focus sobre la primera casella
function afegir() {
	var tds = [
		'<td class="codi" contenteditable></td>',
		'<td class="article" contenteditable></td>',
		'<td class="uni" contenteditable></td>',
		'<td class="preu" contenteditable>0.0</td>',
		'<td class="subtotal">0.0</td>',
		'<td class="accions, nonprintable"></td>'
	];
	afegirCamps(tds); // afegir fila en blanc
}

// funció que afegeix al document la fila que li passem per paràmetre
function afegirCamps(tds) {
	$('tbody').before('<tr></tr>'); // abans del total de la factura, afegeixo una tr
	$('tbody').prev().append(tds.join('')); // afageixo les caselles al tr

	$('tbody').prev().find("td:first-child").focus(); // s'ha de posar el focus sobre la primera casella

	var accions = ["check", "prev", "next", "delete"];

	for (var accio of accions) { // Per cada accio de l'array accions, crea el icona corresponent i l'afageix al camp Acc
		$('tbody').prev().find("td:last-child").append(`<img class="${accio}" style="width:1rem" src="/img/${accio}.svg"></img>`);
	}

	// afegeix a cada icona el gestor d'esdeveniment corresponent
	$('tbody').prev().find("td:last-child").find("img.check").on('click', check);
	$('tbody').prev().find("td:last-child").find("img.prev").on('click', pujar);
	$('tbody').prev().find("td:last-child").find("img.next").on('click', baixar);
	$('tbody').prev().find("td:last-child").find("img.delete").on('click', esborrar);

	//opcional
	$('tbody').prev().on('focusin', function(e) { // event focusin a la fila
		$(this).on('keydown', function(e) { // crea un event keydown
			if (e.keyCode === 46) { // supr
				$(this).find("td:last-child").find("img.delete").trigger('click'); // dispara el event de la icona esborrar 
				e.preventDefault(); // evita el comportament per defecte i la propagacio del event
				e.stopPropagation();
			}
			else if (e.keyCode === 13) { // enter
				$(this).find("td:last-child").find("img.check").trigger('click');
				e.preventDefault(); // evita el comportament per defecte i la propagacio del event
				e.stopPropagation();
			}
		});
		$(this).on('focusout', function(e) { // event que elimina el event keydown con la fila perd el focus
			$(this).off('keydown');
		});
	});
	seleccionarFila();
}

/********** ESDEVENIMENTS DELS BOTONS DEL FINAL I D'ABANS D'IMPRIMIR **********/

// Botó Imprimir factura:
//	comprova que dte estigui entre 0 i 50
//		si és inferior a 0 o està buit, el posa a 0
//		si és superior a 50 el posa a 50
//	comprova que iva sigui 7, 10 o 21. Si no, alert(...) i retorna
//	reescriu el dte i el iva com a enters
//	crida la funció que mostra el diàleg del navegador per imprimir
function imprimir() {
	try {
		comprovarIvaDte();

		window.print();
	}
	catch (e) {
		alert(e);
	}
}

// Esdeveniment "beforeprint"
//	Recalcular el subtotal de cada article i el total dels articles
//	Recalcular els totals de la factura a partir del total d'articles, dte i iva
//	S'han d'escriure en format local (coma, dos decimals i €)
//	Afegir o treure la classe "nonprintable" de l'objecte "fpagada"
//		depenent de si el checkbox "pagada" està marcat o no
function recalcularFinal() {
	$(window).on('beforeprint', recalcularFinal); // Esdeveniment "beforeprint"

	var estil = {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
		style: 'currency',
		currency: 'EUR'
	};
	var totalArticles = 0;

	$('table').find('tr').each(function(index, fila) { // per cada fila calcula el subtotal
		var unitats = $(fila).find('td.uni').text();
		var preu = $(fila).find('td.preu').text();
		var subtotal = parseInt(unitats) * parseFloat(preu);

		if (!Number.isNaN(subtotal)) { // Si s'ha calculat el subtotal de la fila
			totalArticles += subtotal;
			$(fila).find('td.subtotal').text(subtotal.toFixed(2));
		}
	});

	$('table').find('tbody').find('th').eq(1).text(totalArticles.toFixed(2)); // Total Articles

	var importDte = (totalArticles * $('#dte').text()) / 100;
	var importBaseImp = totalArticles - importDte;

	$('#idte').text(importDte.toLocaleString('es-ES', estil));
	$('#base').text(importBaseImp.toLocaleString('es-ES', estil));

	var importIva = (parseInt($('#base').text()) * $('#iva').text()) / 100;
	var totalFactura = (totalArticles + importIva) - parseInt($('#idte').text());

	$('#iiva').text(importIva.toLocaleString('es-ES', estil));
	$('#total').text(totalFactura.toLocaleString('es-ES', estil));

	//	Afegir o treure la classe "nonprintable" de l'objecte "fpagada" depenent de si el checkbox "pagada" està marcat o no
	if ($('#pagada').prop('checked')) {
		$('#fpagada').removeClass('nonprintable');
	}
	else {
		$('#fpagada').addClass('nonprintable');
	}

}

// funció que retorna la data actual en format aaaa-MM-dd
function dataActual() {
	var data = new Date();
	var any = data.getFullYear();
	var mes = data.getMonth() + 1;
	if (data.getMonth() + 1 < 10) {
		mes = `0${data.getMonth()+1}`;
	}
	var dia = data.getDate();
	if (data.getDate() < 10) {
		dia = `0${data.getDate()}`;
	}

	return `${any}-${mes}-${dia}`;
}

// funció que comprova els camps iva i dte
function comprovarIvaDte() {
	var dteText = parseInt($("#dte").text());
	var ivaText = parseInt($("#iva").text());

	if (dteText < 0 || isNaN(dteText)) { // si és inferior a 0 o està buit, el posa a 0
		$('#dte').text(0);
	}
	if (dteText > 50) { // si és superior a 50 el posa a 50
		$('#dte').text(50);
	}

	// comprova que iva sigui 7, 10 o 21. Si no, alert(...)
	if (isNaN(ivaText)) {
		throw "Camp IVA. buit";
	}
	switch (ivaText) {
		case 7:
			break;
		case 10:
			break;
		case 21:
			break;
		default:
			throw "Camp IVA. no vàlid. IVA -> 7, 10, 21";
	}
}

// funció que cambia el color de fons de la fila, si està seleccionada
function seleccionarFila() { // opcional
	$("table").find("tr").each(function(index, fila) {
		if ($(fila).parent().is('TABLE')) { // Si el element pare és "TABLE"
			fila.addEventListener("click", selectedFila); // Afageix un event listener
		}
	});

	function selectedFila(ev) {
		$("table").find("tr").each(function(index, fila) {
			if ($(fila).parent().is('TABLE')) { // Si el element pare és "TABLE"
				if ($(fila).is('[selected]')) { // Si la fila te el atribut selected
					$(fila).removeAttr('selected'); // deselecciona la fila
					$(fila).removeAttr('style'); // elimina el estil
				}
			}
		});

		if (ev.target.nodeName == "IMG") { // Si és un icona cambia el avi img -> td -> tr
			$(ev.target.parentElement.parentElement).attr("selected", "");
			$(ev.target.parentElement.parentElement).attr("style", "background-color:#E2EAE9");
		}
		else { // td -> tr
			$(ev.target.parentElement).attr("selected", "");
			$(ev.target.parentElement).attr("style", "background-color:#E2EAE9");
		}
	}
}


/*************************************************
 * EN AQUEST APARTAT POTS AFEGIR O MODIFICAR CODI *
 *************************************************/

// S'HA D'UTILITZAR JQuery (COM A MÍNIM PER FER LES PETICIONS AL SERVIDOR)

///////////////////////////////////////////////////////////
// ALUMNE: José Alberto Torrents Batista
///////////////////////////////////////////////////////////

/********** ESDEVENIMENTS DELS BOTONS Guardar factura i Cancel·lar **********/

// Botó Guardar factura:
//	Fa el mateix que imprimir però en lloc d'obrir el diàleg per imprimir
//	s'ha de crear un objecte JSON amb totes les dades de la factura i enviar-lo al servidor
// Si no es produeix cap error, ha de tornar a la pàgina principal (index.html)
// Si es produeix un error ha de preguntar si es vol tornar a intentar
//	si accepta, no ha de fer res (continuar en la pàgina per tornar-ho a intentar)
//	si no accepta, ha de tornar a la pàgina principal (index.html)
// S'ha de determinar si es tracta d'una nova factura o si s'ha de  modificar una que existeix
function guardar() {
	comprovarIvaDte();

	recalcularFinal();

	var pagada;

	if ($('#pagada').prop('checked')) { // comprovar com està la checkbox pagada
		pagada = true;
	}
	else {
		pagada = false;
	}

	var liniesFac = []; // array que s'afageix al objecte factura i que conté el articles

	$('table').find('tr').each(function(index, fila) { // per cada fila calcula el subtotal
		var codi = $(fila).find('td.codi').text();

		if (!codi == "") { // Si en la fila existeix el camp codi, afageix el article a l'array liniesFac
			var descripcio = $(fila).find('td.article').text();
			var unitats = $(fila).find('td.uni').text();
			var preu = $(fila).find('td.preu').text();

			var article = {
				"codi": codi,
				"article": descripcio,
				"unitats": unitats,
				"preu": preu
			};

			liniesFac.push(article);
		}
	});

	var url = window.location.search;
	var urlParams = new URLSearchParams(url);
	var factura;
	if (urlParams.get('numFactura')) { // Si és modifica una factura accio -> editarFactura
		var factura = {
			accio: "editarFactura",
			factura: {
				dades: {
					"dataFactura": $('#data').val(),
					numFactura: $('#numero').val(),
					"pagada": pagada,
					"nif": $('#nif').text(),
					"nom": $('#nom').text(),
					"adressa": $('#adressa').text(),
					"poblacio": $('#poblacio').text(),
					"dte": $('#dte').text(),
					"iva": $('#iva').text()
				},
				articles: liniesFac
			}
		};
	}
	else { // accio -> guardarFactura
		var factura = {
			accio: "guardarFactura",
			factura: {
				dades: {
					"dataFactura": $('#data').val(),
					"pagada": pagada,
					"nif": $('#nif').text(),
					"nom": $('#nom').text(),
					"adressa": $('#adressa').text(),
					"poblacio": $('#poblacio').text(),
					"dte": $('#dte').text(),
					"iva": $('#iva').text()
				},
				articles: liniesFac
			}
		};
	}


	var peticio = JSON.stringify(factura); // objecte -> string json
	$.ajax({
		url: arrel,
		data: peticio,
		dataType: 'json',
		type: "POST",

		success: function(data) {
			window.location.replace(data.redirect); // redirecciona on vol el servidor
		},

		error: function() {
			if (confirm("Vols tornar a intentar?")) {}
			else {
				window.location.replace(arrel);
			}
		},
	});
}

// Ha de preguntar si es volen descartar els canvis
//	si accepta, ha de tornar a la pàgina principal (index.html)
//	si no accepta, no ha de fer res (continuar en la pàgina per continuar editant la factura)
function cancelar() {
	if (confirm("Vols descartar els canvis?")) {
		window.location.replace(arrel);
	}
}

/********** INICIALITZAR ATRIBUTS, CONTROLADORS I OBTENIR DADES FACTURA **********/

// Inicialitza atributs i afegeix controladors d'esdeveniments
// S'han de mirar els paràmetres passats per GET per saber si es tracta d'una factura nova o no
// Si és una factura nova, ha de posar la data d'avui i NO posar-li número
//	(posar el número ho farà el servidor quan l'afegeixi)
// Si és una factura existent:
//	S'han d'obtenir les seves dades fent una petició POST al servidor
//	i s'han d'inicialitzar totes les seves dades:
//	data, número, dades del client, articles, resum de la factura...
function init() {
	$('#data').attr('autofocus', '');
	$('#nif').attr('contenteditable', '');
	$('#nom').attr('contenteditable', '');
	$('#adressa').attr('contenteditable', '');
	$('#poblacio').attr('contenteditable', '');
	$('#dte').attr('contenteditable', '');
	$('#iva').attr('contenteditable', '');
	$('#pagada').addClass('nonprintable');

	$('tbody').find('tr').find('th').last().find('img').attr('id', 'afegir');
	$('#afegir').on('click', afegir);

	// camp data, posar la data d'avui
	$('#data').val(dataActual());

	$("#imprimir").on("click", imprimir);
	$("#guardar").on("click", guardar);
	$("#cancelar").on("click", cancelar);
	$(window).on("beforeprint", recalcularFinal);

	// inicialitzar dades en cas de que s'estigui modificant una factura
	inicialtzarFacturaExistent();
}

// Fa una petició POST de la factura que és vol modificar
function inicialtzarFacturaExistent() {
	var url = window.location.search;
	var urlParams = new URLSearchParams(url);
	var factura;

	if (urlParams.get('numFactura')) {
		var peticio = JSON.stringify({
			accio: "getFactura",
			numFactura: urlParams.get('numFactura')
		}); // petició POST amb l'objectiu d'aconseguir la factura corresponent al numFactura
		$.ajax({
			url: arrel,
			data: peticio,
			dataType: 'json',
			type: "POST",

			success: function(data) {
				if (data.error) {
					this.error(data);
				}
				factura = data.factura;
				inicialitzarDades(factura);
			},

			error: function(data) {
				if (confirm("No s'han trobat les dades de la factura. \nVols tornar a intentar?")) {}
				else {
					window.location.href = data.redirect;
				}
			},
		});
	}

	function inicialitzarDades(factura) { // Inicialitza les dades de la factura
		// Dades
		$('#data').val(factura.dades.dataFactura);
		$('#numero').val(factura.dades.numFactura);
		$('#nif').text(factura.dades.nif);
		$('#nom').text(factura.dades.nom);
		$('#adressa').text(factura.dades.adressa);
		$('#poblacio').text(factura.dades.poblacio);
		$('#iva').text(factura.dades.iva);
		$('#dte').text(factura.dades.dte);

		if (factura.dades.pagada) {
			$('#pagada').prop('checked', true);
		}

		// Articles
		for (var article of factura.articles) {
			var camps = [
				`<td class="codi" contenteditable>${article.codi}</td>`,
				`<td class="article" contenteditable>${article.article}</td>`,
				`<td class="uni" contenteditable>${article.unitats}</td>`,
				`<td class="preu" contenteditable>${article.preu}</td>`,
				`<td class="subtotal">0.0</td>`,
				`<td class="accions, nonprintable"></td>`
			];
			afegirCamps(camps);
		}

		recalcularFinal();

	}

}

/***********************************************
 * FINAL DE L'APARTAT ON POTS FER MODIFICACIONS *
 ***********************************************/

function _init() {
	var src = window.location.href;
	arrel = src.substring(0, src.lastIndexOf("/") + 1);

	init();

	// Afegeix línies per provar
	//for (var i = 0; i < 75; ++i) afegir();

	// L'element amb autofocus reb el focus després de carregar la pàgina.
	// En aquest cas, com l'atribut es posa després de carregar la pàgina,
	// s'ha de posar el focus manualment.
	var af = document.querySelector("[autofocus]");
	if (af) af.focus();
}

//window.onload = _init;
$(document).ready(_init);