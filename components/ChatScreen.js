import { Avatar, IconButton } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import styled from "styled-components";
import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import {useCollection} from"react-firebase-hooks/firestore";
import {useRouter} from"next/router";
import Message from "./Message";
import { InsertEmoticon } from "@material-ui/icons";
import MicIcon from '@material-ui/icons/Mic';
// import { useState,use_state } from "react";
import firebase from 'firebase';
import { useState } from "react";




function ChatScreen() {
 const [input,setInput]=useState( );
     const [user]=useAuthState(auth);
    const router=useRouter();
   
 
    const [messageSnapsots]=useCollection(db
                                           .collection('chats')
                                           .doc(router.query.id)
                                           .collection('messages')
                                           .orderBy('timestamp','asc')
                                           );
    const ShowMessage =()=>{
     if(messageSnapsots){
         return messageSnapsots.docs.map((message) =>(
             <Message 
             key={message.id}
             user={message.data().user}
             message={{
                ...message.data(),
                timestamp:message.data().timestamp?.toDate().getTime(),

             }}
             />
         ));
     }else{
         return JSON.parse(messages).map((message)=>(<Message  key={message.id} user={message.user} message={message}/>))
     }  
          
    };


    const sendMessage = (e)=>{
       e.preventDefault();
    
      db.collection('users').doc(user.uid).set(
          {lastSeen:firebase.firestore.FieldValue.serverTimestamp(),
           },
          {merge:true}
      );
      db.collection('chats').doc(router.query.id).collection('messages').add
      ({
          timestamp:firebase.firestore.FieldValue.serverTimestamp(),
          message:input,
          user:user.email,
          photoURL:user.photoURL,
          });
      setInput('');
    };
    return (
        <Container>
            <Header>
                <Avatar/>
               <HeaderInformation>
                   <h3>Rec Email</h3>
                   <p>last seen...</p>
               </HeaderInformation>

               <HeaderIcons>
                   <IconButton>
                       <MoreVertIcon />
                    </IconButton>
                    <IconButton>
                         <AttachFileIcon />
                    </IconButton>
               </HeaderIcons>
               </Header>  

               <MessageContainer>
                   {/* show message */}
                   <p>{ShowMessage()}</p>
               
               <EndOfMessage/>
               
               </MessageContainer>
               <ChatInput>
                   
                   
                   <InsertEmoticon/>
                   <Input value={input} onChange={(e)=>(setInput(e.target.value))}/> 
                    <button  hidden disabled={!input} type='submit' onClick={sendMessage}>Send Message</button>     
             
                   <MicIcon/>
               </ChatInput>
        </Container>
    )
}

export default ChatScreen

const Container =styled.div`

`;
const  Header =styled.div`
display:flex;
padding:11px;
position:sticky;
z-index:100;
top:0;
background-color:white;
align-items:center;
border-bottom:1px solid whitesmoke;


`;
const HeaderInformation =styled.div`
margin-left:15px;
flex:1;
>h3{margin-bottom:3px;}
>p{font-size:14px;
    color:gray;

}

`;

const HeaderIcons =styled.div`
  


`;
const MessageContainer= styled.div`
padding:30px;
height: 90vh;
background-color:#e5ded8;`;

const EndOfMessage =styled.div``;


const Input =styled.input`
  flex:1;
  align-items:center;
  border-radius:10px;
  margin-left:15px;
  margin-right:15px;
  padding:20px;
  position: sticky;
  background-color:whitesmoke;
  border:none;

`;


const ChatInput =styled.form `
  display:flex;
  align-items:center;
  padding:10px;
  position:sticky;
  background-color:white;
  z-index:100;
  bottom:0;


`;
