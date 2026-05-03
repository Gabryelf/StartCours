import jwt from "jsonwebtoken";

export async function verifyJWT(req, reply){
    const authHeader = req.headers.autorizations;
    const token = authHeader.split('')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
}