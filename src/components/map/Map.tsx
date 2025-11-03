import { useVagas } from '@/data/context/VagaContext';
import * as Location from 'expo-location';
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import MapView, { Marker, Region } from "react-native-maps";

// Calcula distância aproximada entre duas coordenadas (km)
function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function Map() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [loading, setLoading] = useState(true);
  const { vagas } = useVagas();
  const [vagasProximas, setVagasProximas] = useState<any[]>([]);

  // Pega localização do usuário
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permissão de localização negada');
        setLoading(false);
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      setLocation(currentLocation);
      setLoading(false);
    })();
  }, []);

  // Filtra vagas próximas
  useEffect(() => {
    if (!location || !vagas) return;

    const filtradas = vagas.filter((vaga) => {
      if (!vaga.latitude || !vaga.longitude) return false; // ignora vagas sem coordenada

      const lat = Number(vaga.latitude);
      const lon = Number(vaga.longitude);
      const distancia = getDistanceFromLatLonInKm(
        location.coords.latitude,
        location.coords.longitude,
        lat,
        lon
      );

      return distancia <= 5000; // até 5 km
    });

    setVagasProximas(filtradas);
  }, [location, vagas]);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (!location) {
    return <View style={styles.error}><Text>Não foi possível obter a localização.</Text></View>;
  }

  const region: Region = {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  return (
    <MapView
      style={styles.map}
      initialRegion={region}
      showsUserLocation={true}
      showsMyLocationButton={true}
    >
      {/* Marcador do usuário */}
      <Marker
        coordinate={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        }}
        title="Você está aqui"
        description="Localização atual"
      />

      {/* Marcadores das vagas */}
      {vagasProximas.map((vaga) => (
        <Marker
          key={vaga.id}
          coordinate={{
            latitude: Number(vaga.latitude),
            longitude: Number(vaga.longitude),
          }}
          pinColor="red"
          title={vaga.titulo}
          description={vaga.descricao}
        >
          {/* <Callout>
            <View style={styles.calloutContainer}>
              <Text style={styles.calloutTitle}>{vaga.titulo}</Text>
              <Text style={styles.calloutDescription}>{vaga.descricao}</Text>
            </View>
          </Callout> */}
        </Marker>
      ))}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: { flex: 1 },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  error: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  calloutContainer: {
    minWidth: 250,          // aumenta largura mínima
    maxWidth: 300,          // largura máxima
    padding: 15,            // mais espaçamento interno
    backgroundColor: "#fff",
    borderRadius: 12,
    borderColor: "#ccc",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
  },
  calloutTitle: {
    fontWeight: "bold",
    fontSize: 18,          // aumenta o tamanho do título
    marginBottom: 8,
  },
  calloutDescription: {
    fontSize: 15,          // aumenta o tamanho do texto
    color: "#333",
  },
  
});
