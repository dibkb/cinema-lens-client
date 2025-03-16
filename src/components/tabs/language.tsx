import SelectGenre from "../genre/select";
import TabsLayout from "./layout";

const Language = () => {
  return (
    <TabsLayout className="border">
      <SelectGenre />
    </TabsLayout>
  );
};

export default Language;
