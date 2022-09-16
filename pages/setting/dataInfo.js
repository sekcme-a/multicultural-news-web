import React, {useEffect, useState} from "react"
import { useRouter } from "next/router"
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import styles from "styles/setting/dataInfo.module.css"
import { firestore as db } from "firebase/firebase";
import dynamic from "next/dynamic";
const QuillNoSSRWrapper = dynamic(import('react-quill'), {
  ssr: false,
  loading: () => <p>로딩중 ...</p>,
})


const DataInfo = () => {
  const [text, setText] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const onTitleClick = () => { router.back() }

  useEffect(() => {
    const fetchData = async () => {
      const data = await db.collection("setting").doc("dataInfo").get()
      if (data.exists) {
        setText(data.data().text)
      }
      setIsLoading(false)
    }
    fetchData()
  }, [])
  if (isLoading) {
    return(<></>)
  }
  return (
    <div className={styles.main_container}>
      <div className={styles.title_container} onClick={onTitleClick}>
        <ArrowBackIosNewIcon style={{fontSize: "15px"}} />
        <p>개인정보 처리방침</p>
      </div>
      <div className={styles.content_container}>
        <QuillNoSSRWrapper value={text||""} readOnly={true} theme="bubble" />
      </div>
    </div>
  )
}

export default DataInfo