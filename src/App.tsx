import Language from "./components/tabs/language";
import Summary from "./components/tabs/summary";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import LanguageIcon from "./icons/language";
import Pencil from "./icons/pencil";
import { useQueryState } from "nuqs";
function App() {
  const [type, setType] = useQueryState("type", {
    defaultValue: "natural-language",
  });
  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <section>
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
    </main>
  );
}

export default App;
