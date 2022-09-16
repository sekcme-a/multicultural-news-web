
import React, {useEffect, useState} from "react"
import { withProtected, withPublic } from "src/hook/route";
import styles from "styles/setting/setting.module.css"
import { firestore as db } from "firebase/firebase";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useRouter } from "next/router";
import Image from "next/image"
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import Link from "next/link";
import useBookmarkLike from "src/hook/bookmarkLike";
const Setting = ({auth}) => {
  const { user, logout,setToken, token } = auth;
  const [name, setName] = useState()
  const [photo, setPhoto] = useState()
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { getBookmarkList, getLikeList } = useBookmarkLike()
  useEffect(() => {
    const fetchData = async () => {
      if (user?.uid) {
        db.collection("users").doc(user.uid).get().then((doc) => {
          if (doc.exists) {
            setName(doc.data().name)
            setPhoto(doc.data().photo)
            setIsLoading(false)
          }
        })
      }
    }
    fetchData()
  }, [user])
  useEffect(() => {
    if (user !== null) {
    getBookmarkList(user.uid)
    getLikeList(user.uid)
    }
  },[user])
  const onTitleClick = () => {
    router.back()
  }
  useEffect(() => {
    if (user !== null) {
      db.collection("users").doc(user.uid).get().then((doc) => {
        if (doc.data().token === undefined) {
          console.log(window)
          console.log(user.providerId)
          if(window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify("sendToken"))
          } else {
            console.log("not mobile")
          }
        }
      })
    }
  }, [])
  
  useEffect(() => {
    document.addEventListener('message', ({data}) => {
      setToken(data)
      db.collection("users").doc(user.uid).update({token: data})
    })
  }, [])

  if(isLoading)
    return <></>
  return (
    <div className={styles.main_container}>
      <div className={styles.title_container} onClick={onTitleClick}>
        <ArrowBackIosNewIcon style={{fontSize: "15px"}} />
        <p>계정</p>
      </div>
      <Link href="/setting/profile">
        <div className={styles.item_container}>
          <div className={styles.img_container}>
            <Image src={photo} alt={"유저이미지"} placeholder="blur" blurDataURL="/public/placeholder.png" layout="fill" objectFit="cover" objectPosition="center" priority />
          </div>
          <div className={styles.text_container}>
            <p className={styles.name}>{name}</p>
            <p className={styles.info}>공개 프로필 및 정보를 편집합니다.</p>
          </div>
        </div>
      </Link>
      <div className={styles.custom_border} />
      {/* <Link href="/setting/alarm">
        <div className={styles.item_container}>
          <div className={styles.icon_container}>
            <NotificationsNoneIcon />
          </div>
          <div className={styles.text_container}>
            <p className={styles.name}>알림</p>
            <p className={styles.info}>알림 유무와 빈도수를 설정합니다.</p>
          </div>
        </div>
      </Link> */}
      <Link href="/setting/bookmark">
        <div className={styles.item_container}>
          <div className={styles.icon_container}>
            <BookmarkBorderIcon />
          </div>
          <div className={styles.text_container}>
            <p className={styles.name}>북마크</p>
            <p className={styles.info}>내가 저장한 기사.</p>
          </div>
        </div>
      </Link>
      <Link href="/setting/like">
        <div className={styles.item_container}>
          <div className={styles.icon_container}>
            <ThumbUpOutlinedIcon />
          </div>
          <div className={styles.text_container}>
            <p className={styles.name}>좋아요</p>
            <p className={styles.info}>내가 좋아요를 누른 기사.</p>
          </div>
        </div>
      </Link>
      <div className={styles.custom_border} />
      {user.providerData[0].providerId === "password" && 
        <Link href="/setting/changepassword">
          <p className={styles.item_container}>
            비밀번호 변경
          </p>
        </Link>
      }
      <Link href="/setting/appinfo">
        <p className={styles.item_container}>
          앱 정보
        </p>
      </Link>
      <Link href="/setting/help">
        <p className={styles.item_container}>
          도움말
        </p>
      </Link>
      <Link href="/login">
        <p className={styles.item_container} onClick={logout}>
          로그아웃
        </p>
      </Link>
    </div>
  )
}
export default withProtected(Setting);