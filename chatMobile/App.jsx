import AuthMenu from './views/authMenu'
import MainMenu from './views/mainMenu'

export default function App() {
  const [account, setAccount] = useState(null)

  return (
    account == null ? <AuthMenu account={account} setAccount={setAccount}/> : <MainMenu/>
  )
}