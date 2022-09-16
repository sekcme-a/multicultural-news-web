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
        let id = 0
        id = parseInt($(element).attr("href").replace("/news/article.html?no=",""))
        console.log(id)
        list.push(id)
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