/**
 * Fetch route from OpenStreetMap Routing Service (OSRM)
 * @returns Array of coordinates representing the route
 */
export async function fetchOSRMRoute(
  fromLat: number,
  fromLon: number,
  toLat: number,
  toLon: number
): Promise<{ latitude: number; longitude: number }[]> {
  // Using OSRM Demo Server (for production, consider hosting your own OSRM instance)
  const url = `https://router.project-osrm.org/route/v1/driving/${fromLon},${fromLat};${toLon},${toLat}?overview=full&geometries=geojson`;

  const response = await fetch(url);
  const data = await response.json();

  if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
    const route = data.routes[0];
    const coordinates = route.geometry.coordinates.map((coord: [number, number]) => ({
      latitude: coord[1],
      longitude: coord[0],
    }));
    return coordinates;
  }

  throw new Error('Route not found');
}
