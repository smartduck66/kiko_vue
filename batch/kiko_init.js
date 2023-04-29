"use strict";
/* eslint-disable @typescript-eslint/no-var-requires */
//
// Bibliothéque JavaScript utilisée en mode "batch" :
// 18/12/2021 : passage en Typescript
// 03/09/2022 : passage en FP, remplacement des require par des import
//
// Mode d'emploi :
// 1. Une fois/an, lancer dans cet ordre :
//      - node kiko_init.js mf : chargement des données climatiques de Météo France (MF)
//        ATTENTION : si plantage, reconstruire manuellement le fichier 'Liste_stations_météo_complètes.txt' car des stations météo peuvent disparaître...
//      - node kiko_init.js immo : création du fichier prix_maisons_m2.json correspondant aux prix immobiliers des maisons
//      - node kiko_init.js clim : création du fichier fc.json à partir des données climatiques de Météo France
// 2. Mise à jour du site Web, hébergé sur netlify, via git
// **********************************************************************************************************************
exports.__esModule = true;
// On 'importe' des fonctions de distances.js
var distances_1 = require("../batch/distances");
// Chargement des prix au m2 et des coordonnées des CNPE
var prix_m2 = require("../src/data/prix_maisons_m2.json");
var lat_long_CNPE = require("../src/data/centrales.json");
// Constantes communes à l'ensemble des traitements
var https = require("https");
var fs = require("fs");
var ref = require("../src/data/ListeFichesClimatiques.json");
function extract_alone_value(ref, pattern, data, value_name) {
    // Fonction qui extrait une valeur seule
    var match = data.match(pattern);
    if (match !== null) {
        return match[0];
    }
    else
        throw new Error("La fiche " + ref + " semble ne pas avoir de données : " + value_name);
}
function extract_value_in_a_list(ref, pattern, data, value_name) {
    // Fonction qui extrait une valeur dans une liste
    var match = data.match(pattern);
    if (match !== null) {
        // Guard : on teste la présence d'une mention ("Données non disponibles" ou "Statistiques...") au lieu de valeurs
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        var offset = match.index + value_name.length + 3; // L'offset permet de "sauter" le titre du bloc de données ; +3 correspond aux caractères parasites : CR,LF...
        var mention = data.substring(offset, offset + 1);
        switch (mention) {
            case "D":
                // Données non disponibles
                return "indisponible";
            case "S":
                offset += 50; // On augmente l'offset à cause de la mention "Statistiques établies..."
            // eslint-disable-next-line no-fallthrough
            default: {
                // On est positionné au début du jeu de données (janvier à décembre, + une valeur moyenne), séparées par des points-virgules
                var s1 = data.substring(offset, offset + 156); // 156 correspond au nombre d'octets du jeu de données
                var s2 = s1.split(";");
                return s2[13].trimStart(); // On ne renvoit que la moyenne annuelle
            }
        }
    }
    else
        throw new Error("La fiche " + ref + " semble ne pas avoir de données : " + value_name);
}
// *********************************************************************************************************************************************
// Main : récupération de l'argument passé en ligne de commande et exécution de la portion de code correspondante
// *********************************************************************************************************************************************
var myArgs = process.argv.slice(2);
console.log("myArgs: ", myArgs);
switch (myArgs[0]) {
    case "mf": {
        console.log("Chargement des données climatiques brutes en provenance du site de Météo France");
        // Balayage de l'ensemble des fiches MF et création des fichiers .data sur disque (assets/ficheclim)
        ref.map(function (refcli) {
            var filename = refcli.ref + ".data";
            console.log("Chargement de la fiche climatique de la ville : " + refcli.town);
            var url = "https://donneespubliques.meteofrance.fr/FichesClim/FICHECLIM_" + filename;
            var request = https.get(url);
            request.on("response", function (response) {
                var httpStatus = response.statusCode;
                response.setEncoding("utf-8");
                var body = "";
                response.on("data", function (chunk) {
                    body += chunk;
                });
                response.on("end", function () {
                    if (httpStatus === 200) {
                        fs.writeFileSync("../src/ficheclim/" + filename, body); // Création du fichier brut, mode texte, sur disque
                    }
                    else {
                        new Error("HTTP status ${response.statusCode}");
                    }
                });
                request.on("error", function (error) {
                    console.log(error);
                });
            });
        });
        break;
    }
    case "clim": {
        console.log("Création du fichier fc.json regroupant les fiches climatiques");
        var data_MF_1 = /** @class */ (function () {
            function data_MF() {
                this.indicatif = "";
                this.ville = "";
                this.departement = "";
                this.altitude = 0;
                this.latitude = "";
                this.longitude = "";
                this.temp_moy = 0;
                this.temp_min = 0;
                this.temp_max = 0;
                this.canicule = 0;
                this.ensoleillement = "";
                this.pluie = "";
                this.vent = "";
                this.distance_cnpe = 0;
                this.prix_maisons = "";
            }
            return data_MF;
        }());
        // Balayage de l'ensemble des fiches MF, enrichissement de l'Array fiches, création du JSON sur disque
        var fiches = ref.map(function (refcli) {
            var text = fs.readFileSync("../src/ficheclim/" + refcli.ref + ".data", "utf8");
            var item = new data_MF_1(); // note the "new" keyword here
            item.indicatif = refcli.ref;
            item.ville = refcli.town;
            var s = extract_alone_value(item.indicatif, /\(\d{1,3}\)/, text, "département");
            item.departement = s.substring(s.indexOf("(") + 1, s.indexOf(")"));
            s = extract_alone_value(item.indicatif, /alt : \d+m/, text, "altitude");
            item.altitude = Number(s.substring(s.indexOf(":") + 2, s.indexOf("m")));
            s = extract_alone_value(item.indicatif, /lat : .+,/, text, "latitude");
            item.latitude = s.substring(s.indexOf(":") + 2, s.indexOf(","));
            s = extract_alone_value(item.indicatif, /lon : .+;/, text, "longitude");
            item.longitude = s.substring(s.indexOf(":") + 2, s.indexOf(";"));
            item.temp_moy = Number(extract_value_in_a_list(item.indicatif, /Température moyenne/, text, "Température moyenne (Moyenne en °C)"));
            item.temp_max = Number(extract_value_in_a_list(item.indicatif, /Température maximale/, text, "Température maximale (Moyenne en °C)"));
            item.temp_min = Number(extract_value_in_a_list(item.indicatif, /Température minimale/, text, "Température minimale (Moyenne en °C)"));
            item.canicule = Number(extract_value_in_a_list(item.indicatif, /Nombre moyen de jours avec/, text, "Nombre moyen de jours avec")); // Tx >= 30°C (1ère ligne)
            item.ensoleillement = extract_value_in_a_list(item.indicatif, /Durée d'insolation/, text, "Durée d'insolation (Moyenne en heures)");
            item.pluie = extract_value_in_a_list(item.indicatif, /Précipitations : Hauteur moyenne mensuelle/, text, "Précipitations : Hauteur moyenne mensuelle (mm)");
            item.vent = extract_value_in_a_list(item.indicatif, /Nombre moyen de jours avec rafales/, text, "Nombre moyen de jours avec rafales");
            var d = (0, distances_1.site_dangereux_le_plus_proche)(lat_long_CNPE, (0, distances_1.convert_DMS_DD)(item.latitude), (0, distances_1.convert_DMS_DD)(item.longitude));
            item.distance_cnpe = Math.trunc(d.distance);
            try {
                item.prix_maisons = prix_m2[prix_m2.findIndex(function (x) { return x.dpt == item.departement; })]["prix"].toString();
            }
            catch (ex) {
                item.prix_maisons = "-";
            }
            return item;
        });
        fs.writeFileSync("../src/data/fc.json", JSON.stringify(fiches, null, 2)); // Création du json final sur disque
        break;
    }
    case "immo": {
        // Chargement du fichier des valeurs foncières et création du fichier afférent sur le disque dur
        // Source : https://www.data.gouv.fr/fr/datasets/demandes-de-valeurs-foncieres/
        console.log("Création du fichier prix_maisons_m2.json correspondant aux prix immobiliers des maisons");
        // Dernières valeurs disponibles complètes : 2022 - Chargées le 29 avril 2023
        var url = "https://static.data.gouv.fr/resources/demandes-de-valeurs-foncieres/20230405-160733/valeursfoncieres-2022.txt";
        var filename_1 = "../src/data_source/valeursfoncieres-2022.txt";
        var request_1 = https.get(url);
        request_1.on("response", function (response) {
            var httpStatus = response.statusCode;
            console.log("httpStatus : " + httpStatus);
            response.setEncoding("utf-8");
            var body = "";
            response.on("data", function (chunk) {
                body += chunk;
            });
            response.on("end", function () {
                if (httpStatus === 200) {
                    // On crée le fichier sur disque si tout est OK (498 Mo pour 2022, 3,803 millions de lignes) *************************************************
                    // Champs ci-dessous pour chaque ligne du fichier --------------------------------------
                    // Code service CH
                    // Reference document
                    // 1 Articles CGI
                    // 2 Articles CGI
                    // 3 Articles CGI
                    // 4 Articles CGI
                    // 5 Articles CGI
                    // No disposition
                    // Date mutation
                    // Nature mutation
                    // Valeur fonciere
                    // No voie
                    // B
                    // T
                    // Q
                    // Type de voie
                    // Code voie
                    // Voie
                    // Code postal
                    // Commune
                    // Code departement
                    // Code commune
                    // Prefixe de section
                    // Section
                    // No plan
                    // No Volume
                    // 1er lot
                    // Surface Carrez du 1er lot
                    // 2eme lot
                    // Surface Carrez du 2eme lot
                    // 3eme lot
                    // Surface Carrez du 3eme lot
                    // 4eme lot
                    // Surface Carrez du 4eme lot
                    // 5eme lot
                    // Surface Carrez du 5eme lot
                    // Nombre de lots
                    // Code type local
                    // Type local
                    // Identifiant local
                    // Surface reelle bati
                    // Nombre pieces principales
                    // Nature culture
                    // Nature culture speciale
                    // Surface terrain
                    fs.writeFileSync(filename_1, body); // Création du fichier brut, mode texte, sur disque
                    fs.appendFileSync(filename_1, "|||||||999999|99/99/9999|Vente|99999999,99|99||RUE|9999||99999||99||||||||||||||||9|9|||||||999"); // Guard à la fin du fichier
                }
                else {
                    new Error("HTTP status ${response.statusCode}");
                }
            });
            request_1.on("error", function (error) {
                console.log(error);
            });
        });
        // Création du fichier prix_maisons_m2.json *****************************************************************************
        var prix_maisons_1 = /** @class */ (function () {
            function prix_maisons() {
                this.dpt = "";
                this.prix = 0;
                this.nb_ventes = 0;
            }
            return prix_maisons;
        }());
        // Balayage du fichier des valeurs foncières, enrichissement de l'Array fiches, création du JSON sur disque
        var fiches1_1 = [];
        var cumul_prix_1 = 0;
        var cumul_surface_1 = 0;
        var nb_vente_1 = 0;
        var num_line_1 = 0;
        var current_district_1 = "01";
        var lineReader = require("readline").createInterface({
            // Nouveau package depuis Node 4.0.0 qui facilite la lecture d'un fichier ligne à ligne
            input: require("fs").createReadStream(filename_1)
        });
        lineReader.on("line", function (line_read) {
            if (num_line_1 > 0) {
                // on saute la 1ère ligne du fichier
                var fields = line_read.split("|");
                var item = new prix_maisons_1(); // note the "new" keyword here
                var departement = fields[18];
                var prix = !fields[10] ? 0 : Number(fields[10].substring(0, fields[10].indexOf(","))); // Guard si le prix est vide ; suppression des décimales sinon
                var type_bien = fields[36];
                var surface = !fields[38] ? 0 : Number(fields[38]); // Guard si la surface est vide
                if (departement == current_district_1) {
                    if (type_bien == "Maison" && prix / surface < 50000) {
                        // Guard : on ne retient pas les prix au m2 hors norme (vente de domaine, etc.)
                        cumul_prix_1 += prix;
                        cumul_surface_1 += surface;
                        ++nb_vente_1;
                    }
                }
                else {
                    item.prix = cumul_surface_1 ? Math.trunc(cumul_prix_1 / cumul_surface_1) : 0; // Guard : pour le département 2B, pas de maison donc pas de surface...
                    item.nb_ventes = nb_vente_1;
                    item.dpt = current_district_1;
                    console.log("Traitement du département " + item.dpt + " : prix moyen au m2 = " + item.prix + " euros (" + item.nb_ventes + " ventes)");
                    fiches1_1.push(item); // Enrichissement du 'vecteur' contenant l'ensemble des fiches
                    current_district_1 = departement;
                    cumul_prix_1 = cumul_surface_1 = nb_vente_1 = 0;
                }
            }
            ++num_line_1;
        });
        lineReader.on("close", function () {
            fs.writeFileSync("../src/data/prix_maisons_m2.json", JSON.stringify(fiches1_1, null, 2)); // Création du json final sur disque
        });
        break;
    }
    default:
        console.log("Désolé mais seule l'une des 3 commandes suivantes est autorisée : mf, clim, immo");
}
