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
  return
}

export const getPreset = async (req, res) => {
  const randomNum = Number((Math.random() * 1500).toFixed(0))
  const results = await db.collection('games').find({ background_image: { $ne: null } }).sort({ ratings_count: -1 }).skip(randomNum).limit(50).toArray().catch(() => {
    res.status(500).send({
      message: 'Could not fetch games',
      status: 500
    })
    return
  })
  const change = results?.map((result) => {
    return {
      title: result.slug,
      image: result.background_image,
      name: result.name
    }
  })
  res.send(change)
  return
}

export const getGame = async (req, res) => {
  const { slug } = req.params
  const results = await db.collection('games').findOne({ slug }).catch(() => {
    res.status(500).send({
      message: 'Could not fetch games',
      status: 500
    })
    return
  })
  res.send(results)
  return
}

export const getMostPlayed = async (req, res) => {
  const results = await db.collection('games').find({}).sort({ ratings_count: -1 }).limit(100).toArray().catch(() => {
    res.status(500).send({
      message: 'Could not fetch games',
      status: 500
    })
    return
  })
  res.send(results)
  return
}

export const getTopSuggested = async (req, res) => {
  const results = await db.collection('games').find({}).sort({ 'ratings.0.count': 'descending' }).limit(100).toArray().catch(() => {
    res.status(500).send({
      message: 'Could not fetch games',
      status: 500
    })
    return
  })
  res.send(results)
  return
}

export const getTopRated = async (req, res) => {
  const results = await db.collection('games').find({ esrb_rating: { $ne: null } }).sort({ rating: -1 }).limit(100).toArray().catch(() => {
    res.status(500).send({
      message: 'Could not fetch games',
      status: 500
    })
    return
  })
  res.send(results)
  return
}
