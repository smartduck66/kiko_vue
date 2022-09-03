"use strict";
// Utilitaire "mode batch" (node csv_to_json.js) permettant de créer des fichiers json à partir de fichiers csv 'open data'
// 03/09/2022 : FP version
// ************************************************************************************************************************
exports.__esModule = true;
// Transformation d'un fichier CSV des communes françaises (https://www.data.gouv.fr/fr/datasets/base-officielle-des-codes-postaux/)
// en un fichier json contenant le nom, la latitude et la longitude de chaque commune française référencée
// Import de communes.json dans fauna via shell : fauna import --path=./assets/data/communes.json --collection=communes --append
var communes = /** @class */ (function () {
  function communes() {
    this.cp = "";
    this.ville = "";
    this.latitude = 0;
    this.longitude = 0;
  }
  return communes;
})();
// eslint-disable-next-line @typescript-eslint/no-var-requires
var fs1 = require("fs");
// Balayage du fichier csv, enrichissement de l'Array fiches, création du JSON sur disque
// Format : Code_commune_INSEE;Nom_commune;Code_postal;Ligne_5;Libellé_d_acheminement;coordonnees_gps
// Ex : 05024;VALDOULE;05150;STE MARIE;VALDOULE;44.4677366709,5.50388863719
var allTextLines = fs1
  .readFileSync("../../data_source/communes.csv", "utf8")
  .split(/\r\n|\n/);
var fiches = allTextLines.map(function (item) {
  var c = new communes(); // note the "new" keyword here
  var fields = item.split(";");
  c.cp = fields[2];
  c.ville = fields[1];
  var coords = fields[5].split(",");
  c.latitude = Number(coords[0]);
  c.longitude = Number(coords[1]);
  return c;
});
fs1.writeFileSync("../../data/communes.json", JSON.stringify(fiches, null, 2)); // Création du json final sur disque
// ***********************************************************************************************************************************
// Transformation d'un fichier CSV des sites Seveso (https://public.opendatasoft.com/explore/dataset/sites-seveso/export/?flg=fr&location=9,44.52588,1.0643&basemap=jawg.streets)
// en un fichier json contenant le nom de l'usine et la commune hébergeant chaque site classé seveso, la latitude, la longitude
var seveso = /** @class */ (function () {
  function seveso() {
    this.site = "";
    this.latitude = 0;
    this.longitude = 0;
  }
  return seveso;
})();
// Balayage du fichier csv, enrichissement de l'Array fiches, création du JSON sur disque
var allTextLines1 = fs1
  .readFileSync("../../data_source/sites-seveso.csv", "utf8")
  .split(/\r\n|\n/);
var fiches1 = allTextLines1.map(function (item) {
  var s = new seveso(); // note the "new" keyword here
  var fields = item.split(";");
  var coords1 = fields[0].split(",");
  s.site = "Sté " + fields[2] + " à " + fields[3] + " - " + fields[12];
  s.latitude = Number(coords1[0]);
  s.longitude = Number(coords1[1]);
  return s;
});
fs1.writeFileSync("../../data/seveso.json", JSON.stringify(fiches1, null, 2)); // Création du json final sur disque
