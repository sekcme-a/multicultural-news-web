import ReactQuill from 'react-quill';
import React, { useRef, useEffect, useState } from "react"
import { uploadImage } from 'firebase/uploadImage';
import { compressImage } from 'src/hook/compressImage';
/*
* Simple editor component that takes placeholder text as a prop
*/
const Editor = (props) => {
  const quillRef = useRef(null)
  const [text, setText] = useState("")
  useEffect(() => {
    // console.log(props.handleChange())
    setText(props.data)
    const handleImage = async () => {
      const input = document.createElement("input");
      input.setAttribute("type", "file");
      input.setAttribute("accept", "image/*");
      input.click();
      input.onchange = async () => {
        const file = input.files[0];

        // 현재 커서 위치 저장
        const range = quillRef.current.getEditor().getSelection(true);

        // 서버에 올려질때까지 표시할 로딩 placeholder 삽입
       quillRef.current.getEditor().insertEmbed(range.index, "image", `image/loading.gif`);

        try {
          // 필자는 파이어 스토어에 저장하기 때문에 이런식으로 유틸함수를 따로 만들어줬다
          // 이런식으로 서버에 업로드 한뒤 이미지 태그에 삽입할 url을 반환받도록 구현하면 된다 
          // 나는 여기에 이미지 사이즈가 2MB가 넘으면 자동으로 압축시킬꺼다
          let img
          if (!checkIsImageSize(file.size)) {
            if (confirm("이미지 용량이 2MB가 넘습니다. 이미지를 압축할까요?\n(취소를 누르면 원본 그대로 저장됩니다. 고화질 용량에 주의하세요")) {
              img = await compressImage(file)
            }else img = file
          }else img = file
          const filePath = `images/${props.docId}/${Date.now()}`;
          const url = await uploadImage(img, filePath); 
          
          // 정상적으로 업로드 됐다면 로딩 placeholder 삭제
          quillRef.current.getEditor().deleteText(range.index, 1);
          // 받아온 url을 이미지 태그에 삽입
          quillRef.current.getEditor().insertEmbed(range.index, "image", url);
          
          // 사용자 편의를 위해 커서 이미지 오른쪽으로 이동
          quillRef.current.getEditor().setSelection(range.index + 1);
        } catch (e) {
          quillRef.current.getEditor().deleteText(range.index, 1);
        }
      };
    }
    
    if (quillRef.current) {
      const toolbar = quillRef.current.getEditor().getModule("toolbar");
      toolbar.addHandler("image", handleImage);
    }
  }, []);

  const onChangeHTML = (html) => {
    props.handleChange(html)
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

  if(props.data)
  return (
    <>
      <ReactQuill
        ref={quillRef}
        onChange={(content, delta, source, editor) => onChangeHTML(editor.getHTML())}
        modules={Editor.modules}
        formats={Editor.formats}
        value={props.data || ""}
        bounds={'#root'}
        theme='snow'
        preserveWhitespace
      />
    </>
    );
  else
    return (
      <ReactQuill
        ref={quillRef}
        onChange={(content, delta, source, editor) => onChangeHTML(editor.getHTML())}
        modules={Editor.modules}
        formats={Editor.formats}
        bounds={'#root'}
        theme='snow'
        preserveWhitespace
      />
    )
}

  Editor.modules = {
    toolbar: [
      [{ font: [] }],
      [{ size: [] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'video', 'image'],
      ['clean'],
      [{ 'color': [] }, { 'background': [] }], // dropdown with defaults from theme
      [{ 'align': [] }],
      [{ 'indent': '-1' }, { 'indent': '+1' }], // outdent/indent
    ],
    clipboard: {
      // toggle to add extra line breaks when pasting HTML:
      matchVisual: false
    },
  };

  /*
  * Quill editor formats
  * See https://quilljs.com/docs/formats/
  */
  Editor.formats = [

    'header',
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'link',
    'image',
    'video',
    'code-block',

    'color',

    'align',
    'direction',
    'indent',
    'background',
    'script',
    'table'

  ];


export default Editor;