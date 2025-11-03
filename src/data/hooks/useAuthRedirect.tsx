// hooks/useAuthRedirect.ts
import { AuthContext } from "@/data/context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { useContext, useEffect } from "react";

export function useAuthRedirect() {
  const { token } = useContext(AuthContext);
  const navigation = useNavigation<any>();

  useEffect(() => {
    if (!token) {
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    }
  }, [token]);
}
