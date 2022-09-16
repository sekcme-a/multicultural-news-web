export const sendRequest = {
  fetchPostIdList: async (address, page) => {
    return new Promise(function (resolve, reject) {
      console.log(page)
      setTimeout(() => {
        try {
          fetch('/api/fetchPostIdList', {
            method: 'POST',
            headers: {
              'content-type': 'application/json',
            },
            body: JSON.stringify({ address: `${address}${address.includes("article_list_all") ? "?" : "&"}page=${page}` }),
          })
            .then((res) => res.json())
            .then((data) => {
              resolve(data.idList)
            })
        } catch (e) {
          resolve(e.message)
        }
      },10)
    })
  },

  fetchPostDataFromId: async (id, isGetContent) => {
    return new Promise(function (resolve, reject) {
      setTimeout(() => {
        try {
          fetch('/api/fetchPostDataFromId', {
            method: 'POST',
            headers: {
              'content-type': 'application/json',
            },
            body: JSON.stringify({ id: id, isGetContent: isGetContent }),
          })
            .then((res) => res.json())
            .then((data) => {
              resolve(data.data)
            })
        } catch (e) {
          resolve(e.message)
        }
      },10)
    })
  },

  fetchMainPostIdList: async (address) => {
    return new Promise(function (resolve, reject) {
      setTimeout(() => {
        try {
          fetch('/api/fetchMainPostIdList', {
            method: 'POST',
            headers: {
              'content-type': 'application/json',
            },
            body: JSON.stringify({ address: address }),
          })
            .then((res) => res.json())
            .then((data) => {
              resolve(data.idList)
            })
        } catch (e) {
          resolve(e.message)
        }
      },10)
    })
  },

  fetchSearchIdList: async (input, page) => {
    return new Promise(function (resolve, reject) {
      setTimeout(() => {
        try {
          fetch('/api/fetchSearchIdList', {
            method: 'POST',
            headers: {
              'content-type': 'application/json',
            },
            body: JSON.stringify({ input: input, page: page }),
          })
            .then((res) => res.json())
            .then((data) => {
              resolve(data)
            })
        } catch (e) {
          resolve(e.message)
        }
      },300)
    })
  }
}