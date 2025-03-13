import styles from './search.module.scss'
import { SearchIcon } from '@/assets/icons/icons'

export default function Search() {
  return (
    <div className={styles.btnContent}>
      <span className={styles.searchIcon}>
        <SearchIcon />
      </span>
      <input
        id="header-search"
        type="text"
        readOnly={true}
        placeholder="Пошук"
        name="search"
        className={styles.searchInput}
        autoComplete="off"
      />
      <span className={styles.invisibleSearchSpan}></span>
    </div>
  )
}
