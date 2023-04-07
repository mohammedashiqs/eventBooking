import mongoose, {Schema, Model} from 'mongoose'
import {IUser} from './IUser'


let userSchema: Schema = new Schema<IUser>({

    name: {type: String, required: true},
    email: {type: String, require: true},
    password: {type: String, required: true},
    avatar: {type: String},
    isAdmin: {type: Boolean, default: false}

},{timestamps:true});



let User: Model<IUser> = mongoose.model<IUser>('User',userSchema)
export default User