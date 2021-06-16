import React,{useRef,useEffect,useState} from "react";
import { useHistory } from "react-router-dom";
import {ChatEngine} from 'react-chat-engine';
import { auth } from "../firebase";

import {useAuth} from '../contexts/AuthContext';
import axios from "axios";

const Chats = () => {

    const history = useHistory();
    const {user}= useAuth();
    const[loading,setLoading]=useState(true);

    const getFile =async (url) =>{
        const response = await fetch(url);
        const data =await response.blob();

        return new File([data],"userPhoto.jpg",{type:"image/jpeg"})
    }
    
  useEffect(()=>{
    if(!user){
        history.push('/')
        return;
    }
    axios.get('https://api.chatengine.io/users/me',{
        headers:{
            "project-id":"enter your proj id",
            "user-name":user.email,
            "user-secret":user.uid
        }
    })
    .then(()=>{
       setLoading(false);
    })
    .catch(()=>{
        let formdata=new FormData();
        formdata.append('email',user.email);
        formdata.append('username',user.email);
        formdata.append('secret',user.uid);

        getFile(user.photoURL)
        .then((avatar)=>{
            formdata.append('avatar',avatar,avatar.name)

            axios.post('https://api.chatengine.io/users/',
            formdata,
            {headers:{"private-key":"enter your private key"}}
            ).then(()=>setLoading(false))
            .catch(error => console.log(error))
        })
    })
  },[user,history])

    const LogoutHandler =async()=>{
       await auth.signOut();
        history.push('/');
    }

    if(!user || loading) return 'Loading ...';

  return (
    <div className="chat-page">
      <div className="nav-bar">
        <div className="logo-tab">UEassyMessage</div>
        <div className="logout-tab" onClick={LogoutHandler}>Logout</div>
      </div>
    <ChatEngine
        height="calc(100vh-66px)"
        projectID= 'Enter your proj id'
        userName={user.email}
        userScret={user.uid}
    />
    </div>
  );
};

export default Chats;
