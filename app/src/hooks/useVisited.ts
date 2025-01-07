export enum VisitedIdentifiers {
  Searches = "searches",
  Results = "results",
}

export const useVisited = ({
  identifier,
}: {
  identifier: VisitedIdentifiers;
}) => {
  const storedVisited = window.localStorage.getItem(identifier) || "{}";
  const parsedVisited = JSON.parse(storedVisited);

  const setVisited = (id: number) => {
    window.localStorage.setItem(
      identifier,
      JSON.stringify(
        typeof parsedVisited === "object" && parsedVisited !== null
          ? { ...parsedVisited, [id]: true }
          : { [id]: true },
      ),
    );
  };

  return {
    setVisited,
    visited: parsedVisited,
  };
};
