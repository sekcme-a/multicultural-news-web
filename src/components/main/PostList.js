import React, { useEffect, useState, useRef } from "react"
import { useRouter } from "next/router"
import styles from "styles/main/postList.module.css"
import { firestore as db } from "firebase/firebase"
import ThumbnailPost from "src/components/main/ThumbnailPost"
import CircularProgress from '@mui/material/CircularProgress';
import InfiniteScroll from "react-infinite-scroll-component"
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';

import { sendRequest } from "pages/api/sendRequest"




const PostList = (props) => {
  const [list, setList] = useState([])
  const [lastDoc, setLastDoc] = useState()
  const [endOfPost, setEndOfPost] = useState(false)
  const [scrollY, setScrollY] = useState()
  const [page, setPage] = useState(1)

  //데이터 가져오는중에 중복 데이터 불러오기방지
  const [isFetching, setIsFetching] = useState(false)

  const [isLoading, setIsLoading] = useState(true)

  const [hasPrevData, setHasPrevData] = useState(true)
  
  const [address, setAddress] = useState("")
  const router = useRouter()
  const fetchCountInOneLoad = 6
  const lazyRoot = React.useRef(null)

  //scroll Y 포지션
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  
  /* 필요한 설정
  1. props.id 가 바뀌거나 새로고침 시 모든 데이터 새로고침
  2. post로 이동할 시 데이터 세션에 저장
  3. post에서 돌아올때 세션에 있는 데이터 덮기
  */

  useEffect(() => {
    const isReload = () => {
      console.log("reload")
      window.sessionStorage.setItem("page", 1)
      window.sessionStorage.setItem("data", null)
      window.sessionStorage.setItem("id", null)
      window.sessionStorage.setItem("scrollPosition", 0)
      setPage(1)
      setList([])
      setHasPrevData(false)
      setEndOfPost(false)
    }
    window.addEventListener("beforeunload", isReload);
    return () => {
      window.removeEventListener("beforeunload", isReload);
    };
  }, []);

  //post로 이동할 시 데이터 세션에 저장.
  const onPostClick = (id) => {
    try {
      db.collection("posts").doc(id).get().then((doc) => {
        if (!doc.exists)
          db.collection("posts").doc(id).set({ likesCount: 0, views: 0, commentsCount: 0 })
      })
    } catch (e) {
      console.log(e)
    }
    if (window) {
      console.log(page)
      window.sessionStorage.setItem("page", page)
      window.sessionStorage.setItem("id",props.id)
      window.sessionStorage.setItem("scrollPosition", scrollY)
      window.sessionStorage.setItem("data",JSON.stringify(list))
    }
    router.push(`/post/${id}`)
  }

  //post가 1개라도 들어오면 로딩해제
  useEffect(() => {
    if (list.length === 0)
      setIsLoading(true)
    else if (isLoading) {
      setIsLoading(false)
    }
  },[list]) 

  //post 에서 돌아올 때 세션에 있는 데이터 덮기
  useEffect(() => {
    if (window) {
      setIsLoading(true)
      const num = window.sessionStorage.getItem("page")
      if(num==="1")
        setPage(2)
      else if(num && num!=="null" && num!==0)
        setPage(parseInt(num))
      const prevData = window.sessionStorage.getItem("data")
      console.log(prevData)
      // console.log(`p: ${JSON.parse(prevData)}`)
      if (prevData && prevData !== "null") {
        try {
          console.log("here")
          setList(JSON.parse(prevData))
        } catch (e) {
          setList([])
          setHasPrevData(false)
        }
      } else
        setHasPrevData(false)
      setTimeout(() => {
      window.scrollTo(0, window.sessionStorage.getItem("scrollPosition"));
      console.log(window.sessionStorage.getItem("scrollPosition"))
      },300)
    }
  }, [])


  //props.id가 바꼈다면 모든 데이터 새로고침 + page1
  useEffect(() => {
    const fetchData = async () => {
      setIsFetching(true)
      setIsLoading(true)
      const doc = await db.collection("crawl").doc(props.id).get()
      if (doc.exists) {
        setAddress(doc.data().address)
        window.sessionStorage.setItem("address", doc.data().address)
        window.sessionStorage.setItem("data", doc.data().address)
        let idList = await sendRequest.fetchPostIdList(doc.data().address, 1)
        let resultList = []

        for (const id of idList) {
          if (props.id === window.sessionStorage.getItem("id")) {
            await sendRequest.fetchPostDataFromId(id.toString(), false).then((data) => {
              resultList.push(data)
              setList([...resultList])
            })
          } else
            break;
        }

        // sendRequest.fetchPostDataFromId(2380, false)


        // setList(resultList)
        setPage(2)
        setIsFetching(false)
        setIsLoading(false)
      } else {
        setList([])
      }
    }
    if (props.id !== window.sessionStorage.getItem("id")) {
      console.log("idChanged")
      window.sessionStorage.setItem("page", 1)
      window.sessionStorage.setItem("data", null)
      window.sessionStorage.setItem("id", props.id)
      window.sessionStorage.setItem("scrollPosition", 0)
      setPage(1)
      setList([])
      setHasPrevData(false)
      setEndOfPost(false)
      fetchData()
    } 
    else if(window.sessionStorage.getItem("scrollPosition")==="0")
      fetchData()
    console.log(`asdf${typeof(window.sessionStorage.getItem("scrollPosition"))}`)
  }, [props.id])
  

  const getMorePost = async () => {
    if (!isFetching) {
      console.log(`fetching${page}`)  //235
      setIsFetching(true)
      const fetchingId = props.id
      let idList = await sendRequest.fetchPostIdList(window.sessionStorage.getItem("address"), page)
      if (idList === undefined)
        return;
      if (idList.length===0) {
        setEndOfPost(true)
        return;
      }
      let resultList = list
      // const prevList = list
      // setList([...list, ...list])
      setPage(page + 1)
      console.log(idList)
      for (const id of idList) {
        if (window.sessionStorage.getItem("data") !== "null") {
          await sendRequest.fetchPostDataFromId(id.toString(), false).then((data) => {
            resultList.push(data)
            setList([...resultList])
          })
        } else
          break;
      }
      setIsFetching(false)
    } else
      console.log("fetching")
  }



  const refreshPage = () => {
    location.reload()
  }

  if (!props.id)
    return (<></>)
  if(isLoading)
    return(<h4 className={styles.loading_post}>loading</h4>)
  return (
    <div className={props.addMargin===true? `${styles.main_container} ${styles.add_margin}`:styles.main_container} ref={lazyRoot} >
      {props.id === "main" && <h1 className={styles.title}>실시간 뉴스</h1>}
      {list.length === 0 ?
        <div className={styles.no_post_container}>
          <HistoryEduIcon style={{fontSize:"40px", color:"rgb(120,120,120)"}} />
          <h4>아직 기사가 없습니다.</h4>
        </div>
        :
      <InfiniteScroll
        dataLength={list.length}
        next={getMorePost}
        hasMore={!endOfPost}
        // loader={<CircularProgress size={20} />}
        loader={<h4 className={styles.loading_post}>loading</h4>}
        endMessage={<div className={styles.end_of_post}>마지막 기사입니다.</div>}

        refreshFunction={refreshPage}
        pullDownToRefresh
        pullDownToRefreshThreshold={300}
        pullDownToRefreshContent={
          <h3 style={{ textAlign: 'center' }}>&#8595; 내려서 새로고침</h3>
        }
        releaseToRefreshContent={
          <h3 style={{ textAlign: 'center' }}>&#8593; 놓아서 새로고침</h3>
        }
      >
        {list?.map((doc, index) => {
          return (
              <div key={index}>
              <ThumbnailPost data={doc} lazyRoot={lazyRoot} onPostClick={onPostClick} />
              </div>
            )
          })
        }
        {list.length < 2 && <div style={{height:"200px"}}></div>}
      </InfiniteScroll>
      }
    </div>
  )
}
export default PostList