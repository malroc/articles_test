import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { observable } from 'mobx'
import ArticlesTable from './articles_table'
import ArticleForm from './article_form'
import RootStore, { RootStoreContext } from '../stores/root_store'

class App extends React.Component {
  render() {
    return (
      <RootStoreContext.Provider value={new RootStore()}>
        <div className="container">
          <h1>Articles</h1>
          <ArticlesTable />
          <ArticleForm
            article={
              observable(
                {name: '', text: '', article_type: 'blog_post', story_name: ''}
              )
            }
          />
        </div>
      </RootStoreContext.Provider>
    )
  }
}

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <App />,
    document.body.appendChild(document.createElement('div')),
  )
})
