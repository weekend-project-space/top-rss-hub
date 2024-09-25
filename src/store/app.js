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
    loves: [],
  }),
  actions: {
    async fetchFeeds() {
      const res = await fetch('/feeds.json')
      this.feeds = await res.json()
    },
    addLove(feed) {
      // console.log('addLove', feed)
      this.loves.push(feed)
    },
    removeLove(feed) {
      // console.log('removeLove', feed)
      this.loves = this.loves.filter((item) => item.url !== feed.url)
    }
  },
  getters: {
    cagetories: (state) => {
      return [...new Set(state.feeds.map((item) => item.category))]
    },
  }

})
