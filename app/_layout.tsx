import { AuthContext, AuthProvider } from '@/context/AuthContext';
import { Redirect, Stack } from 'expo-router';
import { useContext } from 'react';
import 'react-native-reanimated';

export const unstable_settings = {
  anchor: '(tabs)',
};

export function LayoutContent() {

    const {token, tipoUsuario} = useContext(AuthContext)
    console.log(tipoUsuario, "Tipo usuario")
    // if(!token){
    //   return <Redirect href="/(auth)/login"/>

    // }
    if(tipoUsuario==="VOLUNTARIO"){
      return<Redirect href="/(tabsVoluntario)/index"/>
    }
   
  return (
  

      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        {/* <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} /> */}
      </Stack>
   
      
    
  );

}
export default function RootLayout() {
  return (
    <AuthProvider>
      <LayoutContent />
    </AuthProvider>
  );
}