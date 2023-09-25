import { useState, useEffect } from 'react'
import { StyleSheet, View, Image, ScrollView } from 'react-native'
import { Text, TextInput, Button } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer'

import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../app/accountSlice'

import sockets from '../../scripts/sockets'
import requests from '../../scripts/requests'

const LeftDrawer = createDrawerNavigator()
const RightDrawer = createDrawerNavigator()

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
        <View style={{ backgroundColor: '#212529', marginBottom: 5, padding: 10, height: 80, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
          <Image style={{ width: 60, height: 60, resizeMode: 'stretch' }} source={ require('../../assets/images/defaultAcc.png') }/>
          <Text style={{ marginLeft: 5, fontSize: 16, color: '#fff', fontWeight: '700' }}>{nickname}</Text>
        </View>
        <DrawerItemList {...props}/>
        <View style={{ padding: 5, alignItems: 'flex-start' }}>
          <Button textColor='red' onPress={() => logoutAccount()}>Выйти из аккаунта</Button>
        </View>
      </DrawerContentScrollView>
    </View>
  )
}

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
      setMembersList(current => [...current, data])
    })
  }, [])

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <Text style={{ marginTop: 10, color: '#fff', fontSize: 16, fontWeight: '700', alignSelf: 'center' }}>Список участников: {membersList.length}</Text>
        <ScrollView style={{ marginVertical: 10 }}>
          { membersList.map((member, index) => {
            return ( <MemberObj key={index} nickname={member[index]}/> )
          }) }
        </ScrollView>
      </DrawerContentScrollView>
    </View>
  )
}

const MainMenu = () => {
  return (
    <MembersDrawer/>
  )
}

const ChatMenu = () => {
  const [messagesList, setMessagesList] = useState([])
  const [messageInput, setMessageInput] = useState('')

  const accountID = useSelector((state) => state.auth.account.id)

  function addMessage(message) {
    setMessagesList(current => [...current, message])
  }

  function sendMessage() {
    if (accountID && messageInput) {
      sockets.GetSingleton().emit('chatMessage', { "id": accountID, "message": messageInput })
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

const MessageObj = ({ message }) => {
  return (
    <View style={styles.message}>
      <Image style={styles.messageAvatar} source={ require('../../assets/images/defaultAcc.png') }/>
      <View style={styles.messageContent}>
        <Text style={{ color: 'white', fontWeight: '700' }}>{message.nickname}</Text>
        <Text style={{ color: 'white' }}>{message.message}</Text>
        <Text style={{ color: 'gray' }}>{message.sendDate}</Text>
      </View>
    </View>
  )
}

const MemberObj = ({ nickname }) => {
  return (
    <View style={styles.member}>
      <Image style={styles.memberAvatar} source={ require('../../assets/images/defaultAcc.png') }/>
      <Text style={{ fontSize: 16, color: '#fff', fontWeight: '700' }}>{nickname}</Text>
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
  },
  member: {
    backgroundColor: '#212529', 
    borderRadius: 10, 
    marginHorizontal: 10, 
    marginTop: 5, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'flex-start'
  },
  memberAvatar: {
    width: 40, 
    height: 40,
    margin: 5, 
    resizeMode: 'stretch'
  }
})
  
export default MainMenu