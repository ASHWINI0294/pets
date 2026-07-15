import type { StatusFilter } from '../types'

const FILTERS: StatusFilter[] = ['all', 'completed', 'pending', 'failed']

interface TransactionFiltersProps {
  search: string
  filter: StatusFilter
  onSearchChange: (value: string) => void
  onFilterChange: (value: StatusFilter) => void
}

export default function TransactionFilters({
  search,
  filter,
  onSearchChange,
  onFilterChange,
}: TransactionFiltersProps) {
  return (
    <div className="controls">
      <input
        type="search"
        placeholder="Search merchant…"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        aria-label="Search transactions by merchant"
      />
      <div className="tabs" role="tablist" aria-label="Filter by status">
        {FILTERS.map((item) => (
          <button
            key={item}
            type="button"
            role="tab"
            aria-selected={filter === item}
            className={filter === item ? 'active' : ''}
            onClick={() => onFilterChange(item)}
          >
            {item.charAt(0).toUpperCase() + item.slice(1)}
          </button>
        ))}
      </div>
    </div>
  )
}
