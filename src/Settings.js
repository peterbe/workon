import React from "react";
import { observer } from "mobx-react";

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

    render() {
      return (
        <div>
          <h1>{this.pageTitle}</h1>
          <DeleteItAll />
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
