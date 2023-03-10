import { define, observable, action } from '@formily/reactive'

import { FlowMetaParam } from '@toy-box/autoflow-core'

function checkUnique(id, list): boolean {
  return list.findIndex((item) => item.id === id) === -1
}

export class Shortcut {
  list: FlowMetaParam[]
  constructor() {
    this.list = []
  }

  makeObservable() {
    define(this, {
      list: observable.shallow,
      push: action,
    })
  }

  push(shortcutItem: FlowMetaParam) {
    checkUnique(shortcutItem.id, this.list) && this.list.push(shortcutItem)
  }

  getList() {
    return this.list
  }
}
