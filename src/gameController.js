import dbConnect from "../dbConnect.js";

const db = dbConnect();
export const getSearchResults = async (req, res) => {
    const searchResults = await db.collection("games").aggregate([
        {
          $search: {
            index: 'default',
            text: {
              query: req.query.query,
              path: 'slug'
            }
          }
        }
      ]).limit(100).toArray()
    .catch(err => {
        res.status(500).send({
            message: 'Could not fetch games',
            status: 500
        })
        return
    })
    res.send(searchResults)
}

export const getTopRated = async (req, res) => {
  const results = await db.collection('games').find({}).sort({ratings_count: -1}).limit(100).toArray().catch(() => {
    res.status(500).send({
        message: 'Could not fetch games',
        status: 500
    })
    return
  })
  res.send(results)
}