<!DOCTYPE html>
<html lang="ca">
<head>
    <meta charset="UTF-8">
    <title>Factura</title>
    <link rel="stylesheet" type="text/css" href="css/factura.css">
	<script src="js/jQuery341.js"></script>
	<script defer src="js/factura.js"></script>
</head>
<body>
	<div class="printable">
		<h2>Factura</h2>
	</div>
	<div class="nonprintable">
		<h2>Formulari factura</h2>
	</div>
	<div style="white-space:nowrap">
		<h5 class="nonprintable">Dades de la factura i del client</h5>
		<div class="b bold big" style="width:8rem;max-width:8rem"><span class="center">Data factura</span></div><div class="b tbr big" style="width:10rem;max-width:10rem"><input type="date" id="data" style="width:10rem" /></div><div class="b tbr bold big" style="width:8rem;max-width:8rem"><span class="center">Núm. factura</span></div><div class="b tbr big" style="width:5rem;max-width:5rem"><input type="number" id="numero" style="width:5rem" disabled /></div><input type="checkbox" id="pagada" style="width:1rem;margin-left:2rem" class="nonprintable"/><label for="pagada" style="text-align:left" class="nonprintable">Pagada</label><br>
		<br>
		<div class="b bold" style="width:4rem;max-width:4rem">NIF</div><div id="nif" class="b tbr" style="width:9rem;max-width:9rem"></div><div class="b tbr bold" style="width:4rem">Nom</div><div id="nom" class="b tbr" style="width:25rem;max-width:25rem"></div><br>
		<div class="b blr bold" style="width:4rem;max-width:4rem">Adreça</div><div id="adressa" class="b br" style="width:23rem;max-width:23rem"></div><div class="b br bold" style="width:5rem;max-width:5rem">Població</div><div id="poblacio" class="b br" style="width:10rem;max-width:10rem"></div>
	</div>

	<div>
		<h5 class="nonprintable">Detall de la factura</h5>
		<div id="fpagada" class="fpagada nonprintable">PAGADA</div>
		<table style="width:50rem;">
			<thead>
				<tr>
					<th>Codi</th>
					<th class="tha">Article</th>
					<th>Uni.</th>
					<th>Preu</th>
					<th>Subtotal</th>
					<th class="nonprintable">Acc</th>
				</tr>
			</thead>
			<tbody>
				<tr class="thf">
					<th colspan="4">Total articles</th>
					<th style="text-align:right">0.00</th>
					<th class="nonprintable"><img src="img/add.svg" width="32px"></th>
				</tr>
			</tbody>
		</table>
	</div>
	<div style="white-space:nowrap">
		<h5 class="nonprintable">Resum de la factura</h5>
		<div class="b bold" style="width:3rem;max-width:3rem;">Dte.</div><div class="b tbr" id="dte" style="width:2rem;max-width:2rem;text-align:center"></div><div class="b tbr bold" style="width:1rem">%</div>
		<div class="b bold" style="width:7rem;max-width:7rem;margin-left:1.5rem;">Import dte.</div><div class="b tbr" id="idte" style="width:6rem;max-width:6rem;text-align:center"></div>
		<div class="b bold" style="width:10rem;max-width:10rem;margin-left:1.5rem;">Base imposable</div><div class="b tbr" id="base" style="width:7rem;max-width:7rem;text-align:center"></div><br><br>
		<div class="b bold" style="width:3rem;max-width:3rem;">IVA</div><div class="b tbr" id="iva" style="width:2rem;max-width:2rem;text-align:center"></div><div class="b tbr bold" style="width:1rem">%</div>
		<div class="b bold" style="width:7rem;max-width:7rem;;margin-left:1.5rem;">Import IVA</div><div class="b tbr" id="iiva" style="width:6rem;max-width:6rem;text-align:center"></div>
		<div class="b bold" style="width:10rem;max-width:10rem;margin-left:1.5rem;">TOTAL FACTURA</div><div class="b tbr" id="total" style="width:7rem;max-width:7rem;text-align:center"></div>
	</div>
	<div class="nonprintable">
		<button id="imprimir">Imprimir factura</button>
		<button id="guardar">Guardar factura</button>
		<button id="cancelar">Cancel·lar</button>
	</div>
</body>
</html>
