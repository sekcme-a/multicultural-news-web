import React, { useEffect, useState } from "react"
import style from "styles/admin/container.module.css"
import useAuth from "src/hook/auth/auth"
import { useRouter } from "next/router"
import { firestore as db } from "firebase/firebase";
import Button from '@mui/material/Button';

const NewAnnouncement = () => {
  const [text, setText] = useState("")
  const onTextChange = (e) => { setText(e.target.value) }
  const [link, setLink] = useState("")
  const onLinkChange = (e) => { setLink(e.target.value)}
  
  useEffect(() => {
    const fetchData = async() => {
      try {
        const doc = await db.collection("setting").doc("help").get()
        if (doc.exists) {
          setText(doc.data().text)
          setLink(doc.data().link)
        }
      } catch (e) {
        alert(`데이터 불러오기 실패 : ${e.message}`)
      }
    }
    fetchData()
  },[])


  const onSubmitClick = () => {
    try {
      db.collection("setting").doc("help").set({ text: text, link: link })
      alert("변경 성공")
    } catch (e) {
      alert(`변경 실패 : ${e.message}`)
    }
  }

  return (
    <div className={style.mainContainer}>
      <div className={style.container}>
        <h4>내용</h4>
          <p className={style.warning}>{`*제목은 [[[제목]]] 로 표기, 강조체는 <<<강조할문구>>> 로 표기`}</p>
        <p>내용 문구 : <textarea type="text" value={text} onChange={onTextChange} cols="100" rows="25" required/></p>
      </div>
      <div className={style.container}>
        <h4>링크걸기</h4>
          <p className={style.warning}>{`개인정보처리방침이 적힌 url로 이동시킬 수 있습니다.`}</p>
          <p className={style.warning}>{`링크걸 문구==대체문구 로 링크를 설정할 수 있습니다.`}</p>
          <p className={style.warning}>{`<예시>`}</p>
          <p className={style.warning}>{`내용 문구 : 개인정보처리방침을 보려면 asdf를 클릭해주세요.`}</p>
          <p className={style.warning}>{`링크 설정 : asdf==여기`}</p>
          <p className={style.warning}>{`사용자에게 보일 결과 : 개인정보처리방침을 보려면 여기를 클릭해주세요.`}</p>
        <p>링크 설정 : <textarea type="text" value={link} onChange={onLinkChange} cols="100" rows="25" required/></p>
      </div>
      <Button variant="contained" onClick={onSubmitClick}>변 경</Button>
    </div>
  )
}

export default NewAnnouncement