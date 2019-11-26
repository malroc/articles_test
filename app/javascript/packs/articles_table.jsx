import React from 'react'
import { observer } from 'mobx-react'
import consumer from '../channels/consumer'
import { RootStoreContext } from '../stores/root_store'

@observer
export default class ArticlesTable extends React.Component {
  static contextType = RootStoreContext

  constructor(props, context) {
    super(props, context)

    this.onChange = this.onChange.bind(this)
  }

  componentDidMount() {
    let store = this.context.articlesStore

    store.fetch()

    consumer.subscriptions.create(
      {channel: 'ArticlesChannel', room: 'articles_channel'},
      {
        async received() {
          store.fetch()
        }
      }
    )
  }

  onChange(evt) {
    this.context.articlesStore.query[evt.target.name] = evt.target.value
    this.context.articlesStore.fetch()
  }

  async deleteArticle(id) {
    await fetch(
      `/api/v1/articles/${id}`,
      {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json;charset=utf-8'}
      }
    )

    this.context.articlesStore.fetch()
  }

  render() {
    return (
      <table className="table">
        <thead className="thead-light">
          <tr>
            <th scope="row">Name</th>
            <th scope="row">Text</th>
            <th scope="row">Type</th>
            <th scope="row">Story</th>
            <th></th>
          </tr>
        </thead>
        <tfoot>
          <tr>
            <td>
              <div className="input-group">
                <input
                  className="form-control py-2 border-right-0 border"
                  type="text"
                  name="search_by_name"
                  placeholder="Search by name"
                  value={this.context.articlesStore.query.search_by_name}
                  onChange={this.onChange}
                />
                <span className="input-group-append">
                  <div className="input-group-text bg-transparent">
                    <i className="fa fa-search" />
                  </div>
                </span>
              </div>
            </td>
            <td>
              <div className="input-group">
                <input
                  className="form-control py-2 border-right-0 border"
                  type="text"
                  name="search_by_text"
                  placeholder="Search by text"
                  value={this.context.articlesStore.query.search_by_text}
                  onChange={this.onChange}
                />
                <span className="input-group-append">
                  <div className="input-group-text bg-transparent">
                    <i className="fa fa-search" />
                  </div>
                </span>
              </div>
            </td>
            <td>
              <select
                className="form-control"
                name="sort_by"
                value={this.context.articlesStore.query.sort_by}
                onChange={this.onChange}
              >
                <option value="">(No sorting)</option>
                <option value="name">Sort by name</option>
                <option value="text">Sort by text</option>
                <option value="article_type">Sort by article type</option>
                <option value="story_id">Sort by story</option>
              </select>
            </td>
            <td>
              <select
                className="form-control"
                name="group_by"
                value={this.context.articlesStore.query.group_by}
                onChange={this.onChange}
              >
                <option value="">(No grouping)</option>
                <option value="name">Group by name</option>
                <option value="text">Group by text</option>
                <option value="article_type">Group by article type</option>
                <option value="story_id">Group by story</option>
              </select>
            </td>
            <td></td>
          </tr>
        </tfoot>
        {this.context.articlesStore.data.map(group => (
          <tbody key={group.key}>
            {group.list.map(article => (
              <tr key={article.id}>
                <th scope="col">{article.name}</th>
                <td>{article.text}</td>
                <td>{article.article_type}</td>
                <td>{article.story_name}</td>
                <td>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => this.deleteArticle(article.id)}
                  >
                    Delete article
                  </button>
                </td>
              </tr>
            ))}
            <tr className="table-info">
              <th scope="col">Group key: {group.key}</th>
              <td>Count: {group.count}</td>
              <td colSpan="3">
                {group.counts_by_type.map(item => (
                  <span
                    className="counts-by-type"
                    key={`${group.key}_${item.article_type}`}
                  >
                    {item.article_type}: {item.count}
                  </span>
                ))}
              </td>
            </tr>
          </tbody>
        ))}
      </table>
    )
  }
}
