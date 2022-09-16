import React, { useEffect, useState } from "react"
import styles from "styles/result.module.css"
import Skeleton from '@mui/material/Skeleton';
import { useRouter } from "next/router";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import InfiniteScroll from "react-infinite-scroll-component";
import { sendRequest } from "pages/api/sendRequest";
import MiniThumbnail from "src/components/main/MiniThumbnail";
import NotificationHeader from "src/components/notification/NoticationHeader";

const Result = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [isFetching, setIsFetching] = useState(false)
  const [page, setPage] = useState(1)
  const [list, setList] = useState([])
  const [endOfPost, setEndOfPost] = useState(false)
  const router = useRouter();
  const lazyRoot = React.useRef(null)
  const { slug } = router.query


  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      let idList = await sendRequest.fetchPostIdList("https://www.kmcn.kr/news/best_list_all.html?lay_no=2596",1)
      let resultList = []
      setList(idList)
      setPage(2)
      setIsLoading(false)
    }
    fetchData()
  }, [])
  
  const getMorePost = async () => {
    if (!isFetching) {
      setIsFetching(true)
      let idList = await sendRequest.fetchPostIdList("https://www.kmcn.kr/news/best_list_all.html?lay_no=2596", page)
      console.log(idList)
      let resultList = list
      // for (const id of idList) {
      //   await sendRequest.fetchPostDataFromId(id.toString(), false).then((data) => {
      //     resultList.push(data)
      //     setList([...resultList])
      //   })
      // }
      setList([...list, ...idList])
      setPage(page + 1)
      setIsFetching(false)
    }
  }

  const onPostClick = () => {

  }

  const refreshPage = () => {
    location.reload()
  }
  return (
    <div className={styles.main_container}>
      {isLoading ?
        <div>
          <NotificationHeader loc="alarm" />
          <Skeleton animation="wave" variant="text" width="100%-10px" height={70} style={{ margin: "0 10px 0 10px" }} />
          <Skeleton animation="wave" variant="text" width="100%-10px" height={70} style={{ margin: "0 10px 0 10px" }}  />
          <Skeleton animation="wave" variant="text" width="100%-10px" height={70} style={{ margin: "0 10px 0 10px" }}  />
          <Skeleton animation="wave" variant="text" width="100%-10px" height={70} style={{ margin: "0 10px 0 10px" }}  />
          <Skeleton animation="wave" variant="text" width="100%-10px" height={70} style={{ margin: "0 10px 0 10px" }}  />
          <Skeleton animation="wave" variant="text" width="100%-10px" height={70} style={{ margin: "0 10px 0 10px" }}  />
        </div>
        :
        <>
          <NotificationHeader loc="alarm" />
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
                  <MiniThumbnail data={doc} lazyRoot={lazyRoot} onPostClick={onPostClick} />
                  </div>
                )
              })
            }
            {list.length < 2 && <div style={{height:"200px"}}></div>}
          </InfiniteScroll>
        </>
      }
    </div>
  )
}

export default Result