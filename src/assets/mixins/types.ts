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
  canicule: number;
  ensoleillement: string;
  pluie: string;
  vent: string;
  distance_cnpe: number;
  prix_maisons: string;
}

export interface results {
  col1: string;
  col2: string;
  col3: string;
  col4: string;
  col5: string;
  col6: string;
  col7: string;
  col8: string;
  col9: string;
  col10: string;
  col11: string;
}

export interface drias {
  indicatif: string;
  tmoy: number;
  tmin: number;
  tmax: number;
  canicule: number;
  pluie: number;

}

