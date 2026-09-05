import { Site } from "@/components/Site";
import { loadTabs } from "@/content/tabs";

export default async function Home() {
  const tabs = await loadTabs();
  return <Site tabs={tabs} />;
}
