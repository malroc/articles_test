import { observable } from 'mobx'

export default class ArticlesStore {
  @observable data = []
  @observable query = {
    'search_by_name': '',
    'search_by_text': '',
    'group_by': '',
    'sort_by': ''
  }

  async fetch() {
    let query = ''

    for (let [k, v] of Object.entries(this.query)) {
      if (v) {
        if (query) {
          query += `&${k}=${v}`
        } else {
          query += `${k}=${v}`
        }
      }
    }

    let url = '/api/v1/articles'

    if (query) {
      url += `?${query}`
    }

    let response = await fetch(url)
    let data = await response.json()

    this.data = data
  }
}
