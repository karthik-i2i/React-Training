import "./list-layout.css";

export default function ListLayout({ title, headerRight, searchValue, onSearchChange, children, page, totalPages, onPrev, onNext, searchPlaceholder}) {
  
  return (
    <div className="list-container">
      <div className="list-header">
        {title && <h2 className="list-title">{title}</h2>}
        <input type="text" className="list-search-bar" placeholder={searchPlaceholder || `Search ${title || ""}`} value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}/>
        {headerRight && <div className="list-header-right">{headerRight}</div>}
      </div>
      <div className="list-content">
        {children}
      </div>
      <div className="pagination">
        <button disabled={page === 1} onClick={onPrev}>Prev</button>
        <span>{page} / {totalPages}</span>
        <button disabled={page === totalPages} onClick={onNext}>Next</button>
      </div>
    </div>
  );
}
