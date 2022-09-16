import React, {useEffect, useState} from "react"
import styles from "styles/main/shareLink.module.css"
import FileCopyIcon from '@mui/icons-material/FileCopy';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const ShareLink = (props) => {
  const [copied, setCopied] = useState(false)

  const onCopy = () => {
    props.handleCopy()
  }

  return (
    <>
      <div className={styles.main_container} >
        <h2>이 기사의 링크를 복사해 사람들에게 공유하세요</h2>
        <CopyToClipboard text={props.url} onCopy={onCopy}>
          <div>
            <input readOnly value={props.url}/>
            {/* <FileCopyIcon /> */}
          </div>
        </CopyToClipboard>
        <CopyToClipboard text={props.url} onCopy={onCopy}>
          <div className={styles.copy_container}>복사하기</div>
        </CopyToClipboard>
      </div>
    </>
  )
}
export default ShareLink