import React,{useState,useEffect} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import M from 'materialize-css'

const Signup = ()=>{
    const history = useNavigate()
    const [name,setName] = useState("")
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const [image,setImage] = useState("")
    const [url,setUrl] = useState("")
    useEffect(()=>{
        if(url){
            uploadFields()
        }
    },[url])
    const uploadPic = ()=>{
        const data = new FormData()
        data.append("file",image)
        data.append("upload_preset", "insta-clone")
        data.append("cloud_name", "df1tnm857")
        fetch("https://api.cloudinary.com/v1_1/df1tnm857/image/upload",{
            method: "post",
            body:data
        })
        .then(res=>res.json())
        .then(data=>{
            setUrl(data.url)
        })
        .catch(err=>{
            console.log(err)
        })
    }
    const uploadFields = ()=>{
        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
            M.toast({html: "invalid email", classes:"#c62828 red darken-3"})
            return
        }
        fetch("/signup",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                name,
                password,
                email,
                pic:url
            })
        }).then(res=>res.json())
        .then(data=>{
            if(data.error){
                M.toast({html: data.error, classes:"#c62828 red darken-3"})
            } else {
                M.toast({html: data.message, classes:"#43a047 green darken-1"})
                history('/signin')
            }
        }).catch(err=>{
            console.log(err)
        })
    }
    const PostData = ()=>{
        if(image){
            uploadPic()
        } else{
            uploadFields()
        }
        
    }

    return (
        <div className="mycard">
            <div className="card auth-card input-field">
                <h2 className='mario-text title'>MarioPic</h2>
                <input className='mario-text2'
                type="text"
                placeholder="name"
                value={name}
                onChange={(e)=>setName(e.target.value)}
                />
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
                <div className="file-field input-field">
                    <div className="btn #64b5f6 red darken-1">
                        <span className="mario-text3">Upload Pic</span>
                        <input type="file" onChange={(e)=>setImage(e.target.files[0])}/>
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text"/>
                    </div>
                </div>
                <button className="btn waves-effect waves-light #64b5f6 red darken-1 mario-text2" type="submit" name="action"
                onClick={()=>PostData()}
                >
                    Sign Up
                </button>
                <h5>
                    <Link className="mario-text2" to="/signin">Already have an account?</Link>
                </h5>
            </div>
        </div>
    )
}

export default Signup