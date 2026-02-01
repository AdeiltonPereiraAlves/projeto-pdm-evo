import Icone from "@/components/shared/Icone";
import Loading from "@/components/loading/Loading";
import { useVagas } from "@/data/context/VagaContext";
import * as Location from "expo-location";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import { RootStackParamList } from "@/screens/stack/index";


// Calcula distância aproximada entre duas coordenadas (km)
function getDistanceFromLatLonInKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(1)} km`;
}

function formatTipoTrabalho(tipo: string): string {
  const map: Record<string, string> = {
    PRESENCIAL: "Presencial",
    REMOTO: "Remoto",
    HIBRIDO: "Híbrido",
  };
  return map[tipo] || tipo;
}

type VagaMapa = {
  id: string;
  titulo: string;
  descricao?: string;
  localizacao?: string;
  tipoTrabalho?: string;
  latitude: number;
  longitude: number;
  nomeOng?: string;
  ong?: { nome?: string };
};

type MapNavigationProp = NativeStackNavigationProp<RootStackParamList, "DetalheVaga">;

export default function Map() {
  const navigation = useNavigation<MapNavigationProp>();
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [loading, setLoading] = useState(true);
  const { vagas } = useVagas();
  const [vagasProximas, setVagasProximas] = useState<VagaMapa[]>([]);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLoading(false);
        return;
      }
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setLocation(currentLocation);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (!location || !vagas) return;

    const filtradas = vagas
      .filter((v) => v.latitude != null && v.longitude != null && !isNaN(Number(v.latitude)) && !isNaN(Number(v.longitude)))
      .map((v) => {
        const lat = Number(v.latitude);
        const lon = Number(v.longitude);
        const distancia = getDistanceFromLatLonInKm(
          location.coords.latitude,
          location.coords.longitude,
          lat,
          lon
        );
        return { ...v, latitude: lat, longitude: lon, _distancia: distancia };
      })
      .filter((v) => (v as any)._distancia <= 50)
      .sort((a, b) => (a as any)._distancia - (b as any)._distancia)
      .map(({ _distancia, ...rest }) => ({ ...rest, distancia: _distancia }));

    setVagasProximas(filtradas);
  }, [location, vagas]);

  if (loading) {
    return <Loading message="Carregando mapa..." />;
  }

  if (!location) {
    return (
      <View style={styles.error}>
        <Icone nome="location-outline" tamanho={48} color="#94a3b8" />
        <Text style={styles.errorText}>Não foi possível obter sua localização.</Text>
        <Text style={styles.errorHint}>Verifique as permissões do app.</Text>
      </View>
    );
  }

  const region: Region = {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  };

  return (
    <MapView
      style={styles.map}
      initialRegion={region}
      showsUserLocation
      showsMyLocationButton
      zoomEnabled
      zoomControlEnabled
      scrollEnabled
      pitchEnabled
      rotateEnabled
      mapType="standard"
    >
      {vagasProximas.map((vaga) => (
        <Marker
          key={vaga.id}
          coordinate={{
            latitude: vaga.latitude,
            longitude: vaga.longitude,
          }}
          pinColor="#295CA9"
          tracksViewChanges={false}
          title={vaga.titulo || "Vaga"}
          description={
            [
              formatDistance((vaga as any).distancia ?? 0),
              vaga.tipoTrabalho ? formatTipoTrabalho(vaga.tipoTrabalho) : null,
              vaga.nomeOng || vaga.ong?.nome || null,
            ]
              .filter(Boolean)
              .join(" • ") + " — Toque para abrir"
          }
          onCalloutPress={() => navigation.navigate("DetalheVaga", { vagaId: vaga.id })}
        />
      ))}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: { flex: 1 },
  error: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    padding: 24,
  },
  errorText: {
    fontSize: 16,
    color: "#475569",
    marginTop: 12,
    textAlign: "center",
  },
  errorHint: {
    fontSize: 14,
    color: "#94a3b8",
    marginTop: 4,
    textAlign: "center",
  },
});
