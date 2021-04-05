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
import firebase from 'firebase';
import { useRef, useState } from "react";
import getRecipientEmail from "../pages/utils/getrecipientEmail";
import TimeAgo from 'timeago-react';


function ChatScreen({chat,messages}) {

    const endOfMessageRef=useRef(null);
    const [input,setInput]=useState( );
    const [user]=useAuthState(auth);
    const router=useRouter();
    const [recipientSnapshot]= useCollection(db.collection('chats')
                                                .where('email','==',getRecipientEmail(chat.users,user)));
    const [messageSnapsots]= useCollection(db
                                           .collection('chats')
                                           .doc(router.query.id)
                                           .collection('messages')
                                           .orderBy('timestamp','asc')
                                           );
    const ShowMessage  =()=>{
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
     }else
     {
         return JSON.parse(messages).map((message)=>(<Message  key={message.id} user={message.user} message={message}/>))
     }  
          
    };
    const scrollToBottom =()=>{
        endOfMessageRef.current.scrollIntoView({
       behavior:"smooth",
       block:"start",
        });
    }

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
      scrollToBottom();
    };
    
    const recipient=recipientSnapshot?.docs?.[0]?.data();
    const recipientEmail=getRecipientEmail(chat.users,user);
    return (
        <Container>
            <Header>
              {recipient ?(
                  <Avatar src={recipient?.photoURL}/>
              ):(<Avatar>
                  {recipientEmail[0]}
              </Avatar>)}


               <HeaderInformation>

                   <h3>{recipientEmail}</h3>

                   {recipientSnapshot ? (
                    <p>Last active:{' '}{recipient?.lastSeen?.toDate() ? (<TimeAgo  datetime={recipient?.lastSeen?.toDate()}/>  ):"unavailable"} </p>
                   ):(
                        <p>  loading last active...</p>
                   
                   )}
                  
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
               
               
                <EndOfMessage ref={endOfMessageRef}/>
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
padding:50px;
margin-bottom:10px;
height:90%vh;
background-color:#e5ded8;`;

const EndOfMessage =styled.div`
  
  margin-bottom:30px;
 
 
`;


const Input =styled.input`
  flex:1;
  align-items:center;
  border-radius:10px;
  margin-left:15px;
  margin-right:15px;
  padding:20px;
  bottom:0;
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
