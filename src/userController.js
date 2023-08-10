import dbConnect from '../dbConnect.js'
import jwt from 'jsonwebtoken'
import 'dotenv/config'

const db = dbConnect()

export const createUser = async (req, res) => {
    req.body.favorites = []
    const userName = req.body.username
    const user = await db.collection('users').insertOne(req.body).catch(err => {
        res.status(500).send({
            message: 'User creation failed',
            status: 500
        })
        return
    })
    if (user?.acknowledged) {
        user.username = req.body.username
        user.password = req.body.password
        const token = jwt.sign({user}, process.env.SECRET)
        res.send({
            message: "User created successfully",
            status: 200,
            username: userName,
            token
        })
        return
    }
}

export const loginUser = async (req, res) => {
    const user = await db.collection('users').findOne({username: req.body.username}).catch(err => {
        res.status(500).send({
            message: 'Login Attempt Failed',
            status: 500
        })
        return
    })
    if (!user || user.password !== req.body.password) {
        res.status(401).send({
            message: 'Incorrect username or password',
            status: 401
        })
        return
    }
    if (user && user.password === req.body.password) {
        let responseData = user
        responseData.password = undefined
        responseData.favorites = undefined
        const token = jwt.sign({user}, process.env.SECRET)
        res.status(200).send({
            message: "User login successful",
            status: 200,
            user: responseData,
            token
        })
        return
    } 
}

export const addFavorite = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1]
    if(!token) {
        res.status(403).send({
            status: 403,
            message: 'Access denied'
        })
        return
    }
    const decoded = jwt.verify(token, process.env.SECRET)
    await db.collection('users').findOneAndUpdate({'username': decoded.user.username}, {$addToSet: {favorites: req.body}}).catch(err => {
        res.status(500).send({
            message: 'Could not add',
            status: 500
        })
        return
    })
    res.send({
        message: "Favorite added",
        status: 200
    })
    return
}

export const getFavorites = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1]
    if(!token) {
        res.status(403)
        .send({
            status: 403,
            message: 'Access denied'
        })
        return
    }
    const decoded = jwt.verify(token, process.env.SECRET)
    const data = await db.collection('users').findOne({'username': decoded.user.username}).catch(err => {
        res.status(500).send({
            message: 'Could not get',
            status: 500
        })
        return
    })
    if (data?.password) {
        data.password = undefined

    }
    if (data?.userName) {
        data.username = undefined
    }
    res.send(data)
    return
}

export const removeFav = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1]
    if(!token) {
        res.status(403)
        .send({
            status: 403,
            message: 'Access denied'
        })
        return
    }
    const decoded = jwt.verify(token, process.env.SECRET)
    await db.collection('users').findOneAndUpdate({'username': decoded.user.username}, {$pull: {favorites: req.body}}).catch(err => {
        res.status(500).send({
            message: 'Could not remove',
            status: 500
        })
        return
    })
    res.send({
        message: 'Removed Favorite',
    })
    return
}