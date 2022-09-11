import * as faunadb from "faunadb";

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


async function database(collection, search, update, localStorage_name, id, param_object) {
  // Cette fonction sert à rechercher des données (search = true, update = false, localStorage_name not null)
  // Cette fonction sert aussi à modifier des données (search = false, update = true, localStorage_name = null, id et param_object not null)

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
    secret: "fnAEg6NFACAAyGu9nqEDFQMm_6-lt8-xVZWrdx2x", // généré via le dashboard de Fauna, exclusif à la base de données 'bel_vue' /////////////////// TO UPDATE FOR THIS PROJECT
    domain: "db.eu.fauna.com",
    port: 443,
    scheme: "https",
  });

  try {
    if (search) {
      const result = flattenDataKeys(
        await client.query(
          q.Map(
            q.Paginate(Documents(Collection(collection))),
            q.Lambda((x) => q.Get(x))
          )
        )
      );
      localStorage.setItem(localStorage_name, JSON.stringify(result));
      return false;
    }
    if (update) {
      await client.query(
        q.Update(q.Ref(q.Collection(collection), id), {
          data: param_object,
        })
      );
      return false;
    }
  } catch (error) {
    return true;
  }
}

export { flattenDataKeys, isFunction, database };
