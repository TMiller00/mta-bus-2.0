// @Mapbox/Polyline is used to convert MTA's polylines
// into coordinates
import polyline from '@mapbox/polyline';

// This server is found in 2017-02-05_proxy_server
const baseURL = 'http://localhost:8080/Siri'

/**************************************************************************
Named anonymous function that fetches the route information of the MTA B24
bus, extracts the polyline data, and decodes the polyline into coordinates
using the @Mapbox/Polyline library. Becuase the returned data is a nested
array, I flatten the array into a new variable and return the variable

URL: 'http://bustime.mta.info/api/where/route/MTA%20NYCT_B24.json?key=' + KEY + '&version=2'
**************************************************************************/

export const routeService = () => {
  return fetch(baseURL)
    .then(res => res.json())
    .then(json => {
        const route = json.data.entry.polylines

        const temp = route.map(poly => {
          return polyline.decode(poly.points)
        })

        const merged = [].concat.apply([], temp)
        const result = []

        merged.forEach(t => {
          result.push(t.reverse())
        })

        return result
    })
}

/**************************************************************************
Named anonymous function that fetches the route information and returns
an array containing the information for all stops

URL: 'http://bustime.mta.info/api/where/route/MTA%20NYCT_B24.json?key=' + KEY + '&version=2'
**************************************************************************/

export const routeStopService = () => {
  return fetch(baseURL)
    .then(res => res.json())
    .then(json => {
      const stops = json.data.references.stops
      return stops
    })
}

/**************************************************************************
Named anonymous function to fetch all the buses along the B24 route. Returns
an array.

URL: 'http://api.prod.obanyc.com/api/siri/vehicle-monitoring.json?key=' + KEY + '&version=2&LineRef=MTA%20NYCT_B24&VehicleMonitoringDetailLevel=calls'
**************************************************************************/

export const busLocationService = () => {
  return fetch('http://localhost:5000/api')
    .then(res => res.json())
    .then(json => {
      return json.Siri.ServiceDelivery.VehicleMonitoringDelivery[0].VehicleActivity
    })
}

// const route = json.data.entry.stopGroupings[0].stopGroups[1].stopIds
// const filteredStops = stops.filter(stop => {
//   if (route.indexOf(stop.id) !== -1) {
//     return stop
//   }
// })
