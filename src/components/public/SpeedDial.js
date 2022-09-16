import React, {useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import FileCopyIcon from '@mui/icons-material/FileCopyOutlined';
import SaveIcon from '@mui/icons-material/Save';
import ShareIcon from '@mui/icons-material/Share';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import useBookmarkLike from 'src/hook/bookmarkLike';
import useAuth from 'src/hook/auth/auth';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import Alert from "src/components/public/Alert"
import { useRouter } from 'next/router';
import { firestore as db } from 'firebase/firebase';
import { Identity } from '@mui/base';


export default function ControlledOpenSpeedDial(props) {
  const [open, setOpen] = useState(false);
  const { bookmarkList, isBookmarked, deleteBookmark ,pushBookmark, likeList, isLiked, deleteLike, pushLike } = useBookmarkLike()
  const { user } = useAuth()
  const [actions, setActions] = useState([])
  const router = useRouter()
  const handleOpen = () => {
    setOpen(true);
  }
  const handleClose = () => {
    setOpen(false);
  }

  useEffect(() => {
    fetchData()
  }, [props.isBookmark, likeList.length])
  
  const fetchData = () => {
    const noBookmarkNoLike = [
    { icon: <ThumbUpOutlinedIcon />, name: 'like' },
    { icon: <BookmarkBorderIcon />, name: 'bookmark' },
    // {icon: <PictureAsPdfIcon />, name: 'pdf'},
    { icon: <ShareIcon />, name: 'share' },
    ];
    const yesBookmarkNoLike = [
      { icon: <ThumbUpOutlinedIcon />, name: 'like' },
      { icon: <BookmarkIcon style={{color: "rgb(255, 134, 154)"}} />, name: 'bookmark' },
      // {icon: <PictureAsPdfIcon />, name: 'pdf'},
      { icon: <ShareIcon />, name: 'share' },
    ]
    const noBookmarkYesLike = [
      { icon: <ThumbUpIcon style={{color: "rgb(255, 134, 154)"}} />, name: 'like' },
      { icon: <BookmarkBorderIcon />, name: 'bookmark' },
      // {icon: <PictureAsPdfIcon />, name: 'pdf'},
      { icon: <ShareIcon />, name: 'share' },
    ]
    const yesBookmarkYesLike = [
      { icon: <ThumbUpIcon style={{color: "rgb(255, 134, 154)"}} />, name: 'like' },
      { icon: <BookmarkIcon style={{color: "rgb(255, 134, 154)"}} />, name: 'bookmark' },
      // {icon: <PictureAsPdfIcon />, name: 'pdf'},
      { icon: <ShareIcon />, name: 'share' },
    ]
    if(!props.isBookmark && !isLiked(props.id))
      setActions(noBookmarkNoLike)
    else if(props.isBookmark && !isLiked(props.id))
      setActions(yesBookmarkNoLike)
    else if(!props.isBookmark && isLiked(props.id))
      setActions(noBookmarkYesLike)
    else
      setActions(yesBookmarkYesLike)
  }
  const handleClick = (name) => {
    if (name === "share") {
      if (navigator.share) {
        navigator.share({
          title: "한국다문화뉴스",
          text: props.title,
          url: `https://multicultural-news.netlify.app/post/${history[history.length-1]}`,
        })
      } else {
        props.handleShowBackdrop(true)
      }
    } else if (name === "pdf") {
      props.downloadPdf()
    } else if (name === "bookmark") {
      if (user === null) {
        props.handleAlarmText("로그인이 필요합니다.")
        props.handleAlarmMode("warning")
        props.handleIsShow(true)
        setTimeout(() => {
          props.handleIsShow(false)
        },2000)
      }
      else if (props.isBookmark) {
        deleteBookmark(user.uid, props.id)
        props.handleAlarmText("북마크가 삭제되었습니다.")
        props.handleIsBookmark(false)
        props.handleIsShow(true)
        setTimeout(() => {
          props.handleIsShow(false)
        },2000)
      }
      else{
        pushBookmark(user.uid, props.id)
        props.handleAlarmText("북마크가 추가되었습니다.")
        props.handleIsBookmark(true)
        props.handleIsShow(true)
        setTimeout(() => {
          props.handleIsShow(false)
        },2000)
      }
    } else if (name === "like") {
      if (user === null) {
        props.handleAlarmText("로그인이 필요합니다.")
        props.handleAlarmMode("warning")
        props.handleIsShow(true)
        setTimeout(() => {
          props.handleIsShow(false)
        },2000)
      }
      else if (isLiked(props.id)){
        deleteLike(user.uid, props.id)
        props.handleAlarmText("좋아요를 취소합니다.")
        try {
          db.collection("posts").doc(props.id).get().then((doc) => {
            if (doc.exists)
              db.collection("posts").doc(props.id).update({ likesCount: doc.data().likesCount - 1 })
            else
              db.collection("posts").doc(props.id).set({likesCount: 0, views: 0, bookmarkCount: 0, commentsCount: 0})
          })
        } catch (e) {
          console.log(e)
        }
        props.handleIsShow(true)
        setTimeout(() => {
          props.handleIsShow(false)
        },2000)
      }
      else{
        pushLike(user.uid, props.id)
        props.handleAlarmText("이 기사를 좋아합니다.")
        try {
          db.collection("posts").doc(props.id).get().then((doc) => {
            if (doc.exists)
              db.collection("posts").doc(props.id).update({ likesCount: doc.data().likesCount + 1 })
            else
              db.collection("posts").doc(props.id).set({likesCount: 1, views: 0, bookmarkCount: 0, commentsCount: 0})
          })
        } catch (e) {
          console.log(e)
        }
        props.handleIsShow(true)
        setTimeout(() => {
          props.handleIsShow(false)
        },2000)
      }
    }
    setOpen(false)
  }

  return (
    // <Box sx={{ height: 320, transform: 'translateZ(0px)', flexGrow: 1, zIndex: 999999999999 }}>
    <>
      <SpeedDial
        ariaLabel="SpeedDial controlled open example"
        sx={{ position: 'fixed', bottom: 70, right: 10}}
        icon={<SpeedDialIcon />}
        onClose={handleClose}
        onOpen={handleOpen}
        open={open}
        zindex="999999999999"
      >
      {actions.map((action) => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
              onClick={()=>handleClick(action.name)}
            />
      ))}
    </SpeedDial>
    {/* <Alert mode={alarmMode} isShow={alarmMode!=="hide"} text="Url이 복사되었습니다!" /> */}
    </>
    // </Box>
  );
}
