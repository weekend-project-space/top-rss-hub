// Utilities
import {
  defineStore
} from 'pinia'

// feed 数据结构
// {
//   title: string,
//   url: string,
//   htmlUrl: string,
//   category: string,
//   description: string, 
//   lastBuildDate: string,
//   item: [
//     {
//       title: string,
//       link: string,
//       description: string,
//     }
//   ]
// }


export const useAppStore = defineStore('app', {
  state: () => ({
    feeds: [],
    loves: JSON.parse(localStorage.getItem('loves')) || [],
  }),
  actions: {
    async fetchFeeds() {
      const res = await fetch('/feeds.json')
      this.feeds = await res.json()
    },
    addLove(feed) {
      this.loves.push(feed)
      localStorage.setItem('loves', JSON.stringify(this.loves))
    },
    removeLove(feed) {
      this.loves = this.loves.filter((item) => item.url !== feed.url)
      localStorage.setItem('loves', JSON.stringify(this.loves))
    }
  },
  getters: {
    cagetories: (state) => {
      return [...new Set(state.feeds.map((item) => item.category))]
    }
  }

})
