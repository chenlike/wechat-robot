import { Express } from "express"
import { auth,JWT_SECRET } from "../middleware"
import { generateGUID } from "@common/utils"
import jwt from 'jsonwebtoken'


export default function(app:Express){



    let password = process.env.WEB_PASSWORD ?? ""
    if(!password){
        password = generateGUID()
        console.log("由于没有配置密码，默认使用随机密码:" + password)
    }
    
    app.post('/api/auth/login', (req, res)=>{
        // 判断用户提交的登录信息是否正确
        if(req.body.password != password) {
            return res.send(<Result>{success:false,msg:"密码错误"})
        }


        const token = jwt.sign({ }, JWT_SECRET, { expiresIn: '12h' });

        res.send(<Result>{success:true,msg:"登录成功",data:token})
    })


    app.get("/api/auth",auth,(req,res)=>{
        res.send(<Result>{success:true,msg:"OK"})
    })


}