import express from 'express'
import jwt from 'jsonwebtoken'

let TokenVerfier = async (req:express.Request, res:express.Response, next:express.NextFunction) => {
    
        try{
            //check user have token
            let token = req.headers['x-auth-token']
            if(!token){
                return res.status(401).json({
                   errors: [
                    {
                        msg: 'No Token Provide. Access Denied'
                    }
                   ]
                })
            }

            //decode
            if(typeof token === "string"){
                let decode: any =  jwt.verify(token, process.env.JWT_SECRET_KEY)
                req.headers['user'] = decode.user
                next()

            }

        }catch(err){

            return res.status(500).json({
                error: [
                    {
                        msg: 'Invalied token. Access Denied'
                    }
                ]
            })

            
        }


}

export default TokenVerfier

