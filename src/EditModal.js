import React from "react";
import getUrls from "./vendored/get-urls";
import { toDate, formatDistance } from "date-fns/esm";

const DisplayDate = date => {
  if (date === null) {
    throw new Error("date is null");
  }
  const dateObj = toDate(date);
  const now = new Date();
  return (
    <span title={dateObj.toString()}>
      {formatDistance(date, now, { addSuffix: true })}
    </span>
  );
};

const getItemUrls = item => {
  const urls = getUrls(item.text);
  for (let url of getUrls(item.notes || "").values()) {
    urls.add(url);
  }
  return Array.from(urls);
};

export default class EditModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      saveDisabled: true,
      // editNotes: !!this.props.item.notes,
      advancedMode: !!this.props.startInAdvancedMode || this.props.item.notes,
      urls: getItemUrls(this.props.item)
    };
  }

  componentDidMount() {
    this.refs.text.focus();
    window.addEventListener("keydown", this._escapeKey, true);
  }
  componentWillUnmount() {
    window.removeEventListener("keydown", this._escapeKey, true);
  }

  _escapeKey = event => {
    if (event.defaultPrevented) {
      return; // Do nothing if the event was already processed
    }
    if (event.key === "Escape") {
      this.props.close();
    }
  };

  itemFormSubmit = event => {
    event.preventDefault();
    this.itemFormSave();
  };

  itemFormSave = () => {
    const text = this.refs.text.value.trim();
    const notes =
      (this.state.advancedMode && this.refs.notes.value.trim()) || null;
    if (text) {
      this.props.edit(text, notes, this.props.item);
      this.props.close();
    } else {
      this.props.delete(this.props.item);
      this.props.close();
    }
  };

  render() {
    const { item } = this.props;
    return (
      <div className="modal is-active">
        <div
          className="modal-background"
          onClick={() => {
            this.props.close();
          }}
        />

        <div className="modal-content">
          <div className="box" style={{ margin: 0 }}>
            <div className="level is-mobile" style={{ marginBottom: 20 }}>
              <div className="level-item has-text-centered">
                <button
                  type="button"
                  className={
                    item.done ? "button is-warning" : "button is-success"
                  }
                  onClick={() => {
                    this.props.done(item);
                  }}
                >
                  <span role="img" aria-label="Toggle done">
                    ✔️
                  </span>
                  {item.done ? "UNDONE!" : "DONE!"}
                </button>
              </div>
              <div className="level-item has-text-centered">
                <button
                  type="button"
                  className="button is-link"
                  onClick={() => {
                    this.setState({ advancedMode: !this.state.advancedMode });
                  }}
                >
                  {this.state.advancedMode ? "Less!" : "More?"}
                </button>
              </div>
              <div className="level-item has-text-centered">
                <button
                  type="button"
                  className="button is-danger"
                  onClick={() => {
                    this.props.delete(item);
                  }}
                >
                  DELETE
                </button>
              </div>
            </div>

            <form onSubmit={this.itemFormSubmit}>
              <input
                className="input edit-item"
                type="text"
                ref="text"
                style={{ marginBottom: 5 }}
                onChange={() => {
                  if (this.state.saveDisabled) {
                    this.setState({ saveDisabled: false });
                  }
                }}
                defaultValue={item.text}
              />
            </form>
            {this.state.advancedMode && (
              <EditContextDropdown
                onChangeContext={context => {
                  this.props.move(context, this.props.item);
                  this.itemFormSave();
                  // this.props.close();
                }}
                contextOptions={this.props.allContextOptions}
                currentContext={item.context ? item.context : ""}
              />
            )}
            {this.state.advancedMode ? (
              <form onSubmit={this.itemFormSubmit}>
                <textarea
                  ref="notes"
                  className="textarea"
                  placeholder="Notes..."
                  defaultValue={item.notes || ""}
                  onChange={() => {
                    if (this.state.saveDisabled) {
                      this.setState({ saveDisabled: false });
                    }
                  }}
                />
              </form>
            ) : null}

            {this.state.advancedMode && this.state.urls.length ? (
              <p>
                <b>URLs:</b>
                {this.state.urls.map(url => (
                  <a
                    key={url}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      marginLeft: 10,
                      display: this.state.urls.length > 1 ? "block" : "inline"
                    }}
                  >
                    {url}
                  </a>
                ))}
              </p>
            ) : null}
            {this.state.urls.length ? <ul /> : null}

            <div className="level is-mobile" style={{ marginTop: 25 }}>
              <div className="level-left">
                <div className="level-item has-text-left">
                  <button
                    className="button is-success"
                    onClick={this.itemFormSubmit}
                    disabled={this.state.saveDisabled}
                  >
                    Save
                  </button>
                </div>
              </div>
              <div className="level-right">
                <div className="level-item has-text-right">
                  <button
                    className="button"
                    onClick={event => {
                      this.props.close();
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>

            {this.state.advancedMode ? (
              <p className="is-size-6">
                {item.created !== item.modified ? (
                  <span>
                    <b>Edited:</b> {DisplayDate(item.modified)}
                  </span>
                ) : (
                  <span>
                    <b>Added:</b> {DisplayDate(item.created)}
                  </span>
                )}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}

// export default Settings;

class EditContextDropdown extends React.PureComponent {
  state = {
    opened: false,
    addNew: false
  };
  formSubmit = event => {
    event.preventDefault();
    const newContext = this.refs.newcontext.value.trim();
    this.props.onChangeContext(newContext);
  };
  render() {
    return (
      <form onSubmit={this.formSubmit} style={{ marginBottom: 4 }}>
        <div className={this.state.opened ? "dropdown is-active" : "dropdown"}>
          <div className="dropdown-trigger">
            <button
              type="button"
              className="button"
              aria-haspopup="true"
              aria-controls="dropdown-menu"
              onClick={event => {
                event.preventDefault();
                const wasOpen = !!this.state.opened;
                this.setState({ opened: !this.state.opened }, () => {
                  if (wasOpen && this.state.addNew) {
                    this.setState({ addNew: false });
                  }
                });
              }}
            >
              <span>
                {this.state.opened ? "Close" : "Move to a different context"}
              </span>
              <span className="icon is-small">
                <i className="fas fa-angle-down" aria-hidden="true" />
              </span>
            </button>
          </div>
          <div className="dropdown-menu" id="dropdown-menu" role="menu">
            <div className="dropdown-content">
              {this.props.contextOptions.map(context => {
                return (
                  <a
                    key={context.name}
                    href="/"
                    className={
                      this.props.currentContext === context.name
                        ? "dropdown-item is-active"
                        : "dropdown-item"
                    }
                    onClick={event => {
                      event.preventDefault();
                      this.props.onChangeContext(context.name);
                    }}
                  >
                    {context.name ? (
                      <span>
                        {context.name} ({context.count})
                      </span>
                    ) : (
                      <i>Default ({context.count})</i>
                    )}
                  </a>
                );
              })}

              <hr className="dropdown-divider" />
              {!this.state.addNew ? (
                <a
                  href="/"
                  className="dropdown-item"
                  onClick={event => {
                    event.preventDefault();
                    this.setState({ addNew: true }, () => {
                      this.refs.newcontext.focus();
                    });
                  }}
                >
                  Create a new context
                </a>
              ) : (
                <input
                  type="text"
                  ref="newcontext"
                  className="input"
                  placeholder="My new context name"
                  onChange={event => {
                    event.preventDefault();
                    // this.setState({newContext: event.target.value})
                  }}
                  onBlur={event => {
                    console.log("New input blurred");
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </form>
    );
  }
}
