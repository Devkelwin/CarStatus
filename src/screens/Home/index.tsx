import React, { useEffect, useState } from 'react';
import { Container, Content, Label, Title } from './styles';
import { HomeHeader } from '../../components/HomeHeader';
import { CartStatus } from '../../components/CartStatus';
import { useNavigation } from '@react-navigation/native';
import { AppNavigatorRoutesProps, NavigationScreens } from '../../routes/app.routes';
import { useQuery, useRealm } from '../../libs/realm';
import { useUser } from '@realm/react';
import { Historic } from '../../libs/realm/schemas/Historic';
import { Alert, FlatList } from 'react-native';
import { HistoricCard,HistoryCardProps } from '../../components/HistoricCard';
import dayjs from 'dayjs'
import { getLastAsyncTimestamp, saveLastSyncTimestamp } from '../../libs/asyncstorage/syncstorage';
import Toast from 'react-native-toast-message';
import { TopMessage } from '../../components/TopMessage';
import { CloudArrowUp } from 'phosphor-react-native';

export function Home() {
const [vehicleInUse, setVehicleInUse] = useState<Historic | null>(null)
const [vehivleHistoric,setVehicleHistoric] = useState<HistoryCardProps[]>([])
const [percentageToSync,setPercentageToSync] = useState<string | null>(null)
  const {navigate} = useNavigation<AppNavigatorRoutesProps>()
   const historic = useQuery(Historic)
   const realm = useRealm()
  const user = useUser()
  function handleRegisterMovent(){
    if(vehicleInUse?._id){
      return navigate('Arrival',{id: vehicleInUse?._id.toString()})
    }else{
      navigate('Departure')
    }
      
   }

   function fetchVehicleInUse(){
    try {
         const vehicle = historic.filtered("status = 'departure' ")[0]
 setVehicleInUse(vehicle)
    } catch (error) {
      Alert.alert('Veiculo em uso', 'Não foi possivel carregar o veiculo em uso')
    console.log(error)
    }
 
   }

   async function fetchHistoric(){
    try {
       const response = historic.filtered("status = 'arrival' SORT(created_at DESC)")
       const lastSync = await getLastAsyncTimestamp()
   const formattedHistoric = response.map((item) => {
    return ({
      id: item._id.toString(),
      licensePlate: item.license_plate,
      isSync: lastSync > item.updated_at!.getTime(),
      created: dayjs(item.created_at).format('[Saida em] DD/MM/YYYY [ás] HH:mm')
    })
   })
   setVehicleHistoric(formattedHistoric)
    } catch (error) {
      console.log(error)
      Alert.alert('Não foi possivel carregar o historico')
    }
   
   }

   function handleHistoricDetails(id: string){
    navigate('Arrival', {id})
   }

   async function progressNotification(transferred: number,transferable: number){
    const porcentage = (transferred/transferable) * 100
   if(porcentage === 100){
    await saveLastSyncTimestamp()
    await fetchHistoric()
    setPercentageToSync(null)
    Toast.show({
      type: 'info',
      text1: 'Todos os dados estão OK'
    })
   }

   if(porcentage < 100){
    setPercentageToSync(`${porcentage.toFixed(0)}% Sincronizado.`)
   }
   
   }

   useEffect(() => {
    fetchVehicleInUse()
   },[])

   useEffect(() => {
    realm.addListener('change', () => fetchVehicleInUse())
    if(realm && !realm.isClosed){
  realm.removeListener('change',fetchVehicleInUse)
    }
 
   },[])

   useEffect(() => {
    fetchHistoric()
   },[historic])

   useEffect(() => {
 realm.subscriptions.update((mutableSubs,realm) => {
  const historyByUserQuery = realm.objects('Historic').filtered(`user_id = '${user!.id}'`)

  mutableSubs.add(historyByUserQuery,{name: 'historic_by_user'})
 })
   },[realm])

   useEffect(() => {
    const syncSession = realm.syncSession
    if(!syncSession){
      return
    }

    syncSession.addProgressNotification(
      Realm.ProgressDirection.Upload,
      Realm.ProgressMode.ReportIndefinitely,
      progressNotification
    )
    return() => syncSession.removeProgressNotification(progressNotification)
   },[])



  return (
    <Container>
      { 
        percentageToSync && <TopMessage title={percentageToSync} icon={CloudArrowUp}/>
      }
      <HomeHeader/>
      <Content>
        <CartStatus 
        onPress={handleRegisterMovent}
        licensePlate={vehicleInUse?.license_plate}
        />
       <Title>
        Histórico
       </Title>
           <FlatList
           data={vehivleHistoric}
           keyExtractor={item => item.id}
           renderItem={({item}) => (
            <HistoricCard
            data={item}
            onPress={() => handleHistoricDetails(item.id)}
            />
            
           )}
           showsVerticalScrollIndicator={false}
           contentContainerStyle={{paddingBottom: 100}}
           ListEmptyComponent={
            (
              <Label>
                Nenhum Veiculo Utilizado
              </Label>
            )
           }
           />
      </Content>
      
    </Container>
  );
}