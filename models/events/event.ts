import mongoose, {Schema, Model} from "mongoose";
import {IEvent} from './IEvent'


let eventSchema: Schema = new mongoose.Schema({

    name: {type: String, require: true},
    image: {type: String, require: true},
    price: {type: Number, require: true},
    date: {type: String, require: true},
    info: {type: String, require: true},
    type: {type: String, require: true},

}, {timestamps:true});

let Event:Model<IEvent> = mongoose.model<IEvent>('Event', eventSchema)
export default Event