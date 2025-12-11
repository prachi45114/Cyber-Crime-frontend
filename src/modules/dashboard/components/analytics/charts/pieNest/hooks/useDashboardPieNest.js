import { useMemo } from "react";
import sampleDashboardPieNestData from "../utils/seeds";

const useDashboardPieNest = (data = sampleDashboardPieNestData) => {
  const dashboardPieNestConfig = useMemo(
    () => ({
      title: "Desktops",
      subtitle: "Total 2000",
      unit: "",
      innerChartdata: [
          { value: data?.c3iHub, name: 'C3i Hub' },
          { value: data?.c3iCenter, name: 'C3i Center' },
          { value: data?.site, name: 'Tenant' },
      ],
      outerChartdata: [
          { value: data?.inUse, name: 'In Use' },
          { value: data?.underProcurement, name: 'Under Procurement' },
          { value: data?.unAllocated, name: 'Unallocated' },
          { value: data?.discarded, name: 'Discarded' },
          { value: data?.underMaintenence, name: 'Under Maintenence' }
      ],
    }),
    [data]
  );

  return {
    dashboardPieNestConfig,
  };
};

export default useDashboardPieNest;
