import React, {useState, useEffect} from "react"
import { withPublic } from "src/hook/route";
import styles from 'styles/login.module.css'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import Image from "next/image";
import logo from "public/logo.png"
import { GoogleLoginButton } from "react-social-login-buttons";
import { FacebookLoginButton } from "react-social-login-buttons";
import { AppleLoginButton } from "react-social-login-buttons";
import { motion } from "framer-motion";
import { useRouter } from "next/router"
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Button from '@mui/material/Button';
import FormHelperText from '@mui/material/FormHelperText';

const Login = ({auth}) => {
  const { user, loginWithGoogle, loginWithFacebook, error, resetPassword, loginWithApple,signInUserWithEmailAndPassword, setError } = auth;
  const router = useRouter()
  const [email, setEmail] = useState("")
  const onEmailChange = (e) => { setEmail(e.target.value) }
  const [password, setPassword] = useState("")
  const onPasswordChange = (e) => {setPassword(e.target.value)}
  const [values, setValues] = useState({
    password: '',
    showPassword: false,
    error: ""
  });

  useEffect(() => {
    setError("")
  },[])
  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const onBackButtonClick = () => {
    router.back()
  }
  
  const onLoginClick = () => {
    try {
      signInUserWithEmailAndPassword(email, values.password)
    } catch (e) {
        setValues({ ...values, error: e.code})
    }
  }

  const onSignInClick = () => {
    router.push("/signin")
  }

  const onFindPasswordClick = () => {
    router.push("/findpassword")
    // resetPassword(email)
  }

  const handleOnKeyPress = (e) => {
    if (e.key === "Enter") {
      onLoginClick()
    }
  }


  return (
    <div className={styles.main_container} onKeyPress={handleOnKeyPress}>
      <div className={styles.header_container}>
        <div className={styles.icon_container} onClick={onBackButtonClick}><ArrowBackIosIcon style={{fontSize: "15px"}}/></div>
          <p onClick={onBackButtonClick}>뒤로가기</p>
      </div>
      <div className={styles.content_container}>  
        <motion.h1 className={styles.main_text} initial={{ opacity: 0, y:10}} animate={{ opacity: 1, transition: { duration: 1 },y:0 }}>다양한 문화와</motion.h1>
        <motion.h2 className={styles.main_text} initial={{ opacity: 0, y:10}} animate={{ opacity: 1, transition: { duration: 1,  },y:0 }}>가치관을 담는 양방향 소통지</motion.h2>
        <motion.div className={styles.logo_container} initial={{ opacity: 0, y:10}} animate={{ opacity: 1, transition: { duration: 1, },y:0 }}>
          <Image src={logo} alt={"한국다문화뉴스 로고"} layout="fill" objectFit="cover" objectPosition="center"/>
        </motion.div>
        {/* <motion.h3 className={styles.login_text} initial={{ opacity: 0, }} animate={{ opacity: 1, transition: { duration: 1, delay: 0.5 } }}>LOGIN</motion.h3> */}
        <motion.div className={styles.login_container} initial={{ opacity: 0, y:10}} animate={{ opacity: 1, transition: { duration: 1, delay: .5},y:0 }}>
        <TextField
            fullWidth
            id="outlined-helperText"
            label="이메일"
            value={email}
            helperText={error.login}
            error={error.login !== undefined}
            size="small"
            margin="normal"
            onChange={onEmailChange}
            style={{width:"70%", marginTop: "30px"}}
          />


          
          <FormControl sx={{m:1, width: '70%'}} variant="outlined">
            <InputLabel htmlFor="outlined-adornment-password" >비밀번호</InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              type={values.showPassword ? 'text' : 'password'}
              value={values.password}
              style={{paddingTop:0, paddingBottom:0}}
              onChange={handleChange('password')}
              error={error.login!==undefined}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {values.showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
            />
            {error.login !== undefined && <FormHelperText id="component-error-text" error={error.login!==undefined}>{error.login}</FormHelperText>}
          </FormControl>
          <Button variant="outlined" sx={{m:1}} style={{
          width: "70%", fontSize: "17px",
          }} onClick={onLoginClick}>Login</Button>
          <div className={styles.find_password_container}>
            <p onClick={onFindPasswordClick}>비밀번호 찾기</p>
            <p onClick={onSignInClick}>회원가입</p>
          </div>
        </motion.div>
        {/* <motion.h4 className={styles.social_text} initial={{ opacity: 0, }} animate={{ opacity: 1, transition: { duration: 1, delay: 0.5 } }}>소셜 로그인으로 간편하게 로그인하세요!</motion.h4>
        <motion.h4 className={styles.social_text2} initial={{ opacity: 0, }} animate={{ opacity: 1, transition: { duration: 1, delay: 0.5 } }}>Log in easily with social login!</motion.h4> */}
        <motion.div className={styles.button_container} initial={{ opacity: 0, }} animate={{ opacity: 1, transition: { duration: 1, delay: 1} }}>
          <AppleLoginButton onClick={()=>loginWithApple()}><span>애플로 로그인</span></AppleLoginButton>
        </motion.div>
        <motion.div className={styles.button_container2} initial={{ opacity: 0, }} animate={{ opacity: 1, transition: { duration: 1, delay: 1} }}>
          <GoogleLoginButton onClick={()=>loginWithGoogle()}><span>구글로 로그인</span></GoogleLoginButton>
        </motion.div>
        <motion.div className={styles.button_container2} initial={{ opacity: 0, }} animate={{ opacity: 1, transition: { duration: 1, delay:1 } }}>
          <FacebookLoginButton onClick={()=>loginWithFacebook()}><span>페이스북으로 로그인</span></FacebookLoginButton>
        </motion.div>
      </div>
      {/* {error && <h1>{error}</h1>}
      <button onClick={loginWithGoogle}>Google</button>
      <button onClick={loginWithFacebook}>Facebook</button>
      <h1>{user?.uid}</h1> */}
    </div>
  )
}
export default withPublic(Login);