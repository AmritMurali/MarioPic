import React,{useEffect,useState, useContext} from 'react'
import {UserContext} from '../../App'
import {useParams} from 'react-router-dom'

const UserProfile = ()=>{
    const [userProfile,setProfile]=useState(null)
    const [showFollow,setShowFollow] = useState(true)
    const {state,dispatch} = useContext(UserContext)
    const {userid} = useParams()
    useEffect(()=>{
        fetch(`/user/${userid}`,{
            method:"put",
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            if(state && result.user.followers.includes(state._id)){
                setShowFollow(false)
            }
            setProfile(result)
        })
    },[userid])
    const followUser = ()=>{
        fetch('/follow',{
            method:"put",
            headers:{
                "Content-Type": "application/json",
                "Authorization": "Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                followId:userid
            })
        }).then(res=>res.json())
        .then(data=>{
            dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
            localStorage.setItem("user", JSON.stringify(data))
            setProfile((prevState)=>{
                return {
                    ...prevState,
                    user:{
                        ...prevState.user,
                        followers:[...prevState.user.followers,data._id]
                    }
                }
            })
            setShowFollow(false)
        })
    }
    const unfollowUser = ()=>{
        fetch('/unfollow',{
            method:"put",
            headers:{
                "Content-Type": "application/json",
                "Authorization": "Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                unfollowId:userid
            })
        }).then(res=>res.json())
        .then(data=>{
            dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
            localStorage.setItem("user", JSON.stringify(data))
            setProfile((prevState)=>{
                const newFollower = prevState.user.followers.filter(item=>item!=data._id)
                return {
                    ...prevState,
                    user:{
                        ...prevState.user,
                        followers:newFollower
                    }
                }
            })
            setShowFollow(true)

        })
    }

    return (
        <>
        {userProfile?
                <div className="mario-text3" style={{maxWidth:"550px", margin: "0px auto"}}>
                <div style={{
                    display:"flex",
                    justifyContent:"space-around",
                    margin:"18px 0px",
                    borderBottom: "1px solid gray"
                }}>
                    <div>
                        <img style={{width:"160px",height:"160px",borderRadius:"80px"}}
                        src={userProfile.user.pic}
                        />
                    </div>
                    <div>
                        <h4>{userProfile.user.name}</h4>
                        <h5>{userProfile.user.email}</h5>
                        <div style={{display:"flex",width:"108%"}}>
                            <h6 style={{marginRight:"10px"}}>{userProfile.posts.length}{userProfile.posts.length == 1?" post":" posts"}</h6>
                            <h6 style={{marginRight:"10px"}}>{userProfile.user.followers.length}{userProfile.user.followers.length == 1?" follower":" followers"}</h6>
                            <h6>{userProfile.user.following.length}{" following"}</h6>
                        </div>
                        {showFollow?
                        <button style={{margin:"10px"}} className="btn waves-effect waves-light #64b5f6 red darken-1 mario-text3" type="submit" name="action"
                        onClick={()=>followUser()}
                        >
                            Follow
                        </button>
                        :
                        <button style={{margin:"10px"}} className="btn waves-effect waves-light #64b5f6 red darken-1 mario-text3" type="submit" name="action"
                        onClick={()=>unfollowUser()}
                        >
                            Unfollow
                        </button>
                        }
                        
                    </div>
                </div>
    
                <div className="gallery">
                    {                    
                        userProfile.posts.map(item=>{
                            return(
                                <img key={item._id} className="item" src={item.photo} alt={item.title}/>
                            )
                        })
                            
                    }
    
                </div>
            </div>
        :<h2 className="mario-text3">loading ..</h2>}

        </>
    )
}

export default UserProfile