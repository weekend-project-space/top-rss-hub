// 将 json 转换为 opml
export function jsonToOpml(json) {
  return `<?xml version="1.0" encoding="UTF-8"?>
  <opml version="2.0">
    <body>
      ${json.map((item) => `<outline text="${item.title}" type="rss" xmlUrl="${item.url}" htmlUrl="${item.htmlUrl}" category="${item.category}" />`).join('\n      ')}
    </body>
  </opml>`
}

// 将 opml 转换为 json
export function opmlToJson(opml) {
  const parser = new DOMParser()
  const xml = parser.parseFromString(opml, 'application/xml')
  const body = xml.querySelector('body')
  const outlines = body.querySelectorAll('outline')
  return Array.from(outlines).map((outline) => ({
    title: outline.getAttribute('text'),
    url: outline.getAttribute('xmlUrl'),
    htmlUrl: outline.getAttribute('htmlUrl'),
    category: outline.getAttribute('category'),
  }))
}
