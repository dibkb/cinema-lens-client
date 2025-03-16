import SelectGenre from "../genre/select";
import TabsLayout from "./layout";

const Summary = () => {
  return (
    <TabsLayout>
      <SelectGenre accentColor="cyan" />
    </TabsLayout>
  );
};

export default Summary;
