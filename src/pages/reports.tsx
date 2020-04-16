import React, { useState, useEffect } from "react";
import { IonContent, IonCard, IonPage } from "@ionic/react";
import "../styles/Reports.scss";
import FusionCharts from "fusioncharts";
import Charts from "fusioncharts/fusioncharts.charts";
import FusionTheme from "fusioncharts/themes/fusioncharts.theme.fusion";
import ReactFC from "react-fusioncharts";
import CountUp from "react-countup";
import Fade from "react-reveal";

ReactFC.fcRoot(FusionCharts, Charts, FusionTheme);

const dataSource = {
  chart: {
    theme: "fusion",
    decimals: "0",
  },
  data: [
    { label: "Rest Time", value: "2" },
    { label: "Homework", value: "2.5" },
    { label: "Work", value: "8" },
    { label: "Other", value: "1" },
  ],
};
const chartConfigs = {
  type: "doughnut2d",
  width: "97%",
  dataFormat: "json",
  dataSource: dataSource,
};

const Reports: React.FC = () => {
  const [showChart, setShowChart] = useState(false);
  const [showStats, setshowStats] = useState(false);

  setTimeout(() => {
    setShowChart(true);
  }, 500);

  setTimeout(() => {
    setshowStats(true);
  }, 700);
  return (
    <IonPage>
      <IonContent className="ion-padding">
        <h1>Reports</h1>
        <h3 className="date-title">February 15, 2020</h3>
        <IonCard class="chart-card">
          {showChart ? <ReactFC {...chartConfigs} /> : <React.Fragment />}
        </IonCard>

        {showStats ? (
          <Fade>
            <div className="statistics-cards">
              <IonCard className="tasks-completed">
                <p>Tasks Completed</p>
                <h1>
                  <CountUp end={5} />
                </h1>
              </IonCard>
              <IonCard>
                <p>Focus Percentage</p>
                <h1>
                  <CountUp end={65} />%
                </h1>
              </IonCard>
            </div>
          </Fade>
        ) : (
          <React.Fragment></React.Fragment>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Reports;
