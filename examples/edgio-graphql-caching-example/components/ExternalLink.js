export default function ExternalLink({ href, children }) {
  return (
    <a className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600" rel="noreferrer" href={href} target="_blank">
      {children}
    </a>
  )
}
