import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'

import userRouter from './routes/userRouter';
import eventsRouter from './routes/eventsRouter';

const app:express.Application = express();

app.use(express.json())

dotenv.config()

const port: string | undefined = process.env.PORT
let dbUrl: string | undefined = process.env.MONGODB_URI

if(dbUrl){
mongoose.connect(dbUrl).then((resoponse)=>{
    console.log('Connected to mongodb successfully');
    
}).catch((err)=>{
    console.log(err);
    process.exit(1)  //stops the nodejs process
    
})

}

app.get('/', (req: express.Request, res: express.Response) => {
    res.status(200).send("hall")
})

//router configuration
app.use('/users', userRouter)
app.use('/events', eventsRouter)

app.listen(port, () => {
    console.log(`Server is running on the port ${port}`);
    
})