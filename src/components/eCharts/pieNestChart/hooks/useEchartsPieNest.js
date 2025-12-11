import { useMemo } from "react";
import sampleEChartsPieNestConfigData from "../utils/seeds";

const useEchartsPieNest = (data = sampleEChartsPieNestConfigData) => {
  const innerChartdata = data?.innerChartdata;
  const outerChartdata = data?.outerChartdata;
  // Merging and returning name array
  const legendLabels = [...innerChartdata, ...outerChartdata].map(item => item.name);

  const title = data?.title;
 
  const eChartsPieNestConfig = useMemo(() => {
    return {
      title: {
          text: title,
          left: "center",
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        orient: "horizontal", // Ensure horizontal orientation
        bottom: 0, // Place legend at the bottom
        left: "center", // Center it horizontally at the bottom
        data: legendLabels
      },
      series: [
        {
          name: 'Status',
          type: 'pie',
          selectedMode: 'single',
          radius: [0, '30%'],
          label: {
            position: 'inner',
            fontSize: 14
          },
          labelLine: {
            show: false
          },
          data: innerChartdata,
        },
        {
          name: 'Asset Status',
          type: 'pie',
          radius: ['45%', '60%'],
          labelLine: {
            length: 30
          },
          label: {
            formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
            backgroundColor: '#F6F8FC',
            borderColor: '#8C8D8E',
            borderWidth: 1,
            borderRadius: 4,
            rich: {
              a: {
                color: '#6E7079',
                lineHeight: 22,
                align: 'center'
              },
              hr: {
                borderColor: '#8C8D8E',
                width: '100%',
                borderWidth: 1,
                height: 0
              },
              b: {
                color: '#4C5058',
                fontSize: 10,
                fontWeight: 'bold',
                lineHeight: 33
              },
              per: {
                color: '#fff',
                backgroundColor: '#4C5058',
                padding: [3, 4],
                borderRadius: 4
              }
            }
          },
          data: outerChartdata,
        }
      ]
    };
  }, [data]);

  return {
    eChartsPieNestConfig,
  };
};

export default useEchartsPieNest;
