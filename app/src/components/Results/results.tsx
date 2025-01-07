"use client";
import styles from "./results.module.css";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { fetchFilms } from "@/app/src/service/film";
import { FilmResult } from "@/app/src/types/filmResult";
import Link from "next/link";
import clsx from "clsx";
import { useVisited, VisitedIdentifiers } from "@/app/src/hooks/useVisited";

export const Results = () => {
  const query = useSearchParams();
  const [items, setItems] = useState<FilmResult[]>([]);
  const [error, setError] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const { setVisited, visited } = useVisited({
    identifier: VisitedIdentifiers.Results,
  });
  const [fetchTime, setFetchTime] = useState<number>(0);
  const term = query.get("q");

  useEffect(() => {
    startTransition(async () => {
      setError("");
      setFetchTime(0);

      if (!term) return;

      const startTime = performance.now();

      const result = await fetchFilms(term);

      const endTime = performance.now();

      setFetchTime(endTime - startTime);

      if (Array.isArray(result)) {
        setItems(result);
      } else {
        setError(result);
      }
    });
  }, [term]);

  return (
    <div className={styles.results}>
      {error}

      {isPending ? (
        <div>Loading...</div>
      ) : (
        <>
          {fetchTime && (
            <span>
              Found {items.length} items in {Math.floor(fetchTime)}ms.
            </span>
          )}

          {items.map((item) => (
            <div className={styles.result} key={`result-${item.film_id}`}>
              <Link
                href={`/films/${item.film_id}`}
                passHref
                onClick={() => setVisited(item.film_id)}
              >
                <h4
                  className={clsx(
                    styles.title,
                    visited[item.film_id] && styles.visited,
                  )}
                >
                  {item.title}
                </h4>
              </Link>

              <p>{item.description}</p>
            </div>
          ))}
        </>
      )}
    </div>
  );
};
