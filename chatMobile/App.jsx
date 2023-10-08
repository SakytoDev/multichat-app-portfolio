import { useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import { Provider } from 'react-redux'
import store from './src/redux/store'

import AuthMenu from './src/pages/authMenu'
import MainMenu from './src/pages/mainMenu'

import sockets from './api/sockets'

const MainStack = createStackNavigator()

export default function App() {
  useEffect(() => {
    sockets.InitSocket()
  }, [])

  return (
    <Provider store={store}>
      <NavigationContainer>
        <MainStack.Navigator screenOptions={{ headerShown: false, presentation: 'transparentModal' }}>
          <MainStack.Screen name="AuthMenu" component={AuthMenu}/>
          <MainStack.Screen name="MainMenu" component={MainMenu}/>
        </MainStack.Navigator>
      </NavigationContainer>
    </Provider>
  )
}