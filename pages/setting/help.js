import React, {useEffect, useState} from "react"
import styles from "styles/setting/help.module.css"
import { useRouter } from "next/router"
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { firestore as db } from "firebase/firebase";
const Help = () => {
  const router = useRouter()
  const onTitleClick = () => { router.back() }
  const [expanded, setExpanded] = useState(false)
  const [list, setList] = useState([])
  const [text, setText] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      let temp1List = []
      let count = 0
      const doc = await db.collection("setting").doc("help").get()
      if (doc.exists) {
        let text = doc.data().text
        const temp2 = text.split("[[[")
        const linkList = doc.data().link?.split("\n")
        temp2.map((text) => {
          const temp3List = text.split("]]]")
          if (temp3List[0] !== "" && temp3List[1] !== undefined) {
            let temp4string = temp3List[1]
            while(temp4string.includes("<<<"))
              temp4string = temp4string.replace("<<<",`<strong>`)
            while(temp4string.includes(">>>"))
              temp4string = temp4string.replace(">>>", "</strong>")
            while(temp4string.includes("\n"))
              temp4string = temp4string.replace("\n", "<br />")
            if (linkList) {
              linkList.map((link) => {
                const temp5List = link.split("==")
                while (temp4string.includes(temp5List[0])) {
                  console.log(temp5List)
                  temp4string = temp4string.replace(temp5List[0], `<a href="dataInfo">${temp5List[1]}</a>`)
                  console.log(temp4string)
                }
              })
            }
            if (temp4string[0] === "<" && temp4string[1] === "b" && temp4string[2] === "r" && temp4string[3] === " "
              && temp4string[4] === "/" && temp4string[5] === ">") {
              temp4string = temp4string.replace("<br />","")
            }
            temp1List = [
              ...temp1List,
              {
                title: temp3List[0],
                content: temp4string,
                count: count,
              }
            ]
            count++
          }
        })
        setIsLoading(false)
        setList(temp1List)
        console.log(list)
      }
    }
    fetchData()
  },[])

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const onLinkClick = (url) => {
    console.log(url)
  }

  if (isLoading)
    return (<></>)
  
  return (
    <div className={styles.main_container}>
      <div className={styles.title_container} onClick={onTitleClick}>
        <ArrowBackIosNewIcon style={{fontSize: "15px"}} />
        <p>도움말</p>
      </div>
      {
        list.map((data, index) => {
          console.log(data)
          return (
          <Accordion expanded={expanded === `panel${data.count}`} onChange={handleChange(`panel${data.count}`)} style={{width: "100%"}} key={index}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel${data.count}bh-content`}
              id={`panel${data.count}bh-header`}
            >
              <h1 className={styles.title}>{data.title}</h1>
            </AccordionSummary>
            <AccordionDetails>
              <h3 className={styles.text} dangerouslySetInnerHTML={{ __html: data.content }} />
            </AccordionDetails>
          </Accordion>
          )
        })
      }
    </div>
  )
}

export default Help