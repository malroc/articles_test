import { observable } from 'mobx'

export default class ArticlesStore {
  @observable items = []

  @observable newItem = {
    'name': '',
    'text': '',
    'article_type': 'blog_post',
    'story_name': ''
  }

  @observable queryParams = {
    'search': '',
    'group_by': '',
    'sort_by': ''
  }

  baseUrl = '/api/v1/articles'
  headers = {'Content-Type': 'application/json'}

  async fetch() {
    let query = ''

    for (let [k, v] of Object.entries(this.queryParams)) {
      if (v) {
        if (query) {
          query += `&${k}=${v}`
        } else {
          query += `${k}=${v}`
        }
      }
    }

    let url = this.baseUrl

    if (query) {
      url += `?${query}`
    }

    let response = await fetch(url, {headers: this.headers})

    this.items = await response.json()
  }

  destroy(id) {
    fetch(`${this.baseUrl}/${id}`, {method: 'DELETE', headers: this.headers})
  }

  create() {
    let body = JSON.stringify({article: this.newItem})

    fetch(this.baseUrl, {method: 'POST', body: body, headers: this.headers})

    this.newItem['name'] = ''
    this.newItem['text'] = ''
    this.newItem['article_type'] = 'blog_post'
    this.newItem['story_name'] = ''
  }
}
