import React,{useContext,useRef,useEffect,useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {UserContext} from '../App'
import M from 'materialize-css'
const NavBar = () => {
    const searchModal = useRef(null)
    const [search,setSearch]=useState('')
    const [searchResults, setSearchResults]=useState([])
    const {state,dispatch} = useContext(UserContext)
    const history = useNavigate()
    useEffect(()=>{
        M.Modal.init(searchModal.current)
    },[])
    const renderList = ()=>{
        if(state){
            return [
                <span key="span1" style={{marginRight:"10px"}}>
                    <li key="search"><i data-target="modal1" className="large material-icons modal-trigger" style={{color:"black"}}>search</i></li>
                    <li key="explore"><Link className='mario-text2' to="/explore">Explore</Link></li>
                    <li key="create"><Link className='mario-text2' to="/create">Create Post</Link></li>
                    <li key="profile"><Link className='mario-text2' to="/profile">Profile</Link></li>
                    <li key="logout">
                        <button style={{marginBottom:"7px"}} className="btn grey darken-3 mario-text2" type="submit" name="action"
                        onClick={()=>{
                            localStorage.clear()
                            dispatch({type:"CLEAR"})
                            history('/signin')
                        }}
                        >
                            Logout
                        </button>
                    </li>
                </span>
                
            ]
        }else{
            return [
                <span key="span2" style={{marginRight:"10px"}}>
                    <li key="signin"><Link className='mario-text2' to="/signin">Signin</Link></li>
                    <li key="signup"><Link className='mario-text2' to="/signup">Signup</Link></li>
                </span>
            ]

        }
    }
    const fetchUsers =(query)=>{
        setSearch(query)
        fetch('/search-users',{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                query
            })
        }).then(res=>res.json())
        .then(results=>{
            setSearchResults(results.user)
        })
    }
    return(    
        <nav className="red">
            <div className="nav-wrapper">
                <Link to={state?"/":"/signin"} style={{marginLeft:"10px"}} className="mario-text2 left">MarioPic</Link>
                <ul key="nav" id="nav-mobile" className="right">
                    {renderList()}
                </ul>
            </div>
            <div id="modal1" className="modal" ref={searchModal}>
                <div className="modal-content">
                    <input className='mario-text2'
                    type="text"
                    placeholder="search users"
                    value={search}
                    onChange={(e)=>fetchUsers(e.target.value)}
                    />
                    <ul className="collection">
                        {searchResults.map(item=>{
                            return <Link to={state && item._id!=state._id?"/profile/"+item._id:"/profile"}
                                onClick={()=>{M.Modal.getInstance(searchModal.current).close()
                                setSearch('')
                            }}><li className="collection-item">{item.name}</li></Link>
                        })}
                    </ul>
                </div>
                <div className="modal-footer">
                <button className="mario-text3 modal-close waves-effect waves-green btn-flat"
                onClick={()=>setSearch('')}>close</button>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;