import { Site } from "@/components/Site";
import { Pane } from "@/components/shell/Pane";
import { TABS } from "@/features/tabs";

export default function Home() {
  const tabs = TABS.map((tab) => {
    return { id: tab.id, label: tab.label };
  });
  const panes = TABS.map((tab) => {
    const Panel = tab.Panel;
    return (
      <Pane key={tab.id} id={tab.id} label={tab.label}>
        <Panel />
      </Pane>
    );
  });
  return <Site tabs={tabs}>{panes}</Site>;
}
