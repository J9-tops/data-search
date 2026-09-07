import type { FormEvent } from "react";


interface SearchBarProps {
    value: string;
    onChange: (v: string) => void;
    onSubmit: (e: FormEvent) => void;
    loading: boolean;
    condensed: boolean;
    inputRef?: React.RefObject<HTMLInputElement>;
}

export default function SearchBar({
    value,
    onChange,
    onSubmit,
    loading,
    condensed,
    inputRef,
}: SearchBarProps) {
    return (
        <form
            className={`search-bar${condensed ? " search-bar--condensed" : ""}`}
            onSubmit={onSubmit}
            role="search"
        >
            <input
                ref={inputRef}
                type="text"
                className="search-bar__input"
                placeholder="Search for anything…"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                aria-label="Search"
            />
            <button
                type="submit"
                className="search-bar__button"
                disabled={loading || !value.trim()}
            >
                {loading ? "Searching" : "Search"}
            </button>
        </form>
    );
}
