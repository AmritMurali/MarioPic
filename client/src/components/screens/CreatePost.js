import React, {useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import M from 'materialize-css'

const CreatePost = ()=>{
    const history = useNavigate()
    const [title,setTitle] = useState("");
    const [body,setBody] = useState("");
    const [image,setImage] = useState("");
    const [url,setUrl] = useState("");
    const uploadImage = ()=>{
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

    const postDetails = () =>{
        fetch("/createpost",{
            method:"post",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                title,
                body,
                pic:url
            })
        }).then(res=>res.json())
        .then(data=>{
            if(data.error){
                M.toast({html: data.error, classes:"#c62828 red darken-3"})
            } else {
                M.toast({html: "created post successfully", classes:"#43a047 green darken-1"})
                history('/')
            }
        }).catch(err=>{
            console.log(err)
        })
    }
    useEffect(() => {
        if (url) {
          postDetails();
        }
      }, [url]); 
      
    return(
        <div className="card input-filed"
        style={{
            margin:"30px auto",
            maxWidth:"500px",
            padding:"20px",
            textAlign:"center"
        }}
        >
            <input className="mario-text3" type="text" placeholder="title" 
            value={title}
            onChange={(e)=>setTitle(e.target.value)}
            />
            <input className="mario-text3" type="text" placeholder="body" 
            value={body}
            onChange={(e)=>setBody(e.target.value)}
            />
            <div className="file-field input-field">
                <div className="btn #64b5f6 red darken-1">
                    <span className="mario-text3">Upload Image</span>
                    <input type="file" onChange={(e)=>setImage(e.target.files[0])}/>
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text"/>
                </div>
            </div>
            <button className="mario-text3 btn waves-effect waves-light #64b5f6 red darken-1" type="submit" name="action"
            onClick={()=>uploadImage()}
            >
                Submit post
            </button>

        </div>
    )
}

export default CreatePost