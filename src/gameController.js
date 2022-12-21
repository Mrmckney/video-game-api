import dbConnect from "../dbConnect.js";

export const getSearchResults = async (req, res) => {
    const db = dbConnect();
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