import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import axios from "../Axios.js";

import { isUrl, getHostname } from "../Utils.js";

export default class CardItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      valideEntry: false,
      helperText: "",
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.addItems = this.addItems.bind(this);
    this.validateUrl = this.validateUrl.bind(this);
  }

  handleClose() {
    this.props.onDialog(false);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  async addItems() {
    await axios.post("/items/", {
      url: this.state.value,
    });
    this.props.fetchItems();
    this.handleClose();
  }

  validateUrl() {
    if (isUrl(this.state.value)) {
      if (
        ["flickr.com", "flic.kr", "vimeo.com"].includes(
          getHostname(this.state.value)
        )
      ) {
        this.addItems();
        this.setState({ helperText: "", valideEntry: false });
      }
      else {
        this.setState({ helperText: "URL must be from flickr or vimeo", valideEntry: true });
      }
    } else {
      this.setState({ helperText: "Incorrect entry.", valideEntry: true });
    }
  }

  render() {
    return (
      <Dialog
        open={this.props.open}
        onClose={this.handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Add a new bookmark</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To add a bookmark, please enter a Flickr or a Vimeo.
          </DialogContentText>
          <TextField
            error={this.state.valideEntry}
            autoFocus
            margin="dense"
            id="name"
            label=""
            type="url"
            fullWidth
            helperText={this.state.helperText}
            onChange={this.handleChange}
            value={this.state.value}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={this.validateUrl} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
