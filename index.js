const PORT = 8000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const pretty = require('pretty')

const app = express()

const _URL_ = "https://worldofsucculents.com/succupedia/"

app.get('/', (req, res) => {
  res.json('Welcome to my succulent information API. ^_____^')
})

app.get('/succulents', (req, res) => {
  const basePlantData = []

  axios.get(_URL_)
    .then((response) => {
      const html = response.data
      const $ = cheerio.load(html)

      $('h2.is-title').each(function () {
        const elem = $(this).children().first()
        // console.log("elem: " + elem);
        const title = elem.text()
        const url = elem.attr('href')
        // console.log("URL: " + url);
        basePlantData.push({title, url})
      })

      // console.log(...plants)
      // const temp = [basePlantData[0]]

      basePlantData.forEach((data) => {
        const u = data.url;
        // console.log("url: " + u);
        const plants = []
        axios.get(u).then((r) => {
          const _html = r.data
          const $ = cheerio.load(_html);
          const headers = $('div.post-content.cf.entry-content.content-normal > h4')
          const pData = []
          headers.each(function() {
            const title = $(this)
            // console.log("Elem: "+ elem);

            const data = {title: title.text(), paragraph: title.next().text()} 
            plants.push(data)
          })
          console.log(plants)
        })

      });


      res.json(basePlantData);
    }).catch((err) => console.log(err))
})

app.listen(PORT, () => `Server is running on PORT ${PORT}`);