import React from 'react'
import { observer } from 'mobx-react'
import { store } from '../channels/articles_channel'

@observer
export default class ArticlesTable extends React.Component {
  constructor (props) {
    super(props)

    this.onChange = this.onChange.bind(this)
  }

  componentDidMount() {
    store.fetch()
  }

  onChange(evt) {
    store.query[evt.target.name] = evt.target.value
    store.fetch()
  }

  async deleteArticle(id) {
    await fetch(
      `/api/v1/articles/${id}`,
      {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json;charset=utf-8'}
      }
    )

    store.fetch()
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
                  value={store.query.search_by_name}
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
                  value={store.query.search_by_text}
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
                value={store.query.sort_by}
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
                value={store.query.group_by}
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
        {store.data.map(group => (
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
