export default function SecureLayout({ children }) {
  return (
    <main className="flex min-h-screen flex-col justify-between p-24">
      <div>
        {children}
      </div>
    </main>
  )
}