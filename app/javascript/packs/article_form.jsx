import React from 'react'
import { observer } from 'mobx-react'

@observer
export default class ArticleForm extends React.Component {
  constructor (props) {
    super(props)

    this.onSubmit = this.onSubmit.bind(this)
    this.onChange = this.onChange.bind(this)
  }

  onSubmit(evt) {
    evt.preventDefault()

    let body = JSON.stringify({article: this.props.article})

    fetch(
      '/api/v1/articles',
      {
        method: 'POST',
        headers: {'Content-Type': 'application/json;charset=utf-8'},
        body: body
      }
    )

    this.props.article.name = ''
    this.props.article.text = ''
    this.props.article.article_type = 'blog_post'
    this.props.article.story_name = ''
  }

  onChange(evt) {
    this.props.article[evt.target.name] = evt.target.value
  }

  render() {
    return (
      <form method="POST" className="form-inline" onSubmit={this.onSubmit}>
        <div className="form-row">
          <div className="col">
            <input
              className="form-control"
              type="text"
              name="name"
              placeholder="Name"
              value={this.props.article.name}
              onChange={this.onChange}
            />
          </div>
          <div className="col">
            <input
              className="form-control"
              type="text"
              name="text"
              placeholder="Text"
              value={this.props.article.text}
              onChange={this.onChange}
            />
          </div>
          <div className="col">
            <select
              className="form-control"
              name="article_type"
              value={this.props.article.article_type}
              onChange={this.onChange}
            >
              <option value="blog_post">Blog post</option>
              <option value="facebook_post">Facebook post</option>
              <option value="tweet">Tweet</option>
            </select>
          </div>
          <div className="col">
            <input
              className="form-control"
              type="text"
              name="story_name"
              placeholder="Story name"
              value={this.props.article.story_name}
              onChange={this.onChange}
            />
          </div>
          <div className="col">
            <button
              type="submit"
              className="btn btn-success"
              disabled={
                !this.props.article.name ||
                !this.props.article.text ||
                !this.props.article.story_name
              }
            >
              Create article
            </button>
          </div>
        </div>
      </form>
    )
  }
}
