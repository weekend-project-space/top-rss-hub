export function feed2follow(feed) {
  return 'https://s.webfollow.cc/f/' + feed.url.split('://')[1]
}
