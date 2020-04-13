import React from "react";
import axios from "../Axios.js";

import Card from "@material-ui/core/Card";
import IconButton from "@material-ui/core/IconButton";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import ChipInput from "material-ui-chip-input";
import DeleteIcon from "@material-ui/icons/Delete";
import PhotoIcon from "@material-ui/icons/Photo";
import MovieIcon from "@material-ui/icons/Movie";

import { toHHMMSS } from '../Utils.js';

import "./cardItem.scss";

export default class CardItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      keywords: [],
    };
    this.handleAddChip = this.handleAddChip.bind(this);
    this.handleDeleteChip = this.handleDeleteChip.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  async updateKeywords() {
    await axios.post(`/items/${this.props.itemInfos._id}/keywords`, {
      keywords: this.state.keywords,
    });
  }

  componentDidMount() {
    console.log(this.props.itemInfos);
    this.setState({ keywords: this.props.itemInfos.keywords });
  }

  handleAddChip(chip) {
    this.setState(
      (prevState) => ({
        keywords: [...prevState.keywords, chip],
      }),
      () => this.updateKeywords()
    );
  }

  handleDeleteChip(chip, index) {
    this.setState(
      {
        keywords: this.state.keywords.filter((_, i) => i !== index),
      },
      () => this.updateKeywords()
    );
  }

  async handleDelete() {
    await axios.delete(`/items/${this.props.itemInfos._id}/`);
    this.props.fetchItems();
  }

  render() {
    return (
      <Card className="cardItem">
        <CardMedia
          className="itemPic"
          image={this.props.itemInfos.thumbnailUrl}
        />
        <div className="right-card">
          <div className="content-wrapper">
            <div className="details">
              <CardContent className="content">
                <Typography component="h5" variant="h5">
                  {this.props.itemInfos.title}
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                  {this.props.itemInfos.author}
                </Typography>
                <Typography color="textSecondary">
                  {this.props.itemInfos.uploadDate}
                </Typography>
                <Typography color="textSecondary">
                  {this.props.itemInfos.width} x {this.props.itemInfos.height}
                </Typography>
                {this.props.itemInfos.type === "video" && (
                  <Typography color="textSecondary">
                    {toHHMMSS(this.props.itemInfos.duration)}
                  </Typography>
                )}
              </CardContent>
            </div>
            <div className="chips-wrapper">
              <ChipInput
                value={this.state.keywords}
                onAdd={(chip) => this.handleAddChip(chip)}
                onDelete={(chip, index) => this.handleDeleteChip(chip, index)}
              />
            </div>
          </div>
          <CardActions>
            <Button
              href={this.props.itemInfos.url}
              target="_blank"
              size="small"
              color="primary"
            >
              {this.props.itemInfos.type === "video" ? (
                <MovieIcon />
              ) : (
                <PhotoIcon />
              )}
              Go to link
            </Button>
            <IconButton onClick={this.handleDelete} aria-label="Delete">
              <DeleteIcon />
            </IconButton>
          </CardActions>
        </div>
      </Card>
    );
  }
}
