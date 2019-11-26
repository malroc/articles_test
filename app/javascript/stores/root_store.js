import React from 'react'
import ArticlesStore from './articles_store'

export default class RootStore {
  constructor() {
    this.articlesStore = new ArticlesStore()
  }
}

export const RootStoreContext = React.createContext()
