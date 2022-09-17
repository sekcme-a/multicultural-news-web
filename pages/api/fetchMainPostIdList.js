const cheerio = require('cheerio')
const axios = require('axios')

export default async (req, res) => {
  if (req.method === 'POST') {
    const address = req.body.address
    let list = []
    try {
      res.statusCode = 200

      const fetchedHTML = await axios.get(address)
      const $ = cheerio.load(fetchedHTML.data)
      console.log(address)
      $("#artSlide2630.photo_box > li").find('a').each((index, element) => {
        console.log($(element))
        const id = parseInt($(element).attr("href").replace("/news/article.html?no=", ""))
        const thumbnailImg = $(element).children("span").children("img").attr("src")
        const category = $(element).children("div").children("b").text()
        const title = $(element).children("div").children("h3").text()
        const subtitle = $(element).children("div").children("p").text().substring(0,60)+"..."
        list.push({ id: id, thumbnailImg: thumbnailImg, category: category, title: title, subtitle: subtitle})
      })
      return res.json({
        idList: list
      })

      
    } catch (e) {
      res.statusCode = 404
      return res.json({
        fetchedHTML: "error",
        error: e.message
      })
    }
  }
}