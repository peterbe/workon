import React, { Component } from "react";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import "bulma/css/bulma.css";
import "./App.css";
import { Container, Box, Content } from "bloomer";

class App extends Component {
  state = {
    items: [],
    deletedItem: null
  };

  componentWillUnmount() {
    this.dismounted = true;
  }

  componentDidMount() {
    this.refs.new.focus();
    const items = JSON.parse(localStorage.getItem("items") || "[]");
    if (items.length) {
      this.setState({ items });
    }
  }

  itemFormSubmit = event => {
    event.preventDefault();
    const text = this.refs.new.value.trim();
    if (text) {
      const previousIds = this.state.items.map(item => item.id);
      let nextId = 1;
      if (previousIds.length) {
        nextId = Math.max(...previousIds) + 1;
      }
      const items = [
        {
          text,
          done: false,
          created: new Date().getTime(),
          modified: new Date().getTime(),
          id: nextId
        },
        ...this.state.items
      ];
      this.setState({ items }, () => {
        this._persist();
        this.refs.new.value = "";
      });
    }
  };

  _persist = () => {
    localStorage.setItem("items", JSON.stringify(this.state.items));
  };

  doneItem = item => {
    const items = this.state.items.map(thisItem => {
      if (thisItem.id === item.id) {
        thisItem.done = !thisItem.done;
      }
      return thisItem;
    });
    this.setState({ items }, () => {
      this._persist();
    });
  };

  deleteItem = item => {
    const items = this.state.items.filter(thisItem => {
      return thisItem.id !== item.id;
    });
    this.setState({ items, deletedItem: item }, () => {
      this._persist();
      if (this.giveupUndoTimeout) {
        window.clearTimeout(this.giveupUndoTimeout);
      }
      this.giveupUndoTimeout = window.setTimeout(() => {
        if (!this.dismounted) {
          if (this.state.deletedItem) {
            this.setState({ deletedItem: null });
          }
        }
      }, 10 * 1000);
    });
  };

  undoDelete = () => {
    const items = [this.state.deletedItem, ...this.state.items];
    items.sort((a, b) => b.id - a.id);
    this.setState({ items, deletedItem: null }, () => {
      this._persist();
    });
  };

  render() {
    // const items = this.state.items.map(item => {
    //
    // });

    return (
      <Container>
        <Box>
          <Content>
            <h1>Things To Work On</h1>

            {this.state.deletedItem ? (
              <div className="notification is-warning">
                <button
                  className="delete"
                  onClick={event => {
                    this.setState({ deletedItem: null });
                  }}
                />
                <button className="button" onClick={this.undoDelete}>
                  Undo Delete
                </button>
              </div>
            ) : null}

            <ul>
              <li style={{ listStyle: "none" }}>
                <form onSubmit={this.itemFormSubmit}>
                  <input
                    className="input add-item"
                    type="text"
                    ref="new"
                    placeholder="What's next??"
                  />
                </form>
              </li>
              <ReactCSSTransitionGroup
                transitionName="items"
                transitionAppear={true}
                transitionAppearTimeout={500}
                transitionEnter={false}
                transitionLeave={false}
              >
                {this.state.items.map(item => (
                  <Item key={item.id} item={item} />
                ))}
                {/* {items} */}
              </ReactCSSTransitionGroup>
            </ul>
          </Content>
        </Box>
      </Container>
    );
  }
}

export default App;

class Item extends React.PureComponent {
  state = {
    displayMetadata: false
  };
  render() {
    const { item } = this.props;
    const added = item.created; // XXX make user-friendly
    let itemClassName = "";
    if (item.done) {
      itemClassName = "strikeout";
    }
    return (
      <li
        title={`Added ${added}`}
        onMouseOver={event => {
          if (!this.state.displayMetadata) {
            this.setState({ displayMetadata: true });
          }
        }}
        onMouseOut={event => {
          if (this.state.displayMetadata) {
            this.setState({ displayMetadata: false });
          }
        }}
      >
        <nav className="level">
          <div className="level-left">
            <div className="level-item">
              <div>
                <p className={itemClassName}>{item.text}</p>
                {this.state.displayMetadata ? (
                  <p className="metadata">Added {item.created}</p>
                ) : (
                  <p className="metadata">&nbsp;</p>
                )}
              </div>
            </div>
          </div>
          <div className="level-right">
            <div className="level-item">
              <button
                className={
                  item.done
                    ? "button is-small is-info"
                    : "button is-small is-success"
                }
                title="Mark as done"
                onClick={event => {
                  this.doneItem(item);
                }}
              >
                <span role="img" aria-label="Toggle done">
                  ✔️
                </span>
              </button>
            </div>
            <div className="level-item">
              <button
                className="button is-small is-warning"
                title="Delete"
                onClick={event => {
                  this.deleteItem(item);
                }}
              >
                <span role="img" aria-label="Delete">
                  🗑
                </span>
              </button>
            </div>
          </div>
        </nav>
      </li>
    );
  }
}
