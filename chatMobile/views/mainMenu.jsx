import { useState, useEffect } from 'react'
import { StyleSheet, View, Image, ScrollView } from 'react-native'
import { Text, TextInput, Button } from 'react-native-paper'
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer'
import { NavigationContainer } from '@react-navigation/native'

import sockets from '../scripts/sockets'
import requests from '../scripts/requests'

const Drawer = createDrawerNavigator()

const MainMenu = ({ account, setAccount }) => {
  return (
    <NavigationContainer>
      <Drawer.Navigator 
      screenOptions={{ headerStyle: { backgroundColor: '#313538' }, drawerStyle: { backgroundColor: '#313538' }, drawerType: 'back', headerTintColor: '#fff'}} 
      initialRouteName="Чат"
      drawerContent={(props) => <ProfileDrawer {...props} account={account} setAccount={setAccount}/> }
      >
        <Drawer.Screen name="Чат" component={ChatMenu} initialParams={{acc: account}}/>
      </Drawer.Navigator>
    </NavigationContainer>
  )
}

const ChatMenu = ({ route }) => {
  const [messagesList, setMessagesList] = useState([])
  const [messageInput, setMessageInput] = useState('')

  function addMessage(message) {
    setMessagesList(current => [...current, message])
  }

  function sendMessage() {
    if ((route.params.acc && route.params.acc != null) && messageInput) {
      sockets.GetSingleton().emit('chatMessage', { "id": route.params.acc.id, "message": messageInput })
      setMessageInput('')
    }
  }

  useEffect(() => {
    sockets.GetSingleton().on('chatMessage', function(data) {
      addMessage(data)
    })
  }, [])

  return (
    <View style={styles.container}>
      <ScrollView style={{ width: '100%', marginVertical: 5 }}>
        { messagesList.map((message, index) => {
          return ( <MessageObj key={index} message={message}/> )
        }) }
      </ScrollView>
      <View style={{ paddingBottom: 10, flexDirection: 'row', alignItems: 'stretch' }}>
        <TextInput
            style={[styles.messageInput, { flex: 3 }]}
            textColor="#fff"
            activeOutlineColor="#646eff"
            outlineStyle={styles.messageInputOutline}
            mode="outlined"
            onChangeText={messageInput => setMessageInput(messageInput)}
            value={messageInput}/>
        <Button style={styles.sendButton} textColor='#fff' mode="outlined" onPress={() => sendMessage()}></Button>
      </View>
    </View>
  )
}

const ProfileDrawer = (props) => {
  let [nickname, setNickname] = useState('')

  useEffect(() => {
    async function getNickname() {
      const result = await requests.send('getNickname')
      setNickname(result.nickname)
    }
    getNickname()
  }, [])

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <View style={{ backgroundColor: '#212529', marginBottom: 5, padding: 10, height: 80, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
          <Image style={{ width: 60, height: 60, resizeMode: 'stretch' }} source={ require('../assets/images/defaultAcc.png') }/>
          <Text style={{ marginLeft: 5, fontSize: 16, color: '#fff', fontWeight: '700' }}>{nickname}</Text>
        </View>
        <DrawerItemList {...props}/>
        <View style={{ padding: 5, alignItems: 'flex-start' }}>
          <Button textColor='red' onPress={() => props.setAccount(null)}>Выйти из аккаунта</Button>
        </View>
      </DrawerContentScrollView>
    </View>
  )
}

const MessageObj = ({message}) => {
  return (
    <View style={styles.message}>
      <Image style={styles.messageAvatar} source={ require('../assets/images/defaultAcc.png') }/>
      <View style={styles.messageContent}>
        <Text style={{ color: 'white', fontWeight: '700' }}>{message.nickname}</Text>
        <Text style={{ color: 'white' }}>{message.message}</Text>
        <Text style={{ color: 'gray' }}>{message.sendDate}</Text>
      </View>
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
  message: {
    padding: 7,
    borderBottomWidth: 1,
    borderColor: 'gray',
    flexDirection: 'row',
    alignItems: 'center'
  },
  messageAvatar: {
    marginLeft: 5,
    width: 60,
    height: 60,
    resizeMode: 'stretch'
  },
  messageContent: {
    marginHorizontal: 10, 
    flex: 1, 
    flexDirection: 'column', 
    gap: 3
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
  
export default MainMenu