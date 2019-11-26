import React from 'react'
import ArticlesStore from './articles_store'
import StoriesStore from './stories_store'

export default class RootStore {
  constructor() {
    this.articlesStore = new ArticlesStore()
    this.storiesStore = new StoriesStore()
  }
}

export const RootStoreContext = React.createContext()
