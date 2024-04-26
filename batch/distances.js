// Distance entre deux lieux via leurs coordonnées géographiques
// Version du 3/9/2022
// Initialisation de variables-clés
const EARTH_RADIUS_KM = 6371;
const M_PI = Math.acos(-1.0);
// This function converts decimal degrees to radians
function deg2rad(deg) {
    return (deg * M_PI) / 180;
}
//  This function converts radians to decimal degrees
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function rad2deg(rad) {
    return (rad * 180) / M_PI;
}
function distanceEarth(lat1d, lon1d, lat2d, lon2d) {
    /**
     * Returns the distance between two points on the Earth.
     * Direct translation from http://en.wikipedia.org/wiki/Haversine_formula
     * @param lat1d Latitude of the first point in degrees
     * @param lon1d Longitude of the first point in degrees
     * @param lat2d Latitude of the second point in degrees
     * @param lon2d Longitude of the second point in degrees
     * @return The distance between the two points in kilometers
     */
    const lat1r = deg2rad(lat1d);
    const lon1r = deg2rad(lon1d);
    const lat2r = deg2rad(lat2d);
    const lon2r = deg2rad(lon2d);
    const u = Math.sin((lat2r - lat1r) / 2);
    const v = Math.sin((lon2r - lon1r) / 2);
    return (2.0 *
        EARTH_RADIUS_KM *
        Math.asin(Math.sqrt(u * u + Math.cos(lat1r) * Math.cos(lat2r) * v * v)));
}
function convert_DMS_DD(coord) {
    // Fonction qui convertit des coordonnées GPS d'une station météo en Degrés, Minutes, Secondes en Degrés Décimaux
    // Ex : latitude: 45°38'24"N longitude : 05°52'36"E donnera latitude : 45.64   longitude : 5.8766
    // Pas de guard supplémentaire dans cette fonction : le format de la coordonnées DMS a déjà été vérifié lors de la création des fiches climatiques
    const deg = coord.indexOf(`°`);
    const min = coord.indexOf(`'`);
    const sec = coord.indexOf(`"`);
    const h = Number(coord.substring(0, deg));
    const m = Number(coord.substring(deg + 1, min)) / 60;
    const s = Number(coord.substring(min + 1, sec)) / 3600;
    let c = h + m + s;
    // Les coordonnées Sud et Ouest sont négatives
    const n4 = coord.indexOf("S");
    const n5 = coord.indexOf("O"); // Attention si la coordonnée est exprimée en anglais "W pour O"
    if (n4 != -1 || n5 != -1) {
        c = -c;
    }
    return c;
}
function site_dangereux_le_plus_proche(coords_sites_dangereux, latitude_to_test, longitude_to_test) {
    // Fonction qui retourne la distance à vol d'oiseau (en kms) soit :
    // - de la plus proche centrale nucléaire répertoriée sur le territoire français (IRSN.fr)
    //   19 centrales en exploitation en 2020 et 1 en construction (EPR Flamanville)
    //   Outil de vérification : https://www.lexilogos.com/calcul_distances.htm
    // - du site Seveso le plus proche de la commune saisie
    // 03/09/2022 : FP version
    class distance_sites_dangereux {
        constructor() {
            this.distance = 0;
            this.site = "";
        }
    }
    const fiches = coords_sites_dangereux.map((item) => {
        const d = new distance_sites_dangereux(); // note the "new" keyword here
        d.distance = distanceEarth(latitude_to_test, longitude_to_test, item.latitude, item.longitude);
        d.site = item.site;
        return d;
    });
    fiches.sort(function (a, b) {
        return a.distance - b.distance;
    });
    // ... et on renvoit la distance minimale
    return fiches[0];
}
export { site_dangereux_le_plus_proche, convert_DMS_DD };
