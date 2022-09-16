import react, { useEffect, useState } from "react"
import styles from "styles/signin.module.css"
import { useRouter } from "next/router"
import { firestore as db } from "firebase/firebase";
import useAuth from "src/hook/auth/auth";
import { withPublic } from "src/hook/route";

import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import TextField from '@mui/material/TextField';

const FindPassword = ({auth}) => {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [error, setError] = useState(" ")
  const [isSendEmail, setIsSendEmail] = useState(false)
  const onEmailChange = (e) => { setEmail(e.target.value) }
  const { resetPassword } = useAuth()
  
  useEffect(() => {
    setError(" ")
  },[email])

  const onTitleClick = () => {
    router.back()
  }

  const onSubmitClick = async () => {
    if (email) {
      const user = await db.collection("email").doc(email).get()
      let result = ""
      if (user.exists) {
        result = await resetPassword(email)
        setIsSendEmail(true)
        if(result==="There is no user record corresponding to this identifier. The user may have been deleted."){
          setError("등록되지 않은 이메일입니다.")
        }
      } else {
        setError("등록되지 않은 이메일입니다.")
      }
    } else {
      setError("이메일을 입력해주세요.")
    }
  }

  useEffect(() => {
    setIsSendEmail(false)
  },[email, error])
  
  return (
    <div className={styles.main_container}>
      <div className={styles.title_container} onClick={onTitleClick}>
        <ArrowBackIosNewIcon style={{fontSize: "15px"}} />
        <p>비밀번호 찾기</p>
      </div>  
      <TextField
        fullWidth
        id="outlined-helperText"
        label="이메일"
        value={email}
        helperText={isSendEmail ? "": (error === " " ? "계정의 이메일을 작성해주세요. 해당 이메일로 비밀번호 재설정 메일이 전송됩니다." : error) }
        error={error!==" "}
        size="small"
        margin="normal"
        onChange={onEmailChange}
        style={{ width: "70%", marginTop: "25px" }}
      />
      {isSendEmail && <p className={styles.success_text}>비밀번호 재설정 이메일을 보냈습니다. 메일함을 확인해주세요.</p>}
      <div className={styles.submit_button} onClick={onSubmitClick}>비밀번호 재설정 메일 받기</div>
    </div>
  )
}

export default withPublic(FindPassword);