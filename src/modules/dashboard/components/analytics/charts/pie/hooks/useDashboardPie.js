import { useMemo } from "react";
import sampleDashboardPieData from "../utils/seeds"; // Make sure this data is structured correctly

const useDashboardPie = (data = sampleDashboardPieData) => {
  const dashboardPieConfig = useMemo(
    () => ({
      title: "Desktops",
      subtitle: "Total 2000",
      unit: "", // You can replace this with a meaningful unit or remove it
      data: [
        { value: data?.inUse, name: "In Use" },
        { value: data?.underProcurement, name: "Under Procurement" },
        { value: data?.unAllocated, name: "Unallocated" },
        { value: data?.discarded, name: "Discarded" },
        { value: data?.underMaintenence, name: "Under Maintenance" },
      ], // Assuming `data` is an array of objects for the pie chart
    }),
    [data]
  );

  return {
    dashboardPieConfig,
  };
};

export default useDashboardPie;
