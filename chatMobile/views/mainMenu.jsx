import { useState } from 'react'
import { StatusBar, StyleSheet, View, Image } from 'react-native'
import { Text, TextInput, Button } from 'react-native-paper'
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer'
import { NavigationContainer } from '@react-navigation/native'
import axios from 'axios'

const Drawer = createDrawerNavigator()

let accountChange

const MainMenu = ({ setAccount }) => {
  accountChange = setAccount

  return (
    <NavigationContainer>
      <Drawer.Navigator 
      screenOptions={{ headerStyle: { backgroundColor: '#313538' }, drawerStyle: { backgroundColor: '#313538' }, headerTintColor: '#fff'}} 
      initialRouteName="Чат"
      drawerContent={(props) => <ProfileDrawer {...props}/> }
      >
        <Drawer.Screen name="Чат" component={ChatMenu}/>
      </Drawer.Navigator>
    </NavigationContainer>
  )
}

const ChatMenu = () => {
  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>

      </View>
      <View style={{ paddingBottom: 10, flexDirection: 'row', alignItems: 'stretch' }}>
        <TextInput
            style={[styles.messageInput, { flex: 3 }]}
            textColor="#fff"
            activeOutlineColor="#646eff"
            outlineStyle={styles.messageInputOutline}
            mode="outlined"/>
        <Button style={styles.sendButton} textColor='#fff' mode="outlined"></Button>
      </View>
    </View>
  )
}

const ProfileDrawer = (props) => {
  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <View style={{ backgroundColor: '#212529', marginBottom: 5, padding: 10, height: 80, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
          <Image style={{ width: 60, height: 60, resizeMode: 'stretch' }} source={ require('../assets/images/defaultAcc.png') }/>
          <Text style={{ marginLeft: 5, fontSize: 16, color: '#fff', fontWeight: '900' }}>Sakyto</Text>
        </View>
        <DrawerItemList {...props}/>
        <View style={{ padding: 5, alignItems: 'flex-start' }}>
          <Button textColor='red' onPress={() => accountChange(null)}>Выйти из аккаунта</Button>
        </View>
      </DrawerContentScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: '#212529',
    alignItems: 'center'
  },
  sendButton: {
    marginTop: 6,
    marginRight: 5,
    borderColor: 'rgba(100, 110, 255, 1)',
    borderWidth: 2,
    borderRadius: 10, 
    borderTopLeftRadius: 0, 
    borderBottomLeftRadius: 0,
  },
  messageInput: {
    marginLeft: 5,
    marginRight: 5,
    backgroundColor: '#212529',
    fontSize: 18
  },
  messageInputOutline: {
    borderWidth: 2,
    borderRadius: 10,
    borderTopRightRadius: 0, 
    borderBottomRightRadius: 0,
  }
})
  
export default MainMenu;