/* eslint-disable @typescript-eslint/no-var-requires */
//
// Bibliothéque JavaScript utilisée en mode "batch" :
// 18/12/2021 : passage en Typescript
// 03/09/2022 : passage en FP, remplacement des require par des import
// 23/12/2023 : réécriture de la création du fichier de valeurs immobilières (async/await) - Les fiches climatiques sont désormais chargées dans le répertoire \public
// 28/12/2023 : intégration des données issues de la DRIAS - Pour le moment, la récupération des fichiers dans \public\drias se fait manuellement
// 26/04/2024 : transformation au format ES6 et remplacement du package 'createReadStream' (node 4.0) par fs/promises
//
// Mode d'emploi :
// 1. Une fois/an, lancer dans CET ORDRE :
//      - node kiko_init mf : chargement des données climatiques de Météo France (MF)
//        ATTENTION : si plantage, reconstruire manuellement le fichier 'Liste_stations_météo_complètes.txt' car les stations météo évoluent (dernière MAJ : avril 2024)
//      - node kiko_init immo : création du fichier prix_maisons_m2.json correspondant aux prix immobiliers des maisons
//      - node kiko_init clim : création du fichier fc.json à partir des données climatiques de Météo France et de drias_H1.json (prévisions 2021-2050/RPC 4.5)
//        ATTENTION : le répertoire \public\drias contient les fichiers de prévision créés manuellement en partant du site https://www.drias-climat.fr/
// 2. Mise à jour du site Web, hébergé sur netlify, via git
// **********************************************************************************************************************

// On 'importe' des fonctions de distances.js
import { convert_DMS_DD, site_dangereux_le_plus_proche } from "../batch/distances.js";

// Autres imports
import * as https from "https";
import * as fs from "fs";
import { open } from "fs/promises"; // Pour lecture d'un fichier texte ligne à ligne

// Chargement des données
const prix_m2 = JSON.parse(fs.readFileSync("../src/data/prix_maisons_m2.json", "utf8"));
const lat_long_CNPE = JSON.parse(fs.readFileSync("../src/data/centrales.json", "utf8"));
const ref = JSON.parse(fs.readFileSync("../src/data/ListeFichesClimatiques.json", "utf8"));

// Fonction de création du fichier de valeurs foncières
const filename = "../src/data_source/valeursfoncieres.txt";
async function CreationFichierValeursFoncieres(url: string) {
  fs.unlink(filename, (err) => {
    err
      ? console.error("Erreur lors de la suppression du fichier de valeurs foncières : ", err)
      : console.log("Le précédent fichier de valeurs foncières a été supprimé avec succès.");
  });

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Erreur de chargement du fichier : " + url);
  }

  // Créer un objet ReadableStream depuis la réponse
  const reader = response.body!.getReader();

  // Fonction récursive pour lire les morceaux du fichier
  async function read() {
    const { done, value } = await reader.read();

    if (done) {
      // Fin de la lecture du fichier
      console.log("Chargement en local du fichier des valeurs foncières terminé");
      return;
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
    await read();
  }

  // Démarrer la lecture
  await read();

  // Création du fichier prix_maisons_m2.json *****************************************************************************
  class prix_maisons {
    dpt: string;
    prix: number;
    nb_ventes: number;

    constructor() {
      this.dpt = "";
      this.prix = 0;
      this.nb_ventes = 0;
    }
  }

  // Balayage du fichier des valeurs foncières, enrichissement de l'Array fiches, création du JSON sur disque
  const fiches1: prix_maisons[] = [];
  let cumul_prix = 0,
    cumul_surface = 0,
    nb_vente = 0,
    current_district = "01";

  // On lit le fichier texte
  const lineReader = await open(filename);

  let isFirstIteration = true;
  for await (const line of lineReader.readLines()) {
    if (isFirstIteration) {
      isFirstIteration = false;
      continue; // Saute la première itération
    }

    const fields: string[] = line.split("|");
    const item = new prix_maisons(); // note the "new" keyword here

    const departement: string = fields[18];
    const prix: number = !fields[10] ? 0 : Number(fields[10].substring(0, fields[10].indexOf(","))); // Guard si le prix est vide ; suppression des décimales sinon
    const type_bien: string = fields[36];
    const surface: number = !fields[38] ? 0 : Number(fields[38]); // Guard si la surface est vide

    if (departement == current_district) {
      if (type_bien == "Maison" && prix / surface < 50000) {
        // Guard : on ne retient pas les prix au m2 hors norme (vente de domaine, etc.)
        // ATTENTION : le cas où la parcelle contient plusieurs maisons habitables fausse les calculs (cela peut arriver surtout en province)
        cumul_prix += prix;
        cumul_surface += surface;
        ++nb_vente;
      }
    } else {
      item.dpt = current_district;
      item.prix = cumul_surface ? Math.trunc(cumul_prix / cumul_surface) : 0; // Guard : pour le département 2B, pas de maison donc pas de surface...
      item.nb_ventes = nb_vente;
      console.log("Traitement département " + item.dpt + " : prix moyen au m2 = " + item.prix + " € (" + item.nb_ventes + " ventes)");
      fiches1.push(item); // Enrichissement du 'vecteur' contenant l'ensemble des fiches
      current_district = departement;
      cumul_prix = cumul_surface = nb_vente = 0;
    }
  }

  fs.writeFileSync("../src/data/prix_maisons_m2.json", JSON.stringify(fiches1, null, 2)); // Création du json final sur disque
}

function extract_alone_value(ref: string, pattern: RegExp, data: string, value_name: string): string {
  // Fonction qui extrait une valeur seule
  const match = data.match(pattern);
  if (match) {
    return match[0];
  } else throw new Error("La fiche " + ref + " semble ne pas avoir de données : " + value_name);
}

function extract_value_in_a_list(ref: string, pattern: RegExp, data: string, value_name: string): string {
  // Fonction qui extrait une valeur dans une liste
  const match = data.match(pattern);

  if (match) {
    // Guard : on teste la présence d'une mention ("Données non disponibles" ou "Statistiques...") au lieu de valeurs
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    let offset: number = match.index! + value_name.length + 3; // L'offset permet de "sauter" le titre du bloc de données ; +3 correspond aux caractères parasites : CR,LF...
    const mention: string = data.substring(offset, offset + 1);

    switch (mention) {
      case "D":
        // Données non disponibles
        return "indisponible";

      case "S":
        offset += 50; // On augmente l'offset à cause de la mention "Statistiques établies..."

      // eslint-disable-next-line no-fallthrough
      default: {
        // On est positionné au début du jeu de données (janvier à décembre, + une valeur moyenne), séparées par des points-virgules
        const s1: string = data.substring(offset, offset + 156); // 156 correspond au nombre d'octets du jeu de données
        const s2: string[] = s1.split(";");

        return s2[13].trimStart(); // On ne renvoit que la moyenne annuelle
      }
    }
  } else throw new Error("La fiche " + ref + " semble ne pas avoir de données : " + value_name);
}

// *********************************************************************************************************************************************
// Main : récupération de l'argument passé en ligne de commande et exécution de la portion de code correspondante
// *********************************************************************************************************************************************
const myArgs = process.argv.slice(2);
console.log("myArgs: ", myArgs);

switch (myArgs[0]) {
  case "mf": {
    console.log("Chargement des données climatiques brutes en provenance du site de Météo France");

    // Balayage de l'ensemble des fiches MF et création des fichiers .data sur disque (assets/ficheclim)
    ref.map((refcli: any) => {
      const filename = refcli.ref + ".data";
      console.log("Chargement de la fiche climatique de la ville : " + refcli.town);
      const url = "https://donneespubliques.meteofrance.fr/FichesClim/FICHECLIM_" + filename;

      const request = https.get(url);

      request.on("response", (response) => {
        const httpStatus = response.statusCode;

        response.setEncoding("utf-8");
        let body = "";
        response.on("data", (chunk: string) => {
          body += chunk;
        });

        response.on("end", () => {
          if (httpStatus === 200) {
            fs.writeFileSync("../public/ficheclim/" + filename, body); // Création du fichier brut, mode texte, sur disque
          } else {
            new Error("HTTP status ${response.statusCode}");
          }
        });

        request.on("error", (error: string) => {
          console.log(error);
        });
      });
    });
    break;
  }

  case "clim": {
    console.log("Création du fichier fc.json regroupant les fiches climatiques, ainsi que les prévisions DRIAS H1");

    class data_MF {
      indicatif: string;
      ville: string;
      departement: string;
      altitude: number;
      latitude: string;
      longitude: string;
      date_maj: string;
      temp_moy: number;
      temp_min: number;
      temp_max: number;
      canicule: number;
      ensoleillement: string; // Peut être indisponible
      pluie: string; // Peut être indisponible
      vent: string; // Peut être indisponible
      distance_cnpe: number;
      prix_maisons: string; // Peut être indisponible

      constructor() {
        this.indicatif = "";
        this.ville = "";
        this.departement = "";
        this.altitude = 0;
        this.latitude = "";
        this.longitude = "";
        this.date_maj = "";
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
    }

    // Balayage de l'ensemble des fiches MF, enrichissement de l'Array fiches, création du JSON sur disque
    const fiches: data_MF[] = ref.map((refcli: any) => {
      const text = fs.readFileSync("../public/ficheclim/" + refcli.ref + ".data", "utf8");
      const item = new data_MF(); // note the "new" keyword here

      item.indicatif = refcli.ref;
      item.ville = refcli.town;

      let s: string = extract_alone_value(item.indicatif, /\(\d{1,3}\)/, text, "département");
      item.departement = s.substring(s.indexOf("(") + 1, s.indexOf(")"));

      s = extract_alone_value(item.indicatif, /alt : \d+m/, text, "altitude");
      item.altitude = Number(s.substring(s.indexOf(":") + 2, s.indexOf("m")));

      s = extract_alone_value(item.indicatif, /lat : .+,/, text, "latitude");
      item.latitude = s.substring(s.indexOf(":") + 2, s.indexOf(","));

      s = extract_alone_value(item.indicatif, /lon : .+;/, text, "longitude");
      item.longitude = s.substring(s.indexOf(":") + 2, s.indexOf(";"));

      s = extract_alone_value(item.indicatif, /\d{2}\/\d{2}\/\d{4}/, text, "Edité le :");
      item.date_maj = s;

      item.temp_moy = Number(extract_value_in_a_list(item.indicatif, /Température moyenne/, text, "Température moyenne (Moyenne en °C)"));

      item.temp_max = Number(extract_value_in_a_list(item.indicatif, /Température maximale/, text, "Température maximale (Moyenne en °C)"));

      item.temp_min = Number(extract_value_in_a_list(item.indicatif, /Température minimale/, text, "Température minimale (Moyenne en °C)"));

      item.canicule = Number(extract_value_in_a_list(item.indicatif, /Nombre moyen de jours avec/, text, "Nombre moyen de jours avec")); // Tx >= 30°C (1ère ligne)

      item.ensoleillement = extract_value_in_a_list(item.indicatif, /Durée d'insolation/, text, "Durée d'insolation (Moyenne en heures)");

      item.pluie = extract_value_in_a_list(
        item.indicatif,
        /Précipitations : Hauteur moyenne mensuelle/,
        text,
        "Précipitations : Hauteur moyenne mensuelle (mm)"
      );

      item.vent = extract_value_in_a_list(item.indicatif, /Nombre moyen de jours avec rafales/, text, "Nombre moyen de jours avec rafales");

      const d = site_dangereux_le_plus_proche(lat_long_CNPE, convert_DMS_DD(item.latitude), convert_DMS_DD(item.longitude));
      item.distance_cnpe = Math.trunc(d.distance);

      try {
        item.prix_maisons = prix_m2[prix_m2.findIndex((x: { dpt: string }) => x.dpt == item.departement)]["prix"].toString();
      } catch (ex) {
        item.prix_maisons = "-";
      }
      return item;
    });

    fs.writeFileSync("../src/data/fc.json", JSON.stringify(fiches, null, 2)); // Création du json final sur disque

    // Même opération si le fichier indicatif.drias correspondant existe ******************************************************
    // Balayage de l'ensemble des fiches MF, enrichissement de l'Array fiches_drias, création du JSON sur disque

    class data_drias_H1 {
      indicatif: string;
      temp_moy: number;
      temp_min: number;
      temp_max: number;
      canicule: number;
      pluie: number;

      constructor() {
        this.indicatif = "";
        this.temp_moy = 0;
        this.temp_min = 0;
        this.temp_max = 0;
        this.canicule = 0;
        this.pluie = 0;
      }
    }

    const fiches_drias: data_drias_H1[] = ref.map((refcli: any) => {
      const drias_filename = "../public/drias/" + refcli.ref + ".H1";
      const item = new data_drias_H1(); // note the "new" keyword here
      try {
        fs.accessSync(drias_filename, fs.constants.F_OK);
        // Le fichier existe, donc on peut le lire
        let fields = fs.readFileSync(drias_filename, "utf8").split(";");
        item.indicatif = refcli.ref;
        item.temp_moy = Number(fields[0]);
        item.temp_min = Number(fields[1]);
        item.temp_max = Number(fields[2]);
        item.canicule = Number(fields[3]);
        item.pluie = Number(fields[4]);
        return item;
      } catch (error) {
        // Si le fichier n'existe pas, on initialise l'objet à 0
        item.indicatif = refcli.ref;
        item.temp_moy = 0;
        item.temp_min = 0;
        item.temp_max = 0;
        item.canicule = 0;
        item.pluie = 0;
        return item;
      }
    });

    fs.writeFileSync("../src/data/drias_H1.json", JSON.stringify(fiches_drias, null, 2)); // Création du json final sur disque

    break;
  }

  case "immo": {
    // Chargement du fichier des valeurs foncières et création du fichier afférent sur le disque dur
    // Source : https://www.data.gouv.fr/fr/datasets/demandes-de-valeurs-foncieres/
    console.log("Création du fichier prix_maisons_m2.json correspondant aux prix immobiliers des maisons");

    // Dernières valeurs disponibles complètes : 2022 - Chargées le 23 décembre 2023
    // Aller vérifier régulièrement sur https://www.data.gouv.fr/fr/datasets/demandes-de-valeurs-foncieres/
    const url = "https://static.data.gouv.fr/resources/demandes-de-valeurs-foncieres/20240408-125738/valeursfoncieres-2023.txt";

    // Appeler la fonction pour charger le fichier par morceaux, en provenance de data.gouv, puis création de prix_maisons_m2.json
    CreationFichierValeursFoncieres(url);
    break;
  }

  default:
    console.log("Désolé mais seule l'une des 3 commandes suivantes est autorisée : mf, clim, immo");
}
