/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unused-vars */
// Squelette de pipeline d'intégration (plus évolué : utiliser gulp.js)
// Utilisation : 'node pipe_par' à la racine dès qu'un batch.ts est modifié
// 20/01/2022 : moins de 5 secondes de traitement
// 31/08/2022 : reprise de ce pipeline de kiko_web -> La compilation de kiko.ts dont les fonctions seront reprises dans les templates Vue est inutile (A SUPPRIMER)
// 19/03/2023 : regroupement des fichiers de code dédiés aux traitements batch - ATTENTION : distances.ts est également nécessaire au site interactif (/src/assets/mixins)

var startTime = performance.now();

const fs = require("fs");

function lines_delete() {
  // Suppression de lignes dans le fichier kiko.js généré par tsc
  const code_lines = [];
  const filename = "./src/assets/mixins/kiko.js";
  const lineReader = require("readline").createInterface({
    // Nouveau package depuis Node 4.0.0 qui facilite la lecture d'un fichier ligne à ligne
    input: require("fs").createReadStream(filename),
  });

  lineReader.on("line", function (line_read) {
    if (
      line_read.trim() != 'var faunadb = require("faunadb");' &&
      line_read.trim() != 'var distances = require("../mixins/distances.js");'
    ) {
      code_lines.push(line_read);
    }
  });

  lineReader.on("close", function () {
    // Réécriture du fichier source sur disque
    let output = fs.createWriteStream("./src/assets/mixins/kiko.js");
    for (let line of code_lines) {
      output.write(line + "\n");
    }
    output.end();
  });
}

const child_process = require("child_process");
const util = require("util");
const execP = util.promisify(child_process.exec);

const files = ["csv_to_json.ts", "kiko_init.ts", "distances.ts"];
let promises = files.map((file) => execP("tsc " + file+" --resolveJsonModule"));

Promise.all(promises)
  .then((bodies) => {
    console.log("traitement en cours");
  })
  .catch((e) => console.error(e));

//let tsc2 = child_process.execSync("npx prettier --write .");

var endTime = performance.now();

console.log(
  `Le traitement du pipeline a pris ${
    Math.round(endTime - startTime) / 1000
  } secondes`
);
