import SearchBox from "./components/search/search-box";
import Language from "./components/tabs/language";
import Summary from "./components/tabs/summary";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import LanguageIcon from "./icons/language";
import Pencil from "./icons/pencil";
import {
  parseAsArrayOf,
  parseAsBoolean,
  parseAsInteger,
  useQueryState,
} from "nuqs";
import { useEffect, useRef, useState } from "react";
import useHistoryStore from "./store/history";
import { cn } from "./lib/utils";
import Search from "./pages/search";
import { baseURL } from "./axios/base";
import { getGenres } from "./utils/year";
import { processYear } from "./utils/year";
import PlotSummary from "./pages/summary";

function App() {
  const [type, setType] = useQueryState("type", {
    defaultValue: "natural-language",
  });
  const [query, setQuery] = useQueryState("query", {
    defaultValue: "",
  });
  const [reddit] = useQueryState("reddit", parseAsBoolean.withDefault(false));
  const [letterboxd] = useQueryState(
    "letterboxd",
    parseAsBoolean.withDefault(false)
  );
  const [genresSelected] = useQueryState(
    "selected",
    parseAsArrayOf(parseAsInteger)
  );
  const [yearsSelected] = useQueryState("year", parseAsArrayOf(parseAsInteger));

  const [isStreaming, setIsStreaming] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);
  const {
    homepage,
    setHomepage,
    tempMessages,
    updateTempMessages,
    clearTempMessages,
    setTitle,
    title,
    setSimilarMovies,
    setRelatedMovies,
    setRedditMovies,
    setLetterboxdMovies,
    setEntities,
    setPlotSummaries,
  } = useHistoryStore();
  const searchMessagesEndRef = useRef<HTMLDivElement>(null);
  const summaryMessagesEndRef = useRef<HTMLDivElement>(null);
  // Scroll to bottom whenever tempUpdate changes
  useEffect(() => {
    searchMessagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    summaryMessagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [tempMessages]);

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  const handleSubmitSearch = () => {
    // updateSearchHistory(query)

    setSimilarMovies([]);
    setRelatedMovies([]);
    setRedditMovies([]);
    setLetterboxdMovies([]);
    setTitle(query);
    setHomepage(false);
    if (!query.trim() || isStreaming) return;

    setQuery("");
    clearTempMessages();

    setIsStreaming(true);

    // Close existing connection
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    // Initialize new SSE connection
    const years = yearsSelected ? processYear(yearsSelected) : null;
    eventSourceRef.current = new EventSource(
      `${baseURL}/stream-response?query=${encodeURIComponent(
        query
      )}&reddit=${reddit}&letterboxd=${letterboxd}&genres=${getGenres(
        genresSelected
      )?.join(",")}&min_year=${years?.minYear}&max_year=${years?.maxYear}`
    );

    // Handle incoming data
    eventSourceRef.current.onmessage = (event) => {
      if (event.data.startsWith("xx--data")) {
        const [key, value] = event.data.split("xx--data--")[1].split("--");

        if (key === "similar_movies") {
          setSimilarMovies(JSON.parse(value));
        } else if (key === "related_movies") {
          setRelatedMovies(JSON.parse(value));
        } else if (key === "entities") {
          setEntities(JSON.parse(value));
        } else if (key === "reddit_results") {
          setRedditMovies(JSON.parse(value));
        } else if (key === "letterboxd_results") {
          setLetterboxdMovies(JSON.parse(value));
        }
      }
      updateTempMessages(event.data);
    };

    // Handle errors/stream end
    eventSourceRef.current.onerror = () => {
      eventSourceRef.current?.close();
      setIsStreaming(false);
      // clearTempMessages();
      eventSourceRef.current = null;
    };
  };

  const handleSubmitSemantic = () => {
    setQuery("");

    setTitle(query);

    clearTempMessages();
    setPlotSummaries([]);

    setHomepage(false);

    setIsStreaming(true);

    eventSourceRef.current = new EventSource(
      `${baseURL}/stream-response-summary?query=${encodeURIComponent(query)}`
    );

    eventSourceRef.current.onmessage = (event) => {
      if (event.data.startsWith("xx--data")) {
        const [key, value] = event.data.split("xx--data--")[1].split("--");

        if (key === "similar_movies") {
          setPlotSummaries(JSON.parse(value));
        }
      }
      updateTempMessages(event.data);
    };

    eventSourceRef.current.onerror = () => {
      eventSourceRef.current?.close();
      setIsStreaming(false);
      eventSourceRef.current = null;
    };
  };

  const alternateHomepage = (
    <section className="container mx-auto max-w-[900px] w-[90vw] h-[calc(100vh-9rem)] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      <h1 className="text-2xl md:text-3xl h-[4rem] md:h-[5rem] z-10 font-bold absolute top-0 left-0 right-0 libre-baskerville-regular py-4 text-stone-700 text-center line-clamp-1 truncate">
        {title.length > 50 ? title.substring(0, 50) + "..." : title}
      </h1>
      {type === "natural-language" && (
        <Search
          searchMessagesEndRef={searchMessagesEndRef}
          isStreaming={isStreaming}
        />
      )}
      {type === "plot-summaries" && (
        <PlotSummary
          searchMessagesEndRef={summaryMessagesEndRef}
          isStreaming={isStreaming}
        />
      )}
    </section>
  );

  return (
    <main className="flex flex-col items-center justify-center h-[100vh] overflow-hidden bg-transparent">
      {homepage === true && (
        <section className="max-w-[900px] w-[90vw] max-h-[calc(100vh-9rem)] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="flex flex-col gap-4 items-center">
            <h2 className="text-5xl libre-baskerville-regular">
              Discover Your Next Favorite Movie
            </h2>
            <p className="text-stone-600">
              Search by natural language or dive into detailed plot summaries.
            </p>
          </div>
        </section>
      )}
      <section
        className={cn(
          homepage === false && "absolute bottom-4 z-40 max-w-[900px] w-[90vw]",
          "bg-white"
        )}
      >
        <Tabs
          defaultValue={type}
          className={cn(
            "w-full flex justify-center items-center my-6",
            homepage === false && "mt-4 mb-6"
          )}
          onValueChange={(value) => {
            setType(value);
          }}
        >
          <TabsList className="bg-zinc-200 text-xs">
            <TabsTrigger
              value="natural-language"
              className="text-xs cursor-pointer data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:border-none w-full min-w-[150px] sm:w-44 md:w-64"
            >
              <LanguageIcon />
              Natural Language
            </TabsTrigger>
            <TabsTrigger
              value="plot-summaries"
              className="text-xs cursor-pointer data-[state=active]:bg-cyan-600 data-[state=active]:text-white data-[state=active]:border-none w-full min-w-[150px] sm:w-44 md:w-64"
            >
              <Pencil />
              Semantic Search
            </TabsTrigger>
          </TabsList>
          <TabsContent value="natural-language" className="w-full">
            <Language />
          </TabsContent>
          <TabsContent value="plot-summaries" className="w-full">
            <Summary />
          </TabsContent>
        </Tabs>
        <SearchBox
          isStreaming={isStreaming}
          type={type}
          className={""}
          handleSubmitSearch={handleSubmitSearch}
          handleSubmitSemantic={handleSubmitSemantic}
          query={query}
          setQuery={setQuery}
        />
      </section>

      {homepage === false && alternateHomepage}
    </main>
  );
}

export default App;
