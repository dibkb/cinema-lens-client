import { api } from "./axios/base";
import SearchBox from "./components/search/search-box";
import Language from "./components/tabs/language";
import Summary from "./components/tabs/summary";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import LanguageIcon from "./icons/language";
import Pencil from "./icons/pencil";
import { parseAsBoolean, useQueryState } from "nuqs";
import { useEffect, useRef, useState } from "react";

function App() {
  const [type, setType] = useQueryState("type", {
    defaultValue: "natural-language",
  });
  const [homepage, setHomepage] = useQueryState(
    "homepage",
    parseAsBoolean.withDefault(true)
  );
  const [query, setQuery] = useQueryState("query", {
    defaultValue: "",
  });

  const [isStreaming, setIsStreaming] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    []
  );
  const [tempUpdate, setTempUpdate] = useState<string[]>([]);

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  const handleSubmit = () => {
    setHomepage(false);
    if (!query.trim() || isStreaming) return;

    // Add user message
    setMessages((prev) => [...prev, { role: "user", content: query }]);
    setQuery("");

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
      console.log(event.data);
      setTempUpdate((prev) => [...prev, event.data]);
    };

    // Handle errors/stream end
    eventSourceRef.current.onerror = () => {
      eventSourceRef.current?.close();
      setIsStreaming(false);
      eventSourceRef.current = null;
    };
  };

  return (
    <main className="flex flex-col items-center justify-center h-screen">
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
      {homepage === false && (
        <section className="container mx-auto max-w-[900px] w-[90vw] ">
          <div className="flex flex-col gap-1 text-xs text-stone-600">
            {tempUpdate.map((message) => (
              <div key={message}>{message}</div>
            ))}
          </div>
        </section>
      )}
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
