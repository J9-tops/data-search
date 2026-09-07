import {
  useState,
  useRef,
  useEffect,
  type FormEvent,
} from "react";
import "./App.css";
import type { SearchResult } from "./types";
import SearchBar from "./components/search-bar";


// ---- Main page -----------------------------------------------------------

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results] = useState<SearchResult[] | null>(null);
  const [loading] = useState(false);
  const [hasSearched] = useState(false);
  const [condensed, setCondensed] = useState(false);

  const sentinelRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const stickyInputRef = useRef<HTMLInputElement>(null);

  // Toggle the condensed/sticky style once the hero has scrolled out of view.
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => setCondensed(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);



  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

  };

  return (
    <div className="page">
      {/* Sticky bar — only interactive/visible once condensed */}
      <div
        className={`sticky-bar${condensed ? " sticky-bar--visible" : ""}`}
        aria-hidden={!condensed}
      >
        <div className="sticky-bar__inner">
          <span className="sticky-bar__mark">Find</span>
          <SearchBar
            value={query}
            onChange={setQuery}
            onSubmit={handleSubmit}
            loading={loading}
            condensed
            inputRef={stickyInputRef}
          />
        </div>
      </div>

      <section className="hero">
        <div className="hero__inner">
          <h1 className="hero__headline">
            Find what you're
            <br />
            looking for.
          </h1>
          <p className="hero__sub">
            Type a word, a phrase, or a half-formed thought. We'll do the
            rest.
          </p>
          <SearchBar
            value={query}
            onChange={setQuery}
            onSubmit={handleSubmit}
            loading={loading}
            condensed={false}
          />
        </div>
        <div className="hero__sentinel" ref={sentinelRef} />
      </section>

      <section className="results" ref={resultsRef}>
        {!hasSearched && (
          <div className="results__empty">
            <p>Nothing searched yet — your results will appear here.</p>
          </div>
        )}

        {hasSearched && loading && (
          <div className="results__loading" role="status">
            <span className="results__loading-dot" />
            <span className="results__loading-dot" />
            <span className="results__loading-dot" />
          </div>
        )}

        {hasSearched && !loading && results && results.length === 0 && (
          <div className="results__empty">
            <p>
              No matches for <strong>&ldquo;{query}&rdquo;</strong>. Try a
              different search.
            </p>
          </div>
        )}

        {hasSearched && !loading && results && results.length > 0 && (
          <div className="results__list">
            <p className="results__count">
              {results.length} result{results.length === 1 ? "" : "s"} for
              &ldquo;{query}&rdquo;
            </p>
            <ul className="results__items">
              {results.map((r) => (
                <li key={r.id} className="result-item">
                  <h2 className="result-item__title">{r.title}</h2>
                  <p className="result-item__snippet">{r.snippet}</p>
                  <span className="result-item__source">{r.source}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </div>
  );
}