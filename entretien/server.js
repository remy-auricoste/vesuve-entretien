const axios = require("axios");
const https = require("https");
const express = require("express");
const envVar = require("env-var");
/**
 * Format de la réponse JSON
 * [
 *   {
 *     "nom": "Nom 1",
 *   },
 *   {
 *     "nom": "Nom 2",
 *   }
 * ]
 */

const port = envVar.get("PORT").asInt() ?? 5000;

(async function () {
  const app = express();

  app.get("/data", async (req, res) => {
    const apprentis = await getData3();

    const organismes = apprentisToOrganismes(apprentis);
    return res.json({
      organismes,
      formations: apprentis,
      apprentis,
    });
  });

  app.listen(port, () =>
    console.log(`Server ready and listening on port ${port}`)
  );
})();

const apprentisToOrganismes = (apprentis) => {
  return apprentis.map((organisme) => {
    const result = JSON.parse(JSON.stringify(organisme));
    result.nom = result.raison_sociale;
    delete result.raison_sociale;
    return result;
  });
};

const getData3 = () => {
  // [
  //   {
  //   "nom": "organisme1",
  //   "adresse1": "36 rue des lilas Paris"
  //   },
  //   {
  //   "nom": "organisme2",
  //   "adresse": "31 rue des lilas Paris"
  //   }
  //   ]
  return new Promise((resolve, reject) => {
    https
      .get(
        "https://mocki.io/v1/cbbd831b-199c-4e48-b426-1ce8ddbf1aa5",
        (resp) => {
          let data = "";

          resp.on("data", (chunk) => {
            data += chunk;
          });

          resp.on("end", () => {
            try {
              const json = JSON.parse(data);
              resolve(json);
            } catch (err) {
              reject(err);
            }
          });
        }
      )
      .on("error", (err) => {
        reject(err);
      });
  });
};
