import React, { useState, useEffect } from "react";
import config from "react-global-configuration";
import { IonContent, IonCard, IonPage, IonIcon, IonAlert } from "@ionic/react";
import { informationCircleOutline } from "ionicons/icons";
import ReactFC from "react-fusioncharts";
import CountUp from "react-countup";
import Fade from "react-reveal";
import FusionCharts from "fusioncharts";
import Charts from "fusioncharts/fusioncharts.charts";
import FusionTheme from "fusioncharts/themes/fusioncharts.theme.fusion";
import LoadingIcon from "../components/LoadingIcon";
import "../styles/DailyReport.scss";

ReactFC.fcRoot(FusionCharts, Charts, FusionTheme);

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

const DailyReport: React.FC = () => {
  const [showChart, setShowChart] = useState(false);
  const [showFocusInfo, setShowFocusInfo] = useState(false);
  const [mostRecentReportDate, setMostRecentReportDate]: [any, any] = useState(
    undefined
  );
  let dailyReport = config.get("dailyReport");

  setTimeout(() => {
    setShowChart(true);
  }, 500);

  useEffect(() => {
    setMostRecentReportDate(
      dailyReport.reportCard.time_frame.start.format("dddd") +
        ", " +
        dailyReport.reportCard.time_frame.start.format("MMMM") +
        " " +
        dailyReport.reportCard.time_frame.start.date()
    );
  }, [dailyReport.reportCard.time_frame.start]);

  let dataSource = {
    chart: {
      theme: "fusion",
      decimals: "0",
    },
    data: [{}],
  };

  let chartConfigs2 = {
    type: "doughnut2d",
    width: "100%",
    dataFormat: "json",
    dataSource: dataSource,
  };

  console.log(dailyReport);

  dailyReport.reportCard.chart_sectors.forEach((sector) => {
    dataSource.data.push({
      label: sector.category ? sector.category.name : "other",
      value: String(sector.duration.seconds()),
      color: sector.category ? getHexValue(sector.category.color) : "#D3D3D3",
    });
  });

  const TagCard = () => {
    return (
      <React.Fragment>
        <IonCard className="green">
          <h1>3:15am - 4:30am</h1>
          <h3>#homework</h3>
        </IonCard>
        <IonCard className="blue">
          <h1>4:45am - 6:00am</h1>
          <h3>#chore</h3>
        </IonCard>
        <IonCard className="green">
          <h1>7:00am - 7:45am</h1>
          <h3>#homework</h3>
        </IonCard>
        <IonCard className="purple">
          <h1>8:13am - 12:33pm</h1>
          <h3>#school</h3>
        </IonCard>
        <IonCard className="red">
          <h1>5:00pm - 9:12pm</h1>
          <h3>#event</h3>
        </IonCard>
      </React.Fragment>
    );
  };

  return (
    <IonPage>
      <IonContent className="ion-padding">
        {showChart ? (
          <Fade>
            <div className="daily-report-header-area">
              <div className="yellow-left-arrow">
                <IonCard routerLink="/reports">
                  <div className="mask" />
                </IonCard>
              </div>

              <h1>{mostRecentReportDate}</h1>
            </div>

            <IonCard class="chart-card">
              <ReactFC {...chartConfigs2} />
            </IonCard>
            <div className="statistics-cards">
              <IonCard className="tasks-completed">
                <p>Tasks Completed</p>
                <h1>
                  <CountUp end={dailyReport.reportCard.tasks_completed} />
                </h1>
              </IonCard>
              <IonCard onClick={() => setShowFocusInfo(true)}>
                <IonAlert
                  isOpen={showFocusInfo}
                  onDidDismiss={() => setShowFocusInfo(false)}
                  header={"About Your Focus Percentage"}
                  message={
                    "Your focus percentage is the ratio of time you worked to the amount of time you set aside to work. <br><br> The amount of time you set aside to work is calculated from your  chosen start and stop work times found in your settings."
                  }
                  buttons={["OK"]}
                />
                <p>Focus Percentage</p>
                <h1>
                  <CountUp end={dailyReport.reportCard.focus_percentage} />%
                </h1>
                <IonIcon icon={informationCircleOutline} />
              </IonCard>
            </div>

            <h3>Your timeline</h3>
            <div className="tag-card">
              <TagCard />
            </div>
          </Fade>
        ) : (
          <LoadingIcon />
        )}
      </IonContent>
    </IonPage>
  );
};

export default DailyReport;
