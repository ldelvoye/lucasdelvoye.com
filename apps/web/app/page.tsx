import { Frame } from "@/components/shell/Frame";
import { Shell } from "@/components/shell/Shell";
import { loadTabs } from "@/content/tabs";

export default async function Home() {
  const tabs = await loadTabs();
  return (
    <Frame title="smorg — lucasdelvoye">
      <Shell tabs={tabs} enabled />
    </Frame>
  );
}
