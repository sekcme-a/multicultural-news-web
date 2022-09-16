import React, {useEffect, useState} from "react"
import styles from "styles/post/comments.module.css"
import { firestore as db } from "firebase/firebase"
import useAuth from "src/hook/auth/auth"
import TimeCounting from "time-counting"
import Avatar from '@mui/material/Avatar';
import CommentOutlinedIcon from '@mui/icons-material/CommentOutlined';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import Alert from "src/components/public/Alert"
import CircularProgress from '@mui/material/CircularProgress';

//props.num 불러올 댓글 수 제한. 999일때 모두 불러오기
const Comments = (props) => {
  const FIRST_LOAD_COMMENT_NUM = 3; //기본으로 표시할 댓글 수
  const MORE_COMMENT_NUM = 7; //댓글 더보기 클릭시 추가로 표시할 댓글 수
  const [lastDoc, setLastDoc] = useState()
  const [commentList, setCommentList] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [userPhoto, setUserPhoto] = useState("")
  const [input, setInput] = useState("")
  const { user, userrole } = useAuth()
  const [alarmMode, setAlarmMode] = useState("success")
  const [isShow, setIsShow] = useState(false)
  const [alarmText, setAlarmText] = useState("")
  const [triggerReload, setTriggerReload] = useState(true)
  const [isEndOfComment, setIsEndOfComment] = useState(false)
  const [isDelay, setIsDelay] = useState(false)
  const [commentsCount, setCommentsCount] = useState(0)
  
  const timeCountingOption = {
    lang: "ko",
    objectTime: new Date(),
    calculate: {
      justNow: 100
    }
  }
  useEffect(() => {
    console.log(userrole)
    const fetchData = async () => {
      setIsLoading(true)
      let tempCommentsList = []
      let count = 0;
      setCommentList([])
      setCommentsCount(0)
      if (user !== null) {
        db.collection("users").doc(user.uid).get().then((doc) => {
          setUserPhoto(doc.data().photo)
        })
      }
      const data = await db.collection("posts").doc(props.id).collection("comments")?.orderBy("createdAt", 'desc').limit(FIRST_LOAD_COMMENT_NUM).get()
      let i = 0;
      data.docs.map(async (doc) => {
        setTimeout(async() => {
          const userDoc = await db.collection("users").doc(doc.data().userId).get()
          const lvcDoc = await db.collection("posts").doc(props.id).get()
            setCommentsCount(lvcDoc.data().commentsCount)
          if (userDoc.exists) {
            tempCommentsList = [
              ...tempCommentsList,
              {
                name: userDoc.data().name,
                photo: userDoc.data().photo,
                comment: doc.data().comment,
                createdAt: TimeCounting(new Date(doc.data().createdAt.toMillis()), timeCountingOption),
                userId: doc.data().userId,
                id: doc.id,
              }
            ]
            count++
            if (count === FIRST_LOAD_COMMENT_NUM) {
              setLastDoc(doc)
            }
            setCommentList(tempCommentsList)
            console.log(tempCommentsList.length)
            setIsLoading(false)
            // if (commentsCount <= FIRST_LOAD_COMMENT_NUM)
            //   setIsEndOfComment(true)
            // else
            //   setIsEndOfComment(false)
          } else {
            //없는 댓글은 삭제하기
            await db.collection("posts").doc(props.id).collection("comments").doc(doc.id).delete()
            const lvcNow = await db.collection("posts").doc(props.id).get()
            await db.collection("posts").doc(props.id).update({commentsCount: lvcNow.data().commentsCount-1})
            setCommentsCount(lvcNow.data().commentsCount-1)
          }
          i++;
        },i*1000)
      })
      setIsLoading(false)
    }
    fetchData()
  }, [props.id, triggerReload])

  useEffect(() => {
    if (commentsCount > commentList.length)
      setIsEndOfComment(false)
    else
      setIsEndOfComment(true)
  },[commentList])
  
  const handleOnKeyPress = (e) => {
    if (e.key === "Enter") {
      addComment()
    }
  }

  const onInputChange = (e) => {
    if (e.target.value.length < 180) {
      setInput(e.target.value)
    } else {
      setAlarmMode("warning")
      setIsShow(true)
      setAlarmText("댓글 최대길이입니다.")
      setTimeout(() => {
        setIsShow(false)
      },2000)
    }
  }

  const addComment = () => {
    if (input.length < 180 && !isDelay) {
      setIsDelay(true)
      try {
        db.collection("posts").doc(props.id).collection("comments").doc().set({
          userId: user.uid,
          createdAt: new Date(),
          comment: input
        })
        db.collection("posts").doc(props.id).get().then((doc) => {
          db.collection("posts").doc(props.id).update({commentsCount: doc.data().commentsCount + 1})
        })
        setAlarmMode("success")
        setIsShow(true)
        setAlarmText("댓글이 추가되었습니다.")
        setTriggerReload(!triggerReload)
        setInput("")
        setTimeout(() => {
          setIsShow(false)
        },200)
      } catch (e) {
        setAlarmMode("error")
        setIsShow(true)
        setAlarmText("댓글 업로드 실패")
        setTimeout(() => {
          setIsShow(false)
        },2000)
      }
      setTimeout(() => {
        setIsDelay(false)
      },100)
    } else if (isDelay) {
      setAlarmMode("error")
      setIsShow(true)
      setAlarmText("댓글은 한번에 여러번 작성할 수 없습니다.\n 조금 있다가 다시 시도해주세요.")
      setTimeout(() => {
        setIsShow(false)
      },100)
    } else {
      setAlarmMode("error")
      setIsShow(true)
      setAlarmText("댓글 최대길이를 초과했습니다.")
      setTimeout(() => {
        setIsShow(false)
      },2000)
    }
  }
  const onMoreClick = async() => {
    setIsLoading(true)
    let tempCommentsList = []
    let count = 0;
    if (commentList && lastDoc) {
      console.log('asdf')
      const data = await db.collection("posts").doc(props.id).collection("comments")?.orderBy("createdAt", 'desc').startAfter(lastDoc).limit(MORE_COMMENT_NUM).get()
      data.docs.map(async (doc) => {
        const userDoc = await db.collection("users").doc(doc.data().userId).get()
        if (userDoc.exists) {
          tempCommentsList = [
            ...tempCommentsList,
            {
              name: userDoc.data().name,
              photo: userDoc.data().photo,
              comment: doc.data().comment,
              createdAt: TimeCounting(new Date(doc.data().createdAt.toMillis()), timeCountingOption),
              userId: doc.data().userId,
              id: doc.id,
            }
          ]
          count++
          if (count === MORE_COMMENT_NUM) {
            setLastDoc(doc)
          }
          if (commentList[commentList.length - 1].docId !== tempCommentsList[tempCommentsList.length - 1])
            setCommentList([...commentList, ...tempCommentsList])
          // if (tempCommentsList.length < MORE_COMMENT_NUM)
          //   setIsEndOfComment(true)
          // else
          //   setIsEndOfComment(false)
          setIsLoading(false)
        } else {
          //없는 댓글은 삭제하기
          console.log(doc.id)
          await db.collection("posts").doc(props.id).collection("comments").doc(doc.id).delete()
          try {
            await db.collection("posts").doc(props.id).update({commentsCount: commentsCount-1})
          } catch (e) {
            console.log(e)
          }
          setCommentsCount(commentsCount-1)
        }
      })
    }
  }
  
  const onDeleteClick = (id) => {
    try {
      db.collection("posts").doc(props.id).collection("comments").doc(id).delete()
      db.collection("posts").doc(props.id).get().then((doc) => {
        db.collection("posts").doc(props.id).update({commentsCount: doc.data().commentsCount -1})
        setTriggerReload(!triggerReload)
      })
      setAlarmMode("success")
      setIsShow(true)
      setAlarmText("댓글이 삭제되었습니다.")
      setTimeout(() => {
        setIsShow(false)
      },2000)
    } catch (e) {
      setAlarmMode("error")
      setIsShow(true)
      setAlarmText("댓글 삭제 실패.")
      setTimeout(() => {
        setIsShow(false)
      },2000)
    }
  }

  return (
    <div className={styles.main_container}>
      <h3>{`댓 글 ${commentsCount !== undefined ? commentsCount : ""}`}</h3>
      {commentList.length === 0 ?
        !isLoading && <p className={styles.no_comment}><CommentOutlinedIcon style={{ marginRight: "10px" }} />아직 댓글이 없습니다.</p>
        :
        <div className={commentList.length <5 ? `${styles.comment_container} ${styles.short}` : styles.comment_container}>
          {commentList.map((data, index) => {
            return (
              <div className={styles.item_container} key={index}>
                <Avatar alt="프로필" src={data.photo} className={styles.photo} style={{width: 35, height: 35 }} />
                <div className={styles.content_container}>
                  <div className={styles.info_container}>
                    <p className={styles.name}>{data.name}</p>
                    <p className={styles.created_at}>{data.createdAt}</p>
                    {userrole !== null && userrole!==undefined &&  (user?.uid === data.userId || userrole[0] === "admin") && <p className={styles.delete} onClick={()=>onDeleteClick(data.id)}>삭제</p>}
                  </div>
                  <p>{data.comment}</p>
                </div>
              </div>
            )
          })}
          {isLoading ? <CircularProgress size={20} /> : !isEndOfComment && <div className={styles.more_button} onClick={onMoreClick}>더보기</div>}
        </div>
      }
      {user === null ?
        <div className={styles.add_comment_container}>
          <Avatar style={{ marginLeft: "15px", width: 35, height: 35 }}>N</Avatar>
          <input className={styles.search_input} value="로그인이 필요합니다." disabled/>
          <SendOutlinedIcon style={{zIndex: 100, transform: "rotate(315deg)", color: "rgb(170, 170, 170)", marginBottom: "7px"}} />
        </div> 
      :
        <div className={styles.add_comment_container}>
          <Avatar alt="프로필" src={userPhoto} style={{ marginLeft: "15px", width: 35, height: 35 }} />
          <input className={styles.search_input} value={input} onChange={onInputChange} onKeyPress={handleOnKeyPress}
            placeholder="댓글 작성" />
          <SendOutlinedIcon style={{zIndex: 100, transform: "rotate(315deg)", color: "rgb(135, 135, 135)", marginBottom: "7px"}} onClick={addComment} />
        </div> 
      }
      <Alert mode={alarmMode} isShow={isShow} text={alarmText} />
    </div>
  )
}
export default Comments