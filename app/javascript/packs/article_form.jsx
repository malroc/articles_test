import React from 'react'
import { observer } from 'mobx-react'
import { RootStoreContext } from '../stores/root_store'

@observer
export default class ArticleForm extends React.Component {
  static contextType = RootStoreContext

  constructor(props, context) {
    super(props, context)

    this.onSubmit = this.onSubmit.bind(this)
    this.onChange = this.onChange.bind(this)
  }

  onSubmit(evt) {
    evt.preventDefault()

    this.context.articlesStore.create()
  }

  onChange(evt) {
    this.context.articlesStore.newItem[evt.target.name] = evt.target.value
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
              value={this.context.articlesStore.newItem['name']}
              onChange={this.onChange}
            />
          </div>
          <div className="col">
            <input
              className="form-control"
              type="text"
              name="text"
              placeholder="Text"
              value={this.context.articlesStore.newItem['text']}
              onChange={this.onChange}
            />
          </div>
          <div className="col">
            <select
              className="form-control"
              name="article_type"
              value={this.context.articlesStore.newItem['article_type']}
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
              value={this.context.articlesStore.newItem['story_name']}
              onChange={this.onChange}
            />
          </div>
          <div className="col">
            <button
              type="submit"
              className="btn btn-success"
              disabled={
                !this.context.articlesStore.newItem['name'] ||
                !this.context.articlesStore.newItem['text'] ||
                !this.context.articlesStore.newItem['story_name']
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
