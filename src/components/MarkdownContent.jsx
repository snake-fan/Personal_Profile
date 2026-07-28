import ReactMarkdown from 'react-markdown'

export default function MarkdownContent({ children, className = '' }) {
  return (
    <div className={`markdown-content ${className}`.trim()}>
      <ReactMarkdown
        components={{
          a: ({ href, children: linkChildren, node: _node, ...props }) => {
            const isExternal = href?.startsWith('http')

            return (
              <a
                href={href}
                {...(isExternal ? { target: '_blank', rel: 'noreferrer' } : {})}
                {...props}
              >
                {linkChildren}
              </a>
            )
          },
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  )
}
