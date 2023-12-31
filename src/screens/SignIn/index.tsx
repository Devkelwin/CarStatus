import {useState,useEffect} from 'react'
import * as WebBrowser from 'expo-web-browser'
import * as Google from 'expo-auth-session/providers/google'
import backgroundImg from '../../assets/background.png'
import { Button } from '../../components/Button';
import { Container,Slogan,Title } from './styles';

import {Realm,useApp} from '@realm/react'
import {ANDROID_CLIENT_ID,IOS_CLIENT_ID} from '@env'
import { Alert } from 'react-native';
WebBrowser.maybeCompleteAuthSession()

export  function SignIn() {
    const [isAuthenticating, setIsAuthenticating] = useState(false)
    const app = useApp()
    const [_, response,googleSignIn ] = Google.useAuthRequest({
        androidClientId: ANDROID_CLIENT_ID,
        iosClientId: IOS_CLIENT_ID,
        scopes: ['profile','email']
    })

    function handleGoogleSignIn(){
        setIsAuthenticating(true)
        googleSignIn().then((response) =>{
            if(response.type !== "success"){
                setIsAuthenticating(false)
            }
        })
    }

    useEffect(() => {
        if(response?.type === "success"){
            if(response.authentication?.idToken){
           const credentials = Realm.Credentials.jwt(response.authentication.idToken)
            app.logIn(credentials).catch((error)  =>{
                console.log(error)
                Alert.alert('Entrar', 'Não foi possivel Conectar a sua conta Google')
                setIsAuthenticating(false)
            })
        }else{
                Alert.alert('Entrar', 'Não foi possivel Conectar a sua conta Google')
                setIsAuthenticating(false)
            }
        }
    },[response])
    
  return (
   <Container source={backgroundImg}>
    <Title>
        Projeto 05
    </Title>
    <Slogan>
        App Gestão de uso Veiculos
    </Slogan>
<Button title='Entrar com Google' 
onPress={handleGoogleSignIn}
isLoading={isAuthenticating}
/>
   </Container>
  );
}
