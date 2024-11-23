import React,{useEffect,useState, useContext} from 'react'
import {UserContext} from '../../App'
import { useNavigate } from 'react-router-dom'
import M from 'materialize-css'

const Profile = ()=>{
    const [mypics,setPics]=useState([])
    const {state,dispatch} = useContext(UserContext)
    const [image,setImage] = useState("")
    const history = useNavigate()
    useEffect(()=>{
        fetch('mypost',{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            setPics(result.mypost)
        })
    },[])
    useEffect(()=>{
        if(image){
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
                fetch('/updatepic',{
                    method:"put",
                    headers:{
                        "Content-Type":"application/json",
                        "Authorization":"Bearer "+localStorage.getItem("jwt")
                    },
                    body:JSON.stringify({
                        pic:data.url
                    })
                }).then(res=>res.json())
                .then(result=>{
                    localStorage.setItem("user",JSON.stringify({...state,pic:result.pic}))
                    dispatch({type:"UPDATEPIC",payload:result.pic})
                    M.toast({html: "updated profile pic", classes:"#43a047 green darken-1"})
                })
                // window.location.reload()
            })
            .catch(err=>{
                console.log(err)
            })
        }
    },[image])
    const updatePhoto=(file)=>{
        setImage(file)
    }
    const deleteUser=()=>{
        fetch('/deleteuser',{
            method:"delete",
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(()=>{
            localStorage.clear()
            dispatch({type:"CLEAR"})
            history('/signin')
            M.toast({html: "deleted account", classes:"#43a047 green darken-1"})
        })
    }
    return (
        <div className="mario-text3" style={{maxWidth:"550px", margin: "0px auto"}}>
            <div style={{
                    margin:"18px 0px",
                    borderBottom: "1px solid gray"
                }}>
                <div style={{
                    display:"flex",
                    justifyContent:"space-around"
                }}>
                    <div>
                        <img style={{width:"160px",height:"160px",borderRadius:"80px"}}
                        src={state?state.pic:"empty"}
                        />
                    </div>
                    <div>
                        <h4>{state?state.name:"loading"}</h4>
                        <h5>{state?state.email:"loading"}</h5>
                        <div style={{display:"flex",width:"108%"}}>
                            <h6 style={{marginRight:"10px"}}>{mypics.length}{mypics.length == 1?" post":" posts"}</h6>
                            <h6 style={{marginRight:"10px"}}>{state?state.followers.length:"0"}{state?state.followers.length == 1?" follower":" followers":"loading"}</h6>
                            <h6>{state?state.following.length:"0"} following</h6>
                        </div>
                    </div>
                </div>
                <div className="file-field input-field" style={{ margin: "10px", display: "flex", alignItems: "center" }}>
                    <button style={{marginRight:"10px"}} className="btn waves-effect waves-light #64b5f6 red darken-1 mario-text3" type="submit" name="action"
                    onClick={()=>deleteUser()}>
                        Delete Account
                    </button>
                    <div className="btn #64b5f6 red darken-1" style={{ marginRight: "10px" }}>
                        <span className="mario-text3">Update Pic</span>
                        <input type="file" onChange={(e) => updatePhoto(e.target.files[0])} />
                    </div>
                    <div className="file-path-wrapper" style={{ flexGrow: 1 }}>
                        <input className="file-path validate" type="text" />
                    </div>
                </div>
            </div>
            <div className="gallery">
                {                    
                    mypics.map(item=>{
                        return(
                            <img key={item._id} className="item" src={item.photo} alt={item.title}/>
                        )
                    })
                        
                }

            </div>
        </div>
    )
}

export default Profile