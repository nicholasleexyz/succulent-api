const PORT = 8000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')

const app = express()


const url = "https://worldofsucculents.com/succupedia/"

app.get('/', (req, res) => {
  res.json('Welcome to my succulent information API. ^_____^')
})

app.get('/succulents', (req, res) => {
  const plants = []

  axios.get(url)
    .then((response) => {
      const html = response.data
      const $ = cheerio.load(html)

      $('h2.is-title').each(function () {
        const elem = $(this).children().first()
        // console.log("elem: " + elem);
        const title = elem.text()
        const url = elem.attr('href')
        // console.log("URL: " + url);
        plants.push({title, url})
      })
      // console.log(...plants)
      res.json(plants);

    }).catch((err) => console.log(err))
})

app.listen(PORT, () => `Server is running on PORT ${PORT}`);