import React, { useEffect, useState } from "react"
import style from "styles/admin/container.module.css"
import dynamic from "next/dynamic"
import { firestore as db } from "firebase/firebase"

const Editor = dynamic(import('components/public/Editor'), {
  ssr: false,
  loading: () => <p>로딩중 ...</p>,
})

const AppInfo = () => {
  const [textData, setTextData] = useState("")
  const onTextChange = (html) => { setTextData(html) }

  useEffect(() => {
    const fetchData = async () => {
      const doc =  await db.collection("setting").doc("dataInfo").get()
      if (doc.exists) {
        setTextData(doc.data().text)
      }
    }
    fetchData()
  },[])
  
  const onSubmitClick = () => {
    try {
      db.collection("setting").doc("dataInfo").set({ text: textData })
      alert('개인정보처리방침이 변경되었습니다.')
    } catch (e) {
      alert(`업로드 실패 : ${e.message}`)
    }
  }
  return (
    <div className={style.mainContainer}>
      <div className={`${style.container} ${style.quillContainer}`}>
        <Editor docId={"appInfo"} handleChange={onTextChange} data={textData} />
      </div>
      <div className={style.submitButton} onClick={onSubmitClick}>
        개인정보처리방침 변경
      </div>
    </div>
  )
}

export default AppInfo