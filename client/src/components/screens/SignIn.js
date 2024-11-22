import React,{useState,useContext} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {UserContext} from '../../App'
import M from 'materialize-css'
const SignIn = ()=>{
    const {state,dispatch} = useContext(UserContext)
    const history = useNavigate()
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const PostData = ()=>{
        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
            M.toast({html: "invalid email", classes:"#c62828 red darken-3"})
            return
        }
        fetch("/signin",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                password,
                email
            })
        }).then(res=>res.json())
        .then(data=>{
            if(data.error){
                M.toast({html: data.error, classes:"#c62828 red darken-3"})
            } else {
                localStorage.setItem("jwt",data.token)
                localStorage.setItem("user", JSON.stringify(data.user))
                dispatch({type:"USER",payload:data.user})
                M.toast({html: "signin success", classes:"#43a047 green darken-1"})
                history('/')
            }
        }).catch(err=>{
            console.log(err)
        })
    }
    return (
        <div className="mycard">
            <div className="card auth-card input-field">
            <h2 className='mario-text title'>MarioPic</h2>
            <input className='mario-text2'
                type="text"
                placeholder="email"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                />
                <input className='mario-text2'
                type="password"
                placeholder="password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                />
                <button className="btn waves-effect waves-light #64b5f6 red darken-1 mario-text2" type="submit" name="action"
                onClick={()=>PostData()}
                >
                    Login
                </button>
                <h5>
                    <Link className='mario-text2' to="/signup">Don't have an account?</Link>
                </h5>
            </div>
        </div>

    )
}

export default SignIn