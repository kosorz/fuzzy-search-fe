import { fetchFilm } from "@/app/src/service/film";
import { Film } from "@/app/src/types/filmResult";

interface ResultProps {
  params: {
    id: string;
  } & Promise<any>;
}

export default async function Result({ params }: ResultProps) {
  const { id } = params;

  let item: Film | undefined;
  let error: string = "";

  if (!id) {
    error = "No film ID provided.";
  } else {
    const result = await fetchFilm(id);

    if (typeof result === "string") {
      error = result;
    } else {
      item = result;
    }
  }

  return <>{error || <pre>{JSON.stringify(item, null, 2)}</pre>}</>;
}
