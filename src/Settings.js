import { formatDistance, parseISO } from "date-fns/esm";
import { observer } from "mobx-react";
import React from "react";

import store from "./Store";

const Settings = observer(
  class Settings extends React.Component {
    state = {};
    pageTitle = "Settings";
    componentDidMount() {
      document.title = this.pageTitle; // XXX Use helmet
    }

    componentWillUnmount() {
      this.dismounted = true;
    }

    getVersionData = () => {
      const element = document.querySelector("#_version");
      return Object.assign({}, element.dataset);
    };

    render() {
      const data = this.getVersionData();

      return (
        <div>
          <h1>{this.pageTitle}</h1>
          <DeleteItAll />

          <p style={{ textAlign: "center" }}>
            Current version:{" "}
            <a
              href={`https://github.com/peterbe/workon/commit/${data.commit}`}
              title={data.date}
            >
              {data.commit.slice(0, 7)}
            </a>{" "}
            <small>
              (
              {formatDistance(parseISO(data.date), new Date(), {
                addSuffix: true,
              })}
              )
            </small>{" "}
            <a
              href="https://whatsdeployed.io/s/58R"
              rel="noopener noreferrer"
              target="_blank"
            >
              Whatsdeployed?
            </a>
          </p>
        </div>
      );
    }
  }
);

export default Settings;

function DeleteItAll() {
  const [confirm, setConfirm] = React.useState(false);

  return (
    <div className="box">
      {confirm ? (
        <h4 className="has-text-centered">
          This will delete all items forever.
        </h4>
      ) : null}
      <button
        className={
          confirm
            ? "button is-danger is-fullwidth"
            : "button is-warning is-fullwidth"
        }
        onClick={(event) => {
          if (confirm) {
            store.todos.selfDestruct();
            setConfirm(false);
          } else {
            setConfirm(true);
          }
        }}
        type="button"
      >
        {confirm ? "Are you certain?" : "Delete it All!"}
      </button>
    </div>
  );
}
