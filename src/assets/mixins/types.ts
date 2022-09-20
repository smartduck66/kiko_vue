export interface fiche_climatique {
  indicatif: string;
  ville: string;
  departement: string;
  altitude: number;
  latitude: string;
  longitude: string;
  temp_moy: number;
  temp_min: number;
  temp_max: number;
  ensoleillement: string;
  pluie: string;
  vent: string;
  distance_cnpe: number;
  prix_maisons: string;
}

export interface results {
  site: string;
  tmoy: number;
  tmin: number;
  tmax: number;
  soleil: string;
  pluie: string;
  vent: string;
  cnpe: number;
  prix: string;
}
