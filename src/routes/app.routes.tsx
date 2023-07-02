import {createNativeStackNavigator} from '@react-navigation/native-stack'
import { Home } from '../screens/Home'
import { Departure} from '../screens/Departure'
import { NavigationProp } from '@react-navigation/native'
import { Arrival } from '../screens/Arrival'
const {Navigator,Screen} = createNativeStackNavigator()


export type AppNavigatorRoutesProps = NavigationProp<NavigationScreens>
export type NavigationScreens = {
    Home: undefined;
    Departure: undefined;
    Arrival: {
        id: string
    }
}

export function AppRoutes(){
return(
    <Navigator screenOptions={{headerShown: false}}>
        <Screen
        name='Home'
        component={Home}
        />

<Screen
        name='Departure'
        component={Departure}
        />

<Screen
        name='Arrival'
        component={Arrival}
        />
        

    </Navigator>
)
}