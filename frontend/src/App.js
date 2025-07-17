"use client"

import { useState, useEffect } from "react"
import LoginPage from "./components/LoginPage"
import RegisterPage from "./components/RegisterPage"
import BoardPage from "./components/BoardPage"
import "./App.css"

function App() {
  const [currentPage, setCurrentPage] = useState("login")
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)

  useEffect(() => {
    // Check for existing token on app load
    const savedToken = localStorage.getItem("token")
    const savedUser = localStorage.getItem("user")

    if (savedToken && savedUser) {
      setToken(savedToken)
      setUser(JSON.parse(savedUser))
      setCurrentPage("board")
    }
  }, [])

  const handleLogin = (userData, authToken) => {
    setUser(userData)
    setToken(authToken)
    localStorage.setItem("token", authToken)
    localStorage.setItem("user", JSON.stringify(userData))
    setCurrentPage("board")
  }

  const handleLogout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setCurrentPage("login")
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "login":
        return <LoginPage onLogin={handleLogin} onSwitchToRegister={() => setCurrentPage("register")} />
      case "register":
        return <RegisterPage onRegister={handleLogin} onSwitchToLogin={() => setCurrentPage("login")} />
      case "board":
        return <BoardPage user={user} token={token} onLogout={handleLogout} />
      default:
        return <LoginPage onLogin={handleLogin} />
    }
  }

  return <div className="App">{renderCurrentPage()}</div>
}

export default App
