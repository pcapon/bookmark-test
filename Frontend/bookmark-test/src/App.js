import React from "react";
import "./App.scss";
import axios from "./Axios.js";

import CardItem from "./cardItem/cardItem";
import AddDialog from "./addDialog/addDialog";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import BookmarksIcon from "@material-ui/icons/Bookmarks";
import CircularProgress from "@material-ui/core/CircularProgress";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: null,
      dialogVisibility: false
    };

    this.fetchItems = this.fetchItems.bind(this);
    this.handleVisibility = this.handleVisibility.bind(this);
  }

  handleVisibility = visibility => {
    this.setState({dialogVisibility: visibility});
  }

  async fetchItems() {
    const res = await axios.get("/items/");
    this.setState({ items: res.data });
  }

  async componentDidMount() {
    await this.fetchItems();
  }

  listItems(itemList) {
    if (!itemList) {
      return <CircularProgress />;
    }
    return (
      <div className="item-list">
        {itemList.reverse().map((item) => (
          <CardItem fetchItems={this.fetchItems} key={item._id} itemInfos={item}></CardItem>
        ))}
      </div>
    );
  }

  render() {
    return (
      <div className="App">
        <AppBar position="static">
          <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="menu">
              <BookmarksIcon />
            </IconButton>
            <Typography variant="h6">Bookmark</Typography>
          </Toolbar>
        </AppBar>
        <Fab className="fab-modal" size="medium" color="secondary" aria-label="add" onClick={this.handleVisibility.bind(this, true)}>
          <AddIcon />
        </Fab>
        <AddDialog fetchItems={this.fetchItems} open={this.state.dialogVisibility} onDialog={this.handleVisibility}></AddDialog>
        <div className="body">{this.listItems(this.state.items)}</div>
      </div>
    );
  }
}

export default App;
