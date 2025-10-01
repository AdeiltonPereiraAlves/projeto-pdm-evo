import { View,Text } from 'react-native';


export interface RodapeLoginProps {
    title?: string;
    subtitle?: string;
    onPress?: () => void;
}



export default function RodapeLogin({ title, subtitle, onPress }: RodapeLoginProps) {
    return (
        <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center', marginTop:20}}>
            <Text style={{color:'#939EAA'}}>{title}</Text>
            <Text style={{color:'#0A2472', fontWeight:'bold',textDecorationLine: 'underline'}}>{subtitle}</Text>
        </View>
    )
}