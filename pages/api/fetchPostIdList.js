const cheerio = require('cheerio')
const axios = require('axios')

export default async (req, res) => {
  if (req.method === 'POST') {
    const address = req.body.address
    let list = []
    try {
      res.statusCode = 200
      console.log(address)

      const fetchedHTML = await axios.get(address)
      const $ = cheerio.load(fetchedHTML.data)
      $(".art_list_all > li").find('a').each((index, element) => {
        let id = 0
        id = parseInt($(element).attr("href").replace("/news/article.html?no=",""))
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