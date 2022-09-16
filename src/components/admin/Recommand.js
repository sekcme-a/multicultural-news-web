import React, { useEffect, useState } from "react"
import { firestore as db } from "firebase/firebase"
import style from "styles/admin/container.module.css"
import Loader from "src/components/public/Loader"

const Recommand = () => {
  const [text, setText] = useState("")

  useEffect(() => {
    db.collection("setting").doc("recommand").get().then((doc) => {
      setText(doc.data()?.list)
    })
  },[])

  const onTextChange = (e) => {
    setText(e.target.value)
  }
  const onSubmit = async() => {
    const list = text.split(",")
    let result
    try {
      if (list[0] === "") {
        await db.collection("setting").doc("recommand").delete()
        alert("업로드 성공")
      }
      else {
        result = await isValidId(list)
        if (result === "valid") {
          await db.collection("setting").doc("recommand").set({ list:list })
          alert("업로드 성공")
        }
        else if (result !== "not Valid")
          alert(`존재하지 않는 기사 Id가 있습니다: ${result}`)
        }
    } catch (e) {
      alert(`업로드 실패 : ${e.message}`)
    }
  }

  const isValidId = async(list) => {
    return new Promise(async function (resolve, reject) {
      try {
        for (let i = 0; i < list.length; i++){
          const docRef = db.collection("posts").doc(list[i])
          const doc = await docRef.get()
          if(!doc.exists)
            resolve(list[i])
        }
            resolve("valid")
      } catch (e) {
        alert(`업로드 실패 : ${e.message}`)
        resolve("not Valid")
      }
    })
  }
  return (
    <div className={style.mainContainer}>
      <div className={style.container}>
        <h4>주요기사 등록</h4>
        <p className={style.warning}>{`기사id,기사id,기사id 형식으로 저장(빈칸없이)`}</p>
        <p className={style.warning}>{`등록된 주요기사가 하나도 없으면 자동으로 최근기사 5개가 등록됩니다.`}</p>
        <p>{`주요기사 id`} : <input type="text" value={text} onChange={onTextChange} size="60" required/></p>
      </div>
      <div className={style.submitButton} onClick={onSubmit}>저장</div>
    </div>
  )
}
export default Recommand