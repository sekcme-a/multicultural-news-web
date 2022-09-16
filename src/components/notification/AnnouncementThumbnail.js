import React, { useState, useEffect } from "react"
import styles from "styles/notification/announcementThumbnail.module.css"
import { useRouter } from "next/router"
import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined';

const AnnouncementThumbnail = (props) => {
  const router = useRouter()
  const onClick = () => {
    router.push(`/notification/announcement/${props.data.id}`)
  }

  return (
    <div className={styles.main_container} onClick={onClick}>
      <div className={styles.icon_container}>
        <CampaignOutlinedIcon style={{fontSize: "30px"}} />
      </div>
      <div className={styles.content_container}>
        <div className={styles.title_container}>
          <p>{props.data.title}</p>
        </div>
        <div className={styles.author_container}>
          <p>{`${props.data.createdAt} | ${props.data.author}`}</p>
        </div>
      </div>
    </div>
  )
}

export default AnnouncementThumbnail