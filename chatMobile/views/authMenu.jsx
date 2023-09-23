import { useState } from 'react';
import { StatusBar, StyleSheet, View, Image, ToastAndroid } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';

import sockets from '../scripts/sockets'
import requests from '../scripts/requests'

const AuthMenu = ({ setAccount }) => {
  const [authForm, setForm] = useState({});
  const [isRegMode, switchRegMode] = useState(false);
  const [authDisabled, disableAuth] = useState(false);

  function handleFormChange(text, name) {
    setForm({
      ...authForm,
      [name]: text
    })
  }

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />

      <View style={{ width: '100%', height: '100%', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-around' }}>
        <View style={{ alignItems: 'center' }}>
          <Image style={{ width: 125, height: 125, resizeMode: 'stretch' }} source={ require('../assets/images/logo.png') }/>
          <Text style={{ color: '#fff', fontSize: 36, fontWeight: '900', paddingTop: 20 }}>КЛОWNS</Text>
        </View>

        <View style={{ width: '80%' }}>
          { isRegMode ? (
            <TextInput
              style={[styles.input, {marginBottom: 5}]}
              label="Почта"
              textColor="#fff"
              activeOutlineColor="#646eff"
              outlineStyle={styles.inputOutline}
              mode="outlined"
              onChangeText={(e) => handleFormChange(e, "email")}/>
          ) : null}

          <TextInput
            style={styles.input}
            label="Никнейм"
            textColor="#fff"
            activeOutlineColor="#646eff"
            outlineStyle={styles.inputOutline}
            mode="outlined"
            onChangeText={(e) => handleFormChange(e, "nickname")}/>

          <TextInput
            style={[styles.input, {marginTop: 5}]}
            label="Пароль"
            textColor="#fff"
            activeOutlineColor="#646eff"
            outlineStyle={styles.inputOutline}
            mode="outlined"
            secureTextEntry
            onChangeText={(e) => handleFormChange(e, "password")}/>
        </View>

        <View style={{ width: '80%', flexDirection: 'column' }}>
          <Button 
            buttonColor={ authDisabled ? 'rgba(100, 110, 255, 0.5)' : 'rgba(100, 110, 255, 1)' }
            mode="contained"
            onPress={() => authToAccount()}
            loading={authDisabled}>
            { isRegMode ? 'Зарегистрироваться' : 'Войти' }
          </Button>

          <Button
            style={{ marginTop: 10 }}
            textColor="#fff"
            mode="outlined"
            onPress={() => switchRegMode(!isRegMode)}>
            { isRegMode ? 'Уже есть аккаунт?' : 'Регистрация' }
          </Button>
        </View>
      </View>
    </View>
  );

  async function getAccountInfo() {
    const result = await requests.send('getAcc')

    if (result.code == 'success') {
      sockets.GetSingleton().emit('authUpdate', { "id": result.account.id })

      setAccount(result.account)
    }
  }

  async function authToAccount() {
    if (authDisabled) return;

    if (isRegMode && !authForm.email) {
      ToastAndroid.show('Введите почту', ToastAndroid.SHORT);
      return;
    }

    if (!authForm.nickname) {
      ToastAndroid.show('Введите никнейм', ToastAndroid.SHORT);
      return;
    }

    if (!authForm.password) {
      ToastAndroid.show('Введите пароль', ToastAndroid.SHORT);
      return;
    }

    disableAuth(true);

    if (!isRegMode) {
      const result = await requests.sendForm('accLogin', authForm)

      if (result.code == 'success') {
        getAccountInfo()
      } 
      else if (result.code == 'failure') {
        ToastAndroid.show('Неверные данные', ToastAndroid.SHORT);
      }
    } 
    else {
      const result = await requests.sendForm('accReg', authForm)

      if (result.code == 'success') {
        getAccountInfo()
      } 
      else if (result.code == 'failure') {
        ToastAndroid.show('Ошибка регистрации', ToastAndroid.SHORT)
      }
    }

    disableAuth(false);
  }
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: '#212529',
    alignItems: 'center'
  },
  input: {
    backgroundColor: '#212529',
  },
  inputOutline: {
    borderWidth: 2,
    borderRadius: 10
  }
})

export default AuthMenu;
