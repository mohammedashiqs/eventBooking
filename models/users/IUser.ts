import {Document} from 'mongoose'

export interface IUser extends Document {
    _id?: string,
    name: String,
    email: String,
    password: String,
    avatar: String,
    isAdmin: Boolean,
    createdAt?: String,
    updatedAt?: String

}
