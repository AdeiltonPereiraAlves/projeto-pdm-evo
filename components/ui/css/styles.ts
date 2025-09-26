import { StyleSheet } from "react-native";

export const globalStyles = StyleSheet.create({
  containerCenter: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    width: "80%",
    marginBottom: 10,
    borderRadius: 8,
  },
  button: {
    backgroundColor: "#295CA9",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 999,
    width: 200,
    alignItems: "center",
    justifyContent: "center"
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
