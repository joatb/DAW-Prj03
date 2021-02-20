"use strict";

// Conté l'arrel del domini per fer les peticions al servidor (http://localhost:8080/...)
var arrel;

/** Laravel CSRF token */
let token = document
    .querySelector('meta[name="csrf-token"]')
    .getAttribute("content");

var estil = {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    style: "currency",
    currency: "EUR",
};

// Petició POST mitjançant AJAX
const httpPost = (endpoint, peticio) => {
    return $.ajax({
        url: arrel + endpoint,
        data: peticio,
        dataType: "json",
        type: "POST",
        headers: {
            "X-CSRF-TOKEN": token,
        },

        success: function (response) {
            return response;
        },

        error: function (e) {
            return e;
        },
    });
};

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
    try {
        const tr = ev.target.parentElement; // línia objectiu de l'acció

        let [codi, article, uni, preu] = $(tr).children(); // desestructurant camps

        let camps = [codi, article, uni, preu]; // Camps que és comproven

        camps.forEach((camp) => {
            // Comprovació de cada camp
            if ($(camp).text() == "") {
                // Si el camp està buit
                $(camp).focus();
                throw `Camp ${$(camp).attr("class")}: buit`;
            }

            if ($(camp).attr("class") != "article") {
                const valor = parseFloat($(camp).text());
                if (valor < 0) {
                    // comprova si és un valor negatiu
                    $(camp).focus();
                    throw `Camp ${$(camp).attr("class")}: número negatiu`;
                }
                if (isNaN(valor)) {
                    // comprova que el camp tingui com a mínim 1 dígit
                    $(camp).focus();
                    throw `Camp ${$(camp).attr(
                        "class"
                    )}: valor incorrecte -> com a mínim un dígit`;
                }
            }
        });

        recalcular();
    } catch (e) {
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
    var indexUltimaLinia = $("table").find("tbody").index(); // Index de l'última fila

    if (indexLinia < indexUltimaLinia - 1) {
        // si el index de la línia que es vol baixar és més petit que el index de la penúltima línia
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
        recalcular();
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
        '<td class="accions, nonprintable"></td>',
    ];
    afegirCamps(tds); // afegir fila en blanc
    $(".codi").on("focusout", getArticle); // esdeveniment que dispara una funció que retorna un article si coincideix amb el codi ja introduït
    [".uni", ".preu"].forEach((camp) => $(camp).on("focusout", check)); // cada vegada que perd el focus, comprova la línia
    //
}

// funció que afegeix al document la fila que li passem per paràmetre
function afegirCamps(tds) {
    $("tbody").before('<tr style="text-align:center;"></tr>'); // abans del total de la factura, afegeixo una tr
    $("tbody").prev().append(tds.join("")); // afageixo les caselles al tr

    $("tbody").prev().find("td:first-child").focus(); // s'ha de posar el focus sobre la primera casella

    var accions = ["prev", "next", "delete"];

    for (var accio of accions) {
        // Per cada accio de l'array accions, crea el icona corresponent i l'afageix al camp Acc
        $("tbody")
            .prev()
            .find("td:last-child")
            .append(
                `<img class="${accio}" style="width:1rem" src="img/${accio}.svg"></img>`
            );
    }

    // afegeix a cada icona el gestor d'esdeveniment corresponent
    $("tbody")
        .prev()
        .find("td:last-child")
        .find("img.check")
        .on("click", check);
    $("tbody").prev().find("td:last-child").find("img.prev").on("click", pujar);
    $("tbody")
        .prev()
        .find("td:last-child")
        .find("img.next")
        .on("click", baixar);
    $("tbody")
        .prev()
        .find("td:last-child")
        .find("img.delete")
        .on("click", esborrar);

    //opcional
    $("tbody")
        .prev()
        .on("focusin", function (e) {
            // event focusin a la fila
            $(this).on("keydown", function (e) {
                // crea un event keydown
                if (e.keyCode === 46) {
                    // supr
                    $(this)
                        .find("td:last-child")
                        .find("img.delete")
                        .trigger("click"); // dispara el event de la icona esborrar
                    e.preventDefault(); // evita el comportament per defecte i la propagacio del event
                    e.stopPropagation();
                } else if (e.keyCode === 13) {
                    // enter
                    $(this)
                        .find("td:last-child")
                        .find("img.check")
                        .trigger("click");
                    e.preventDefault(); // evita el comportament per defecte i la propagacio del event
                    e.stopPropagation();
                }
            });
            $(this).on("focusout", function (e) {
                // event que elimina el event keydown con la fila perd el focus
                $(this).off("keydown");
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
        //comprovarIvaDte();

        window.print();
    } catch (e) {
        alert(e);
    }
}

// Esdeveniment "beforeprint"
//	Recalcular el subtotal de cada article i el total dels articles
//	Recalcular els totals de la factura a partir del total d'articles, dte i iva
//	S'han d'escriure en format local (coma, dos decimals i €)
//	Afegir o treure la classe "nonprintable" de l'objecte "fpagada"
//		depenent de si el checkbox "pagada" està marcat o no
function recalcular() {
    var totalArticles = 0;

    $("table")
        .find("tr")
        .each((index, fila) => {
            // per cada fila calcula el subtotal
            var unitats = $(fila).find("td.uni").text();
            var preu = $(fila).find("td.preu").text();
            var subtotal = parseInt(unitats) * parseFloat(preu);
            $(fila).find("td.preu").text(preu.toLocaleString("es-ES", estil));
            $(fila)
                .find("td.subtotal")
                .text(subtotal.toLocaleString("es-ES", estil));
            if (!Number.isNaN(subtotal)) {
                // Si s'ha calculat el subtotal de la fila
                totalArticles += subtotal;
            }
        });

    $("#totalArticles").text(totalArticles.toLocaleString("es-ES", estil));
    //$('table').find('tbody').find('th').eq(1).text(totalArticles.toFixed(2)); // Total Articles

    var importDte = (totalArticles * $("#dte").text()) / 100;
    var importBaseImp = totalArticles - importDte;

    $("#idte").text(importDte.toLocaleString("es-ES", estil));
    $("#base").text(importBaseImp.toLocaleString("es-ES", estil));

    var importIva = (importBaseImp * $("#iva").text()) / 100;
    var totalFactura = importBaseImp + importIva;

    $("#iiva").text(importIva.toLocaleString("es-ES", estil));
    $("#total").text(totalFactura.toLocaleString("es-ES", estil));

    //	Afegir o treure la classe "nonprintable" de l'objecte "fpagada" depenent de si el checkbox "pagada" està marcat o no
    if ($("#pagada").prop("checked")) {
        $("#fpagada").removeClass("nonprintable");
    } else {
        $("#fpagada").addClass("nonprintable");
    }
}

// funció que retorna la data actual en format aaaa-MM-dd
function dataActual() {
    var data = new Date();
    var any = data.getFullYear();
    var mes = data.getMonth() + 1;
    if (data.getMonth() + 1 < 10) {
        mes = `0${data.getMonth() + 1}`;
    }
    var dia = data.getDate();
    if (data.getDate() < 10) {
        dia = `0${data.getDate()}`;
    }

    return `${any}-${mes}-${dia}`;
}

/*
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
*/

// funció que cambia el color de fons de la fila, si està seleccionada
function seleccionarFila() {
    // opcional
    $("table")
        .find("tr")
        .each(function (index, fila) {
            if ($(fila).parent().is("TABLE")) {
                // Si el element pare és "TABLE"
                fila.addEventListener("click", selectedFila); // Afageix un event listener
            }
        });

    function selectedFila(ev) {
        $("table")
            .find("tr")
            .each(function (index, fila) {
                if ($(fila).parent().is("TABLE")) {
                    // Si el element pare és "TABLE"
                    if ($(fila).is("[selected]")) {
                        // Si la fila te el atribut selected
                        $(fila).removeAttr("selected"); // deselecciona la fila
                        $(fila).removeAttr("style"); // elimina el estil
                    }
                }
            });

        if (ev.target.nodeName == "IMG") {
            // Si és un icona cambia el avi img -> td -> tr
            $(ev.target.parentElement.parentElement).attr("selected", "");
            $(ev.target.parentElement.parentElement).attr(
                "style",
                "background-color:#E2EAE9"
            );
        } else {
            // td -> tr
            $(ev.target.parentElement).attr("selected", "");
            $(ev.target.parentElement).attr(
                "style",
                "background-color:#E2EAE9"
            );
        }
    }
}

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
    recalcular();

    let pagada;

    if ($("#pagada").prop("checked")) {
        // comprovar com està la checkbox pagada
        pagada = 1;
    } else {
        pagada = 0;
    }

    var linies = []; // array que s'afageix al objecte factura i que conté el articles

    $("table")
        .find("tr")
        .each(function (index, fila) {
            // per cada fila calcula el subtotal
            var codi = $(fila).find("td.codi").text();

            if (!codi == "") {
                // Si en la fila existeix el camp codi, afageix el article a l'array liniesFac
                var article = $(fila).find("td.article").text();
                var unitats = $(fila).find("td.uni").text();
                var preu = $(fila).find("td.preu").text();

                var linia = {
                    unitats: unitats,
                    article: {
                        id: codi,
                        article: article,
                        preu: parseFloat(preu),
                    },
                };

                linies.push(linia);
            }
        });

    var url = window.location.search;
    var urlParams = new URLSearchParams(url);
    var peticio = {};

    peticio = {
        factura: {
            id: $("#numero").val(),
            data: $("#data").val(),
            pagada: pagada,
            client: {
                nif: $("#nif").text(),
                nom: $("#nom").text(),
                adreca: $("#adreca").text(),
                poblacio: $("#poblacio").text(),
            },
            descompte: $("#dte").text() == "" ? 0 : $("#dte").text(),
            iva: $("#iva").text() == "" ? 0 : $("#iva").text(),
            linies: linies,
        },
    };

    $.when(httpPost("upsertFactura", peticio.factura))
        .then((factura) => {
            var URL = `${arrel}factura?facturaId=${factura.id}`;
            window.location.replace(encodeURI(URL));
        })
        .catch((e) => {
            const errors = e.responseJSON.errors;
            let errorMSG = "";
            for (const property in errors) {
                errorMSG += `${errors[property]}\n`;
            }
            if (
                confirm(
                    "No s'ha pogut guardar la factura. \nVols tornar-lo a intentar?\n\n" +
                        errorMSG
                )
            ) {
                //guardar();
            } else {
                window.location.href = arrel;
            }
        });
}

// Ha de preguntar si es volen descartar els canvis
//	si accepta, ha de tornar a la pàgina principal (index.html)
//	si no accepta, no ha de fer res (continuar en la pàgina per continuar editant la factura)
function cancelar() {
    if (
        confirm("Vols cancelar i descartar els canvis que no estiguin desats?")
    ) {
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
    $("#data").attr("autofocus", "");
    $("#nif").attr("contenteditable", "");
    $("#nom").attr("contenteditable", "");
    $("#adreca").attr("contenteditable", "");
    $("#poblacio").attr("contenteditable", "");
    $("#dte").attr("contenteditable", "");
    $("#iva").attr("contenteditable", "");
    $("#pagada").addClass("nonprintable");

    $("tbody").find("tr").find("th").last().find("img").attr("id", "afegir");
    $("#afegir").on("click", afegir);

    // camp data, posar la data d'avui
    $("#data").val(dataActual());

    $("#nif").on("focusout", getClient);
    $("#imprimir").on("click", imprimir);
    $("#guardar").on("click", guardar);
    $("#cancelar").on("click", cancelar);
    $(window).on("beforeprint", recalcular);

    //$("#dte").on("focusout", recalcular);
    //$("#iva").on("focusout", recalcular);

    ["#dte", "#iva"].forEach((camp) => $(camp).on("focusout", recalcular));

    // inicialitzar dades en cas de que s'estigui modificant una factura
    inicialtzarFacturaExistent();
}

// Fa una petició d'un client utilitzant el nif al servidor
function getClient() {
    let nif = $("#nif").text();
    let peticio = { nif: nif };
    $.when(httpPost("getClient", peticio)).then(function (client) {
        inicialitzarDadesClient(client);
    });
}

// Inicialitza les dades del client en la factura
function inicialitzarDadesClient(client) {
    $("#nom").text(client.nom);
    $("#adreca").text(client.adreca);
    $("#poblacio").text(client.poblacio);
}

// Fa una petició d'un article al servidor utilitant el codi de l'article
// Inicialitza les dades de l'article a la línia corresponent de la factura
function getArticle(e) {
    const fila = e.target.parentElement;
    const codi = $(fila).find(".codi").text();
    let peticio = { articleId: codi };
    $.when(httpPost("getArticle", peticio)).done(function (article) {
        inicialitzarDadesArticle(fila, article);
    });

    function inicialitzarDadesArticle(fila, article) {
        $(fila).find(".article").text(article.article);
        $(fila).find(".preu").text(parseFloat(article.preu).toFixed(2));
    }
}

// Fa una petició POST per obtenir les dades de la factura que és vol modificar
function inicialtzarFacturaExistent() {
    var url = window.location.search;
    var urlParams = new URLSearchParams(url);
    var factura;
    const facturaId = urlParams.get("facturaId");
    let peticio = { facturaId: facturaId };

    if (facturaId) {
        $.when(httpPost("getFactura", peticio))
            .then(function (factura) {
                inicialitzarDades(factura);
            })
            .catch(() => {
                if (
                    confirm(
                        "No s'han trobat les dades de la factura. \nVols tornar-lo a intentar?"
                    )
                ) {
                    inicialtzarFacturaExistent();
                } else {
                    window.location.href = arrel;
                }
            });
    }

    function inicialitzarDades(factura) {
        // Inicialitza les dades de la factura
        // Dades
        $("#data").val(factura.data);
        $("#numero").val(factura.id);
        $("#nif").text(factura.client.nif);
        inicialitzarDadesClient(factura.client);
        $("#iva").text(factura.iva);
        $("#dte").text(factura.descompte);

        if (factura.pagada) {
            $("#pagada").prop("checked", true);
        }

        // Articles
        for (var linia of factura.linies) {
            var camps = [
                `<td class="codi" contenteditable>${linia.article.id}</td>`,
                `<td class="article" contenteditable>${linia.article.article}</td>`,
                `<td class="uni" contenteditable>${linia.unitats}</td>`,
                `<td class="preu" contenteditable>${linia.article.preu.toLocaleString(
                    "es-ES",
                    estil
                )}</td>`,
                `<td class="subtotal">0.0</td>`,
                `<td class="accions, nonprintable"></td>`,
            ];
            afegirCamps(camps);
        }

        recalcular();
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
