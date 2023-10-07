import { View, Image, StyleSheet } from 'react-native'
import { Text } from 'react-native-paper'

const MemberObj = ({ nickname }) => {
    return (
      <View style={styles.container}>
        <Image style={styles.avatar} source={ require('../../assets/images/defaultAcc.png') }/>
        <Text style={styles.nickname}>{nickname}</Text>
      </View>
    )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#212529', 
    borderRadius: 10, 
    marginHorizontal: 10, 
    marginTop: 5, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'flex-start'
  },
  avatar: {
    width: 40, 
    height: 40,
    margin: 5, 
    resizeMode: 'stretch'
  },
  nickname: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 700
  }
})

export default MemberObj;