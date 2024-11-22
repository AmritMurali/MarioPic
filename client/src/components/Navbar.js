import React,{useContext} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {UserContext} from '../App'

const NavBar = () => {
    const {state,dispatch} = useContext(UserContext)
    const history = useNavigate()
    const renderList = ()=>{
        if(state){
            return [
                <span key="span1" style={{marginRight:"10px"}}>
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
    return(    
        <nav className="red">
            <div className="nav-wrapper">
                <Link to={state?"/":"/signin"} style={{marginLeft:"10px"}} className="mario-text2 left">MarioPic</Link>
                <ul key="nav" id="nav-mobile" className="right">
                    {renderList()}
                </ul>
            </div>
        </nav>
    );
};

export default NavBar;