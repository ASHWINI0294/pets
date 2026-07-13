const STATUS_FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'completed', label: 'Completed' },
  { key: 'pending', label: 'Pending' },
  { key: 'failed', label: 'Failed' },
]

export default function TransactionFilters({
  searchTerm,
  onSearchChange,
  activeFilter,
  onFilterChange,
}) {
  return (
    <div className="filters">
      <input
        type="search"
        className="search-input"
        placeholder="Search by merchant name…"
        value={searchTerm}
        onChange={(event) => onSearchChange(event.target.value)}
        aria-label="Search transactions by merchant name"
      />

      <div className="filter-tabs" role="tablist" aria-label="Filter by status">
        {STATUS_FILTERS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={activeFilter === key}
            className={`filter-tab ${activeFilter === key ? 'filter-tab--active' : ''}`}
            onClick={() => onFilterChange(key)}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}
