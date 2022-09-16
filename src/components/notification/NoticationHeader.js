import React from "react"
import Link from "next/link"
import styles from "styles/notification/notificationHeader.module.css"
import SettingsIcon from '@mui/icons-material/Settings';
import useAuth from "src/hook/auth/auth";
const NotificationHeader = (props) => {
  const { user } = useAuth()
  return (
    <div className={styles.header_container}>
      <Link href="/notification/ranking">
        <div className={props.loc==="alarm" ? `${styles.item_container} ${styles.selected}` :styles.item_container}>
          <p>뉴스 랭킹</p>
          <div className={styles.custom_border} />
        </div>
      </Link>
      <Link href="/notification/notification">
        <div className={props.loc==="notification" ? `${styles.item_container} ${styles.selected}` :styles.item_container}>
          <p>공지사항</p>
          <div className={styles.custom_border} />
        </div>
      </Link>
      {/* <Link href={user!==null ? "/setting/alarm" : "/login"}>
        <div className={styles.icon_container}>
          <SettingsIcon />
        </div>
      </Link> */}
    </div>
  )
}
export default NotificationHeader