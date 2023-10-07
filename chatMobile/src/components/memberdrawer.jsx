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
      <DrawerContentScrollView {...props} style={{ backgroundColor: '#2d3034' }}>
        <View style={{ backgroundColor: '#212529', height: 65, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: '#fff', fontSize: 20, alignSelf: 'center' }}>Список участников: {membersList.length}</Text>
        </View>
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