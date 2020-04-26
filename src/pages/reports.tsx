import React, { useState, useEffect } from "react";
import {
  IonContent,
  IonCard,
  IonPage,
  IonSelect,
  IonSelectOption,
} from "@ionic/react";
import "../styles/Reports.scss";
import FusionCharts from "fusioncharts";
import Charts from "fusioncharts/fusioncharts.charts";
import FusionTheme from "fusioncharts/themes/fusioncharts.theme.fusion";
import ReactFC from "react-fusioncharts";
import Fade from "react-reveal";
import CheckAuth from "../helpers/CheckAuth";
import { getReport } from "../controllers/reports/reports";
import LoadingIcon from "../components/LoadingIcon";
import config from "react-global-configuration";
import { Tag } from "../models";

ReactFC.fcRoot(FusionCharts, Charts, FusionTheme);

let dataSource = {
  chart: {
    theme: "fusion",
    decimals: "0",
  },
  data: [{}],
};

let chartConfigs = {
  type: "doughnut2d",
  width: "100%",
  dataFormat: "json",
  dataSource: dataSource,
};

function getUniqueId() {
  let max = 100000;

  return Math.floor(Math.random() * Math.floor(max));
}

const ReportCard = (reportCard) => {
  const currentDate =
    reportCard.reportCard.time_frame.start.format("dddd") +
    ", " +
    reportCard.reportCard.time_frame.start.format("MMMM") +
    " " +
    reportCard.reportCard.time_frame.start.date();

  return (
    <div
      className="report-card"
      onClick={() => {
        config.set(
          { qux: "grault" },
          { freeze: false, environment: "production" }
        );
        config.set({ dailyReport: reportCard });
      }}
    >
      <IonCard routerLink="/dailyreport">
        <h2>{currentDate}</h2>
        <div className="total-focus-time">
          <div className="text">
            <p>Total focus time</p>
            <h1>
              {parseFloat(
                reportCard.reportCard.total_focus_time.asHours()
              ).toFixed(2)}{" "}
              hours
            </h1>
          </div>
          <div className="yellow-right-arrow">
            <div className="mask" />
          </div>
        </div>
      </IonCard>
    </div>
  );
};

function resetChartVariables() {
  dataSource = {
    chart: {
      theme: "fusion",
      decimals: "0",
    },
    data: [{}],
  };

  chartConfigs = {
    type: "doughnut2d",
    width: "100%",
    dataFormat: "json",
    dataSource: dataSource,
  };
}

function getHexValue(color) {
  switch (color) {
    case "red":
      return "#ff6f6f";
    case "green":
      return "#7ad683";
    case "blue":
      return "#6999d0";
    case "purple":
      return "#c05fd5";
  }
}

const Reports: React.FC = () => {
  const [showStats, setshowStats] = useState(true);
  const [report, setReport]: [any, any] = useState(undefined);
  const [filter, setFilter]: [any, any] = useState("daily");
  const [mostRecentReportDate, setMostRecentReportDate]: [any, any] = useState(
    undefined
  );

  useEffect(() => {
    CheckAuth();
    resetChartVariables();
    setshowStats(false);

    getReport(filter)?.then((res) => {
      setReport(res);

      console.log(res);

      setTimeout(() => {
        setshowStats(true);
      }, 500);

      res[0].chart_sectors.forEach((sector) => {
        dataSource.data.push({
          label: sector.category ? sector.category.name : "other",
          value: String(sector.duration.seconds()),
          color: getHexValue(sector.category.color),
        });
      });

      setMostRecentReportDate(
        res[0].time_frame.start.format("dddd") +
          ", " +
          res[0].time_frame.start.format("MMMM") +
          " " +
          res[0].time_frame.start.date()
      );
    });
  }, []);

  return (
    <IonPage>
      <IonContent className="ion-padding">
        {showStats ? (
          <Fade>
            <h1>Reports</h1>
            <p>{mostRecentReportDate} (Most recent)</p>
            <IonCard className="chart-card">
              <ReactFC {...chartConfigs} />
            </IonCard>
            <IonCard className="filter">
              <IonSelect
                value={filter}
                okText="Okay"
                cancelText="Dismiss"
                onIonChange={(e) => setFilter(e.detail.value)}
              >
                <IonSelectOption value="daily">Daily</IonSelectOption>
                <IonSelectOption value="weekly">Weekly</IonSelectOption>
                <IonSelectOption value="monthly">Mont hly</IonSelectOption>
              </IonSelect>
            </IonCard>
            {report ? (
              report.map((singleReport) => {
                return (
                  <ReportCard reportCard={singleReport} key={getUniqueId()} />
                );
              })
            ) : (
              <h4 className="no-tasks-here">No reports available!</h4>
            )}
          </Fade>
        ) : (
          <LoadingIcon />
        )}
      </IonContent>
    </IonPage>
  );
};

export default Reports;
