import express from 'express'
import TokenVerfier from '../middlewares/tokenVerifier'
import { body, validationResult } from 'express-validator'
import { IEvent } from '../models/events/IEvent'
import Event from '../models/events/event'




const eventsRouter: express.Router = express.Router()
/*
@usage: Upload an Event,
@url: http://217.0.0.1:5000/events/upload,
@method: post,
@fields: name, image, price, date, info, type
@access: private
*/

eventsRouter.post('/upload', [
    body('name').not().isEmpty().withMessage('Name is Required'),
    body('image').not().isEmpty().withMessage('Image is Required'),
    body('price').not().isEmpty().withMessage('Price is Required'),
    body('date').not().isEmpty().withMessage('Data is Required'),
    body('info').not().isEmpty().withMessage('Info is Required'),
    body('type').not().isEmpty().withMessage('Type is Required'),
], TokenVerfier, async (req: express.Request, res: express.Response) => {

    let errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(401).json({
            errors: errors.array()
        })
    }

    try {
        let { name, image, price, date, info, type } = req.body
        //todo upload events logic

        //check if event with the same name
        let event: IEvent | null = await Event.findOne({ name: name })
        if (event) {
            return res.status(401).json({
                errors: [
                    {
                        msg: "Event is already exists"
                    }
                ]
            })
        }

        //create an event
        event = new Event({ name, image, price, date, info, type })
        event = await event.save()


        res.status(200).json({
            msg: 'upload event is success'
        })
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            error: [
                {
                    msg: err
                }
            ]
        })

    }
})


/*
@usage: get all free events,
@url: http://217.0.0.1:5000/events/free,
@method: get,
@fields: no-fields
@access: public
*/


eventsRouter.get('/free', async (req: express.Request, res: express.Response) => {
    try {

        //todo get all free events logic

        let events:IEvent[] | null  = await Event.find({type:'FREE'})
        if(!events){
            res.status(400).json({
                errors: [
                    {
                        msg: 'No events found'
                    }
                ]
            })
        }


        res.status(200).json({
            events: events
        })
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            error: [
                {
                    msg: err
                }
            ]
        })

    }
})



eventsRouter.get('/pro', async (req: express.Request, res: express.Response) => {
    try {

        //todo get all free events logic

        let events:IEvent[] | null  = await Event.find({type:'PRO'})
        if(!events){
            res.status(400).json({
                errors: [
                    {
                        msg: 'No events found'
                    }
                ]
            })
        }


        res.status(200).json({
            events: events
        })
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            error: [
                {
                    msg: err
                }
            ]
        })

    }
})


eventsRouter.get('/:eventId', async (req:express.Request, res:express.Response) => {
    try{

        let {eventId} = req.params
        //to get a single event logic

        let event:IEvent | null  = await Event.findById(eventId)
        if(!event){
            res.status(400).json({
                errors: [
                    {
                        msg: 'No event found'
                    }
                ]
            })
        }

        return res.status(200).json({
            event:event
        })

    }catch(err){
        console.log(err);
        res.status(500).json({
            error: [
                {
                    msg: err
                }
            ]
        })
        
    }
})


export default eventsRouter;