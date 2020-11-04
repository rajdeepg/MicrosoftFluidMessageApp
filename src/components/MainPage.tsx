import * as React from "react";
import {
  getMessages,
  getMessageSetters,
  getMessageString
} from "../state/messageListManager";
import * as Material from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import * as Icon from "@material-ui/icons";

function Copyright() {
  return (
    <Material.Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Material.Link color="inherit" href="https://www.autodesk.com/">
        Autodesk
      </Material.Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Material.Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
  },
  layout: {
    width: "auto",
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    marginTop: theme.spacing(4),
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      width: 600,
      marginLeft: "auto",
      marginRight: "auto",
    },
  },
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3),
    },
  },
  stepper: {
    padding: theme.spacing(3, 0, 5),
  },
  buttons: {
    display: "flex",
    justifyContent: "flex-end",
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
  },
  appIcon: {
    width: "30px",
    height: "30px",
    margin: "5px"
  }
}));

export const MainPage = () => {
  const messages = getMessages(); // Get Messages
  const messageText = getMessageString();
  const {
    addMessage,
    updateMessage,
    deleteMessage,
    updateMessageText,
  } = getMessageSetters();
  const classes = useStyles();

  function _changeMessageEvent(e) {
    updateMessageText(e.target.value);
  }

  function _addMessageEvent(e) {
    if (messageText != "") {
      addMessage(messageText);
      updateMessageText("");
      e.currentTarget.value = "";
    }
    e.preventDefault();
  }

  function _deleteMessageEvent(messageId) {
    deleteMessage(messageId);
  }

  return (
    <React.Fragment>
      <Material.CssBaseline />
      <Material.AppBar
        position="absolute"
        color="default"
        className={classes.appBar}
      >
        <Material.Toolbar>
           <img src="/src/images/autodesk-logo-small.svg" alt="Autodesk" className={classes.appIcon}></img>
          <Material.Typography variant="h6" color="inherit" noWrap>
            Autodesk and Microsoft Hackathon
          </Material.Typography>
        </Material.Toolbar>
      </Material.AppBar>
      <main className={classes.layout}>
        <Material.Grid container spacing={1}>
          <Material.Grid item xs={9}>
            <Material.InputLabel htmlFor="my-input">
              Comment
            </Material.InputLabel>
            <Material.Input
              id="my-input"
              aria-describedby="my-helper-text"
              fullWidth={true}
              onChange={_changeMessageEvent}
              value={messageText}
            />
            <Material.FormHelperText id="my-helper-text">
              Comments will be viewable by everyone who is in this fluid session...
            </Material.FormHelperText>
          </Material.Grid>
          <Material.Grid item xs={3}>
            <Material.Button
              variant="contained"
              color="primary"
              onClick={_addMessageEvent}
            >
              Add Comment
            </Material.Button>
          </Material.Grid>
        </Material.Grid>
        <Material.Paper className={classes.paper}>
          <Material.Typography component="h1" variant="h4" align="center">
            Comments ({messages.length})
          </Material.Typography>
          <br></br>
          <React.Fragment>
            <React.Fragment>
              {messages.map((message) => (
                <Material.Grid container spacing={1} alignContent="center">
                  <Material.Grid item xs={1} alignContent="center">
                    <Icon.CommentTwoTone />
                  </Material.Grid>
                  <Material.Grid item xs={10} alignContent="center">
                    <Material.Typography>{message.title}</Material.Typography>
                  </Material.Grid>
                  <Material.Grid item xs={1} alignContent="center">
                    <Material.IconButton
                      onClick={() => {
                        _deleteMessageEvent(message.id);
                      }}
                    >
                      <Icon.DeleteForever />
                    </Material.IconButton>
                  </Material.Grid>
                </Material.Grid>
              ))}
            </React.Fragment>
          </React.Fragment>
        </Material.Paper>
        <Copyright />
      </main>
    </React.Fragment>
  );
};
