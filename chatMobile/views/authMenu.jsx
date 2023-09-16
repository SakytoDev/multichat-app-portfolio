import { useState } from 'react';
import { StatusBar, StyleSheet, View, Image, ToastAndroid } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import axios from 'axios';

const AuthMenu = ({ setAccount }) => {
  const [loginText, setLoginText] = useState('');
  const [emailText, setEmailText] = useState('');
  const [passText, setPassText] = useState('');

  const [isRegMode, switchRegMode] = useState(false);

  const [authDisabled, disableAuth] = useState(false);

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />

      <View style={{ width: '100%', height: '100%', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-around' }}>
        <View style={{ alignItems: 'center' }}>
          <Image style={{ width: 125, height: 125, resizeMode: 'stretch' }} source={ require('../assets/logo.png') }/>
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
              onChangeText={emailText => setEmailText(emailText)}
              value={emailText}/>
          ) : null}

          <TextInput
            style={styles.input}
            label="Логин"
            textColor="#fff"
            activeOutlineColor="#646eff"
            outlineStyle={styles.inputOutline}
            mode="outlined"
            onChangeText={loginText => setLoginText(loginText)}
            value={loginText}/>

          <TextInput
            style={[styles.input, {marginTop: 5}]}
            label="Пароль"
            textColor="#fff"
            activeOutlineColor="#646eff"
            outlineStyle={styles.inputOutline}
            mode="outlined"
            secureTextEntry
            onChangeText={passText => setPassText(passText)}
            value={passText}/>
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
    await axios({
      url: 'https://192.168.10.8:3000/request',
      method: 'GET',
      params: {
        type: 'getAcc'
      },
    }).then(res => {
      if (res.data.code == 'success') {
        setAccount(res.data.account)
      }
    }).catch(err => {
      console.log(err)
    })
  }

  async function authToAccount() {
    if (authDisabled) return;

    if (isRegMode && !emailText) {
      ToastAndroid.show('Введите почту', ToastAndroid.SHORT);
      return;
    }

    if (!loginText) {
      ToastAndroid.show('Введите логин', ToastAndroid.SHORT);
      return;
    }

    if (!passText) {
      ToastAndroid.show('Введите пароль', ToastAndroid.SHORT);
      return;
    }

    disableAuth(true);

    if (!isRegMode) {
      let formLogin = [
        {name: 'nickname', value: loginText},
        {name: 'password', value: passText}
      ];

      await axios({
        url: 'https://192.168.10.8:3000/request',
        method: 'GET',
        params: {
          type: 'accLogin',
          form: formLogin,
        },
      }).then(res => {
        if (res.data.code == 'success') {
          getAccountInfo()
        } 
        else if (res.data.code == 'failure') {
          ToastAndroid.show('Неверные данные', ToastAndroid.SHORT);
        }
      }).catch(err => {
        console.log(err)
      });
    } 
    else {
      let formReg = [
        {name: 'email', value: emailText},
        {name: 'nickname', value: loginText},
        {name: 'password', value: passText},
      ];

      await axios({
        url: 'https://192.168.10.8:3000/request',
        method: 'GET',
        params: {
          type: 'accReg',
          form: formReg,
        },
      }).then(function(res) {
        if (res.data.code == 'success') {
          getAccountInfo()
        } 
        else if (res.data.code == 'failure') {
          ToastAndroid.show('Ошибка регистрации', ToastAndroid.SHORT);
        }
      }).catch(err => {
        console.log(err)
      });
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
