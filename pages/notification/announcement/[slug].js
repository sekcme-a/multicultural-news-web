import React, {useEffect, useState} from "react"
import { useRouter } from "next/router";
import styles from "styles/notification/post.module.css"
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { firestore as db } from "firebase/firebase";
import dynamic from "next/dynamic";
import Alert from "src/components/public/Alert"
import ShareIcon from '@mui/icons-material/Share';
import Backdrop from '@mui/material/Backdrop';
import ShareLink from "components/public/ShareLink"

const QuillNoSSRWrapper = dynamic(import('react-quill'), {
  ssr: false,
  loading: () => <p>로딩중 ...</p>,
})

const Post = () => {
  const router = useRouter();
  const { slug } = router.query
  const [title, setTitle] = useState("")
  const [text, setText] = useState("")
  const [createdAt, setCreatedAt] = useState("")
  const [author, setAuthor] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [id, setId] = useState("")

  const [showBackdrop, setShowBackdrop] = useState(false)
  const [alarmMode, setAlarmMode] = useState("success")
  const [isShow, setIsShow] = useState(false)
  const [alarmText, setAlarmText] = useState("")
  const onTitleClick = () => { router.back() }

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      const post = await db.collection("announcement").doc(slug).get()
      if (post.exists) {
        setTitle(post.data().title)
        setText(post.data().text)
        setCreatedAt(getDate(post.data().createdAt))
        setAuthor(post.data().author)
        setIsLoading(false)
        setId(post.id)
      } else {

      }
    }
    
    fetchData()
  }, [])
  
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
  const onShareIconClick = () => {
    setShowBackdrop(true)
  }
  const handleCloseBackDrop = () => {
    setShowBackdrop(false)
  }
  const handleCopy = () => {
    setIsShow(true)
    setAlarmText("Url이 복사되었습니다!")
    setAlarmMode("success")
    setTimeout(() => {
      setIsShow(false)
    },2000)
  }

  if (isLoading)
    return (
      <></>
    )
  return (
    <div className={styles.main_container}>
      <div className={styles.title_container}>
        <div className={styles.con1} onClick={onTitleClick}>
          <ArrowBackIosNewIcon style={{fontSize: "15px"}} />
          <p>공지사항</p>
        </div>
        <div className={styles.con2}>
          <ShareIcon className={styles.icon} onClick={onShareIconClick} style={{fontSize: "17px"}}  />
        </div>
        <Backdrop open={showBackdrop} onClick={handleCloseBackDrop} sx={{ color: '#fff', zIndex: 1000, }}>
          <ShareLink url={`https://multicultural-news.netlify.app/notification/announcement/${id}`} handleCopy={handleCopy} />
        </Backdrop>
      </div>
      <h1>{title}</h1>
      <h2>{`${createdAt} | ${author}`}</h2>
      <div className={styles.content_container} >
        <QuillNoSSRWrapper value={text||""} readOnly={true} theme="bubble" />
      </div>  
      <Alert mode={alarmMode} isShow={isShow} text={alarmText} />
    </div>
  )
}

export default Post