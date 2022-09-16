import React, {useEffect, useState} from "react"
import NotificationHeader from "src/components/notification/NoticationHeader"
import styles from "styles/notification/notification.module.css"
import { firestore as db } from "firebase/firebase"
import CircularProgress from '@mui/material/CircularProgress';
import AnnouncementThumbnail from "src/components/notification/AnnouncementThumbnail"
import Skeleton from '@mui/material/Skeleton';

const Notification = (props) => {
  const fetchCountInOneLoad = 20
  const [lastDoc, setLastDoc] = useState("")
  const [list, setList] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      let tempIdList = []
      let count = 0;
      const announcements = await db.collection("announcement")?.orderBy("createdAt", "desc").limit(fetchCountInOneLoad).get()
      announcements.docs.map((doc) => {
        tempIdList = ([
          ...tempIdList,
          {
            title: doc.data().title,
            author: doc.data().author,
            createdAt: getDate(doc.data().createdAt),
            id: doc.id,
          }
        ])
        count++
        if (count === fetchCountInOneLoad) {
          setLastDoc(doc)
        }
      })
      setList(tempIdList)
      setIsLoading(false)
    }
    fetchData()
  }, [])

  // useEffect(() => {
  //   const fetchData = async () => {
  //     setIsLoading(true)
  //     let tempIdList = []
  //     let count = 0;
  //     console.log(props.isBottom)
  //     console.log(list)
  //     console.log(lastDoc)
  //     if (props.isBottom && list && lastDoc) {
  //       const posts = await db.collection("announcement")?.orderBy("createdAt", 'desc').startAfter(lastDoc).limit(fetchCountInOneLoad).get()
  //       posts.docs.map((doc) => {
  //         tempIdList = ([
  //           ...tempIdList,
  //           {
  //             title: doc.data().title,
  //             author: doc.data().author,
  //             createdAt: getDate(doc.data().createdAt),
  //             id: doc.id,
  //           }
  //         ])
  //         count++
  //         if (count === fetchCountInOneLoad) {
  //           setLastDoc(doc)
  //         }
  //       })
  //       if (list[list.length - 1].docId !== tempIdList[tempIdList.length - 1]?.docId) {
  //         setList([...list, ...tempIdList])
  //       }
  //       setIsLoading(false)
  //     }
  //   }
  //   fetchData()
  // }, [props.isBottom])
  
  const getDate = (d) => {
    const date = new Date(d.toMillis())
    if(date.getMonth()+1<10 && date.getDate()<10)
      return date.getFullYear() + ".0" + (date.getMonth() + 1) + ".0" + date.getDate() +" "+date.getHours()+":"+date.getMinutes()
    else if(date.getMonth()+1<10 && date.getDate()>=10)
      return date.getFullYear() + ".0" + (date.getMonth() + 1) + "." + date.getDate() +" "+date.getHours()+":"+date.getMinutes()
    else if(date.getMonth()+1>=10 && date.getDate()<10)
      return date.getFullYear() + "." + (date.getMonth() + 1) + ".0" + date.getDate() +" "+date.getHours()+":"+date.getMinutes()
    else if(date.getMonth()+1>=10 && date.getDate()>=10)
      return date.getFullYear() + "." + (date.getMonth() + 1) + "." + date.getDate() +" "+date.getHours()+":"+date.getMinutes()
  }

  if (isLoading)
    return(
      <div className={styles.main_container}>
        <NotificationHeader loc="notification" />
        <Skeleton animation="wave" variant="text" width="100%-10px" height={70} style={{ margin: "0 10px 0 10px" }} />
        <Skeleton animation="wave" variant="text" width="100%-10px" height={70} style={{ margin: "0 10px 0 10px" }}  />
        <Skeleton animation="wave" variant="text" width="100%-10px" height={70} style={{ margin: "0 10px 0 10px" }}  />
        <Skeleton animation="wave" variant="text" width="100%-10px" height={70} style={{ margin: "0 10px 0 10px" }}  />
        <Skeleton animation="wave" variant="text" width="100%-10px" height={70} style={{ margin: "0 10px 0 10px" }}  />
        <Skeleton animation="wave" variant="text" width="100%-10px" height={70} style={{ margin: "0 10px 0 10px" }}  />
      </div>
    )

  return (
    <div className={styles.main_container}>
      <NotificationHeader loc="notification" />
      {!isLoading && list.length === 0 && <div className={styles.no_notification}>공지사항이 없습니다.</div>}
      {list?.map((doc, index) => {
        return (
          <AnnouncementThumbnail data={doc} key={index} />
        )
      })}
      {/* <p className={styles.more} onClick={onMoreClick}>더보기</p> */}
      {isLoading && <CircularProgress size={20} />}
    </div>
  )
}
export default Notification