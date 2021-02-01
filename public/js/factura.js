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



/*************************************************
* EN AQUEST APARTAT POTS AFEGIR O MODIFICAR CODI *
*************************************************/

// S'HA D'UTILITZAR JQuery (COM A MÍNIM PER FER LES PETICIONS AL SERVIDOR)

///////////////////////////////////////////////////////////
// ALUMNE: 
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
}

// Ha de preguntar si es volen descartar els canvis
//	si accepta, ha de tornar a la pàgina principal (index.html)
//	si no accepta, no ha de fer res (continuar en la pàgina per continuar editant la factura)
function cancelar() {
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
}

/***********************************************
* FINAL DE L'APARTAT ON POTS FER MODIFICACIONS *
***********************************************/

function _init() {
	var src = window.location.href;
	arrel = src.substring(0,src.lastIndexOf("/") + 1);

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
