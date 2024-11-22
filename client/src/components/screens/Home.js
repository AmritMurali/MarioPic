import React,{useState, useEffect,useContext} from 'react'
import {UserContext} from '../../App'
import {Link} from 'react-router-dom'
import mushroomImage from '../../assets/mushroom.webp'
import goombaImage from '../../assets/goomba.webp'
import shellImage from '../../assets/shell.webp'

const Home = ()=>{
    const [data,setData] = useState([])
    const {state,dispatch}=useContext(UserContext)
    useEffect(()=>{
        fetch('/allsubpost',{
            headers:{
                "Authorization":"Bearer " + localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            setData(result.posts)
        })
    },[])
    const likePost=(id)=>{
        fetch('/like',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId:id
            })
        }).then(res=>res.json())
        .then(result=>{
            //console.log(result)
            const newData=data.map(item=>{
                if(item._id==result._id){
                    return result
                }else{
                    return item
                }
            })
            setData(newData)
        }).catch(err=>{
            console.log(err)
        })
    }
    const unlikePost=(id)=>{
        fetch('/unlike',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId:id
            })
        }).then(res=>res.json())
        .then(result=>{
            //console.log(result)
            const newData=data.map(item=>{
                if(item._id==result._id){
                    return result
                }else{
                    return item
                }
            })
            setData(newData)
        }).catch(err=>{
            console.log(err)
        })
    }

    const makeComment=(text,postId)=>{
        fetch('/comment',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt") 
            },
            body:JSON.stringify({
                postId,
                text
            })
        }).then(res=>res.json())
        .then(result=>{
            console.log(result)
            const newData=data.map(item=>{
                if(item._id==result._id){
                    return result
                }else{
                    return item
                }
            })
            setData(newData)
        }).catch(err=>{
            console.log(err)
        })
    }
    const deletePost =(postid)=>{
        fetch(`/deletepost/${postid}`,{
            method:"delete",
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            console.log(result)
            const newData = data.filter(item=>{
                return item._id !== result._id
            })
            setData(newData)
        })
    }
    const deleteComment=(postId, commentId)=>{
        fetch('/deletecomment',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId,
                commentId
            })
        }).then(res=>res.json())
        .then(result=>{
            console.log(result)
            const newData=data.map(item=>{
                if(item._id==result._id){
                    return result
                }else{
                    return item
                }
            })
            setData(newData)
        }).catch(err=>{
            console.log(err)
        })
    }
    return (
        data.length != 0?
        <div className="mario-text3 home">
            {
                data.map(item=>{
                    return(
                        <div className="card home-card" key={item._id}>
                            <h5><span style={{marginLeft:"10px"}}>
                                    <Link to={item.postedBy._id!==state._id ?"/profile/"+item.postedBy._id:"/profile"}>
                                        <img className="postpic" src={item.postedBy.pic}/>
                                        <span style={{marginLeft:"50px"}}>{item.postedBy.name}</span>
                                    </Link>
                                </span>{item.postedBy._id==state._id 
                                && <i className="material-icons" style={{
                                    float:"right"
                                }}
                                onClick={()=>deletePost(item._id)}
                                >delete</i>}</h5>
                            <div className="card-image">
                                <img src={item.photo}/>
                            </div>
                            <div className="card-content">
                                {item.likes.includes(state._id)
                                ? <div className="whole-icon">
                                <img src={goombaImage} onClick={()=>{unlikePost(item._id)}} alt="Mushroom Icon" className="goomba" />
                            </div>
                                :
                                <div className="whole-icon">
                                    <img src={mushroomImage} onClick={()=>{likePost(item._id)}} alt="Mushroom Icon" className="mushroom" />
                                </div>
                                }
                                <h6 style={{margin:"2px"}}>{item.likes.length}{item.likes.length==1?" like":" likes"}</h6>
                                <h5 style={{margin:"2px"}}>{item.title}</h5>
                                <p>{item.body}</p>
                                {
                                    item.comments.map(record=>{
                                        return(
                                            <h6 key={record._id} style={{position:"relative"}}>
                                                <img className="commentpic" src={record.postedBy.pic}/>
                                                <span style={{marginLeft:"25px"}}>{record.postedBy.name}{" "}
                                                <span className="comment-text">{record.text}</span></span>
                                                {record.postedBy._id==state._id && 
                                                <div style={{float:"right",height:"20px",position:"relative",top:"-8px"}}>
                                                    <img src={shellImage} onClick={()=>{deleteComment(item._id,record._id)}} alt="Shell Icon" className="shell" />
                                                </div>
                                                }
                                            </h6>
                                        )
                                    })
                                }
                                <form onSubmit={(e)=>{
                                    e.preventDefault()
                                    makeComment(e.target[0].value,item._id)
                                }}>
                                    <input className="mario-text3" type="text" placeholder="add a comment" />
                                </form>                            
                            </div>
                        </div>
                    )
                })
            }
        </div>
        :
        <h5 className="mario-text2" style={{textAlign:"center"}}>Looks like you're not following anyone, why not check out Mario?</h5>
    )
}

export default Home