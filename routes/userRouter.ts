import express from 'express'
import { body, validationResult } from 'express-validator'
import User from '../models/users/user'
import { IUser } from '../models/users/IUser'
import bcrypt from 'bcrypt'
import gravatar from 'gravatar'
import jwt from 'jsonwebtoken'
import TokenVerfier from '../middlewares/tokenVerifier'




const userRouter: express.Router = express.Router();

/*
@usage: register a user,
@url: http://217.0.0.1:5000/users/register,
@method: POST,
@fields: name, email, password,
@access: public
*/

userRouter.post('/register', [
    body('name').not().isEmpty().withMessage('Name is required'),
    body('email').not().isEmpty().withMessage('Email is required'),
    body('password').not().isEmpty().withMessage('Password is required'),
], async (req: express.Request, res: express.Response) => {

    let errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        })
    }
    try {
        let { name, email, password } = req.body
        //todo registration logic

        //check if the email is exists
        let user: IUser | null = await User.findOne({ emai: email })
        if (user) {
            return res.status(400).json({
                errors: [
                    { msg: 'user is Already exists' }
                ]
            })
        }
        //encrypt the password
        let salt = await bcrypt.genSalt(10)
        password = await bcrypt.hash(password, salt)

        //get avatar url
        let avatar = gravatar.url(email, {
            s: '300px',
            r: 'pg',
            d: 'mm'

        })

        //register the user 
        user = new User({ name, email, password, avatar })
        user = await user.save()


        res.status(200).json({
            msg: 'Registration is successfull'
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


userRouter.post('/login', [
    body('email').not().isEmpty().withMessage('Email is Required'),
    body('password').not().isEmpty().withMessage('Password is Required')
], async (req: express.Request, res: express.Response) => {

    let errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        })
    }

    try {
        let { email, password } = req.body
        //todo registration logic

        //check for email

        let user: IUser | null = await User.findOne({ email: email })
        
        
        if (!user) {
            return res.status(401).json({
                error: [
                    {
                        msg: 'Invalid Email'
                    }
                ]
            })
        }

        //check for password
        
        
        let isMatch: boolean  = await bcrypt.compare(password, user.password.toString());
        if (!isMatch) {
            return res.status(401).json([
                {
                    msg: 'Invalid Password'
                }
            ])
        }

        //create a token and send

        let payload: any = {
            user: {
                id: user.id,
                name: user.name
            }
        }

        let myscretkey : string | undefined = process.env.JWT_SECRET_KEY;
        
        if(myscretkey){
            let token = await jwt.sign(payload, myscretkey)
            res.status(200).json({
                msg: 'login is success',
                token: token
            })
        }

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
@usage: Get a user info,
@url: http://217.0.0.1:5000/users/me,
@method: get,
@fields: no-fields,
@access: private
*/

userRouter.get('/me', TokenVerfier, async (req: express.Request, res: express.Response) => {
    try {

        //todo user info logic
        let requestedUser: any = req.headers['user']
        let user:IUser | null = await User.findById(requestedUser.id).select('-password')
        if(!user){
           return res.status(400).json({
                errors: [
                    {
                        msg: 'user data not found'
                    }
                ]
            })
        }
        res.status(200).json({
            user: user
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


export default userRouter