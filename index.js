import express from 'express'
import cors from 'cors'
import { getGame, getMostPlayed, getPreset, getSearchResults, getTopRated, getTopSuggested } from './src/gameController.js'
import { getFavorites, loginUser, createUser, removeFav, addFavorite } from './src/userController.js'
import dbConnect from "./dbConnect.js";

const db = dbConnect();
const app = express()
app.use(cors())
app.use(express.json())

app.get("/", async (req, res) => {
    const results = await db.collection('games').find({}).sort({ ratings_count: -1 }).limit(100).toArray().catch(() => {
        res.status(500).send({
          message: 'Could not fetch games',
          status: 500
        })
        return
      })
      res.send(results)
})

// games
app.get('/mostplayed' , getMostPlayed)
app.get('/topsuggested', getTopSuggested)
app.get('/toprated', getTopRated)
app.get('/game/:slug', getGame)
app.get('/search/:name', getSearchResults)
app.get('/preset', getPreset)

// user 
app.get('/favorites', getFavorites)
app.post('/signup', createUser)
app.post('/login', loginUser)
app.patch('/addfav', addFavorite)
app.patch('/removefav', removeFav)


app.listen('4000', () => {
    console.log('our app is listening on port 4000')
})

export default app

// async function deleteGames() {
//     const db = dbConnect()
//     const ok = db.collection('games').deleteMany({rating: 0, suggestions_count: 0})
//     return ok
// }

// app.get('/remove', (req, res) => {
//     deleteGames()
//     res.send('ok')
// })

// async function getGames(page) {
//     const data = await fetch(`https://api.rawg.io/api/games?key=${API_KEY}&page=${page}&page_size=40`)
//     const gameResults = await data.json()
//     const bulkGames = await gameResults.results.map(game => {return game})
//     const db = dbConnect();
//     return db.collection('games').insertMany(bulkGames)
// }


// // make sure to re-run
// app.get('/game', (req, res) => {
//   let pageNum = 0
//   for(let i = 13980; i < 14000; i++){
//     pageNum = i
//     getGames(i)
//   }
//   res.send(`Got games ${pageNum}`)
// })