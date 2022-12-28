import express from 'express';
import {Request,Response} from 'express';
import cors from 'cors';
import { mockMessages } from './mockMessages';
import { mockUserDetails } from './mockUserDetails';
import bodyParser from 'body-parser';


const app = express();

app.use(cors());

app.get('/',(req : Request, res : Response)=>{
    res.send('hello world')
})

app.get('/Name',(req : Request, res : Response)=>{  
    const mockMessagesWithNames = mockMessages.map((message) => {
        const author = mockUserDetails .find(user => user.id === message.authorId);
        const authorName = author && author.name;
        return { ...message, authorName };
      });

    res.send(mockMessagesWithNames)
})


app.get('/useridName',(req : Request, res : Response)=>{  
    const mockMessagesOnlyNamesAndID = mockUserDetails.map((user) => {
       return { "id" : user.id , "name" : user.name }
      });

    res.send(mockMessagesOnlyNamesAndID);

})

app.get('/userdetails',(req : Request, res : Response)=>{  
    res.send(mockUserDetails);
})

app.post('/newmessage',bodyParser.json(),(req : Request, res : Response)=>{  //should add the user name, and initialize the likes to 0.
    const authorId = req.body.authorId
    const id = req.body.id
    const body= req.body.body
    const timestamp = req.body.timestamp
    const likes = [] 

    mockMessages.push({
        authorId,
        id,
        body,
        timestamp,
        likes
    })
    res.sendStatus(200)
})

app.post('/like',bodyParser.json(),(req : Request, res : Response)=>{  
    const obj = req.body;
    const msgId: number = obj.messageId;
    const userId: number = obj.userId;
    const like: boolean = obj.like;
    let theMsg = mockMessages.filter((msg) => msg.id === msgId);
    if (theMsg[0].likes.includes(userId)) {
      theMsg[0].likes.map((element, index) => {
        if (element === userId) {
          theMsg[0].likes.splice(index, 1);
        }
      });
    } else{
        theMsg[0].likes.push(userId);
    }
    res.sendStatus(200);
    })

app.listen(3001, () => {
    console.log('Server is running');
});

export default app;