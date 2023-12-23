"use strict";
/* eslint-disable @typescript-eslint/no-var-requires */
//
// Bibliothéque JavaScript utilisée en mode "batch" :
// 18/12/2021 : passage en Typescript
// 03/09/2022 : passage en FP, remplacement des require par des import
//
// Mode d'emploi :
// 1. Une fois/an, lancer dans CET ORDRE :
//      - node kiko_init.js mf : chargement des données climatiques de Météo France (MF)
//        ATTENTION : si plantage, reconstruire manuellement le fichier 'Liste_stations_météo_complètes.txt' car des stations météo peuvent disparaître...
//      - node kiko_init.js immo : création du fichier prix_maisons_m2.json correspondant aux prix immobiliers des maisons
//      - node kiko_init.js clim : création du fichier fc.json à partir des données climatiques de Météo France
// 2. Mise à jour du site Web, hébergé sur netlify, via git
// **********************************************************************************************************************
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
// On 'importe' des fonctions de distances.js
var distances_1 = require("../batch/distances");
// Chargement des prix au m2 et des coordonnées des CNPE
var prix_m2 = require("../src/data/prix_maisons_m2.json");
var lat_long_CNPE = require("../src/data/centrales.json");
// Constantes communes à l'ensemble des traitements
var https = require("https");
var fs = require("fs");
var ref = require("../src/data/ListeFichesClimatiques.json");
// Fonction de création du fichier de valeurs foncières
var filename = "../src/data_source/valeursfoncieres.txt";
function CreationFichierValeursFoncieres(url) {
    return __awaiter(this, void 0, void 0, function () {
        // Fonction récursive pour lire les morceaux du fichier
        function read() {
            return __awaiter(this, void 0, void 0, function () {
                var _a, done, value;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, reader.read()];
                        case 1:
                            _a = _b.sent(), done = _a.done, value = _a.value;
                            if (done) {
                                // Fin de la lecture du fichier
                                console.log("Chargement en local du fichier des valeurs foncières terminé");
                                return [2 /*return*/];
                            }
                            // Utiliser la partie 'value', qui contient le morceau de données
                            // On crée le fichier sur disque si tout est OK (591 Mo pour 2022, 4,7 millions de lignes) *************************************************
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
                            fs.appendFileSync(filename, value); // Création incrémentale du fichier brut, mode texte, sur disque
                            // Appeler récursivement la fonction pour lire le morceau suivant
                            return [4 /*yield*/, read()];
                        case 2:
                            // Appeler récursivement la fonction pour lire le morceau suivant
                            _b.sent();
                            return [2 /*return*/];
                    }
                });
            });
        }
        var response, reader, prix_maisons, fiches1, cumul_prix, cumul_surface, nb_vente, num_line, current_district, lineReader;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fs.unlink(filename, function (err) {
                        if (err) {
                            console.error("Erreur lors de la suppression du fichier de valeurs foncières : ", err);
                        }
                        else {
                            console.log("Le précédent fichier de valeurs foncières a été supprimé avec succès.");
                        }
                    });
                    return [4 /*yield*/, fetch(url)];
                case 1:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error("Erreur de chargement du fichier");
                    }
                    reader = response.body.getReader();
                    // Démarrer la lecture
                    return [4 /*yield*/, read()];
                case 2:
                    // Démarrer la lecture
                    _a.sent();
                    prix_maisons = /** @class */ (function () {
                        function prix_maisons() {
                            this.dpt = "";
                            this.prix = 0;
                            this.nb_ventes = 0;
                        }
                        return prix_maisons;
                    }());
                    fiches1 = [];
                    cumul_prix = 0;
                    cumul_surface = 0;
                    nb_vente = 0;
                    num_line = 0;
                    current_district = "01";
                    lineReader = require("readline").createInterface({
                        // Nouveau package depuis Node 4.0.0 qui facilite la lecture d'un fichier ligne à ligne
                        input: require("fs").createReadStream(filename),
                    });
                    lineReader.on("line", function (line_read) {
                        if (num_line > 0) {
                            // on saute la 1ère ligne du fichier
                            var fields = line_read.split("|");
                            var item = new prix_maisons(); // note the "new" keyword here
                            var departement = fields[18];
                            var prix = !fields[10] ? 0 : Number(fields[10].substring(0, fields[10].indexOf(","))); // Guard si le prix est vide ; suppression des décimales sinon
                            var type_bien = fields[36];
                            var surface = !fields[38] ? 0 : Number(fields[38]); // Guard si la surface est vide
                            if (departement == current_district) {
                                if (type_bien == "Maison" && prix / surface < 50000) {
                                    // Guard : on ne retient pas les prix au m2 hors norme (vente de domaine, etc.)
                                    cumul_prix += prix;
                                    cumul_surface += surface;
                                    ++nb_vente;
                                }
                            }
                            else {
                                item.prix = cumul_surface ? Math.trunc(cumul_prix / cumul_surface) : 0; // Guard : pour le département 2B, pas de maison donc pas de surface...
                                item.nb_ventes = nb_vente;
                                item.dpt = current_district;
                                console.log("Traitement du département " + item.dpt + " : prix moyen au m2 = " + item.prix + " euros (" + item.nb_ventes + " ventes)");
                                fiches1.push(item); // Enrichissement du 'vecteur' contenant l'ensemble des fiches
                                current_district = departement;
                                cumul_prix = cumul_surface = nb_vente = 0;
                            }
                        }
                        ++num_line;
                    });
                    lineReader.on("close", function () {
                        fs.writeFileSync("../src/data/prix_maisons_m2.json", JSON.stringify(fiches1, null, 2)); // Création du json final sur disque
                    });
                    return [2 /*return*/];
            }
        });
    });
}
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
        // Dernières valeurs disponibles complètes : 2022 - Chargées le 23 décembre 2023
        var url = "https://static.data.gouv.fr/resources/demandes-de-valeurs-foncieres/20231010-093059/valeursfoncieres-2022.txt";
        // Appeler la fonction pour charger le fichier par morceaux, en provenance de data.gouv, puis création de prix_maisons_m2.json
        CreationFichierValeursFoncieres(url);
        break;
    }
    default:
        console.log("Désolé mais seule l'une des 3 commandes suivantes est autorisée : mf, clim, immo");
}
