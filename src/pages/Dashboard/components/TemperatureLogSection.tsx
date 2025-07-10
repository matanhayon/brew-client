import { useEffect, useState } from "react";
import TemperatureLogCard from "./TemperatureLogCard";
import { getBrewTempLogs } from "@/api/brew";
import type { BrewTempLog } from "@/api/types";

type TemperatureLogSectionProps = {
  brewId: string;
  brewStatus: string;
};

const TemperatureLogSection = ({
  brewId,
  brewStatus,
}: TemperatureLogSectionProps) => {
  const [tempLogs, setTempLogs] = useState<BrewTempLog[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    if (brewStatus !== "started") return;

    let isMounted = true;

    const fetchLogs = async () => {
      try {
        const logs = await getBrewTempLogs(brewId);
        if (isMounted) {
          setTempLogs(logs);
        }
      } finally {
        if (isMounted) {
          setInitialLoading(false);
        }
      }
    };

    fetchLogs(); // initial load
    const interval = setInterval(fetchLogs, 10000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [brewId, brewStatus]);

  if (brewStatus !== "started") return null;

  return (
    <TemperatureLogCard
      tempLogs={tempLogs}
      loading={initialLoading && tempLogs.length === 0}
    />
  );
};

export default TemperatureLogSection;
