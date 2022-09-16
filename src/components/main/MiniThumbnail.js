import React, { useEffect, useState } from "react"
import Image from "hook/Image"
import styles from "styles/main/miniThumbnail.module.css"
import { useRouter } from "next/router"

const MiniThumbnail = (props) => {
  const router = useRouter()

  const onThumbnailClick = () => {
    router.push(`/post/${props.data.id}`)
  }

  return (
    <div className={styles.main_container} onClick={onThumbnailClick}>
      <div className={styles.content_container}>
        <h2>{`[${props.data.category}]`}</h2>
        <h3>{props.data.title}</h3>
        <h4>{props.data.tag}</h4>
        <h5>{props.data.author}</h5>
      </div>
      <div className={styles.img_container}>
        <Image src={props.data.thumbnailImg.includes("https:") ? props.data.thumbnailImg : `https:${props.data.thumbnailImg}`} quality={50} alt={props.data.title} placeholder="blur" blurDataURL="/public/placeholder.png" layout="fill" objectFit="cover" objectPosition="center" priority={true} />
      </div>
    </div>
  )
}
export default MiniThumbnail