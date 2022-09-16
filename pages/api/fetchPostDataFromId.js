const cheerio = require('cheerio')
const axios = require('axios')

export default async (req, res) => {
  if (req.method === 'POST') {
    const id = req.body.id
    const isGetContent = req.body.isGetContent
    let data = {}
    
    try {
      res.statusCode = 200
      const fetchedHTML = await axios.get(`https://www.kmcn.kr/news/article.html?no=${id}`)
      const $ = cheerio.load(fetchedHTML.data)
      const $category = $(".fl>.p_tit").text()
      const $title = $(".art_top > h2").text()
      let $subtitle = $(".sub_tit").text()
      const $author = $(".art_info > li ").eq(0).text()
      const $createdAt = $(".art_info > li ").eq(-1).text().replace("등록 ", "")
      let $thumbnailImg = ""
      let $imgFrom = ""
      $("#news_body_area").each((index, element) => {
        const $temp = $(element).find("img")
        $imgFrom = $temp.attr("title")
        $thumbnailImg = $temp.attr("src")
        console.log($thumbnailImg)
        if($thumbnailImg === undefined)
          $thumbnailImg="https://firebasestorage.googleapis.com/v0/b/multicultural-news-web.appspot.com/o/images%2Fdefault_thumbnail.png?alt=media&token=f9d4fcd3-aa6b-43ab-8124-73b24ed45beb"
        else if (!$thumbnailImg.includes("//www"))
          $thumbnailImg = `https://www.kmcn.kr${$thumbnailImg}`
      })
      
      let content = ""
      if (isGetContent) {
        $("#news_body_area").find("p").each((index, element) => {
          if ($(element).children().length !== 0)
            content = `${content}<strong>${$(element).text()}</strong><p class="ql-align-justify"/>&nbsp;</p>`
          else
            content = `${content}${$(element).text()}<p class="ql-align-justify"/>&nbsp;</p>`
        })
      }
      let tag = ""
      $(".tag_lists > li").find("a").each((index, element) => {
        tag = `${tag}${$(element).text()} `
      })

      if ($subtitle === "" || $subtitle === undefined) {
        let tempContent = ""
        $("#news_body_area").find("p").each((index, element) => {
          if ($(element).children().length !== 0)
            tempContent = `${tempContent}<strong>${$(element).text()}</strong><p class="ql-align-justify"/>&nbsp;</p>`
          else
            tempContent = `${tempContent}${$(element).text()}<p class="ql-align-justify"/>&nbsp;</p>`
        })
        $subtitle = createSubtitle(tempContent)
      }
      const $video = $("iframe").attr("src")
      if ($video !== undefined) {
        content = `<iframe class="ql-video" frameborder="0" allowfullscreen="true" src=${$video}></iframe>${content}`
      }
      return res.json({
        data: {
          id: id,
          video: $video,
          category: $category,
          title: $title,
          subtitle: $subtitle,
          author: $author,
          createdAt: $createdAt,
          thumbnailImg: $thumbnailImg,
          imgFrom: $imgFrom,
          tag: tag,
          content: content
        }
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

const createSubtitle = (content) => {
  let temp = content.substr(0,200)
  while (temp.includes("&lt;") || 
    temp.includes("&gt;") || temp.includes("&nbsp;")) {
    temp = temp.replace(/<[^>]*>?/g, '')
    temp = temp.replace("&lt;", "<")
    temp = temp.replace("&gt;", ">")
    temp = temp.replace("&nbsp;", "")
  }
  let tmp = temp.substr(0, 85)
  while (tmp.includes("\n"))
    tmp = tmp.replace("\n", " ")
  tmp = tmp + "..."
  return tmp
}