import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { View, Image, ScrollView, StyleSheet, Pressable } from 'react-native';
import { TextInput, Button } from 'react-native-paper';

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
        <ScrollView style={{ width: '100%', marginBottom: 5 }}>
          { messagesList.map((message, index) => {
            return ( <MessageObj key={index} message={message}/> )
          }) }
        </ScrollView>
        <View style={styles.inputContainer}>
          <TextInput
              style={[styles.messageInput, { flex: 3 }]}
              textColor="#fff"
              activeOutlineColor="#cfcfcf"
              outlineStyle={styles.messageInputOutline}
              mode="outlined"
              onChangeText={messageInput => setMessageInput(messageInput)}
              value={messageInput}/>
          <Pressable style={styles.sendButton} onPress={() => sendMessage()}>
            <Image style={{ width: 26, height: 26 }} source={ require('../../assets/images/send.png') }/>
          </Pressable>
        </View>
      </View>
    )
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: '#1d2024',
    alignItems: 'center'
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'center',
    paddingTop: 5,
    paddingBottom: 10,
    borderColor: '#8f8f8f',
    borderTopWidth: 2
  },
  messageInput: {
    marginLeft: 5,
    marginRight: 5,
    backgroundColor: 'transparent',
    fontSize: 18
  },
  messageInputOutline: {
    borderWidth: 2,
    borderRadius: 10,
    borderTopRightRadius: 0, 
    borderBottomRightRadius: 0,
  },
  sendButton: {
    marginTop: 6,
    justifyContent: 'center',
    padding: 10,
    borderColor: '#8f8f8f',
    borderWidth: 2,
    borderRadius: 10,
    borderTopLeftRadius: 0, 
    borderBottomLeftRadius: 0,
  }
})

export default ChatMenu;