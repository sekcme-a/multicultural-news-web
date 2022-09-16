import React, { useEffect, useState } from "react"
import styles from "styles/setting/bookmark.module.css"
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import useAuth from 'src/hook/auth/auth'
import { firestore as db } from "firebase/firebase"
import MiniPostList2 from "src/components/main/MiniPostList2"
import useBookmarkLike from "src/hook/bookmarkLike";
import { useRouter } from "next/router"
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import { sendRequest } from "pages/api/sendRequest";
import Skeleton from '@mui/material/Skeleton';
const Bookmark = () => {
  const { user, userrole, logout, setUserrole } = useAuth();
  const { likeList, getLikeList, triggerReload } = useBookmarkLike()
  const [importance, setImportance] = useState(5)
  const [list, setList] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [empty, setEmpty] = useState(false)
  const router = useRouter()

  useEffect(() => {
    let temp = []
    const fetchData = async () => {
      getLikeList(user.uid)
      if (likeList.length === 0)
        setList([])
      let resultList = []
      for (let i = likeList.length-1; i >= 0; i--) {
        if (likeList[i] !== undefined) {
          await sendRequest.fetchPostDataFromId(likeList[i].toString(), false).then((data) => {
            resultList.push(data)
            setList([...resultList])
          })
        }
      }
      setIsLoading(false)
    }
    fetchData()
  }, [triggerReload])

  const onTitleClick = () => { router.back() }

  if (isLoading)
    return (
      <div>
        <Skeleton animation="wave" variant="text" width="100%-10px" height={70} style={{ margin: "0 10px 0 10px" }} />
        <Skeleton animation="wave" variant="text" width="100%-10px" height={70} style={{ margin: "0 10px 0 10px" }}  />
        <Skeleton animation="wave" variant="text" width="100%-10px" height={70} style={{ margin: "0 10px 0 10px" }}  />
        <Skeleton animation="wave" variant="text" width="100%-10px" height={70} style={{ margin: "0 10px 0 10px" }}  />
        <Skeleton animation="wave" variant="text" width="100%-10px" height={70} style={{ margin: "0 10px 0 10px" }}  />
        <Skeleton animation="wave" variant="text" width="100%-10px" height={70} style={{ margin: "0 10px 0 10px" }}  />
      </div>
    )
  if (empty) {
    return (
    <div className={styles.main_container}>
      <div className={styles.title_container} onClick={onTitleClick}>
        <ArrowBackIosNewIcon style={{fontSize: "15px"}} />
        <p>좋아요한 기사</p>
      </div>
      <div className={styles.bookmark_none_container}>
        <ThumbUpOutlinedIcon style={{ fontSize: "60px", color: "gray" }} />
        <p>아직 좋아요한 기사가 없습니다.</p>
        <p>마음에 드는 기사에 좋아요를 눌러보세요.</p>
      </div>
    </div>
    )
  }
  return (
    <div className={styles.main_container}>
      <div className={styles.title_container} onClick={onTitleClick}>
        <ArrowBackIosNewIcon style={{fontSize: "15px"}} />
        <p>좋아요한 기사</p>
      </div>
      <MiniPostList2 data={list}/>
    </div>
  )
}

export default Bookmark