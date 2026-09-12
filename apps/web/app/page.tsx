import { Suspense } from "react";
import { Site } from "@/components/Site";
import { Pane } from "@/components/shell/Pane";
import { Player } from "@/components/shell/Player";
import { PlayerNow } from "@/features/spotify/PlayerNow";
import { TABS } from "@/features/tabs";
import { smorgVersion } from "@/lib/smorg";

export default async function Home() {
  const version = await smorgVersion();
  const tabs = TABS.map((tab) => {
    return { id: tab.id, label: tab.label };
  });
  const panes = TABS.map((tab) => {
    const Panel = tab.Panel;
    let content = <Panel />;
    if (tab.Fallback !== null) {
      const Fallback = tab.Fallback;
      content = (
        <Suspense fallback={<Fallback />}>
          <Panel />
        </Suspense>
      );
    }
    return (
      <Pane key={tab.id} id={tab.id} label={tab.label}>
        {content}
      </Pane>
    );
  });
  const player = (
    <Suspense fallback={<Player now={null} pending />}>
      <PlayerNow />
    </Suspense>
  );
  return (
    <Site version={version} tabs={tabs} player={player}>
      {panes}
    </Site>
  );
}
