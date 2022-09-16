const cheerio = require('cheerio')
const axios = require('axios')

export default async (req, res) => {
  if (req.method === 'POST') {
    const input = req.body.input
    const page = req.body.page
    let list = []
    try {
      res.statusCode = 200

      const fetchedHTML = await axios.get(`https://www.kmcn.kr/news/search_result.html?search=${encodeURI(input)}&page=${page}`)
      const $ = cheerio.load(fetchedHTML.data)
      $(".art_list_all > li").find('a').each((index, element) => {
        let id = 0
        id = parseInt($(element).attr("href").replace("/news/article.html?no=",""))
        list.push(id)
      })
      const $resultCount = $(".desc_all > i").text()

      return res.json({
        idList: list,
        resultCount: $resultCount
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