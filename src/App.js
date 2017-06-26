import React, {Component} from 'react';
import ReactMapboxGl, { Layer, Feature } from "react-mapbox-gl";
import { routeService, routeStopService, busLocationService } from './lib/busService';
import './App.css';

// Create a new React Mapbox GL object with token
const Map = ReactMapboxGl({accessToken: "pk.eyJ1IjoidG1pbGxlciIsImEiOiJ6dGRpN3ZvIn0.ndthw82iivvOXpvybGob4A"});

// Initial position of the map
const center = [-73.9387992, 40.7242217];

// Styles for the mappedRoute
const lineLayout = {
  'line-cap': 'round',
  'line-join': 'round'
};

const linePaint = {
  'line-color': '#4790E5',
  'line-width': 1
};

class App extends Component {
  state = {
    route: [],
    stops: [],
    buses: []
  }

  componentDidMount() {
    routeService().then(res => this.setState({ route: res }))
    routeStopService().then(res => this.setState({ stops: res }))
    busLocationService().then(res => this.setState({ buses: res }))
  }

  render() {
    const mappedRoute = this.state.route
    const routeStops = this.state.stops
    const buses = this.state.buses

    return (
      <div className="App">

        <Map style="mapbox://styles/tmiller/cj4d9psou5y2g2smvm8taw11p" center={center} zoom={[12]} containerStyle={{
          height: "100vh",
          width: "100vw"
        }}>

          {/* The route for the current bus line */}
          <Layer type="line" layout={lineLayout} paint={linePaint}>
            <Feature coordinates={mappedRoute}/>
          </Layer>

          {/* All the bus stops along the route */}
          <Layer type="circle" id="marker">
            { routeStops.map(stop => <Feature key={stop.code} coordinates={[stop.lon, stop.lat]}/>) }
          </Layer>

          {/* The current location of every bus */}
          <Layer type="symbol" id="busmarker" layout={{ "icon-image": "marker-15" }}>
            { buses.map(bus => <Feature key={bus.MonitoredVehicleJourney.VehicleRef} coordinates={[bus.MonitoredVehicleJourney.VehicleLocation.Longitude, bus.MonitoredVehicleJourney.VehicleLocation.Latitude]}/>) }
          </Layer>
        </Map>
      </div>
    );
  }
}
export default App;
