import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import truck from "./images/truck.png";
import "./app.css";

import L from "leaflet";

const truckIcon = L.icon({
  iconUrl: truck,
  iconSize: [50, 50],
  iconAnchor: [22, 94],
  shadowAnchor: [4, 62],
  popupAnchor: [-3, -76],
});

const socket = io("http://localhost:5000");

const App = () => {
  let truckIds = [];
  let trucks = [];
  const [markers, setMarkers] = useState([]);
  const [marker, setMarker] = useState({});
  const [position, setPosition] = useState(null);

  const [connectionState, setConnectionState] = useState("Connecting");

  useEffect(() => {
    connect();
    truckLocation();
    onDisconnect();
  }, []);

  const connect = () => {
    socket.on("connect", () => setConnectionState("Connected"));
  };

  const onDisconnect = () => {
    socket.on("connect_error", () => setConnectionState("Disconnected"));
  };

  const trucksLocations = () => {
    socket.on("truck", (data) => {
      if (truckIds.includes(data.id)) {
        const index = truckIds.indexOf(data.id);
        setMarkers(trucks);
      }
      truckIds.push(data.id);
      setMarkers(trucks);
    });
  };

  const truckLocation = () => {
    socket.on("truck", (data) => {
      setPosition([data.latitude, data.longitude]);
    });
  };

  return (
    <>
      <h1>{connectionState}</h1>
      <h1>{position && position[0]}</h1>

      <MapContainer center={[6.9271, 79.8612]} zoom={13}>
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {position && <Marker position={position} icon={truckIcon} />}
        {/* {markers.map((el, i) => el.slideTo([el.latitude, el.longitude]))} */}
      </MapContainer>
    </>
  );
};
export default App;
