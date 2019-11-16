import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { observable } from 'mobx'
import ArticlesTable from './articles_table'
import ArticleForm from './article_form'

const App = () => (
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
)

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <App />,
    document.body.appendChild(document.createElement('div')),
  )
})
