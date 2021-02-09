"use strict";

// Conté l'arrel del domini per fer les peticions al servidor (http://localhost:8080/...)
var arrel;

/*************************************************
 * EN AQUEST APARTAT POTS AFEGIR O MODIFICAR CODI *
 *************************************************/

// NO ES POT UTILITZAR JQuery

///////////////////////////////////////////////////////////
// ALUMNE: José Alberto Torrents Batista
///////////////////////////////////////////////////////////

/********** ESDEVENIMENTS DELS BOTONS (ICONES) DE LES ACCIONS EN CADA FILA **********/

// Botó Editar factura (icona):
//	Ha d'obrir la pàgina 'factura.html' passant-li com a paràmetre la factura a editar
//	El paràmetre s'ha de passar en la mateixa URL (mètode GET)
//	La pàgina per editar la factura s'ha d'obrir en la mateixa finestra
function editar(ev) {
	var numFactura = ev.target.parentElement.parentElement.firstChild.innerHTML;
	var URL = `${arrel}factura?numFactura=${numFactura}`;
	window.location.replace(encodeURI(URL));
}

// Botó Esborrar factura (icona):
//	Ha de preguntar si es vol esborrar la factura; si no, no fer res
//	Enviar una petició POST al servidor per Pesborrar la factura
//	Ha d'actualitzar la llista de factures
function esborrar(ev) {
	if (confirm("Vols esborrar la factura?")) {
		// Gestor de la resposta
		function requestListener() {
			actualitzarTaula();
		}

		// Gestor d'errors
		function errorListener() {
			alert("Error al fer petició al servidor");
		}
		var factura_id = ev.target.parentElement.parentElement.firstChild.innerHTML;

		let token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

		fetch(arrel + 'deleteFactura', {
			method: 'post',
			headers: {
				'Content-Type': 'application/json',
				"X-CSRF-TOKEN": token
				// 'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: JSON.stringify({'factura_id': factura_id}) // body data type must match "Content-Type" header
		})
		.then(response => response.json())
		.then(response => {
			console.log(response);
		});

	}
}

/********** ESDEVENIMENT DEL BOTÓ DEL FINAL (Nova factura) **********/

// Botó Nova factura:
//	Ha d'obrir la pàgina 'factura.html' sense cap paràmetre
//	La pàgina per editar la factura s'ha d'obrir en la mateixa finestra
function nova() {
	window.location.href = `${window.location.href}factura`;
}

/********** INICIALITZAR ATRIBUTS I CONTROLADORS **********/

// Inicialitza atributs i afegeix controladors d'esdeveniments
// Envia una petició POST al servidor per obtenir les dades generals de totes les factures
// Actualitza la taula per mostrar totes les factures
//	En cada línia apareixerà el número, la data, si està pagada,el nom del client
//	la base imposable, l'import de l'IVA i el total de la factura
//	icones per editar i esborrar la factura
// Cada 15 segons s'ha de tornar a fer la petició al servidor
//	per si s'ha produït algun canvi des d'un altre terminal
function init() {
	document.getElementById("nova").addEventListener("click", nova);
	actualitzarTaula();
	setInterval(actualitzarTaula, 15000);
}

function omplirTaula(factures) {
	var estil = {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
		style: 'currency',
		currency: 'EUR'
	};

	for (var factura of factures) {
		var fila = [];
		fila.push(factura.id);
		fila.push(factura.data);
		fila.push((factura.pagada)===1? 'Si' : 'No');
		fila.push(factura.client.nom);

		var subtotal = 0;
		for (var linia of Object.entries(factura.linies)) {
			console.log(linia[1].unitats);
			subtotal += linia[1].article.preu * linia[1].unitats;
		}
		var dte = parseInt(factura.descompte);
		var importDte = (subtotal * dte) / 100;
		var importBaseImp = subtotal - importDte;
		var iva = parseInt(factura.iva);
		var importIva = (importBaseImp * iva) / 100;
		var totalFactura = (subtotal + importIva) - importDte;

		fila.push(importBaseImp.toLocaleString('es-ES', estil));
		fila.push(iva);
		fila.push(totalFactura.toLocaleString('es-ES', estil));

		omplirFila(fila);
	}

}

function omplirFila(fila) {
	var tr = document.createElement("tr");

	for (var camp of fila) { // Per cada camp de cada factura-> Crea el camp corresponent
		var td = document.createElement("td");
		var tdText = document.createTextNode(camp);
		td.appendChild(tdText);
		tr.appendChild(td);
	}

	// camp accions
	var tdAccio = document.createElement("td");
	tdAccio.setAttribute("class", "nonprintable");
	var accions = ["edit", "delete"];

	for (var accio of accions) { // Per cada accio de l'array accions, crea el icona corresponent i l'afageix al camp Acc
		var img = document.createElement("img");
		img.setAttribute("class", accio);
		img.setAttribute("style", `width:1rem`);
		img.setAttribute("src", `img/${accio}.svg`);
		tdAccio.appendChild(img);
	}

	tr.appendChild(tdAccio);

	// Insertar fila al final de la taula, abans del tancament de l'element tbody
	document.getElementsByTagName("tbody")[0].insertAdjacentElement("beforeend", tr);

	// Esdeveniments icones
	document.querySelectorAll(".edit").forEach(icona => icona.addEventListener("click", editar));
	document.querySelectorAll(".delete").forEach(icona => icona.addEventListener("click", esborrar));
}

function actualitzarTaula() {
	fetch(arrel + 'getFactures', {
		method: 'get'
	})
	.then(response => response.json())
	.then(factures => {
		omplirTaula(factures);
	});

	const tbody = document.getElementsByTagName("tbody")[0];
	while (tbody.firstChild) {
		tbody.removeChild(tbody.firstChild);
	}

	// Gestor d'errors
	function errorListener() {
		alert("Error al fer petició al servidor");
	}

}

/***********************************************
 * FINAL DE L'APARTAT ON POTS FER MODIFICACIONS *
 ***********************************************/

function _init() {
	var src = window.location.href;
	arrel = src.substring(0, src.lastIndexOf("/") + 1);
	init();
}

window.onload = _init;