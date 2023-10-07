import { useState, useEffect } from 'react'
import { View, ScrollView } from 'react-native'
import { Text } from 'react-native-paper'
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer'

import sockets from '../../api/sockets'

import ProfileDrawer from './profiledrawer'
import MemberObj from '../components/member'

const RightDrawer = createDrawerNavigator()

function MembersDrawer() {
  return (
    <RightDrawer.Navigator 
      screenOptions={{
        headerShown: false,
        headerStyle: { backgroundColor: '#313538' }, 
        headerTintColor: '#fff',
        drawerStyle: { backgroundColor: '#313538' }, 
        drawerPosition: 'right', 
        drawerType: 'back'
      }} 
      drawerContent={() => <MemberContent/> }>
        <RightDrawer.Screen name="ProfileDrawer" children={() => <ProfileDrawer/>}/>
    </RightDrawer.Navigator>
  )
}

function MemberContent(props) {
  const [membersList, setMembersList] = useState([])

  useEffect(() => {
    sockets.GetSingleton().on('onlineList', function(data) {
      setMembersList(current => { current = []; return [...current, ...data] })
    })
  }, [])

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <Text style={{ marginTop: 10, color: '#fff', fontSize: 16, fontWeight: '700', alignSelf: 'center' }}>Список участников: {membersList.length}</Text>
        <ScrollView style={{ marginVertical: 10 }}>
          { membersList.map((name, index) => {
            return ( <MemberObj key={index} nickname={name}/> )
          }) }
        </ScrollView>
      </DrawerContentScrollView>
    </View>
  )
}

export default MembersDrawer;