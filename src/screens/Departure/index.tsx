import React, { useRef, useState } from 'react';
import { Container, Content } from './styles';
import { Header } from '../../components/Header';
import { LicensePlateInput } from '../../components/LicensePlateInput';
import { TextAreaInput } from '../../components/TextAreaInput';
import { Button } from '../../components/Button';
import { TextInput,ScrollView } from 'react-native';
import { licensePlateValidate } from '../../utils/licenseplatevalidate';
import { Alert } from 'react-native';
import { useRealm } from '../../libs/realm';
import {useUser} from '@realm/react'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Historic } from '../../libs/realm/schemas/Historic';
import { useNavigation } from '@react-navigation/native';



export function Departure() {
const [description,setDescription] = useState('')
const [licencePlate,setLicencePlate] = useState('')
const [isRegistering,setIsRegistering] = useState(false)
const {goBack} = useNavigation()
const realm = useRealm()
const user = useUser()
const descriptionRef = useRef<TextInput>(null)
const licensePlateRef = useRef<TextInput>(null)

function handleDepartureRegister(){
    try {
        if(!licensePlateValidate(licencePlate)){
            licensePlateRef.current?.focus()
            return Alert.alert('Placa inválidade', 'A Placa é invalidade, informe a placa correta do veiculo')
           }
        
           if(description.trim().length === 0){
            descriptionRef.current?.focus()
            return Alert.alert('Finalidade','Por favor Informe a finalidade do uso do veiculo')
           }
           setIsRegistering(true)

           realm.write(() => {
            realm.create('Historic',Historic.generate({
                user_id: user!.id,
                license_plate: licencePlate.toUpperCase(),
                description
            }))
           })
           Alert.alert('Saída', 'Saída do veiculo registrada com sucesso')
           goBack()



    } catch (error) {
        console.log(error)
        Alert.alert('Erro', 'Não foi possivel registrar a saida do veiculo')
        setIsRegistering(false)
    }


  
}
  return (
    <Container>
        <Header title='Saída'/>
        <KeyboardAwareScrollView extraHeight={100} >
        <ScrollView>
        <Content>
               <LicensePlateInput 
               ref={licensePlateRef}
        label='Placa do veículo'
        placeholder='BRA1234'
        onSubmitEditing={() => descriptionRef.current.focus()}
        returnKeyType='next'
        onChangeText={setLicencePlate}
        />

        <TextAreaInput
        ref={descriptionRef}
        label='Finalidade'
        placeholder='Vou utilizar o veículo para...'
        onSubmitEditing={handleDepartureRegister}
        returnKeyType='send'
        blurOnSubmit
        onChangeText={setDescription}
        />


        <Button 
        title='Registrar Saída'
        onPress={handleDepartureRegister}
        isLoading={isRegistering}
        />
        </Content>
        </ScrollView>
        </KeyboardAwareScrollView>
    </Container>
  );
}