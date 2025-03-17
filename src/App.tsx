import SearchBox from "./components/search/search-box";
import Language from "./components/tabs/language";
import Summary from "./components/tabs/summary";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import LanguageIcon from "./icons/language";
import Pencil from "./icons/pencil";
import { useQueryState } from "nuqs";
import { useEffect, useRef, useState } from "react";
import useHistoryStore from "./store/history";
import Results from "./components/results/results";

function App() {
  const [type, setType] = useQueryState("type", {
    defaultValue: "natural-language",
  });
  const [query, setQuery] = useQueryState("query", {
    defaultValue: "",
  });

  const [isStreaming, setIsStreaming] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);
  const [, setMessages] = useState<{ role: string; content: string }[]>([]);
  const {
    homepage,
    setHomepage,
    tempMessages,
    updateTempMessages,
    clearTempMessages,
    searchHistory,
    updateSearchHistory,
    results,
    updateResults,
  } = useHistoryStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever tempUpdate changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [tempMessages]);

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  const handleSubmit = () => {
    updateSearchHistory(query);
    setHomepage(false);
    if (!query.trim() || isStreaming) return;

    // Add user message
    setMessages((prev) => [...prev, { role: "user", content: query }]);
    setQuery("");
    clearTempMessages();

    // Add empty assistant message
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);
    setIsStreaming(true);

    // Close existing connection
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    // Initialize new SSE connection
    eventSourceRef.current = new EventSource(
      `http://localhost:8000/stream-response?query=${query}`
    );

    // Handle incoming data
    eventSourceRef.current.onmessage = (event) => {
      if (event.data.startsWith("xxx==result==xxx")) {
        const data = event.data.split("xxx==result==xxx")[1];
        try {
          // Convert Python-style dict to valid JSON by replacing single quotes with double quotes
          const jsonString = data
            .trim()
            .replace(/'/g, '"')
            .replace(/False/g, "false")
            .replace(/True/g, "true")
            .replace(/None/g, "null");

          const result = JSON.parse(jsonString);
          updateResults(result);
          // Now you can use the result data
        } catch (error) {
          console.error("Error parsing JSON data:", error, data);
        }
      }
      updateTempMessages(event.data);
    };

    // Handle errors/stream end
    eventSourceRef.current.onerror = () => {
      eventSourceRef.current?.close();
      setIsStreaming(false);
      eventSourceRef.current = null;
    };
  };

  const alternateHomepage = (
    <section className="container mx-auto max-w-[900px] w-[90vw] h-[calc(100vh-9rem)]">
      <h1 className="text-3xl h-[5rem] z-10 font-bold absolute top-0 left-0 max-w-[900px] translate-x-1/2 w-[90vw] libre-baskerville-regular py-4 text-stone-700">
        {searchHistory[searchHistory.length - 1]}
      </h1>
      <div className="flex flex-col gap-1 text-sm text-stone-700 max-h-[400px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] cutive-mono-regular font-medium">
        {tempMessages.map((message) => (
          <div key={message}>{message}</div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      {/* Results */}
      {results && <Results />}
    </section>
  );

  return (
    <main className="flex flex-col items-center justify-center h-[100vh] overflow-y-none">
      {homepage === true && (
        <section className="max-w-[900px] w-[90vw]">
          <div className="flex flex-col gap-4 items-center">
            <h2 className="text-5xl libre-baskerville-regular">
              Discover Your Next Favorite Movie
            </h2>
            <p className="text-stone-600">
              Search by natural language or dive into detailed plot summaries.
            </p>
          </div>
          <Tabs
            defaultValue={type}
            className="mt-12 w-full flex justify-center items-center"
            onValueChange={(value) => {
              setType(value);
            }}
          >
            <TabsList className="bg-stone-50 text-xs">
              <TabsTrigger
                value="natural-language"
                className="text-xs cursor-pointer data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:border-none w-64"
              >
                <LanguageIcon />
                Natural Language
              </TabsTrigger>
              <TabsTrigger
                value="plot-summaries"
                className="text-xs cursor-pointer data-[state=active]:bg-cyan-600 data-[state=active]:text-white data-[state=active]:border-none w-64"
              >
                <Pencil />
                Plot Summaries
              </TabsTrigger>
            </TabsList>
            <TabsContent value="natural-language" className="w-full">
              <Language />
            </TabsContent>
            <TabsContent value="plot-summaries" className="w-full">
              <Summary />
            </TabsContent>
          </Tabs>
        </section>
      )}
      {homepage === false && alternateHomepage}
      <SearchBox
        type={type}
        homepage={homepage}
        handleSubmit={handleSubmit}
        query={query}
        setQuery={setQuery}
      />
    </main>
  );
}

export default App;
