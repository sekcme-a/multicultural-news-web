  export const adminMenuItems = [
    {type: "main", title:"기사 관리", child: true, icon: "ModeIcon", level:"admin",},
    {type: "sub", title:"기사 관리", child: false, subtitle: "기사 등록", path: "/newArticle", level:"admin",},
    { type: "sub", title: "기사 관리", child: false, subtitle: "기사 편집", path: "/editArticle", level: "admin", },
    {type: "main", title:"페이지 관리", child: true, icon: "TagIcon", level:"admin",},
    {type: "sub", title:"페이지 관리", child: false, subtitle: "지역별 편집", path: "/local", level:"admin",},
    { type: "sub", title: "페이지 관리", child: false, subtitle: "언어별 편집", path: "/country", level: "admin", },
    { type: "sub", title: "페이지 관리", child: false, subtitle: "사회 편집", path: "/society", level: "admin", },
    { type: "sub", title: "페이지 관리", child: false, subtitle: "문화 편집", path: "/culture", level: "admin", },
    { type: "sub", title: "페이지 관리", child: false, subtitle: "기획 편집", path: "/plan", level: "admin", },
    { type: "sub", title: "페이지 관리", child: false, subtitle: "앱정보 편집", path: "/appInfo", level: "admin", },
    { type: "sub", title: "페이지 관리", child: false, subtitle: "도움말 편집", path: "/help", level: "admin", },
    { type: "sub", title: "페이지 관리", child: false, subtitle: "개인정보처리방침 편집", path: "/dataInfo", level: "admin", },
    {type: "main", title:"공지사항 관리", child: true, icon: "CampaignIcon", level:"admin",},
    {type: "sub", title:"공지사항 관리", child: false, subtitle: "공지사항 추가", path: "/newAnnouncement", level:"admin",},
    { type: "sub", title: "공지사항 관리", child: false, subtitle: "공지사항 편집", path: "/editAnnouncement", level: "admin", },
    {type: "main", title:"크롤링", child: true, icon: "PestControlIcon", level:"admin",},
    {type: "sub", title:"크롤링", child: false, subtitle: "크롤링 설정", path: "/crawling", level:"admin",},
  ]