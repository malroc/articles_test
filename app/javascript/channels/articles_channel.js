import consumer from './consumer'
import { observable } from 'mobx'

class Store {
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

    let url = '/articles.json'

    if (query) {
      url += `?${query}`
    }

    let response = await fetch(url)
    let data = await response.json()

    this.data = data
  }
}

export const store = new Store()

consumer.subscriptions.create(
  {channel: 'ArticlesChannel', room: 'articles_channel'},
  {
    async received() {
      store.fetch()
    }
  }
)
