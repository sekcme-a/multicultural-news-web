import React from "react"
import Alert from '@mui/material/Alert';
import styles from "styles/public/alert.module.css"


/**?
 <Alert mode="success" text="알림문구" isShow=boolean값 />


   setTimeout(() => {
      setIsShow(false)
    },3000)
    이런식으로 통제
 */
const AlertComponent = (props) => {
  return (
      <div className={props.isShow ? styles.alert_container : `${styles.alert_container} ${styles.alert_hide}`}>
        <Alert severity={props.mode === "success" || props.mode==="error" ||props.mode==="info"||props.mode==="warning" ? props.mode : "success"} >{props.text}</Alert>
      </div>
  )
}

export default AlertComponent