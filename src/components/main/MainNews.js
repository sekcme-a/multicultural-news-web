import styles from "styles/main/mainNews.module.css"
import React, { useEffect, useState } from "react"
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-cards";
import "swiper/css/pagination";
import "swiper/css/navigation";
import SwiperCore, { EffectCards, Pagination, Navigation, Autoplay } from "swiper";
import { firestore as db } from "firebase/firebase"
import Link from "next/link";
import Image from "next/image";
import { sendRequest } from "pages/api/sendRequest"
import Skeleton from '@mui/material/Skeleton';

const MainNews = () => {
  const [list, setList] = useState()
  const [isLoading, setIsLoading] = useState(true)
  SwiperCore.use([Autoplay])
  useEffect(() => {
    const fetchData = async () => {
      const idList = await sendRequest.fetchMainPostIdList("https://www.kmcn.kr/")
      // for (const id of idList) {
      //   await sendRequest.fetchPostDataFromId(id.toString(), false).then((data) => {
      //     resultList.push(data)
      //   })
      // }
      setList(idList)
      setIsLoading(false)
    }
    fetchData()
  },[])
  
  const onPostClick = () => {
    window.sessionStorage.setItem("page", 1)
    window.sessionStorage.setItem("data", null)
    window.sessionStorage.setItem("id", "home")
    window.sessionStorage.setItem("scrollPosition", 0)
  }

  if (isLoading)
    return (
      <div className={styles.swiper_slide_skeleton}>
        <div className={styles.swiper_container}>
          {/* <Skeleton animation="wave" variant="rectangular" width="100%" height={250} /> */}
          <div className={`${styles.overlay_skeleton} ${styles.overlay}`}>
            <h2><Skeleton animation="wave" variant="text" width="90%" height={20} /></h2>
            <h3><Skeleton animation="wave" variant="text" width="90%" height={20} /></h3>
            <h4><Skeleton animation="wave" variant="text" width="90%" height={20} /></h4>
          </div>
        </div>
      </div>
    )
  return (
    <div className={styles.main_container}>
      <h1>주요 뉴스</h1>
      <Swiper
        effect={"cards"}
        grabCursor={true}
        modules={[EffectCards, Pagination, Navigation]}
        className={styles.swiper}
        pagination={true}
        autoplay={{ delay: 2300, disableOnInteraction: false }}
        loop={true}
      >
        {list?.map((doc, index) => {
          return (
            <SwiperSlide className={styles.swiper_slide} key={index}>
              <Link href={`/post/${doc.id}`} >
                <div className={styles.swiper_container} onClick={onPostClick}>
                  <div className={styles.overlay}>
                    <h2>{`[${doc.category}]`}</h2>
                    <h2>{doc.title}</h2>
                    <h3>{doc.subtitle}</h3>
                    {/* <h4>{`${doc.createdAt} | ${doc.author}`}</h4> */}
                  </div>
                  <Image src={doc.thumbnailImg.includes("https:") ? doc.thumbnailImg : `https:${doc.thumbnailImg}`} alt="메인 배경 이미지" layout="fill" objectFit="cover" objectPosition="center"/>
                </div>
              </Link>
            </SwiperSlide>
          )
        })}
      </Swiper>
    </div>
  )
}
export default MainNews