import React, {useEffect, useState} from "react"
import styles from "styles/setting/profile.module.css"
import Alert from "src/components/public/Alert"
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useRouter } from "next/router";
import Image from "hook/Image"
import TextField from '@mui/material/TextField';
import { firestore as db } from "firebase/firebase";
import useAuth from "src/hook/auth/auth";
import Skeleton from '@mui/material/Skeleton';
import Button from '@mui/material/Button';
import { compressImage } from "src/hook/compressImage"
import { uploadImage } from "firebase/uploadImage"
import CircularProgress from '@mui/material/CircularProgress'
import CountrySelect from "src/components/setting/profile/CountrySelect"
import GenderSelect from "src/components/setting/profile/GenderSelect"
import Backdrop from '@mui/material/Backdrop';
const Profile = () => {
  const router = useRouter()
  const { user, logout, deleteAccount } = useAuth()
  const [userName, setUserName] = useState("")
  const onUserNameChange = (e) => { setUserName(e.target.value); if(error==="userName") setError("none")}
  const [email, setEmail] = useState("")
  const onEmailChange = (e) => { setEmail(e.target.value); if(error==="email") setError("none")}
  const [date, setDate] = useState("")
  const onDateChange = (e) => { setDate(e.target.value); if(error==="date") setError("none")}
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("none")
  const [profileUrl, setProfileUrl] = useState("")
  const [country, setCountry] = useState("")
  const handleCountry = (country) => { setCountry(country) }
  const [phoneNumber, setPhoneNumber] = useState("")
  const onPhoneNumberChange = (e) => { setPhoneNumber(e.target.value); if (error === "phoneNumber") setError("none") }
  const [realName, setRealName] = useState("")
  const onRealNameChange = (e)=>{setRealName(e.target.value)}
  const [gender, setGender] = useState()
  const onGenderChange = (gender) => { setGender(gender) }
  const [showBackdrop, setShowBackdrop] = useState(false)
  
  const [alertText, setAlertText] = useState("")
  const [alertMode, setAlertMode] = useState("none")

  useEffect(() => {
    const fetchData = async () => {
      const userData = await db.collection("users").doc(user.uid).get()
      if (userData.exists) {
        if(userData.data().name !== undefined)
          setUserName(userData.data().name)
        if(userData.data().email!== undefined)
          setEmail(userData.data().email)
        if(userData.data().photo!== undefined)
          setProfileUrl(userData.data().photo)
        if(userData.data().phoneNumber!== undefined)
          setPhoneNumber(userData.data().phoneNumber)
        if(userData.data().date!== undefined)
          setDate(userData.data().date)
        if(userData.data().country!== undefined)
          setCountry(userData.data().country)
        if(userData.data().realName!== undefined)
          setRealName(userData.data().realName)
        if(userData.data().gender!== undefined)
          setGender(userData.data().gender)
        setIsLoading(false)
      }
    }
    fetchData()
  },[])

  const onTitleClick = () => {
    router.back()
  }

  const onSubmit = () => {
    const blank_pattern = /^\s+|\s+$/g;
    const special_pattern = /[`~!@#$%^&*|\\\'\";:\/?]/gi;
    let gen = "none"
    console.log(country)
    if (userName === undefined)
      setUserName("")
    if(realName===undefined)
      setRealName("")
    if(phoneNumber === undefined)
      setPhoneNumber("")
    if (date === undefined)
      setDate("")
    if(email === undefined)
      setEmail("")
    if(gender !== undefined)
      gen = gender
    if (userName !== "" && userName !==" " && userName.length > 25 && userName!==null&& userName!==undefined)
      setError("userNameToLong")
    else if (userName !== "" && userName !==" "&& userName!==undefined && userName.replace(blank_pattern, "") === "" && userName!==null)
      setError("userNameOnlyBlank")
    else if (userName !== "" && userName !==" "&& userName!==undefined && userName!==null && special_pattern.test(userName) === true)
      setError("userNameHasSpecial")
    else if (realName!=="" && realName!==" "&& realName!==undefined && realName!==null && realName?.length > 60)
      setError("realNameToLong")
    else if(realName!=="" && realName!==" "&& realName!==undefined && realName!==null && realName?.replace(blank_pattern, "")==="")
      setError("realNameOnlyBlank")
    else if(realName!=="" && realName!==" " && realName!==undefined && realName!==null && special_pattern.test(realName)===true)
      setError("realNameHasSpecial")
    else if ((/^[0-9]{2,3}-[0-9]{3,4}-[0-9]{4}/.test(phoneNumber) === false || phoneNumber?.length>13) && phoneNumber!==""&& phoneNumber!==" "&& phoneNumber!==null&& phoneNumber!==undefined)
      setError("phoneNumber")
    else if (!checkValidDate(date) && date!=="" && date!==" " && date!==null && date!==undefined)
      setError("date")
    else if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email) === false && email!=="" && email!==" " && email!==null&& email!==undefined)
      setError("email")
    else if (profileUrl !== undefined) {
      const profileHashMap = {
        name: userName,
        phoneNumber: phoneNumber,
        date: date,
        email: email,
        country: country,
        photo: profileUrl,
        realName: realName,
        gender: gen
      }
      try {
         db.collection("users").doc(user.uid).update(profileHashMap)
        setAlertText("프로필이 변경되었습니다.")
        setError("")
        setAlertMode("success")
        setTimeout(() => {
          setAlertMode("none")
        },2500)

      } catch (e) {
        console.log(e)
        setAlertText("저장 실패")
        setAlertMode("error")
        setTimeout(() => {
          setAlertMode("none")
        },3000)
      }
    }
  }
const checkValidDate = (value) => {
	var result = true;
	try {
	    var date = value.split("-");
	    var y = parseInt(date[0], 10),
	        m = parseInt(date[1], 10),
	        d = parseInt(date[2], 10);
	    
	    var dateRegex = /^(?=\d)(?:(?:31(?!.(?:0?[2469]|11))|(?:30|29)(?!.0?2)|29(?=.0?2.(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00)))(?:\x20|$))|(?:2[0-8]|1\d|0?[1-9]))([-.\/])(?:1[012]|0?[1-9])\1(?:1[6-9]|[2-9]\d)?\d\d(?:(?=\x20\d)\x20|$))?(((0?[1-9]|1[012])(:[0-5]\d){0,2}(\x20[AP]M))|([01]\d|2[0-3])(:[0-5]\d){1,2})?$/;
	    result = dateRegex.test(d+'-'+m+'-'+y);
	} catch (err) {
		result = false;
	}    
    return result;
  }
  
  const onImgChange = async(e) => {
    let img
    setProfileUrl("")
    if (e.target.files[0] !== undefined) {
      if (checkIsImage(e.target.files[0].name)) {
        if (!checkIsImageSize(e.target.files[0].size))
          img = await compressImage(e.target.files[0])
        else
          img = e.target.files[0]
        console.log(img)
        try {
          const url = await uploadImage(img, `profile/${user.uid}`)
          setProfileUrl(url)
        } catch (e) {
          setAlertText("업로드 실패")
          setAlertMode("error")
          setTimeout(() => {
            setAlertMode("none")
          },3000)
          setProfileUrl(undefined)
        }
      }
    }
  }
  //업로드한게 이미지가 맞는지 확인
  const checkIsImage = (file) => {
    const pathpoint = file.lastIndexOf('.')
    const filepoint = file.substring(pathpoint+1,file.length)
    const filetype = filepoint.toLowerCase();
    if (filetype == 'jpg' || filetype == 'png' || filetype == 'git' || filetype == 'jpeg' || filetype == 'bmp') {
      return true;
    } else {
      alert("이미지 파일만 선택할 수 있습니다.\n (.jpg .gif .png .jpeg .bmp)")
      return false;
    }
  }
  const checkIsImageSize = (img) => {
    const maxSize = 1 * 1024 * 1024; //1MB
    if (img > maxSize) {
      return false;
    }
    else
      return true
  }

  const onLogoutForeverClick = () => {
    setShowBackdrop(true)
  }
  const handleCloseBackDrop = () => {
    setShowBackdrop(false)
  }

  const onYesClick = async () => {
    // await db.collection("users").doc(user.uid).delete().then(() => {
      deleteAccount()
      logout()
    // }
    // )
    router.push("/login")
  }

  const onNoClick = () => {
    console.log(user.uid)
    setShowBackdrop(false)
  }

  if (isLoading)
    return (
      // <Skeleton animation="wave" variant="rectangular" width="100%" height={250} />
   <div className={styles.main_container}>
      <div className={styles.title_container} onClick={onTitleClick}>
        <Skeleton animation="wave" variant="text" width="100%" />
      </div>
      <div className={styles.img_container}>
       <Skeleton animation="wave" variant="circular" width="100%" height="100%"/>
      </div>
      <Skeleton animation="wave" variant="text" width="80%" />
      <div className={styles.input_container}>
        <Skeleton animation="wave" variant="text" width="100%" />
        <p style={{marginBottom:"10px"}}><Skeleton animation="wave" variant="text" width="100%" /></p>
          <Skeleton animation="wave" variant="rectangular" width="100%" height={50} margin="10px" />
          <Skeleton animation="wave" variant="text" width="100%" />
          <Skeleton animation="wave" variant="text" width="100%" />
          <Skeleton animation="wave" variant="rectangular" width="100%" height={50} margin="10px" />
          <Skeleton animation="wave" variant="text" width="100%" />
          <Skeleton animation="wave" variant="text" width="100%" />
          <Skeleton animation="wave" variant="text" width="100%" />
      </div>
    </div>
    )
  return (
    <div className={styles.main_container}>
      <div className={styles.title_container} onClick={onTitleClick}>
        <ArrowBackIosNewIcon style={{fontSize: "15px"}} />
        <p> 프로필 편집</p>
      </div>
      <div className={styles.img_container}>
        {profileUrl === "" ?
          <CircularProgress />
          :
          <Image src={profileUrl} quality={50} alt={"유저 프로필 사진"} placeholder="blur" blurDataURL="/public/placeholder.png"
            layout="fill" objectFit="cover" objectPosition="center" priority={true} />
        }
      </div>
      <label htmlFor="input_file" className={styles.img_button} >사진 편집</label><input onChange={onImgChange} type="file" id="input_file" accept="image/*" className={styles.hide_input} />
      <div className={styles.img_button} style={{marginTop: "10px"}}>{email}</div>
      <div className={styles.input_container}>
        <TextField
          fullWidth
          id="outlined-helperText"
          label="닉네임"
          value={userName}
          helperText={error === "userName" ? "필수항목입니다." :
            error === "userNameToLong" ? "닉네임이 너무 깁니다." :
              error === "userNameOnlyBlank" ? "닉네임은 공백이 될 수 없습니다." :
            error ==="userNameHasSpecial" ? "닉네임에는 특수문자가 포함될 수 없습니다." : "닉네임은 모두에게 공개됩니다."}
          error={error==="userName" || error==="userNameToLong" || error==="userNameOnlyBlank" || error==="userNameHasSpecial"}
          size="small"
          margin="normal"
          onChange={onUserNameChange}
        />
        <p style={{marginBottom:"10px"}}>아래의 개인정보는 모두 비공개 정보입니다.</p>
        <TextField
          fullWidth
          id="outlined-helperText"
          label="실명"
          value={realName}
          helperText={ error === "realNameToLong" ? "실명이 너무 깁니다." :
              error === "realNameOnlyBlank" ? "실명은 공백이 될 수 없습니다." :
            error ==="realNameHasSpecial" && "실명에는 특수문자가 포함될 수 없습니다."}
          error={error==="realNameToLong" || error==="realNameOnlyBlank" || error==="realNameHasSpecial"}
          size="small"
          margin="normal"
          onChange={onRealNameChange}
        />
        <TextField
          fullWidth
          id="outlined-helperText"
          label="전화번호"
          placeholder="XXX-XXXX-XXXX"
          value={phoneNumber}
          size="small"
          margin="dense"
          helperText={error==="phoneNumber" && "유효하지 않은 전화번호입니다."}
          error={error === "phoneNumber"}
          onChange={onPhoneNumberChange}
        />
        <GenderSelect gender={gender} onGenderChange={onGenderChange} />
        <TextField
          fullWidth
          id="outlined-helperText"
          label="생년월일"
          placeholder="YYYY-MM-DD"
          value={date}
          size="small"
          margin="dense"
          helperText={error==="date" && "유효하지 않은 날짜입니다."}
          error={error === "date"}
          onChange={onDateChange}
        />
        <CountrySelect handleCountry={handleCountry} country={country} />
        <TextField
          fullWidth
          id="outlined-helperText"
          label="이메일 주소"
          value={email}
          size="small"
          margin="normal"
          helperText={error==="email" && "유효하지 않은 이메일 주소입니다."}
          error={error === "email"}
          onChange={onEmailChange}
        />
        <Button variant="contained" component="label" onClick={onSubmit}>
          저장
        </Button>
        <p className={styles.red_logout} onClick={onLogoutForeverClick}>회원 탈퇴</p>
      </div>
      <Alert mode={alertMode} text={alertText} isShow={alertMode !== "none"} />
      <Backdrop open={showBackdrop} onClick={handleCloseBackDrop} sx={{ color: '#fff', zIndex: 1000, }}>
        <div className={styles.alert_container}>
          <h4>회원 탈퇴시 북마크, 좋아요 등 모든 회원 정보가 삭제되며 다시 불러올 수 없습니다. 삭제하시겠습니까?</h4>
          <p onClick={onYesClick}>예</p>
          <p onClick={onNoClick}>아니요</p>
        </div>
      </Backdrop>
    </div>
  )
}
export default Profile