import React, { useEffect, useState } from "react"
import { firestore as db } from "firebase/firebase"
import style from "styles/admin/container.module.css"

const Crawling = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [input, setInput] = useState("")
  const [localList, setLocalList] = useState([])
  const [countryList, setCountryList] = useState([])
  const [societyList, setSocietyList] = useState([])
  const [cultureList, setCultureList] = useState([])
  const [planList, setPlanList] = useState([])


  useEffect(() => {
    const fetchData = async () => {
      const doc = await db.collection("crawl").doc("data").get()
      let data = ""
      if (doc.exists) {
        for (let i = 0; i < doc.data().nameList.length; i++) {
          if(doc.data().addressList)
            data = `${data}${doc.data().nameList[i]}===${doc.data().addressList[i]}\n`
          else
            data = `${data}${doc.data().nameList[i]}\n`
        }
        setInput(data)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
   const fetchData = async () => {
      // setValues({...values, localList: []})
      let tempList = ""
      const doc = await db.collection("local").doc("list").get()
      if (doc.exists) {
        for (let i = 0; i < doc.data().list.length; i++){
          tempList = `${tempList}${doc.data().list[i]} : ${doc.data().idList[i]}\n`
        }
        setLocalList(tempList)
      }
      
      // setValues({...values, countryList: []})
      let tempList2 = ""
      const doc2 = await db.collection("country").doc("list").get()
      if (doc2.exists) {
        for (let i = 0; i < doc2.data().list.length; i++){
          tempList2 = `${tempList2}${doc2.data().list[i]} : ${doc2.data().idList[i]}\n`
        }
        setCountryList(tempList2)
      }

      // setValues({...values, societyList: []})
      let tempList3 = ""
      const doc3 = await db.collection("society").doc("list").get()
      if (doc3.exists) {
        for (let i = 0; i < doc3.data().list.length; i++){
          tempList3 = `${tempList3}${doc3.data().list[i]} : ${doc3.data().idList[i]}\n`
        }
        setSocietyList(tempList3)
      }

      // setValues({...values, cultureList: []})
      let tempList4 = ""
      const doc4 = await db.collection("culture").doc("list").get()
      if (doc4.exists) {
        for (let i = 0; i < doc4.data().list.length; i++){
          tempList4 = `${tempList4}${doc4.data().list[i]} : ${doc4.data().idList[i]}\n`
        }
        setCultureList(tempList4)
      }

      // setValues({...values, planList: []})
      let tempList5 = ""
      const doc5 = await db.collection("plan").doc("list").get()
      if (doc5.exists) {
        for (let i = 0; i < doc5.data().list.length; i++){
          tempList5 = `${tempList5}${doc5.data().list[i]} : ${doc5.data().idList[i]}\n`
        }
        setPlanList(tempList5)
      }
      setIsLoading(false)
    }
    fetchData()
  }, [])

  

  const onInputChange = (e) => {
    setInput(e.target.value)
  }

  const onSaveclick = () => {
    const temp = input.split("\n")
    let nameList = []
    let addressList = []
    temp.forEach((item) => {
      const temp2 = item.split("===")
      db.collection("crawl").doc(temp2[0]).set({address: temp2[1]})
      nameList.push(temp2[0])
      addressList.push(temp2[1])
    })
    try {
      db.collection("crawl").doc("data").set({ nameList: nameList, addressList: addressList })
      alert("저장성공")
    } catch (e) {
      alert(e.message)
    }
  }
  
  return (
    <div className={style.mainContainer}>

      <div className={style.container}>
        <h4>지역별 id 리스트</h4>
        <p>id 리스트 : <textarea type="text" value={localList} cols="100" rows="10" /></p>
      </div>
      <div className={style.container}>
        <h4>국가별 id 리스트</h4>
        <p>id 리스트 : <textarea type="text" value={countryList} cols="100" rows="10" /></p>
      </div>
      <div className={style.container}>
        <h4>사회 id 리스트</h4>
        <p>id 리스트 : <textarea type="text" value={societyList} cols="100" rows="10" /></p>
      </div>
      <div className={style.container}>
        <h4>문화 id 리스트</h4>
        <p>id 리스트 : <textarea type="text" value={cultureList} cols="100" rows="10" /></p>
      </div>
      <div className={style.container}>
        <h4>기획 id 리스트</h4>
        <p>id 리스트 : <textarea type="text" value={planList} cols="100" rows="10" /></p>
      </div>


      <div className={style.container}>
        <h4>크롤링 리스트</h4>
        <p>리스트 : <textarea type="text" value={input} cols="100" rows="10" onChange={onInputChange} /></p>
      </div>
      <div className={style.submitButton} onClick={onSaveclick}>
        데이터 저장
      </div>
    </div>
  )
}

export default Crawling