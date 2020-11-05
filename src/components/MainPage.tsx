import * as React from "react";
import {
  getMessages,
  getMessageSetters,
  getMessageString,
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


let editMessage = {
  id: "",
  title: "",
  completed: false,
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
    margin: "5px",
  },
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

  function _changeEditCommentEvent(e) {
    editMessage.title = e.target.value;
    e.preventDefault();
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

  const [open, setOpen] = React.useState(false);
  const handleClickOpen = (messageId,  message) => {
    editMessage.id = messageId;
    editMessage.title = message;
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOk = () => {
    updateMessage(editMessage.id, editMessage);
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Material.Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <Material.DialogTitle id="alert-dialog-title">{"Comment Editing"}</Material.DialogTitle>
        <Material.DialogContent>
          <Material.DialogContentText id="alert-dialog-description">
            Editing a comment is permanent and cannot be undone.
          </Material.DialogContentText>
          <Material.Input
              id="editMessageInput"
              aria-describedby="my-helper-text"
              fullWidth={true}
              onChange={_changeEditCommentEvent}
            />
        </Material.DialogContent>
        <Material.DialogActions>
        <Material.Button onClick={handleClose} color="primary">
            Cancel
          </Material.Button>
          <Material.Button onClick={handleOk} color="primary" autoFocus>
            OK
          </Material.Button>
        </Material.DialogActions>
      </Material.Dialog>

      <Material.CssBaseline />
      <Material.AppBar
        position="absolute"
        color="default"
        className={classes.appBar}
      >
        <Material.Toolbar>
          <img
            src="/src/images/autodesk-logo-small.svg"
            alt="Autodesk"
            className={classes.appIcon}
          ></img>
          <Material.Typography variant="h6" color="inherit" noWrap>
            Auto Fluid
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
              Comments will be viewable by everyone who is in this fluid
              session...
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
          <Material.Typography component="h4" variant="h4" align="center">
            {messages.length == 0 ? (
              <span>No Comments</span>
            ) : (
              <span>Comments ({messages.length})</span>
            )}
          </Material.Typography>
          <br></br>
          <React.Fragment>
            <React.Fragment>
              {messages.map((message) => (
                <Material.Grid container spacing={1} alignContent="center">
                  <Material.Grid item xs={1} alignContent="center">
                    <Icon.CommentTwoTone />
                  </Material.Grid>
                  <Material.Grid item xs={9} alignContent="center">
                    <Material.Typography>{message.title}</Material.Typography>
                  </Material.Grid>
                  <Material.Grid item xs={1} alignContent="center">
                    <Material.IconButton
                      onClick={() => {
                        handleClickOpen(message.id, message.title);
                      }}
                    >
                      <Icon.Edit />
                    </Material.IconButton>
                  </Material.Grid>
                  <Material.Grid item xs={1} alignContent="center">
                    <Material.IconButton
                      onClick={() => {
                        _deleteMessageEvent(message.id);
                      }}
                    >
                      <Icon.Delete />
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
