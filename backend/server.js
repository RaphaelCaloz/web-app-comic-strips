const express = require('express')
const path = require('path')
const request = require('request')
const {Client} = require('pg')

const app = express()
const port = process.env.PORT || 5000

app.use(express.static(path.join(__dirname, 'build')))

// All backend api routes
app.get('/api/xkcd/maxComicId', (req, res) => {
    request(`https://xkcd.com/info.0.json`, { json: true }, (err, response, body) => {
        if (err) { return console.log(err) }
        res.json({
            maxComicId: body.num
        })
    })
})

app.get('/api/xkcd/:comicId', (req, res) => {
    // If comicId is valid, get that comic's data
    request(`https://xkcd.com/${req.params.comicId}/info.0.json`, { json: true }, (err, response, body) => {
        if (err) { return console.log(err) }
        res.json(body)
    })
})

app.get('/api/xkcd', (req, res) => {
    request(`https://xkcd.com/info.0.json`, { json: true }, (err, response, body) => {
        if (err) { return console.log(err) }
        res.json(body)
    })
})

app.get('/api/psql/comicViews/:comicId', (req, res) => {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,  // Replace by connectionString value for local testing
        ssl: { rejectUnauthorized: false }
    })

    client.connect()

    // This query should return at most 1 entry, as "comic_num" column values are unique
    client.query(`SELECT comic_views FROM views WHERE comic_num = ${req.params.comicId}`, (err, psqlRes) => {
        if (err) { return console.error(err) }

        let numViews = 0
        if (psqlRes.rowCount > 0) {
            numViews = psqlRes.rows[0].comic_views
        }

        client.end()
        
        res.json({
            comicViews: numViews
        })
    })
})

app.get('/api/psql/IncrementComicViews/:comicId', (req, res) => {
    /// Increment views by 1
    const client = new Client({
        connectionString: process.env.DATABASE_URL,  // Replace by connectionString value for local testing
        ssl: { rejectUnauthorized: false }
    })
    // Add to psql db
    client.connect()

    // If entry exists for comicId, update it.
    // If it doesn't exist, create it and set its value to 1.
    client.query(`
        INSERT INTO views (comic_num, comic_views) 
        VALUES ('${req.params.comicId}', '1')
        ON CONFLICT (comic_num) DO UPDATE
            SET comic_views = views.comic_views+1
            WHERE views.comic_num = ${req.params.comicId};
        `, (err, psqlRes) => {
        if (err) { return console.error(err) }
        client.end()
    })
    res.json({
        message: "Incremented comicViews successfully."
    })
})

// Default routes. Used to access the frontend.
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

app.listen(port, _ => {
    console.log(`Server started on port ${port}.`)
})