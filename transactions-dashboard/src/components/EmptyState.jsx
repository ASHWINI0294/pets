export default function EmptyState({ message = 'Nothing to show yet.' }) {
  return (
    <div className="state state--empty">
      <span>{message}</span>
    </div>
  )
}
