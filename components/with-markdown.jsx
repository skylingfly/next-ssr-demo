import MarkdownIt from 'markdown-it'
import { memo, useMemo } from 'react'
import 'github-markdown-css'

const md = new MarkdownIt({
  html: true,
  linkify: true
})

function b64toutf8(bstr){
  return decodeURIComponent(escape(atob(bstr)))
}

export default memo(function markdownRenderContent({content, isBase64}) {
  const markContent = isBase64 ? b64toutf8(content): content
  const html = useMemo(() => md.render(markContent), [markContent])

  return (
    <div className="markdown-body">
      <div dangerouslySetInnerHTML={{__html:html}} />
    </div>
  )
})