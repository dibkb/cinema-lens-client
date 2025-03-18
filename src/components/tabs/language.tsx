import DateRange from "../date/range";
import SelectGenre from "../genre/select";
import TabsLayout from "./layout";

const Language = () => {
  return (
    <TabsLayout className="">
      <div className="flex flex-col md:flex-row items-center justify-center gap-2">
        <SelectGenre accentColor="blue" />
        <DateRange accentColor="blue" />
      </div>
    </TabsLayout>
  );
};

export default Language;
