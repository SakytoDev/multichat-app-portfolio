import { View, Image, StyleSheet } from 'react-native'
import { Text } from 'react-native-paper'

const MessageObj = ({ message }) => {
    return (
      <View style={styles.container}>
        <Image style={styles.avatar} source={ require('../../assets/images/defaultAcc.png') }/>
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
    padding: 7,
    borderBottomWidth: 1,
    borderColor: 'gray',
    flexDirection: 'row',
    alignItems: 'center'
  },
  avatar: {
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
})

export default MessageObj;