import React from "react";
import { observer } from "mobx-react";
import store from "./Store";
import "bulma-timeline/dist/bulma-timeline.min.css";

import {
  format,
  isSameDay,
  subDays,
  startOfDay,
  startOfMonth,
  isEqual
} from "date-fns/esm";

const TimeLine = observer(
  class TimeLine extends React.Component {
    componentDidMount() {
      document.title = "Things Done";
    }

    componentWillUnmount() {
      this.dismounted = true;
    }

    render() {
      const doneItems = store.items.filter(item => item.done);
      const groups = {};
      doneItems.reverse().forEach(item => {
        const date = startOfDay(item.done).getTime();
        if (!groups[date]) {
          groups[date] = [];
        }
        groups[date].push(item);
      });
      const dates = Object.keys(groups).map(d => parseInt(d, 10));
      dates.sort((a, b) => a - b);
      let previousMonth = null;
      return (
        <div>
          <h1>Things Done</h1>
          <div className="timeline">
            <header className="timeline-header">
              <span className="tag is-medium is-primary">Start</span>
            </header>
            <div className="timeline-item">
              <div className="timeline-content" />
            </div>
            {dates.map(date => {
              const items = groups[date];
              const month = startOfMonth(date);
              let monthHeader = null;
              if (!previousMonth || !isEqual(month, previousMonth)) {
                monthHeader = (
                  <header className="timeline-header" key={month}>
                    <span className="tag is-primary">
                      {format(month, "MMM")}
                    </span>
                  </header>
                );
              }
              previousMonth = month;
              return [
                monthHeader,
                <div className="timeline-item" key={date}>
                  <div className="timeline-marker" />
                  <div className="timeline-content">
                    <p className="heading">{FriendlyDate(date)}</p>
                    {items.map(item => <p key={item.id}>{item.text}</p>)}
                  </div>
                </div>
              ];
            })}
            <div className="timeline-header">
              <span className="tag is-medium is-primary">End</span>
            </div>
          </div>
        </div>
      );
    }
  }
);

export default TimeLine;

const FriendlyDate = datetime => {
  const now = new Date();
  let text;
  if (isSameDay(now, datetime)) {
    text = "Today";
  } else if (isSameDay(datetime, subDays(now, 1))) {
    text = "Yesterday";
  } else {
    text = format(datetime, "D MMM YYYY");
  }
  return text;
};
