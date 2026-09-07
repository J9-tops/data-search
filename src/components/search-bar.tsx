import type { FormEvent, KeyboardEvent, RefObject } from "react";
import { useEffect, useRef } from "react";

interface SearchBarProps {
    value: string;
    onChange: (v: string) => void;
    onSubmit: (e: FormEvent) => void;
    loading: boolean;
    condensed: boolean;
    inputRef?: RefObject<HTMLTextAreaElement | null>;
}

export default function SearchBar({
    value,
    onChange,
    onSubmit,
    loading,
    condensed,
    inputRef,
}: SearchBarProps) {
    const internalRef = useRef<HTMLTextAreaElement>(null);
    const ref = inputRef ?? internalRef;

    // Auto-grow the textarea as the user types
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        el.style.height = "auto";
        el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
    }, [value, ref]);

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (!loading && value.trim()) {
                onSubmit(e as unknown as FormEvent);
            }
        }
    };

    return (
        <form
            className={`search-bar${condensed ? " search-bar--condensed" : ""}`}
            onSubmit={onSubmit}
            role="search"
        >
            <textarea
                ref={ref}
                className="search-bar__input"
                placeholder="Search for anything…"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                aria-label="Search"
            />
            <button
                type="submit"
                className="search-bar__button"
                disabled={loading || !value.trim()}
                aria-label="Send"
            >
                {loading ? (
                    <span className="search-bar__spinner" />
                ) : (
                    <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M12 19V5M12 5L6 11M12 5L18 11"
                            stroke="currentColor"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                )}
            </button>
        </form>
    );
}