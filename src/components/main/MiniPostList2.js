import React, {useEffect} from "react"
import styles from "styles/main/postList.module.css"
import MiniThumbnail from "src/components/main/MiniThumbnail"
import { useRouter } from "next/router"

const MiniPostList = (props) => {
  const lazyRoot = React.useRef(null)
  const router = useRouter()


  return (
    <div className={styles.main_container}>
      {props.data?.map((doc, index) => {
        return (
          <MiniThumbnail data={doc} key={index} lazyRoot={lazyRoot} />
        )
      })}
    </div>
  )
}
export default MiniPostList