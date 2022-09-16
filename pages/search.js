import React, { useEffect, useState } from "react"
import styles from "styles/search.module.css"
import { firestore as db } from "firebase/firebase"
import Link from "next/link"
import SearchIcon from '@mui/icons-material/Search';
import MiniThumbnail from "src/components/main/MiniThumbnail"
import ThumbnailPost from "src/components/main/ThumbnailPost"
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import PostList from "src/components/main/PostList";
import MiniPostList from "src/components/main/MiniPostList";
import { sendRequest } from "pages/api/sendRequest";
import Router from "next/router"

const Search = () => {
  const [input, setInput] = useState("")
  const [sendInput, setSendInput] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [categoryList, setCategoryList] = useState()
  const [localList, setLocalList] = useState()
  const [countryList, setCountryList] = useState()
  const [isSearchMode, setIsSearchMode] = useState(false)
  const [resultList, setResultList] = useState([])
  const [societyList, setSocietyList] = useState([""])
  const [cultureList, setCultureList] = useState([""])
  const [planList, setPlanList] = useState([""])
  const [searchCount, setSearchCount] = useState(0)
  const handleSearchCount = (count) => { setSearchCount(count)}
  const onInputChange = (e) => {
    setInput(e.target.value)
    if (e.target.value === "")
      setIsSearchMode(false)
  }

  useEffect(() => {
    let temp2=[]
    db.collection("local").doc("list").get().then((doc) => {
      for (let i = 0; i < doc.data().list.length; i++){
        temp2.push({ name:doc.data().list[i], id: doc.data().idList[i]})
      }
      setLocalList(temp2)
      setIsLoading(false)
    })
    let temp3=[]
    db.collection("country").doc("list").get().then((doc) => {
      for (let i = 0; i < doc.data().list.length; i++){
        temp3.push({ name:doc.data().list[i], id: doc.data().idList[i]})
      }
      setCountryList(temp3)
    })
    let temp4=[]
    db.collection("society").doc("list").get().then((doc) => {
      for (let i = 0; i < doc.data().list.length; i++){
        temp4.push({ name:doc.data().list[i], id: doc.data().idList[i]})
      }
      setSocietyList(temp4)
    })
    let temp5=[]
    db.collection("culture").doc("list").get().then((doc) => {
      for (let i = 0; i < doc.data().list.length; i++){
        temp5.push({ name:doc.data().list[i], id: doc.data().idList[i]})
      }
      setCultureList(temp5)
    })
    let temp6=[]
    db.collection("plan").doc("list").get().then((doc) => {
      for (let i = 0; i < doc.data().list.length; i++){
        temp6.push({ name:doc.data().list[i], id: doc.data().idList[i]})
      }
      setPlanList(temp6)
    })
  }, [])

  const handleOnKeyPress = (e) => {
    if (e.key === "Enter") {
      onSearchClick()
    }
  }
  const onSearchClick = async () => {
    Router.push(`/result/${input}`)
  }

  if (isLoading&&isSearchMode===false) {
    return (
      <div className={styles.skeleton_container}>
        <Skeleton animation="wave" variant="rectangular" width="100%" height={35} />
        <Skeleton animation="wave" variant="text" width={80} height={20} style={{marginTop: 10}} />
        <Skeleton animation="wave" variant="rectangular" width="100%" height={30} style={{marginTop: 10}}/>
        <Skeleton animation="wave" variant="rectangular" width="100%" height={30} style={{marginTop: 10}}/>
        <Skeleton animation="wave" variant="rectangular" width="100%" height={30} style={{marginTop: 10}}/>
        <Skeleton animation="wave" variant="rectangular" width="100%" height={30} style={{marginTop: 10}}/>
        <Skeleton animation="wave" variant="rectangular" width="100%" height={30} style={{marginTop: 10}}/>
        <Skeleton animation="wave" variant="rectangular" width="100%" height={30} style={{marginTop: 10}}/>
        <Skeleton animation="wave" variant="text" width={80} height={20} style={{marginTop: 10}} />
        <Skeleton animation="wave" variant="rectangular" width="100%" height={30} style={{marginTop: 10}}/>
        <Skeleton animation="wave" variant="rectangular" width="100%" height={30} style={{marginTop: 10}}/>
        <Skeleton animation="wave" variant="rectangular" width="100%" height={30} style={{marginTop: 10}}/>
        <Skeleton animation="wave" variant="rectangular" width="100%" height={30} style={{marginTop: 10}}/>
        <Skeleton animation="wave" variant="rectangular" width="100%" height={30} style={{marginTop: 10}}/>
        <Skeleton animation="wave" variant="rectangular" width="100%" height={30} style={{marginTop: 10}}/>

        {/* <Skeleton variant="circular" width={40} height={40} />
        <Skeleton variant="rectangular" width={210} height={118} /> */}
      </div>
    )
  }

  return (
    <div className={styles.main_container}>
      <div className={styles.search_container}>
        <SearchIcon style={{fontSize:"medium"}} />
        <input className={styles.search_input} value={input} onChange={onInputChange} onKeyPress={handleOnKeyPress} placeholder="Search" />
        <p className={styles.search_button} onClick={onSearchClick}>검색</p>
      </div>
      {isSearchMode ?
        (
          <>
            {isLoading ?
              <div className={styles.skeleton_search_container}>
                <Skeleton animation="wave" variant="text" width={80} height={20} style={{marginTop: 10}} />
                <Skeleton animation="wave" variant="rectangular" width="100%" height={170} style={{marginTop: 10}} />
                <Skeleton animation="wave" variant="text" width={250} style={{marginTop: 3}} />
                <Skeleton animation="wave" variant="text" width={220} style={{marginTop: 1}} />
                <Skeleton animation="wave" variant="text" width={220} style={{marginTop: 1}} />
                <Skeleton animation="wave" variant="text" width={220} style={{marginTop: 1}} />
                <Skeleton animation="wave" variant="rectangular" width="100%" height={260} style={{marginTop: 10}} />
                <Skeleton animation="wave" variant="text" width={250} style={{marginTop: 3}} />
                <Skeleton animation="wave" variant="text" width={220} style={{marginTop: 1}} />
                <Skeleton animation="wave" variant="text" width={220} style={{marginTop: 1}} />
                <Skeleton animation="wave" variant="text" width={220} style={{marginTop: 1}} />
              </div>
              :
              <>
                <h3 className={styles.title}>{`${searchCount}개의 검색결과`}</h3>
                <MiniPostList input={sendInput} handleSearchCount={handleSearchCount} />
              </>
            }
          </>
        ) :
        (
        <>
          <h3 className={styles.title}>모든 지역별</h3>
          <div className={styles.list_container}>
            {localList?.map((item, index) => {
              return (
                <Link key={index} href={`/local/${item.id}`} passHref >
                  <div className={`${styles.item_container} ${styles.category}`}>
                    <p>{item.name}</p>
                  </div>
                </Link>
              )
            })}
          </div>
            
          <h3 className={styles.title}>모든 언어별</h3>
          <div className={styles.list_container}>
            {countryList?.map((item, index) => {
              return (
                <Link key={index} href={`/country/${item.id}`} passHref >
                  <div className={`${styles.item_container} ${styles.category}`}>
                    <p>{item.name}</p>
                  </div>
                </Link>
              )
            })}
          </div>
            
          <h3 className={styles.title}>모든 사회별</h3>
          <div className={styles.list_container}>
            {societyList?.map((item, index) => {
              return (
                <Link key={index} href={`/society/${item.id}`} passHref >
                  <div className={`${styles.item_container} ${styles.category}`}>
                    <p>{item.name}</p>
                  </div>
                </Link>
              )
            })}
          </div>
            
          <h3 className={styles.title}>모든 문화별</h3>
          <div className={styles.list_container}>
            {cultureList?.map((item, index) => {
              return (
                <Link key={index} href={`/culture/${item.id}`} passHref >
                  <div className={`${styles.item_container} ${styles.category}`}>
                    <p>{item.name}</p>
                  </div>
                </Link>
              )
            })}
          </div>
            
          <h3 className={styles.title}>모든 기획별</h3>
          <div className={styles.list_container}>
            {planList?.map((item, index) => {
              return (
                <Link key={index} href={`/plan/${item.id}`} passHref >
                  <div className={`${styles.item_container} ${styles.category}`}>
                    <p>{item.name}</p>
                  </div>
                </Link>
              )
            })}
          </div>
          

          </>
        )}
    </div>
  )
}

export default Search