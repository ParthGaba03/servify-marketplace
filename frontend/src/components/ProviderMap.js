import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Link } from 'react-router-dom';

function ProviderMap({ providers }) {
    // Default center for the map (Manipal)
    const mapCenter = [13.3525, 74.7825];

    return (
        // This style prop is essential for the map to be visible
        <MapContainer center={mapCenter} zoom={13} style={{ height: '100%', width: '100%' }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {providers.map(provider => (
                provider.latitude && provider.longitude && (
                    <Marker key={provider.id} position={[provider.latitude, provider.longitude]}>
                        <Popup>
                            <strong>{provider.username}</strong><br />
                            {provider.city}<br />
                            <Link to={`/providers/${provider.id}`}>View Profile</Link>
                        </Popup>
                    </Marker>
                )
            ))}
        </MapContainer>
    );
}

export default ProviderMap;