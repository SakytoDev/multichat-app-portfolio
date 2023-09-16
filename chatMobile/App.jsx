import { useState, useEffect } from 'react'

import AuthMenu from './views/authMenu'
import MainMenu from './views/mainMenu'

import io from 'socket.io-client'

export default function App() {
  const [account, setAccount] = useState(null)

  useEffect(() => {
    const socket = io('https://192.168.10.8:3000')
  }, [])

  return (
    account == null ? <AuthMenu account={account} setAccount={setAccount}/> : <MainMenu/>
  )
}