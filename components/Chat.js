import styled from "styled-components";
import {Avatar} from "@material-ui/core";
import getRecipientEmail from "../utils/getrecipientEmail";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth,db } from "../firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import {useRouter} from"next/router";


function Chat({id,users}) {
    const router=useRouter();
    const[user]= useAuthState(auth);
    const [recipientSnapshot] = useCollection(db.collection('users').where('email','==',getRecipientEmail(users,user)));
    const recipient =recipientSnapshot?.docs?.[0]?.data();
    const recipientEmail = getRecipientEmail(users,user);

    const enterChat=()=>{router.push(`/chat/${id}`)}
    return (
        <Container onClick={enterChat}>
          
            {recipient ?(<UseAvatar src={recipient?.photoURL}/>)
            :(<UseAvatar>
              {recipientEmail[0]}
            </UseAvatar> )}
      
           
            <p>{ recipientEmail}</p>


        </Container>
       
    )
}

export default Chat;

const Container=styled.div`
  display:flex;
  align-items:center;
  
  cursor: pointer;
   padding: 10px ;
   word-break:break-word;

   :hover {background-color: #e9eaeb}

`;
const UseAvatar=styled(Avatar)`
margin:5px;
margin-left:13px;


`;

