import React, { useEffect, useState } from "react"
import style from "styles/admin/container.module.css"
import useAuth from "src/hook/auth/auth"
import { useRouter } from "next/router"
import "react-quill/dist/quill.snow.css"; 
import dynamic from "next/dynamic";
import { firestore as db } from "firebase/firebase";
const Editor = dynamic(import('components/public/Editor'), {
  ssr: false,
  loading: () => <p>로딩중 ...</p>,
})
const QuillNoSSRWrapper = dynamic(import('react-quill'), {
  ssr: false,
  loading: () => <p>로딩중 ...</p>,
})

const NewAnnouncement = () => {
  const { user } = useAuth();
  const [docId, setDocId] = useState("")
  const onDocIdChange = (e) => {setDocId(e.target.value)}
  const router = useRouter()
  const [title, setTitle] = useState("")
  const onTitleChange =(e)=>{setTitle(e.target.value)}
  const [author, setAuthor] = useState("관리자")
  const onAuthorChange = (e) => { setAuthor(e.target.value) }
  const [textData,setTextData] = useState("")
  const onTextChange = (html) => {setTextData(html)}


  const onSubmitClick = () => {
    const announcementHashMap = {
      title: title,
      author: author,
      createdAt: new Date(),
      uid: user.uid,
      text: textData,
    }
    try {
      db.collection("announcement").doc(docId).set(announcementHashMap)
      alert("성공적으로 업로드되었습니다!")
      router.push('/rhksflwk/home')
    } catch (e) {
      alert(`업로드 실패 : ${e.message}`)
    }
  }

  const onDeleteClick = () => {
    try {
      db.collection("announcement").doc(docId).delete()
      alert("공지가 삭제되었습니다.")
    } catch (e) {
      alert(`삭제 실패 : ${e.message}`)
    }
  }

  const onSearchClick = async() => {
    const doc = await db.collection("announcement").doc(docId).get()
    if (doc.exists) {
      setTitle(doc.data().title)
      setAuthor(doc.data().author)
      setTextData(doc.data().text)
    } else alert("존재하지 않는 기사 Id 입니다.")
  }

  return (
    <div className={style.mainContainer}>
      <div className={style.container}>
        <h4>기사 ID</h4>
        <p className={style.warning}>기사 ID는 기사의 URL을 통해 확인할 수 있습니다.</p>
        <p>기사 ID : <input type="text" value={docId} onChange={onDocIdChange} size="60" required />
          <text className={style.search} onClick={onSearchClick}>조회</text>
        </p>
      </div>
      <div className={style.container}>
        <h4>제목</h4>
        <p className={style.warning}>*필수</p>
        <p>제목 문구 : <input type="text" value={title} onChange={onTitleChange} size="60" required/></p>
      </div>
      <div className={style.container}>
        <h4>작성자</h4>
        <p className={style.warning}>*필수</p>
        <p>작성자 명 : <input type="text" value={author} onChange={onAuthorChange} size="60" required/></p>
      </div>

      <div className={`${style.container} ${style.quillContainer}`}>
        <Editor docId={docId} handleChange={onTextChange} data={textData} />
      </div>
      <div className={`${style.container} ${style.previewQuillContainer}`}>
        <QuillNoSSRWrapper value={textData||""} readOnly={true} className={style.quill} theme="bubble" />
      </div>
      <div className={style.submitButton} onClick={onSubmitClick}>
        공지 편집
      </div>
      <div className={style.deleteButton} onClick={onDeleteClick}>
        공지 삭제
      </div>
    </div>
  )
}

export default NewAnnouncement