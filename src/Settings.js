import React from "react";
import { observer } from "mobx-react";
import { formatDistance } from "date-fns/esm";

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
              {formatDistance(data.date, new Date(), {
                addSuffix: true
              })}
              )
            </small>{" "}
            <a
              href="https://whatsdeployed.io/s/58R"
              target="_blank"
              rel="noopener noreferrer"
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

class DeleteItAll extends React.PureComponent {
  state = { confirm: false };

  render() {
    return (
      <div className="box">
        {this.state.confirm ? (
          <h4 className="has-text-centered">
            This will delete all items forever.
          </h4>
        ) : null}
        <button
          type="button"
          className={
            this.state.confirm
              ? "button is-danger is-fullwidth"
              : "button is-warning is-fullwidth"
          }
          onClick={event => {
            if (this.state.confirm) {
              store.todos.selfDestruct();
              this.setState({ confirm: false });
            } else {
              this.setState({ confirm: true });
            }
          }}
        >
          {this.state.confirm ? "Are you certain?" : "Delete it All!"}
        </button>
      </div>
    );
  }
}
