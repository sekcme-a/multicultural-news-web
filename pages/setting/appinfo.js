import React, {useEffect, useState} from "react"
import styles from "styles/setting/container.module.css"
import { useRouter } from "next/router"
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { firestore as db } from "firebase/firebase";
import dynamic from "next/dynamic";
const QuillNoSSRWrapper = dynamic(import('react-quill'), {
  ssr: false,
  loading: () => <p>로딩중 ...</p>,
})


const AppInfo = () => {
  const router = useRouter()
  const [text, setText] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const doc = await db.collection("setting").doc("appInfo").get()
      if (doc.exists) {
        setText(doc.data().text)
      }
    }
    fetchData()
  },[])

  const onTitleClick = () => [
    router.back()
  ]
  return (
    <div className={styles.main_container}>
      <div className={styles.title_container} onClick={onTitleClick}>
        <ArrowBackIosNewIcon style={{fontSize: "15px"}} />
        <p>한국 다문화 뉴스</p>
      </div>
      <div className={styles.content_container}>
        <QuillNoSSRWrapper value={text||""} readOnly={true} theme="bubble" />
      </div>
    </div>
  )
}

export default AppInfo