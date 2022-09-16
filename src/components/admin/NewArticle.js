import React, {useState, useEffect, useRef} from "react"
import dynamic from 'next/dynamic'
import {useRouter} from "next/router"
import style from "styles/admin/container.module.css"
import { firestore as db } from "firebase/firebase"
import "react-quill/dist/quill.snow.css";
import { uploadImage } from "firebase/uploadImage"
import Loader from "components/public/Loader"
import useAuth from "src/hook/auth/auth";
import { compressImage } from "src/hook/compressImage"
import { useLeavePageConfirm } from "src/hook/useLeavePageConfirm"
import Expo from "expo-server-sdk";
let expo = new Expo();
const Editor = dynamic(import('components/public/Editor'), {
  ssr: false,
  loading: () => <p>로딩중 ...</p>,
})
const QuillNoSSRWrapper = dynamic(import('react-quill'), {
  ssr: false,
  loading: () => <p>로딩중 ...</p>,
})



const NewArticle = () => {
  const { user } = useAuth();
  const [docId, setDocId] = useState("")
  const router = useRouter()

  // const [text, setText] = useState();
  let text="";

  // useLeavePageConfirm()

  const [textData, setTextData] = useState()
  const [isLoading, setIsLoading] = useState(true)
  const [title, setTitle] = useState("")
  const [subtitle, setSubtitle] = useState("")
  const [thumbnailImg, setThumbnailImg] = useState()
  const [tag, setTag] = useState("")
  const [author, setAuthor] = useState("")
  const [importance, setImportance] = useState("")
  const onTitleChange = (e) => { setTitle(e.target.value) }
  const onSubtitleChange = (e)=>{setSubtitle(e.target.value)}
  const onTagChange = (e) => { setTag(e.target.value) }
  const onAuthorChange = (e) => { setAuthor(e.target.value) }
  const onImportanceChange = (e) => { setImportance(e.target.value) }
  const [createdAt, setCreatedAt] = useState()
  const onCreatedAtChange = (e) => { setCreatedAt(e.target.value) }
  const [createdAtDate, setCreatedAtDate] = useState()
  const [imageFrom, setImageFrom] = useState("")
  const onImageFromChange = (e)=>{setImageFrom(e.target.value)}

  const onTextChange = (html) => {
    setTextData(html)
  }

  const [categoryList, setCategoryList] = useState([])
  const [selectedCategoryList, setSelectedCategoryList] = useState([])
  const [localList, setLocalList] = useState([])
  const [selectedLocalList, setSelectedLocalList] = useState([])
  const [countryList, setCountryList] = useState([])
  const [selectedCountryList, setSelectedCountryList] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      await db.collection("category").doc("list").get().then((doc) => {
        setCategoryList(doc.data()?.list)
      })
      await db.collection("local").doc("list").get().then((doc) => {
        setLocalList(doc.data()?.list)
      })
      await db.collection("country").doc("list").get().then((doc) => {
        setCountryList(doc.data()?.list)
      })
      const fetchedDocId = await db.collection("likesAndComments").doc()
      setDocId(fetchedDocId.id)
      setIsLoading(false)
    }
    try {
      fetchData()
    } catch (e) {
      alert(`데이터를 불러오지 못했습니다 : ${e.message}`)
    }
  }, [])

  const onSubmitClick = async() => {
    try {
      const catLi = await db.collection("category").doc("list").get()
      const locLi = await db.collection('local').doc("list").get()
      const couLi = await db.collection('country').doc("list").get()
      let categoryIdList = []
      let localIdList = []
      let countryIdList = []
      const thumbnailUrl = await uploadImage(thumbnailImg, `thumbnails/${Date.now()}`)
      if (checkInput() && user) {
        if (true) {
          selectedCategoryList.map((cat) => {
            for (let i = 0; i < catLi.data().list.length; i++) {
              if (cat === catLi.data().list[i])
                categoryIdList.push(catLi.data().idList[i])
            }
          })
          selectedLocalList.map((loc) => {
            for (let i = 0; i < locLi.data().list.length; i++) {
              if (loc === locLi.data().list[i])
                localIdList.push(locLi.data().idList[i])
            }
          })
          selectedCountryList.map((cou) => {
            for (let i = 0; i < couLi.data().list.length; i++) {
              if (cou === couLi.data().list[i])
                countryIdList.push(couLi.data().idList[i])
            }
          })
          let arrayData = []
          const titleAsWord = title.toLowerCase().split(" ")
          for (let j = 0; j < titleAsWord.length; j++) {
            for (let i = 1; i < titleAsWord[j].length + 1; i++) {
              arrayData.push(titleAsWord[j].substring(0, i))
            }
          }
          const tagAsWord = tag.toLowerCase().replace(/^\s+|\s+$/gm, '').split("#")
          for (let j = 0; j < tagAsWord.length; j++) {
            for (let i = 1; i < tagAsWord[j].length + 1; i++) {
              arrayData.push(tagAsWord[j].substring(0, i))
            }
          }
          if (subtitle === "" || subtitle === " ") {
            const temp = textData
            temp = temp.replace(/<[^>]*>?/g, '')
            temp = temp.replace("&lt;", "<")
            temp = temp.replace("&gt;", ">")
            temp = temp.replace("&nbsp;", "")
            temp = temp.substr(0, 80)
            setSubtitle(temp)
          }
          const postHashMap = {
            title: title,
            subtitle: subtitle,
            thumbnail: thumbnailUrl,
            createdAt: new Date(),
            author: author,
            uid: user.uid,
            category: selectedCategoryList.toString(),
            local: selectedLocalList.toString(),
            country: selectedCountryList.toString(),
            categoryId: categoryIdList,
            localId: localIdList,
            countryId: countryIdList,
            tag: tag,
            importance: parseInt(importance),
            text: textData,
            keyword: arrayData,
            imageFrom:imageFrom,
          }
          const thumbnailHashMap = {
            title: title,
            subtitle: subtitle,
            thumbnail: thumbnailUrl,
            createdAt: new Date(),
            author: author,
            uid: user.uid,
            category: selectedCategoryList.toString(),
            local: selectedLocalList.toString(),
            country: selectedCountryList.toString(),
            categoryId: categoryIdList,
            localId: localIdList,
            countryId: countryIdList,
            tag: tag,
          }
          const batch = db.batch();
          categoryIdList.forEach((category) => {
            batch.set(db.collection(category).doc(docId), thumbnailHashMap);
          })
          if (localIdList.length !== 0) {
            localIdList.forEach((local) => {
              batch.set(db.collection(local).doc(docId), thumbnailHashMap)
            })
          }
          if (countryIdList.length !== 0) {
            countryIdList.forEach((country) => {
              batch.set(db.collection(country).doc(docId), thumbnailHashMap)
            })
          }
          batch.set(db.collection("posts").doc(docId), postHashMap)
          batch.set(db.collection("lvc").doc(docId), { likesCount: 0, viewsCount: 0, commentsCount: 0 })
          batch.set(db.collection("posts").doc(docId).collection('lvc').doc("count"), { likesCount: 0, viewsCount: 0, commentsCount: 0 })
          await batch.commit();
          alert("성공적으로 업로드되었습니다!")
          router.push(`/rhksflwk/home`)
        }
      }
    } catch (e) {
      alert(`업로드 실패 : ${e.message}`)
    }
  }

  useEffect(() => {
    console.log(textData)
  },[textData])

  const onImgChange = async (e) => {
    let img
    if (e.target.files[0] !== undefined) {
      if (checkIsImage(e.target.files[0].name)) {
        if (!checkIsImageSize(e.target.files[0].size))
          img = await compressImage(e.target.files[0])
        else
          img = e.target.files[0]
        setThumbnailImg(img)
      }
    }
  }

  //필수항목 작성 확인
  const checkInput = () => {
    if (title === "") alert("제목은 필수항목입니다.")
    else if(checkIsValidCreatedAt()) alert("날짜 형식이 잘못되었습니다.")
    else if (thumbnailImg==="") alert("썸네일은 필수항목입니다.")
    else if (selectedCategoryList.length===0) alert("적어도 하나의 카테고리를 선택해야합니다.")
    else if (tag=== "") alert("태그는 필수항목입니다.")
    else if (author==="") alert("작성자는 필수항목입니다.")
    else if (isNaN(parseInt(importance)) || parseInt(importance)>5||parseInt(importance)<0) alert("중요도는 0~5 사이여야 합니다.")
    else if (textData === undefined) alert("글은 필수항목입니다.")
    else return true
    return false;
  }

  const checkIsValidCreatedAt = () => {
    if (createdAt === "") {
      setCreatedAtDate(new Date())
      return true
    }
    try {
      const tempArray = createdAt.split("/")
      const date = new Date(parseInt(tempArray[0]), parseInt(tempArray[1])-1, parseInt(tempArray[2]),
        parseInt(tempArray[3]), parseInt(tempArray[4]), parseInt(tempArray[5]))
      setCreatedAtDate(date)
    } catch (e) {
      console.log(e.message)
      return false
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

  //이미지의 크기가 2MB이하인지 확인 후, 아니라면 압축할지 물어본뒤 압축진행.
  const checkIsImageSize = (img) => {
    const maxSize = 2 * 1024 * 1024; //2MB
    if (img > maxSize) {
      return false;
    }
    else
      return true
  }

  const onPreviewClick = () => {
    setTextData(text)
  }
const sendMessage = () => {
  // Manage array of messages
  let notifications = [];
    if (!Expo.isExpoPushToken("ExponentPushToken[PL3TqtKTRqIYMfJSDDmn90]")) {
      console.error(`Push token is not a valid Expo push token`);
    }else
    notifications.push({
      to: "ExponentPushToken[PL3TqtKTRqIYMfJSDDmn90]",
      sound: "default",
      title: "hello",
      body: "world",
      // data: message // TODO: message or message.data ?
    });
  // Send the messages via chunkPushNotifications and sendPushNotificationsAsync
  let chunks = expo.chunkPushNotifications(notifications);
  let tickets = [];
  (async () => {
    for (let chunk of chunks) {
      try {
        let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        tickets.push(...ticketChunk);
        console.log("ticketChunk: ", ticketChunk);
        // TODO: Handle errors
      } catch (error) {
        console.error(error);
      }
    }
  })();

  _retrieveReceipts(tickets);
};

const _retrieveReceipts = tickets => {
  // Later, after the Expo push notification service has delivered the
  // notifications to Apple or Google (usually quickly, but allow the the service
  // up to 30 minutes when under load), a "receipt" for each notification is
  // created. The receipts will be available for at least a day; stale receipts
  // are deleted.
  //
  // The ID of each receipt is sent back in the response "ticket" for each
  // notification. In summary, sending a notification produces a ticket, which
  // contains a receipt ID you later use to get the receipt.
  //
  // The receipts may contain error codes to which you must respond. In
  // particular, Apple or Google may block apps that continue to send
  // notifications to devices that have blocked notifications or have uninstalled
  // your app. Expo does not control this policy and sends back the feedback from
  // Apple and Google so you can handle it appropriately.
  let receiptIds = [];
  for (let ticket of tickets) {
    // NOTE: Not all tickets have IDs; for example, tickets for notifications
    // that could not be enqueued will have error information and no receipt ID.
    if (ticket.id) {
      receiptIds.push(ticket.id);
    }
  }

  let receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);
  (async () => {
    // Like sending notifications, there are different strategies you could use
    // to retrieve batches of receipts from the Expo service.
    for (let chunk of receiptIdChunks) {
      try {
        let receipts = await expo.getPushNotificationReceiptsAsync(chunk);
        console.log(receipts);

        // The receipts specify whether Apple or Google successfully received the
        // notification and information about an error, if one occurred.
        for (let receipt of receipts) {
          if (receipt.status === "ok") {
            console.log("Receipt status received and ok");
            continue;
          } else if (receipt.status === "error") {
            console.error(
              `There was an error sending a notification: ${receipt.message}`
            );
            if (receipt.details && receipt.details.error) {
              // The error codes are listed in the Expo documentation:
              // https://docs.expo.io/versions/latest/guides/push-notifications#response-format
              // You must handle the errors appropriately.
              console.error(`The error code is ${receipt.details.error}`);
            }
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
  })();
};

  const onTestClick = () => {
    sendMessage()
  }
  
  if (isLoading)
    return <Loader />
  return (
    <div className={style.mainContainer}>
      <div className={style.container}>
        <h4>기사 ID</h4>
        <p>기사 ID : <input type="text" value={docId} size="60" required disabled/></p>
      </div>
      <div className={style.container}>
        <h4>제목</h4>
        <p className={style.warning}>*필수</p>
        <p>제목 문구 : <input type="text" value={title} onChange={onTitleChange} size="60" required/></p>
      </div>
      <div className={style.container}>
        <h4>부제목{`(요약)`}</h4>
        <p className={style.warning}>*빈칸일 경우 기사 앞부분으로 자동적용</p>
        <p>부제목 문구 : <textarea value={subtitle} onChange={onSubtitleChange} rows="5" cols="80" required/></p>
      </div>
      <div className={style.container}>
        <h4>작성 시간</h4>
        <p className={style.warning}>*빈칸일 경우 자동으로 현재 시각으로 적용</p>
        <p className={style.warning}>*YYYY/MM/DD/Hour/Min/Sec 형식으로 작성 예- 2001/09/13/14/13/30</p>
        <p>작성 시간 : <input type="text" value={createdAt} onChange={onCreatedAtChange} size="60" required/></p>
      </div>
      <div className={style.container}>
        <h4>썸네일 이미지</h4>
        <p className={style.warning}>*필수 *이미지의 크기가 2MB보다 클 경우 자동으로 압축됩니다.</p>
        <p>이미지 선택 : <input type="file" name="selectedImg[]" onChange={onImgChange} accept="image/*"/></p>
        {/* <img className={style.thumbnail} src={thumbnailImg}></img> */}
      </div>
      <div className={style.container}>
        <h4>이미지 출처</h4>
        <p>출처 문구 : <textarea value={imageFrom} onChange={onImageFromChange} rows="5" cols="80"/></p>
      </div>
      <div className={style.container}>
        <h4>카테고리 선택</h4>
        <p className={style.warning}>*필수 중복선택가능</p>
        {
          categoryList?.map((data, index) => {
          return (
            <button key={index} onClick={() => {
              !selectedCategoryList.includes(data)
                ? setSelectedCategoryList((selectedCategoryList)=>[...selectedCategoryList, data])
                : setSelectedCategoryList(selectedCategoryList.filter((cate)=>cate!==data))
              }}
              className={
                selectedCategoryList.includes(data) ? `${style.categoryButton} ${style.selected}` : style.categoryButton 
              }
            >
              {data}
            </button>
          )
        })}
      </div>
      {/* <div className={style.container}>
        <h4>지역별</h4>
        <p className={style.warning}>지역 설정시 지역별 페이지에도 기사 추가됨, 중복선택가능</p>
        {
          localList?.map((data, index) => {
          return (
            <button key={index} onClick={() => {
              !selectedLocalList.includes(data)
                ? setSelectedLocalList((selectedLocalList)=>[...selectedLocalList, data])
                : setSelectedLocalList(selectedLocalList.filter((cate)=>cate!==data))
              }}
              className={
                selectedLocalList.includes(data) ? `${style.categoryButton} ${style.selected}` : style.categoryButton 
              }
            >
              {data}
            </button>
          )
        })}
      </div> */}
      <div className={style.container}>
        <h4>나라별</h4>
        <p className={style.warning}>나라 설정시 나라별 페이지에도 기사 추가됨, 중복선택가능</p>
        {
          countryList?.map((data, index) => {
          return (
            <button key={index} onClick={() => {
              !selectedCountryList.includes(data)
                ? setSelectedCountryList((selectedCountryList)=>[...selectedCountryList, data])
                : setSelectedCountryList(selectedCountryList.filter((cate)=>cate!==data))
              }}
              className={
                selectedCountryList.includes(data) ? `${style.categoryButton} ${style.selected}` : style.categoryButton 
              }
            >
              {data}
            </button>
          )
        })}
      </div>
      <div className={style.container}>
        <h4>태그</h4>
        <p className={style.warning}>*필수 형식 : #태그1 #태그2 #태그3</p>
        <p>기사 태그 : <input type="text" value={tag} onChange={onTagChange} size="100" required/></p>
      </div>
      <div className={style.container}>
        <h4>작성자</h4>
        <p className={style.warning}>*필수</p>
        <p>작성자 : <input type="text" value={author} onChange={onAuthorChange} size="100" required/></p>
      </div>
      <div className={style.container}>
        <h4>중요도</h4>
        <p className={style.warning}>*필수 유저가 설정한 중요도에 따라 알림 전송 0~5, 높을수록 중요함, 중요도 0 : 알림 전송안함</p>
        <p>기사 중요도 : <input type="text" value={importance} onChange={onImportanceChange} size="100" required/></p>
      </div>
      <div className={`${style.container} ${style.quillContainer}`}>
        <Editor docId={docId} handleChange={onTextChange} />
      </div>
      <div className={`${style.container} ${style.previewQuillContainer}`}>
        <QuillNoSSRWrapper value={textData||""} readOnly={true} className={style.quill} theme="bubble" />
      </div>
      <div className={style.submitButton} onClick={onSubmitClick}>
        기사 추가
      </div>
      {/* <div className={style.submitButton} onClick={onTestClick}>
        테스트
      </div> */}
    </div>
  )
}
export default NewArticle;