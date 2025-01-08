import { Film, FilmResult, FilmSuggestion } from "@/app/src/types/filmResult";

export async function fetchFilms(
  term: string,
  body?: Record<string, string | number>,
): Promise<FilmSuggestion[] | FilmResult[] | string> {
  try {
    const response = await fetch(
      process.env.NEXT_PUBLIC_API_URL + `/film-search/${term}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error: any) {
    return error.message;
  }
}

export async function fetchFilm(id: string): Promise<Film | string> {
  try {
    const response = await fetch(
      process.env.NEXT_PUBLIC_API_URL + `/film/${id}`,
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error: any) {
    return error.message;
  }
}
