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
    case "gray":
      return "#9e9e9e";
  }
}

function getUniqueId() {
  let max = 100000;

  return Math.floor(Math.random() * Math.floor(max));
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

  dailyReport.reportCard.chart_sectors.forEach((sector) => {
    dataSource.data.push({
      label: sector.category ? sector.category.name : "other",
      value: String(sector.duration.seconds()),
      color: sector.category ? getHexValue(sector.category.color) : "#D3D3D3",
    });
  });

  const TagCard = (task) => {
    let timeFrameText =
      task.task.work_period.start.format("LT") +
      " - " +
      task.task.work_period.end.format("LT");

    return (
      <React.Fragment>
        <IonCard className={task.task.tag ? task.task.tag.color : "gray"}>
          <h1>{timeFrameText}</h1>
          {task.task.tag ? <h3>#{task.task.tag.name}</h3> : <h3>No tag set</h3>}
          <h5>{task.task.task_name}</h5>
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
              {dailyReport.reportCard.report_task_collection.map((task) => {
                return <TagCard task={task} key={getUniqueId()} />;
              })}
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
