import {History} from './base'
import {noop} from '../../util/core'
import {on} from '../../util/dom'
import {parseQuery, getPath} from '../util'

export class HTML5History extends History {
  constructor(config) {
    super(config)
    this.mode = 'history'
  }

  getCurrentPath() {
    const base = this.getBasePath()
    let path = window.location.pathname

    if (base && path.indexOf(base) === 0) {
      path = path.slice(base.length)
    }

    return (path || '/') + window.location.search + window.location.hash
  }

  onchange(cb = noop) {
    on('click', e => {
      const el = e.target.tagName === 'A' ? e.target : e.target.parentNode

      if (el.tagName === 'A' && !/_blank/.test(el.target)) {
        e.preventDefault()
        const url = el.href
        window.history.pushState({key: url}, '', url)
        cb()
      }
    })

    on('popstate', cb)
  }

  /**
   * Parse the url
   * @param {string} [path=location.href]
   * @return {object} { path, query }
   */
  parse(path = location.href) {
    let query = ''

    const queryIndex = path.indexOf('?')
    if (queryIndex >= 0) {
      query = path.slice(queryIndex + 1)
      path = path.slice(0, queryIndex)
    }

    const base = getPath(location.origin)
    const baseIndex = path.indexOf(base)

    if (baseIndex > -1) {
      path = path.slice(baseIndex + base.length)
    }

    return {
      path,
      file: this.getFile(path),
      query: parseQuery(query)
    }
  }
}