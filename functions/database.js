// Serverless function qui sert à rechercher les coordonnées géographiques d'une commune dont le code postal est passé en paramètre (cp)
// Inspired by https://dev.to/maxiggle/a-definitive-guide-to-using-serverless-functions-in-a-serverless-databases-with-netlify-and-vuejs-4ieg
import * as faunadb from "faunadb";
console.log("je rentre dans la serverless");

// Fauna typically returns objects that look like:
// {
//   ref: ..
//   ts: ...
//   data: {..}
// }
// We will never use a ref or ts key in our data so we'll just flatten it to work more easily.
function flattenDataKeys(obj) {
  if (Array.isArray(obj)) {
    return obj.map((e) => flattenDataKeys(e));
  } else if (typeof obj === "object") {
    // the case where we have just data pointing to an array.
    if (Object.keys(obj).length === 1 && obj.data && Array.isArray(obj.data)) {
      return flattenDataKeys(obj.data);
    } else {
      Object.keys(obj).forEach((k) => {
        if (k === "data") {
          const d = obj[k];
          delete obj.data;

          Object.keys(d).forEach((dataKey) => {
            obj[dataKey] = flattenDataKeys(d[dataKey]);
          });
        } else {
          obj[k] = flattenDataKeys(obj[k]);
        }
      });
    }
    return obj;
  } else {
    return obj;
  }
}

function isFunction(functionToCheck) {
  return functionToCheck && {}.toString.call(functionToCheck) === "[object Function]";
}

// Connexion à la base distante
const q = faunadb.query;

const {
  Call,
  Create,
  Collection,
  CurrentIdentity,
  Paginate,
  Documents,
  Lambda,
  Get,
  Var,
  Select,
  Let,
  Match,
  Index,
  Join,
  If,
  Exists,
  Update,
  Do,
  Add,
  Subtract,
  Not,
  Contains,
  Abort,
  Now,
} = q;

const client = new faunadb.Client({
  secret: process.env.FAUNADB_SERVER_SECRET, // généré via le dashboard de Fauna, exclusif à la base de données 'kiko'
  domain: "db.eu.fauna.com",
  port: 443,
  scheme: "https",
});

exports.handler = async (event, context) => {
  // get the data from the body of the request
  const cp = JSON.parse(event.body);
  

  try {
    const result = flattenDataKeys(
      await client.query(
        q.Map(
          q.Paginate(Documents(Collection("communes"))),
          q.Lambda((x) => q.Get(q.Match(q.Index("code_postal"), cp)))
        )
      )
    );
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Successfully created document",
        data: result,
      }),
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 400,
      body: JSON.stringify({
        error,
      }),
    };
  }
};
