import React,{useEffect,createContext,useReducer,useContext} from 'react'
import NavBar from './components/Navbar'
import "./App.css"
import {BrowserRouter, Route, Routes, useNavigate} from 'react-router-dom'
import Explore from './components/screens/Explore'
import Signin from './components/screens/SignIn'
import Profile from './components/screens/Profile'
import Signup from './components/screens/Signup'
import CreatePost from './components/screens/CreatePost'
import UserProfile from './components/screens/UserProfile'
import Home from './components/screens/Home'
import {reducer, initialState} from './reducers/userReducer'

export const UserContext = createContext()

const Routing = ()=>{
  const {state,dispatch} = useContext(UserContext)
  const history = useNavigate()
  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("user"))
    if(user){
      dispatch({type:"USER",payload:user})
    } else{
      history('/signin')
    }
  },[])
  return(
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/explore" element={<Explore />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/create" element={<CreatePost />} />
      <Route path="/profile/:userid" element={<UserProfile />} />
    </Routes>
  )
}

const Footer = ()=>{
  return (
    <footer className="footer mario-text3">
      <div className="footer-content">
        <p>© 2024 by Amrit Murali</p>
        <div className="social-links">
          <a href="https://github.com/AmritMurali" target="_blank" rel="noopener noreferrer">GitHub</a>
          <span> | </span>
          <a href="https://www.linkedin.com/in/amrit-murali/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        </div>
      </div>
    </footer>
  )
}

function App() {
  const [state, dispatch] = useReducer(reducer,initialState)
  return (
    <UserContext.Provider value={{state,dispatch}}>
      <BrowserRouter>
        <NavBar />
        <Routing />
        <Footer />
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
