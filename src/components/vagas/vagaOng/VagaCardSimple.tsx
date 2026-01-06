// import React from "react";
// import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

// export interface VagaCardSimpleProps {
//   id: string;
//   titulo: string;
//   status: string;
//   onPress?: () => void;

// }

// export default function VagaCardSimple({ id, titulo, status, onPress }: VagaCardSimpleProps) {
//   return (
//     <TouchableOpacity style={styles.card} onPress={onPress}>
//       <View style={styles.row}>
//         <View style={styles.info}>
//           <Text style={styles.titulo} numberOfLines={2}>{titulo}</Text>
//           <View style={styles.statusBadge}>
//             <Text style={[styles.statusText, status === "ABERTO" ? styles.open : styles.closed]}>{status}</Text>
//           </View>
//         </View>

//         <TouchableOpacity style={styles.btnInscricoes} onPress={onPress}>
//           <Text style={styles.btnText}>Inscrições</Text>
//         </TouchableOpacity>
//       </View>
//     </TouchableOpacity>
//   );
// }

// const styles = StyleSheet.create({
//   card: {
//     backgroundColor: "#fff",
//     borderRadius: 10,
//     padding: 12,
//     marginHorizontal: 16,
//     marginVertical: 8,
//     elevation: 3,
//     shadowColor: "#000",
//     shadowOpacity: 0.08,
//     shadowOffset: { width: 0, height: 2 },
//   },
//   row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
//   info: { flex: 1, marginRight: 12 },
//   titulo: { fontSize: 16, fontWeight: "700", color: "#111" },
//   statusBadge: { marginTop: 8, alignSelf: "flex-start", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, backgroundColor: "#F3F4F6" },
//   statusText: { fontSize: 12, fontWeight: "600" },
//   open: { color: "#065F46" },
//   closed: { color: "#B91C1C" },
//   btnInscricoes: { backgroundColor: "#295CA9", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
//   btnText: { color: "#fff", fontWeight: "600" },
// });

//




import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export interface VagaCardSimpleProps {
    id: string;
    titulo: string;
    status: string;
    inscricoesCount?: any[];
    onPress?: () => void;
    onVerInscricoes?: () => void;
}

export default function VagaCardSimple({
    id,
    titulo,
    status,
    inscricoesCount = [],
    onPress,
    onVerInscricoes,
}: VagaCardSimpleProps) {
    const statusIsOpen = String(status).toUpperCase() === "ABERTO";
    const count = Array.isArray(inscricoesCount)
        ? inscricoesCount.length
        : (inscricoesCount || 0);
    return (
        <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
            <View style={styles.content}>
                <View style={styles.left}>
                    <Text style={styles.titulo} numberOfLines={2}>
                        {titulo}
                    </Text>

                    <View style={styles.metaRow}>
                        <View style={[styles.statusBadge, statusIsOpen ? styles.openBg : styles.closedBg]}>
                            <Text style={[styles.statusText, statusIsOpen ? styles.openText : styles.closedText]}>
                                {status}
                            </Text>
                        </View>

                        <Text style={styles.inscricoesText}>{count} inscriç{count === 1 ? "ão" : "ões"}</Text>
                    </View>
                </View>

                {/* Botão para ver inscrições */}
                {count > 0 && onVerInscricoes && (
                    <TouchableOpacity
                        onPress={(e) => {
                            e.stopPropagation(); // Previne que o onPress do card seja acionado
                            onVerInscricoes();
                        }}
                        style={styles.inscricoesButton}
                    >
                        <Text style={styles.inscricoesButtonText}>Ver Inscrições</Text>
                    </TouchableOpacity>
                )}
            </View>
        </TouchableOpacity>
      
    
  );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 12,
        marginHorizontal: 16,
        marginVertical: 8,
        elevation: 2,
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
    },
    inscricoesButton: {
        marginTop: 8,
        paddingVertical: 6,
        paddingHorizontal: 12,
        backgroundColor: '#E5E7EB',
        borderRadius: 6,
        alignSelf: 'flex-start',
    },
    inscricoesButtonText: {
        color: '#374151',
        fontSize: 14,
        fontWeight: '500',
    },
    content: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
    left: { flex: 1, marginRight: 12 },
    titulo: { fontSize: 16, fontWeight: "700", color: "#111", marginBottom: 8 },
    metaRow: { flexDirection: "row", alignItems: "center", gap: 12 },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 999,
        alignItems: "center",
        justifyContent: "center",
    },
    openBg: { backgroundColor: "#ECFDF5" },
    closedBg: { backgroundColor: "#FEF2F2" },
    statusText: { fontSize: 12, fontWeight: "700" },
    openText: { color: "#065F46" },
    closedText: { color: "#991B1B" },
    inscricoesText: { marginLeft: 12, color: "#6B7280", fontSize: 13 },
    btnInscricoes: {
        backgroundColor: "#295CA9",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
    },
    btnText: { color: "#fff", fontWeight: "700", fontSize: 13 },
});

