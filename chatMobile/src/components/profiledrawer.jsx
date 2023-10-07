import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { View, Image } from 'react-native'
import { Text, Button } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer'

import { logout } from '../app/accountSlice'

import requests from '../../api/requests'

import ChatMenu from './chat'

const LeftDrawer = createDrawerNavigator()

function ProfileDrawer() {
    return (
      <LeftDrawer.Navigator 
        screenOptions={{ 
          headerStyle: { backgroundColor: '#313538' }, 
          headerTintColor: '#fff',
          drawerStyle: { backgroundColor: '#313538' }, 
          drawerPosition: 'left', 
          drawerType: 'back'
        }} 
        initialRouteName="Чат"
        drawerContent={(props) => <ProfileContent {...props}/> }
        >
          <LeftDrawer.Screen name="Чат" component={ChatMenu}/>
      </LeftDrawer.Navigator>
    )
  }
  
function ProfileContent(props) {
    const [nickname, setNickname] = useState('')
  
    const dispatch = useDispatch()
    const navigation = useNavigation()
  
    const logoutToken = useSelector((state) => state.auth.account.logoutToken)
  
    useEffect(() => {
      async function getNickname() {
        const result = await requests.send('getNickname')
        setNickname(result.nickname)
      }
      getNickname()
    }, [])
  
    async function logoutAccount() {
      const result = await requests.sendParam('accLogout', 'token', logoutToken)
  
      if (result.code == 'success') {
        dispatch(logout())
        navigation.navigate("AuthMenu") 
      }
    }
  
    return (
      <View style={{ flex: 1 }}>
        <DrawerContentScrollView {...props}>
          <View style={{ backgroundColor: '#212529', marginBottom: 5, padding: 10, height: 65, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
            <Image style={{ width: 50, height: 50, resizeMode: 'stretch' }} source={ require('../../assets/images/defaultAcc.png') }/>
            <Text style={{ marginLeft: 10, fontSize: 16, color: '#fff', fontWeight: '700' }}>{nickname}</Text>
          </View>
          <DrawerItemList {...props}/>
          <View style={{ padding: 5, alignItems: 'flex-start' }}>
            <Button textColor='red' onPress={() => logoutAccount()}>Выйти из аккаунта</Button>
          </View>
        </DrawerContentScrollView>
      </View>
    )
}

export default ProfileDrawer;
  