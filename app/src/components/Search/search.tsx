"use client";
import {
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import { fetchFilms } from "@/app/src/service/film";
import { useDebounce } from "@/app/src/hooks/useDebounce";
import { FilmSuggestion } from "@/app/src/types/filmResult";
import styles from "./search.module.css";
import clsx from "clsx";
import { Glass } from "@/app/src/icons/glass";
import { useRouter, useSearchParams } from "next/navigation";
import { useOnClickOutside } from "@/app/src/hooks/useOnClickOutside";
import { useVisited, VisitedIdentifiers } from "@/app/src/hooks/useVisited";

export const Search = ({
  className,
  autofocus = true,
}: {
  className?: string;
  autofocus?: boolean;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isFocused, setIsFocused] = useState(autofocus);
  const [suggestions, setSuggestions] = useState<FilmSuggestion[]>([]);
  const [debouncedTerm, term, setTerm] = useDebounce<string>(
    searchParams.get("q") || "",
    300,
  );
  const [arrowSuggestion, setArrowSuggestion] = useState<number | undefined>();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string>("");
  const selfRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { setVisited, visited } = useVisited({
    identifier: VisitedIdentifiers.Searches,
  });

  useOnClickOutside({
    ref: selfRef,
    onClickOutside: () => setIsFocused(false),
  });

  useEffect(() => {
    if (!debouncedTerm) return setSuggestions([]);

    if (isPending) return;

    getSuggestions();
  }, [debouncedTerm]);

  useEffect(() => {
    if (inputRef.current) {
      const input = inputRef.current;
      inputRef.current.focus();
      setTimeout(() => {
        input.setSelectionRange(input.value.length, input.value.length);
      }, 0);
    }
  }, [arrowSuggestion]);

  const getSuggestions = () => {
    startTransition(async () => {
      setError("");

      const result = await fetchFilms(debouncedTerm, { limit: 10 });

      if (Array.isArray(result)) {
        setSuggestions(result);
      } else {
        setError(result);
      }
    });
  };

  const onKeyDown = (
    e: KeyboardEvent<HTMLInputElement> & { target: { value: string } },
  ) => {
    setIsFocused(true);

    if (!term) return;

    if (e.key === "Enter") {
      const suggestion =
        typeof arrowSuggestion === "number"
          ? suggestions[arrowSuggestion]
          : suggestions.find(
              (s) =>
                s.title.trim().toLowerCase() ===
                e.target.value.trim().toLowerCase(),
            );

      handleSelection(suggestion?.title || term, suggestion?.film_id);

      return;
    }

    if (e.key === "ArrowDown") {
      if (arrowSuggestion === undefined) {
        setArrowSuggestion(0);
      } else if (arrowSuggestion + 1 <= suggestions.length - 1) {
        setArrowSuggestion(arrowSuggestion + 1);
      } else {
        setArrowSuggestion(undefined);
      }

      return;
    }

    if (e.key === "ArrowUp") {
      if (arrowSuggestion === undefined) {
        setArrowSuggestion(suggestions.length - 1);
      } else if (arrowSuggestion - 1 >= 0) {
        setArrowSuggestion(arrowSuggestion - 1);
      } else {
        setArrowSuggestion(undefined);
      }

      return;
    }

    setTerm(e.target.value);
    setArrowSuggestion(undefined);
  };

  const renderSuggestions = isFocused && suggestions.length > 0;

  const handleSelection = (selection?: string, id?: number) => {
    if (id) {
      setVisited(id);
    }

    setArrowSuggestion(undefined);

    if (selection && selection !== term) {
      setTerm(selection);
    }

    setIsFocused(false);

    router.push(`/search?q=${selection || term}`);
  };

  return (
    <div ref={selfRef} className={clsx(styles.root, className)}>
      <div
        className={clsx(
          styles.search,
          renderSuggestions && styles.searchWithSuggestions,
        )}
      >
        <div
          onClick={() => setIsFocused(true)}
          className={clsx(
            styles.inputFrame,
            renderSuggestions && styles.inputFrameWithSuggestions,
          )}
        >
          <Glass />
          <input
            ref={inputRef}
            autoFocus={autofocus}
            onKeyDown={onKeyDown}
            type={"text"}
            name={"term"}
            value={
              typeof arrowSuggestion === "number"
                ? suggestions[arrowSuggestion].title
                : term
            }
            onChange={(e) => {
              setTerm(e.target.value);
            }}
            className={styles.input}
          />
        </div>
        {renderSuggestions && (
          <ul className={styles.suggestions}>
            {suggestions.map((item, index) => (
              <li
                className={clsx(
                  styles.suggestion,
                  index === arrowSuggestion && styles.arrowSuggestion,
                  typeof arrowSuggestion !== "number" && styles.suggestionHover,
                  visited[item.film_id] && styles.suggestionVisited,
                )}
                onMouseLeave={() => setArrowSuggestion(undefined)}
                onMouseEnter={() => setArrowSuggestion(undefined)}
                key={`suggestion-${item.film_id}`}
                onClick={() => handleSelection(item.title, item.film_id)}
              >
                <Glass />
                {item.title}
              </li>
            ))}
          </ul>
        )}
      </div>

      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
};
