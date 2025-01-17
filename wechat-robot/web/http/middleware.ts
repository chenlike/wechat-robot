import { RequestHandler } from "express"
import dayjs from "dayjs"
import crypto from "crypto"
import jwt from 'jsonwebtoken'



function md5(data: string) {
    let hash = crypto.createHash('md5');
    return hash.update(data).digest("hex")
}

function genGUID() {
    return md5(dayjs().format("YYYY-MM-DD HH:mm:ss"))
}

export const JWT_SECRET = md5(genGUID());





export const auth: RequestHandler = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token is required' });
    }

    // 验证 Token
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        next();
    });
}

