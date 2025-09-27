// app/(auth)/login.tsx
import Botao from "@/components/ui/Botao";
import RodapeLogin from "@/components/ui/RodapeLogin";
import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
// import { AuthContext } from "../../context/AuthContext";

export default function Login() {
    //   const { login } = useContext(AuthContext);
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    const handleLogin = async () => {
        // try {
        //   const res = await fetch("http://localhost:3000/auth/login", {
        //     method: "POST",
        //     headers: { "Content-Type": "application/json" },
        //     body: JSON.stringify({ email, senha }),
        //   });

        //   const data = await res.json();
        //   if (res.ok) {
        //     login(data.token, data.tipoUsuario);
        //   } else {
        //     alert(data.msg || "Erro ao logar");
        //   }
        // } catch (err) {
        //   console.log(err);
        // }
    };

    return (
        <View style={{ flex: 1, alignItems: "center", height: '100%', }}>

            <Text style={{ fontSize: 34, fontWeight: "bold", marginTop: 60, marginBottom: 6, height: 50, textAlign: 'center' }}>
                Login
            </Text>

            <View style={{ flex: 1, alignItems: "center", height: '100%', width: '100%', borderTopWidth: 1, borderTopColor: '#eeeeeeff' }}>
                <View style={{ flexDirection: 'column', alignItems: 'center', width: '100%', height: 300 , justifyContent:'center', marginTop:100}}>
                    <View style={{flexDirection:'column', alignItems:'flex-start', width:'100%', paddingLeft:30,paddingRight:30, marginBottom:10}}> 
                        <Text style={{fontSize: 20,fontWeight:"bold" }}>E-mail:</Text>
                        <TextInput
                           style={styles.input}
                            placeholder="seu.email@exemplo.com"
                            value={email}
                            onChangeText={setEmail}
                        />
                    </View>
                   <View style={{flexDirection:'column', alignItems:'flex-start', width:'100%', paddingLeft:30,paddingRight:30, marginBottom:10}}> 
                    <Text style={{fontSize: 20,fontWeight:"bold" }}>Senha:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="***************"
                        secureTextEntry
                        value={senha}
                        onChangeText={setSenha}
                    />
                    </View>
                </View>


                <Botao title="Entrar" largura={330} altura={56} color="#295CA9" onPress={handleLogin} />

                <View style={{ height:50, marginTop:186}}>
                    <RodapeLogin title="Não tem uma conta? " subtitle="Cadastre-se" onPress={() => { }} />
                </View>
            </View>

            {/* <Button title="Entrar" onPress={handleLogin} color={red} /> */}
        </View>
    );
}

const styles = StyleSheet.create({
    input: {
        borderWidth: 1, borderColor: '#eeeeeeff', padding: 10, width: '100%', marginBottom: 10, borderRadius: 8, marginTop:10, height:56,
        color: "#939EAA",
        
    }
})