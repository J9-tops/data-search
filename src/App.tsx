import {
  useState,
  useRef,
  useEffect,
  type FormEvent,
} from "react";
import "./App.css";
import type { SearchResult } from "./types";
import SearchBar from "./components/search-bar";
import { searchQuery } from "./services/search";
import ResultModal from "./components/result-modal";


// ---- Main page -----------------------------------------------------------

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState<number | null>(null);
  const [perPage, setPerPage] = useState<number>(20);
  const [condensed, setCondensed] = useState(false);
  const [selected, setSelected] = useState<SearchResult | null>(null);

  const sentinelRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const stickyInputRef = useRef<HTMLTextAreaElement>(null);

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

  // Focus sticky input when condensed becomes true
  useEffect(() => {
    if (condensed) {
      stickyInputRef.current?.focus();
    }
  }, [condensed]);

  // Abortable fetch wrapper using the service
  const fetchResults = (() => {
    let controller: AbortController | null = null;
    return async (q: string, p: number) => {
      controller?.abort();
      controller = new AbortController();
      const signal = controller.signal;
      setLoading(true);
      try {
        const data: any = await searchQuery(q, p, signal);
        // support either an array or { results, total_results / total, per_page }
        if (Array.isArray(data)) {
          setResults(data);
          setTotal(null);
          setPerPage(data.length || perPage);
        } else if (data && Array.isArray(data.results)) {
          setResults(data.results);
          setTotal(
            typeof data.total_results === "number"
              ? data.total_results
              : typeof data.total === "number"
              ? data.total
              : null
          );
          setPerPage(typeof data.per_page === "number" ? data.per_page : perPage);
        } else {
          setResults([]);
          setTotal(null);
        }
        setHasSearched(true);
        setTimeout(
          () => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
          50
        );
      } catch (err) {
        if ((err as any).name !== "AbortError") {
          console.error(err);
          setResults([]);
          setHasSearched(true);
        }
      } finally {
        setLoading(false);
      }
    };
  })();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setPage(1);
    void fetchResults(query.trim(), 1);
  };

  // fetch when page changes (but only after an initial search)
  useEffect(() => {
    if (!hasSearched) return;
    // avoid fetching if no query
    if (!query.trim()) return;
    void fetchResults(query.trim(), page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

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
              {total !== null ? total : results.length} result{(total ?? results.length) === 1 ? "" : "s"} for
              &ldquo;{query}&rdquo;
            </p>
            <div className="results__grid">
              {results.map((r) => {
                const photo =
                  r.photos && r.photos.length
                    ? (r.photos[0].startsWith("http") ? r.photos[0] : `https://images.hotels.ng/${r.photos[0]}`)
                    : null;
                const street = r.location_obj?.street?.[0] ?? r.locations?.[0]?.street ?? "not provided";
                const price = r.minprice ? `${r.default_currency_code ?? ""} ${r.minprice}` : "not provided";

                return (
                  <div key={r.id} className="result-card" onClick={() => setSelected(r)} role="button" tabIndex={0}>
                    <div className="result-card__image">
                      {photo ? <img src={photo} alt={r.business_name ?? "photo"} /> : <div className="result-card__noimage">No image</div>}
                    </div>
                    <div className="result-card__body">
                      <h3 className="result-card__title">{r.business_name ?? "not provided"}</h3>
                      <div className="result-card__street">{street}</div>
                      <div className="result-card__price">{price}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            {selected && <ResultModal item={selected} onClose={() => setSelected(null)} />}
            {/* Pagination controls */}
            <div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 18 }}>
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1 || loading}
                aria-label="Previous page"
              >
                Prev
              </button>
              <div style={{ alignSelf: "center" }}>Page {page}</div>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={
                  loading ||
                  // disable if server returned fewer than perPage items on this page
                  (results.length < perPage && !(total && page * perPage < total)) ||
                  (total !== null && page * perPage >= total)
                }
                aria-label="Next page"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}