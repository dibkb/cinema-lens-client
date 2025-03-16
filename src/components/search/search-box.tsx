import { useQueryState } from "nuqs";
import { useMemo } from "react";

const SearchBox = ({ type }: { type?: string }) => {
  const [query, setQuery] = useQueryState("query", {
    defaultValue: "",
  });

  const placeholder = useMemo(() => {
    if (type === "natural-language") {
      return "Type your movie query here… e.g., 'movies directed by Steven Spielberg in the 1980s'";
    } else if (type === "plot-summaries") {
      return "Type your movie plot here… e.g., 'movies where the protagonist is a detective and the antagonist is a serial killer'";
    }
  }, [type]);

  return (
    <div className="bg-white rounded-lg w-[900px] mt-9 px-4 py-2 flex flex-col">
      <textarea
        placeholder={placeholder}
        className="w-full outline-none resize-none overflow-y-hidden min-h-[2rem] font-medium"
        style={{ height: "auto" }}
        onInput={(e) => {
          const target = e.target as HTMLTextAreaElement;
          target.style.height = "0px";
          target.style.height = `${target.scrollHeight}px`;
        }}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <main className="h-12"></main>
    </div>
  );
};

export default SearchBox;
