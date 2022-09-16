import React, { useState, useEffect } from "react"
import { firestore as db } from "firebase/firebase"
import style from "styles/admin/container.module.css"
import Loader from "src/components/public/Loader"

//<Setting loc="" />   loc: catgory/local/country
//카테고리, 지역별, 나라별 설정
const Setting = (props) => {
  let tempList = []
  let tempIdList = []
  const [isLoading, setIsLoading] = useState(true)
  const [text, setText] = useState("")
  const [list, setList] = useState([])
  const [idList, setIdList] = useState([])
  const [addCategory, setAddCategory] = useState("")
  const [beforeCategory, setBeforeCategory] = useState("")
  const [afterCategory, setAfterCategory] = useState("")
  const [deleteCategory, setDeleteCategory] = useState("")
  const [categoryOrder, setCategoryOrder] = useState("")
  const onAddCategoryChange = (e) => { setAddCategory(e.target.value) }
  const onBeforeCategoryChange = (e) =>{setBeforeCategory(e.target.value)}
  const onAfterCategoryChange = (e) =>{setAfterCategory(e.target.value)}
  const onDeleteCategoryChange = (e) => { setDeleteCategory(e.target.value) }
  const onCategoryOrderChange = (e)=>{setCategoryOrder(e.target.value)}

  useEffect(() => {
    if(props.loc==="local") setText("지역별")
    if(props.loc==="country") setText("나라별")
    if(props.loc==="society") setText("사회")
    if(props.loc==="culture") setText("문화")
    if(props.loc==="plan") setText("기획")
    fetchData()
  }, [])
  useEffect(() => {
    setCategoryOrder(list.toString())
  },[list])
  const fetchData = async () => {
    try {
      db.collection(props.loc).doc("list")?.get().then((doc) => {
        if (doc.data()?.list !== undefined) {
          setList(doc.data()?.list)
          setIdList(doc.data()?.idList)
        }
        setIsLoading(false)
      })
    } catch (e) {
      setIsLoading(false)
      if(e.message !== "Cannot read properties of undefined (reading 'list')")
        alert(`데이터를 불러오는데 실패했습니다 : ${e.message}`)
    }
  }
  
  const onAddCategorySubmit = () => {
    if (addCategory === "" || addCategory === " ")
      alert(`${props.loc}는 빈칸이 될수 없습니다.`)
    else if (!list?.includes(addCategory)) {
      try {
        const doc = db.collection(props.loc).doc()
        doc.set({ "name": addCategory })
        db.collection(props.loc).doc("list").set({"list": [...list, addCategory], "idList": [...idList, doc.id]})
        alert("성공적으로 적용되었습니다.")
        reload()
      } catch (e) {
        alert(`적용 실패 : ${e.message}`)
      }
    } else {
      alert(`이미 있는 ${props.loc} 입니다.`)
    }
  }
  const onEditCategorySubmit = () => {
    if (list.includes(afterCategory)) {
      alert(`이미 있는 ${props.loc}로 변경할 수 없습니다.`)
    }
    else if (list.includes(beforeCategory)) {
      try {
        for (let i = 0; i < list.length; i++){
          if (list[i] === beforeCategory) {
            const tempList = list
            tempList[i] = afterCategory
            db.collection(props.loc).doc("list").update({"list":tempList})
            alert("성공적으로 적용되었습니다")
            reload()
          }
        }
      } catch (e) {
        alert(`적용 실패 : ${e.message}`)
      }
    } else {
      alert(`없는 ${props.loc} 입니다.`)
    }
  }
  const onCategoryOrderSubmit = () => {
    let tempIdOrder = []
    if (categoryOrder === "") {
      alert("빈칸입니다.")
      return
    }
    let categoryOrderList = categoryOrder.split(",")
    for (let i = 0; i < categoryOrderList.length; i++){
      for (let j = 0; j < list.length; j++){
        if (list[j] === categoryOrderList[i])
          tempIdOrder.push(idList[j])
      }
    }
    if (categoryOrderList.length === tempIdOrder.length) {
      try {
        db.collection(props.loc).doc("list").set({"list": categoryOrderList, "idList": tempIdOrder}) 
        alert("성공적으로 적용되었습니다")
        reload()
      } catch (e) {
        alert(`적용 실패 : ${e.message}`)
      }
    } else
      alert("입력을 다시 확인해 주세요.")
  }
  const onDeleteCategorySubmit = () => {
    if (list?.includes(deleteCategory)) {
      try {
        for (let i = 0; i < list.length; i++){
          if (list[i] === deleteCategory) {
            const tempList = list.filter(cat => cat !== deleteCategory)
            const tempIdList = idList.filter(id => id !== idList[i])
            db.collection(props.loc).doc(idList[i]).delete()
            db.collection(props.loc).doc("list").set({ "list": tempList, "idList": tempIdList })
            alert("성공적으로 적용되었습니다.")
            reload()
          }
        }
      } catch (e) {
        alert(`적용 실패 : ${e.message}`)
      }
    } else {
      alert(`존재하지 않는 ${props.loc} 입니다.`)
    }
  }

  const reload = () => {
    fetchData()
    setAddCategory("")
    setDeleteCategory("")
    setBeforeCategory("")
    setAfterCategory("")
  }
  
  if (isLoading)
    return <Loader />

  return (
    <div className={style.mainContainer}>
      <div className={style.container}>
        <h4>현재 {text}</h4>
        <p className={style.warning}>변경사항이 적용되지 않은 것 같다면 새로고침해 주세요.</p>
        <p>{`현재 ${text}`} : <input type="text" value={list?.toString()} unselectable  size="60" required/></p>
      </div>
      <div className={style.container}>
        <h4>{text} 추가</h4>
        <p className={style.warning}>한개씩만 추가가 가능합니다.</p>
        <p>{`추가할 ${text}`} : <input type="text" value={addCategory} onChange={onAddCategoryChange} unselectable size="60" required /></p>
        <div className={style.submitButton} onClick={onAddCategorySubmit}>적용</div>
      </div>
      <div className={style.container}>
        <h4>{text} 이름 변경</h4>
        <p className={style.warning}>한개씩만 변경이 가능합니다.</p>
        <p>{`변경할 ${text}`} : <input type="text" value={beforeCategory} onChange={onBeforeCategoryChange} unselectable size="60" required /></p>
        <p>{`변경할 ${text} 이름`} : <input type="text" value={afterCategory} onChange={onAfterCategoryChange} unselectable size="60" required /></p>
        <div className={style.submitButton} onClick={onEditCategorySubmit}>적용</div>
      </div>
      <div className={style.container}>
        <h4>{text} 순서 변경</h4>
        <p className={style.warning}>이름,이름,이름,이름 형식으로 입력해주세요</p>
        <p>{`${text} 순서`} : <input type="text" value={categoryOrder} onChange={onCategoryOrderChange} unselectable size="60" required /></p>
        <div className={style.submitButton} onClick={onCategoryOrderSubmit}>적용</div>
      </div>
      <div className={style.container}>
        <h4>{text} 삭제</h4>
        <p className={style.warning}>한개씩만 삭제가 가능합니다.</p>
        <p>{`삭제할 ${text}`} : <input type="text" value={deleteCategory} onChange={onDeleteCategoryChange} unselectable size="60" required /></p>
        <div className={style.submitButton} onClick={onDeleteCategorySubmit}>적용</div>
      </div>
      {/* <div className={style.submitButton} onClick={onSubmit}>저장</div> */}
    </div>
  )
}

export default Setting;