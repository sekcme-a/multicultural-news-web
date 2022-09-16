import React, { useEffect, useState } from "react"
import styles from "styles/result.module.css"
import Skeleton from '@mui/material/Skeleton';
import { useRouter } from "next/router";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import InfiniteScroll from "react-infinite-scroll-component";
import { sendRequest } from "pages/api/sendRequest";
import MiniThumbnail from "src/components/main/MiniThumbnail";

const Result = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [isFetching, setIsFetching] = useState(false)
  const [searchCount, setSearchCount] = useState(0)
  const [page, setPage] = useState(1)
  const [list, setList] = useState([])
  const [endOfPost, setEndOfPost] = useState(false)
  const router = useRouter();
  const lazyRoot = React.useRef(null)
  const { slug } = router.query

  const onTitleClick = () => {
    router.back()
  }

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      let idList = await sendRequest.fetchSearchIdList(slug, 1)
      let resultList = []
      setSearchCount(idList.resultCount)
      for (const id of idList.idList) {
        await sendRequest.fetchPostDataFromId(id.toString(), false).then((data) => {
          resultList.push(data)
          setList([...resultList])
        })
      }
      setPage(2)
      setIsLoading(false)
    }
    fetchData()
  }, [])
  
  const getMorePost = async () => {
    if (!isFetching) {
      setIsFetching(true)
      let idList = await sendRequest.fetchSearchIdList(slug, page)
      let resultList = list
      setSearchCount(idList.resultCount)
      for (const id of idList.idList) {
        await sendRequest.fetchPostDataFromId(id.toString(), false).then((data) => {
          resultList.push(data)
          setList([...resultList])
        })
      }
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
          <Skeleton animation="wave" variant="text" width="100%-10px" height={70} style={{ margin: "0 10px 0 10px" }} />
          <Skeleton animation="wave" variant="text" width="100%-10px" height={70} style={{ margin: "0 10px 0 10px" }}  />
          <Skeleton animation="wave" variant="text" width="100%-10px" height={70} style={{ margin: "0 10px 0 10px" }}  />
          <Skeleton animation="wave" variant="text" width="100%-10px" height={70} style={{ margin: "0 10px 0 10px" }}  />
          <Skeleton animation="wave" variant="text" width="100%-10px" height={70} style={{ margin: "0 10px 0 10px" }}  />
          <Skeleton animation="wave" variant="text" width="100%-10px" height={70} style={{ margin: "0 10px 0 10px" }}  />
        </div>
        :
        <>
          <div className={styles.title_container} onClick={onTitleClick}>
            <ArrowBackIosNewIcon style={{fontSize: "15px"}} />
            <p>{slug}</p>
            <p>에 대한 검색결과</p>
          </div>
          <h3 className={styles.subtitle}>{`${searchCount}개의 검색결과`}</h3>
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