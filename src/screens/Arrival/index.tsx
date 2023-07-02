import React, { useEffect, useState } from 'react';
import { AsyncMessage, Container, Content, Description, Footer, Label, LicensePlate } from './styles';
import {useNavigation, useRoute} from '@react-navigation/native'
import { Header } from '../../components/Header';
import { Button } from '../../components/Button';
import { ButtonIcon } from '../../components/ButtonIcon';
import { X } from 'phosphor-react-native';
import { useObject, useRealm } from '../../libs/realm';
import { Historic } from '../../libs/realm/schemas/Historic';
import { BSON } from 'realm';
import { Alert } from 'react-native';
import { getLastAsyncTimestamp } from '../../libs/asyncstorage/syncstorage';
import { loadAsync } from 'expo-auth-session';
type RouteParamsProps = {
    id: string
}
export function Arrival() {
    const [dataNotSync,setDataNotSync] = useState(false)
    const route = useRoute()
    const {id} = route.params as RouteParamsProps
    const historic = useObject(Historic,new BSON.UUID(id))
    const realm = useRealm()
    const {goBack} = useNavigation()
    const title = historic?.status === 'departure' ? 'Chegada' : 'Detalhes'
    function handleRemoveVehicleUsage(){
        Alert.alert(
            'Cancelar',
            'Deseja Cancelar a utilização do veículo?',
            [
            {
                text: 'Não', style: 'cancel'
            },
            {
                text: 'Sim', onPress: () => removeVehivleUsage()
            }
        ]
        )
    }

    function removeVehivleUsage(){
        realm.write(() => {
            realm.delete(historic)
        })
        goBack()
    }

    function handleArrivalRegister(){
        try {
            if(!historic){
                return Alert.alert('Error', 'Não foi possivel obter os dados para registrar a chegada')
            }

            realm.write(() => {
                historic.status = 'arrival',
            historic.updated_at = new Date();
            } )
            Alert.alert('Chegada', 'Chegada registrada com sucesso')
          goBack()
        } catch (error) {
            console.log(error)
            Alert.alert('Erro Não foi possivel registrar a chegada')
        }
    }

    useEffect(() => {
        getLastAsyncTimestamp().then(lastSync => setDataNotSync(historic!.updated_at.getTime() > lastSync))
       
    },[])

    return (
    <Container>
        <Header title={title}/>
        <Content>

             <Label>
            Placa do Veículo
        </Label>

        <LicensePlate>
            {historic?.license_plate}
        </LicensePlate>

        <Label>
            Finalidade
        </Label>

        <Description>
           {historic?.description}
        </Description>

    
      
        </Content>
        {
            historic?.status === 'departure' &&
              <Footer>
            <ButtonIcon
            icon={X}
            onPress={handleRemoveVehicleUsage}
            />

            <Button 
            title='Registrar Chegada'
            onPress={handleArrivalRegister}
            />
        </Footer>
        }

        {
            dataNotSync && 
        <AsyncMessage>
         Sincronização da {historic?.status === 'departure' ? 'partida' : 'chegada'} pendente
       </AsyncMessage>
       
        }
       
    </Container>
  );
}