import React, { useState, useEffect } from "react"
import styles from "styles/main/thumbnailPost.module.css"
// import Image from "next/image";
import Image from "hook/Image"
import Link from "next/link"
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer"
import useBookmarkLike from 'src/hook/bookmarkLike';
import useAuth from 'src/hook/auth/auth';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Backdrop from '@mui/material/Backdrop';
import ShareLink from "components/public/ShareLink"
import { useRouter } from "next/router"
import { firestore as db } from "firebase/firebase";
import Alert from "src/components/public/Alert"
import { Skeleton } from "@mui/material";
const ThumbnailPost = (props) => {
  const [randomNumber, setRandomNumber] = useState()
  const [id, setId] = useState("")
  // const [isOpenThisPost, setIsOpenThisPost] = useState()
  const { getLikeList, getBookmarkList, isBookmarked, deleteBookmark, pushBookmark, isLiked, deleteLike, pushLike } = useBookmarkLike()
  const [isTimeOut, setIsTimeOut] = useState(false)
  const [isShow, setIsShow] = useState(false)
  const [alarmText, setAlarmText] = useState("")
  const [showBackdrop, setShowBackdrop] = useState(false)
  const [alarmMode, setAlarmMode] = useState("success")
  const router = useRouter()
  
  const { user } = useAuth()
  // useEffect(() => {
  //   //Random number from 0~8 (int)
  //   setRandomNumber(Math.floor(Math.random() * 9))
  // }, [])
  useEffect(() => {
    if(props.data)
      setId(props.data.id)
    if (user !== null) {
      getLikeList(user.uid)
      getBookmarkList(user.uid)
    }
  }, [props.data])

  const onBookmarkClick = () => {
    if (user === null) {
      setAlarmText("???????????? ???????????????.")
      setAlarmMode("warning")
      setIsShow(true)
      setTimeout(() => {
        setIsShow(false)
      },2000)
    }
    else if (!isTimeOut) {
      if (isBookmarked(id)) {
        deleteBookmark(user.uid, id)
        setAlarmMode("success")
        setAlarmText("???????????? ?????????????????????.")
        setIsShow(true)
        setTimeout(() => {
          setIsShow(false)
        }, 2000)
      }
      else {
        pushBookmark(user.uid, id)
        setAlarmText("???????????? ?????????????????????.")
        setAlarmMode("success")
        setIsShow(true)
        setTimeout(() => {
          setIsShow(false)
        }, 2000)
      }
      setIsTimeOut(true)
      setTimeout(()=>{setIsTimeOut(false)},1000)
    }
  }
  const onLikeClick = () => {
    if (user === null) {
      setAlarmText("???????????? ???????????????.")
      setAlarmMode("warning")
      setIsShow(true)
      setTimeout(() => {
        setIsShow(false)
      },2000)
    }
    else if (!isTimeOut) {
      if (isLiked(id)) {
        deleteLike(user.uid, id)
        setAlarmText("???????????? ???????????????.")
        setAlarmMode("success")
        try {
          db.collection("posts").doc(id).get().then((doc) => {
            if (doc.exists)
              db.collection("posts").doc(id).update({ likesCount: doc.data().likesCount - 1 })
            else 
              db.collection("posts").doc(id).set({ likesCount: 0, views: 0, bookmarkCount: 0, commentsCount: 0 })
          })
        } catch (e) {
          console.log(e)
        }
        setIsShow(true)
        setTimeout(() => {
          setIsShow(false)
        }, 2000)
      }
      else {
        pushLike(user.uid, id)
        console.log(user.uid)
        console.log(id)
        setAlarmText("??? ????????? ???????????????.")
        setAlarmMode("success")
        setIsShow(true)
        try {
          db.collection("posts").doc(id).get().then((doc) => {
            if (doc.exists)
              db.collection("posts").doc(id).update({ likesCount: doc.data().likesCount + 1 })
            else 
              db.collection("posts").doc(id).set({ likesCount: 0, views: 0,  commentsCount: 0 })
          })
        } catch (e) {
          console.log(e)
        }
        setTimeout(() => {
          setIsShow(false)
        }, 2000)
      }
      setIsTimeOut(true)
      setTimeout(()=>{setIsTimeOut(false)},1000)
    }
  }

  const onShareClick = () => {
    if (navigator.share) {
    navigator.share({
      title: "?????????????????????",
      text: props.title,
      url: `https://multicultural-news.netlify.app/post/${id}`,
    })
  } else {
    setShowBackdrop(true)
  }
  }
  const handleCloseBackDrop = () => {
    setShowBackdrop(false)
  }
  const handleCopy = () => {
    setIsShow(true)
    setAlarmText("Url??? ?????????????????????!")
    setTimeout(() => {
      setIsShow(false)
    },2000)
  }

  if(props.data===undefined)
    return (
    <></>
  )

  return (
    <div className={styles.main_container}>
      <Card sx={{ width: "100%", maxWidth: 500, marginTop: "20px", marginLeft:'10px', marginRight:"10px" }}>
        <CardHeader
          title={props.isLoading ? <Skeleton animation="wave" height={25} width="80%" />: props.data?.title}
          subheader={props.isLoading ? <Skeleton animation="wave" height={15} width="100%" /> : `${props.data?.info}`}
          onClick={()=>props.onPostClick(id)}
        />
        {props.isLoading ?
          <Skeleton sx={{ height: 190 }} animation="wave" variant="rectangular" />
          :
          <CardMedia
            component="img"
            height="194"
            image={props.data?.thumbnailImg.replace("http://","https://")}
            alt={props.data.title}
            onClick={()=>props.onPostClick(id)}
          />
        }
        {props.isLoading ? 
          <CardContent style={{ padding: "8px" }}>
            <Skeleton animation="wave" height={10} style={{ marginBottom: 6 }} />
            <Skeleton animation="wave" height={10} width="80%" style={{ marginBottom: 6 }} />
            <Skeleton animation="wave" height={10} width="80%" />
          </CardContent>
          :
          <CardContent style={{ padding: "8px" }} onClick={()=>props.onPostClick(id)}>
            <Typography variant="body2" color="#3f729b">
              {props.data.tag}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {`${props.data.subtitle ==="..." ? props.data.title : props.data.subtitle}`}
            </Typography>
          </CardContent>
        }

        <CardActions disableSpacing>
          <IconButton aria-label="bookmark" onClick={onBookmarkClick}>
            {
              props.isLoading ? 
                <Skeleton animation="wave" height={32} width="20px" />
              :
                isBookmarked(id) ?
                  <BookmarkBorderIcon style={{ color: "rgb(255, 134, 154)" }} />
                :
                  <BookmarkBorderIcon />
            }
          </IconButton>
          <IconButton aria-label="like" onClick={onLikeClick}>
            {
              props.isLoading ? 
                <Skeleton animation="wave" height={32} width="20px" />
              :
                isLiked(id) ?
                  <ThumbUpOffAltIcon style={{ color: "rgb(255, 134, 154)" }} />
                :
                  <ThumbUpOffAltIcon />
            }
          </IconButton>
          {props.isLoading ? 
            <Skeleton animation="wave" height={32} width="20px" style={{ marginLeft: "8px" }} />
            :
            <IconButton aria-label="share" onClick={onShareClick}>
              <ShareIcon />
            </IconButton>
          }
        </CardActions>
      </Card>
      <Alert mode={alarmMode} isShow={isShow} text={alarmText} />
      <Backdrop open={showBackdrop} onClick={handleCloseBackDrop} sx={{ color: '#fff', zIndex: 1000, }}>
        <ShareLink url={`https://multicultural-news.netlify.app/post/${id}`} handleCopy={handleCopy} />
      </Backdrop>
    </div>
  )
}
export default ThumbnailPost
