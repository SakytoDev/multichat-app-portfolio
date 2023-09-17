import { useState, useEffect } from 'react'

import AuthMenu from './views/authMenu'
import MainMenu from './views/mainMenu'

import sockets from './scripts/sockets'

export default function App() {
  const [account, setAccount] = useState(null)

  useEffect(() => {
    sockets.InitSocket()
  }, [])

  return (
    account == null ? <AuthMenu setAccount={setAccount}/> : <MainMenu account={account} setAccount={setAccount}/>
  )
}