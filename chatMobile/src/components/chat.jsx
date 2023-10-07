import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { View, Image, ScrollView, StyleSheet } from 'react-native';
import { TextInput } from 'react-native-paper';
import { Button } from 'react-native-paper';

import sockets from '../../api/sockets';

import MessageObj from '../components/message';

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
          <Button style={styles.sendButton} textColor='#fff' mode="outlined" onPress={() => sendMessage()}>
            <Image style={{ width: 10, height: 10 }} source={ require('../../assets/images/send.png') }/>
          </Button>
        </View>
      </View>
    )
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: '#000',
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
    backgroundColor: '#000',
    fontSize: 18
  },
  messageInputOutline: {
    borderWidth: 2,
    borderRadius: 10,
    borderTopRightRadius: 0, 
    borderBottomRightRadius: 0,
  }
})

export default ChatMenu;