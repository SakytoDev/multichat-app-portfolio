import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import AuthMenu from './views/authMenu'
import MainMenu from './views/mainMenu'

import sockets from './scripts/sockets'

const MainStack = createStackNavigator()

export default function App() {
  const [account, setAccount] = useState(null)

  useEffect(() => {
    sockets.InitSocket()
  }, [])

  return (
      <NavigationContainer>
        <MainStack.Navigator screenOptions={{ headerShown: false, presentation: 'transparentModal' }}>
          <MainStack.Screen name="AuthMenu" component={AuthMenu}/>
          <MainStack.Screen name="MainMenu" component={MainMenu}/>
        </MainStack.Navigator>
      </NavigationContainer>
  )
}