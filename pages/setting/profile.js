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
        setAlertText("???????????? ?????????????????????.")
        setError("")
        setAlertMode("success")
        setTimeout(() => {
          setAlertMode("none")
        },2500)

      } catch (e) {
        console.log(e)
        setAlertText("?????? ??????")
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
          setAlertText("????????? ??????")
          setAlertMode("error")
          setTimeout(() => {
            setAlertMode("none")
          },3000)
          setProfileUrl(undefined)
        }
      }
    }
  }
  //??????????????? ???????????? ????????? ??????
  const checkIsImage = (file) => {
    const pathpoint = file.lastIndexOf('.')
    const filepoint = file.substring(pathpoint+1,file.length)
    const filetype = filepoint.toLowerCase();
    if (filetype == 'jpg' || filetype == 'png' || filetype == 'git' || filetype == 'jpeg' || filetype == 'bmp') {
      return true;
    } else {
      alert("????????? ????????? ????????? ??? ????????????.\n (.jpg .gif .png .jpeg .bmp)")
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
        <p> ????????? ??????</p>
      </div>
      <div className={styles.img_container}>
        {profileUrl === "" ?
          <CircularProgress />
          :
          <Image src={profileUrl} quality={50} alt={"?????? ????????? ??????"} placeholder="blur" blurDataURL="/public/placeholder.png"
            layout="fill" objectFit="cover" objectPosition="center" priority={true} />
        }
      </div>
      <label htmlFor="input_file" className={styles.img_button} >?????? ??????</label><input onChange={onImgChange} type="file" id="input_file" accept="image/*" className={styles.hide_input} />
      <div className={styles.img_button} style={{marginTop: "10px"}}>{email}</div>
      <div className={styles.input_container}>
        <TextField
          fullWidth
          id="outlined-helperText"
          label="?????????"
          value={userName}
          helperText={error === "userName" ? "?????????????????????." :
            error === "userNameToLong" ? "???????????? ?????? ?????????." :
              error === "userNameOnlyBlank" ? "???????????? ????????? ??? ??? ????????????." :
            error ==="userNameHasSpecial" ? "??????????????? ??????????????? ????????? ??? ????????????." : "???????????? ???????????? ???????????????."}
          error={error==="userName" || error==="userNameToLong" || error==="userNameOnlyBlank" || error==="userNameHasSpecial"}
          size="small"
          margin="normal"
          onChange={onUserNameChange}
        />
        <p style={{marginBottom:"10px"}}>????????? ??????????????? ?????? ????????? ???????????????.</p>
        <TextField
          fullWidth
          id="outlined-helperText"
          label="??????"
          value={realName}
          helperText={ error === "realNameToLong" ? "????????? ?????? ?????????." :
              error === "realNameOnlyBlank" ? "????????? ????????? ??? ??? ????????????." :
            error ==="realNameHasSpecial" && "???????????? ??????????????? ????????? ??? ????????????."}
          error={error==="realNameToLong" || error==="realNameOnlyBlank" || error==="realNameHasSpecial"}
          size="small"
          margin="normal"
          onChange={onRealNameChange}
        />
        <TextField
          fullWidth
          id="outlined-helperText"
          label="????????????"
          placeholder="XXX-XXXX-XXXX"
          value={phoneNumber}
          size="small"
          margin="dense"
          helperText={error==="phoneNumber" && "???????????? ?????? ?????????????????????."}
          error={error === "phoneNumber"}
          onChange={onPhoneNumberChange}
        />
        <GenderSelect gender={gender} onGenderChange={onGenderChange} />
        <TextField
          fullWidth
          id="outlined-helperText"
          label="????????????"
          placeholder="YYYY-MM-DD"
          value={date}
          size="small"
          margin="dense"
          helperText={error==="date" && "???????????? ?????? ???????????????."}
          error={error === "date"}
          onChange={onDateChange}
        />
        <CountrySelect handleCountry={handleCountry} country={country} />
        <TextField
          fullWidth
          id="outlined-helperText"
          label="????????? ??????"
          value={email}
          size="small"
          margin="normal"
          helperText={error==="email" && "???????????? ?????? ????????? ???????????????."}
          error={error === "email"}
          onChange={onEmailChange}
        />
        <Button variant="contained" component="label" onClick={onSubmit}>
          ??????
        </Button>
        <p className={styles.red_logout} onClick={onLogoutForeverClick}>?????? ??????</p>
      </div>
      <Alert mode={alertMode} text={alertText} isShow={alertMode !== "none"} />
      <Backdrop open={showBackdrop} onClick={handleCloseBackDrop} sx={{ color: '#fff', zIndex: 1000, }}>
        <div className={styles.alert_container}>
          <h4>?????? ????????? ?????????, ????????? ??? ?????? ?????? ????????? ???????????? ?????? ????????? ??? ????????????. ?????????????????????????</h4>
          <p onClick={onYesClick}>???</p>
          <p onClick={onNoClick}>?????????</p>
        </div>
      </Backdrop>
    </div>
  )
}
export default Profile