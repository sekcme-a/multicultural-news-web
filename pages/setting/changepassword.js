import react, { useEffect, useState } from "react"
import styles from "styles/setting/changepassword.module.css"
import { useRouter } from "next/router"
import { firestore as db } from "firebase/firebase";
import useAuth from "src/hook/auth/auth";
import { withProtected, withPublic } from "src/hook/route";


import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import FormHelperText from '@mui/material/FormHelperText';
import Checkbox from '@mui/material/Checkbox';

const FindPassword = ({ auth }) => {
  const router = useRouter()
  const { user, error,setError, updatePassword } = useAuth()
  const [values, setValues] = useState({
    password: '',
    NewPassword: '',
    comfirmNewPassword: '',
    showPassword: false,
    showNewPassword: false,
    showConfirmNewPassword: false,
  });

  const onValuesChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const onTitleClick = () => {
    router.back()
  }

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  
  
  const handleClickShowNewPassword = () => {
    setValues({
      ...values,
      showNewPassword: !values.showNewPassword,
    });
  };
  const handleMouseDownNewPassword = (event) => {
    event.preventDefault();
  };

  
  const handleClickShowConfirmNewPassword = () => {
    setValues({
      ...values,
      showConfirmNewPassword: !values.showConfirmNewPassword,
    });
  };
  const handleMouseDownConfirmNewPassword = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    setError("")
  },[])


  const onSubmitClick = () => {
    // if (values.newPassword !== values.confirmNewPassword) {
    //   setError({"changepassword" : "재확인 비밀번호가 다릅니다."})
    // } else {
      updatePassword(values.newPassword, values.confirmNewPassword)
    // }
  }

  
  return (
    <div className={styles.main_container}>
      <div className={styles.title_container} onClick={onTitleClick}>
        <ArrowBackIosNewIcon style={{fontSize: "15px"}} />
        <p>비밀번호 변경</p>
      </div>  
      <div className={styles.content_container}>
        {/* <FormControl sx={{m:1, width: '70%'}} variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password" style={{backgroundColor:"white", paddingRight:"2px"}} >현재 비밀번호</InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            type={values.showPassword ? 'text' : 'password'}
            value={values.password}
            style={{paddingTop:0, paddingBottom:0}}
            onChange={onValuesChange('password')}
            error={error.changepassword==="비밀번호를 입력해주세요." || error.changepassword==="비밀번호는 최소 6자리 이상이여야합니다."}
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
          {(error.changepassword === "비밀번호를 입력해주세요." ||
            error.changepassword === "비밀번호는 최소 6자리 이상이여야합니다.")
            && <FormHelperText id="component-error-text" error={true} >{error.changepassword}</FormHelperText>}
        </FormControl> */}


        <FormControl sx={{m:1, width: '70%'}} variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password" style={{backgroundColor:"white", paddingRight:"2px"}} >새 비밀번호</InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            type={values.showNewPassword ? 'text' : 'password'}
            value={values.newPassword}
            style={{paddingTop:0, paddingBottom:0}}
            onChange={onValuesChange('newPassword')}
            error={error.changepassword==="비밀번호를 입력해주세요." || error.changepassword==="비밀번호는 최소 6자리 이상이여야합니다."}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowNewPassword}
                  onMouseDown={handleMouseDownNewPassword}
                  edge="end"
                >
                  {values.showNewPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="newPassword"
          />
          {(error.changepassword === "비밀번호를 입력해주세요." ||
            error.changepassword === "비밀번호는 최소 6자리 이상이여야합니다.")
            && <FormHelperText id="component-error-text" error={true} >{error.changepassword}</FormHelperText>}
        </FormControl>


        <FormControl sx={{m:1, width: '70%'}} variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password" style={{backgroundColor:"white", paddingRight:"2px"}} >새 비밀번호 재확인</InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            type={values.showConfirmNewPassword ? 'text' : 'password'}
            value={values.confirmNewPassword}
            style={{paddingTop:0, paddingBottom:0}}
            onChange={onValuesChange('confirmNewPassword')}
            error={error.changepassword==="재확인 비밀번호가 다릅니다." || error.changepassword==="비밀번호는 최소 6자리 이상이여야합니다."}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowConfirmNewPassword}
                  onMouseDown={handleMouseDownConfirmNewPassword}
                  edge="end"
                >
                  {values.showConfirmNewPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="confirmNewPassword"
          />
          {(error.changepassword === "재확인 비밀번호가 다릅니다." ||
            error.changepassword === "비밀번호는 최소 6자리 이상이여야합니다.")
            && <FormHelperText id="component-error-text" error={true} >{error.changepassword}</FormHelperText>}
        </FormControl>
        {error.changepassword==="비밀번호가 변경되었습니다." && <p className={styles.success_text}>{error.changepassword}</p>}
        <div className={styles.submit_button} onClick={onSubmitClick}>비밀번호 변경</div>
      </div>
    </div>
  )
}

export default withProtected(FindPassword);