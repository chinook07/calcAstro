import { useState, useEffect } from "react";
import { LayersControl, MapContainer, ScaleControl, TileLayer, Marker, useMapEvents } from "react-leaflet";
import styled from "styled-components";

const CarteCoord = () => {

    const [emplacement, setEmplacement] = useState({});
        
    const ChoixCliquerCarte = () => {
        useMapEvents({
            click(e) {setEmplacement(e.latlng)}
        })
    }

    return (
        <Wrapper
            center={[45.5, -73.8]}
            zoom="8"
        >
            <ScaleControl imperial={false} position="topright" />
            <LayersControl position="topright">
                <LayersControl.BaseLayer checked name="OpenStreetMap">
                    <TileLayer
                        attribution='<a href="https://openstreetmap.org/copyright" title="OpenStreetMap Copyright">OpenStreetMap</a> | Données: &copy; contributeurs <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        minZoom={5}
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                </LayersControl.BaseLayer>
                <LayersControl.BaseLayer name="Esri (satellite)">
                    <TileLayer
                        attribution='Tuiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, et la communauté des utilisateurs des SIG'
                        minZoom={5}
                        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                    />
                </LayersControl.BaseLayer>
            </LayersControl>
            <ChoixCliquerCarte />
            {
                emplacement && emplacement.lat && <Marker position={emplacement} />
            }
            
        </Wrapper>
    )
}

const Wrapper = styled(MapContainer)`
    height: 300px;
    width: 400px;
`

export default CarteCoord;