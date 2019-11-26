import { observable } from 'mobx'

export default class StoriesStore {
  @observable items = []

  baseUrl = '/api/v1/stories'
  headers = {'Content-Type': 'application/json'}

  async fetch() {
    let response = await fetch(this.baseUrl, {headers: this.headers})

    this.items = await response.json()
  }
}
