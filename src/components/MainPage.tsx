import {
  Text,
  TextField,
  List,
  Checkbox,
  FontIcon,
  ITextField,
} from "@fluentui/react";
import * as React from "react";
import {
  getMessages,
  getMessageSetters,
  getMessageString,
  IMessage,
} from "../state/messageListManager";
import * as Material from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

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
}));

export const MainPage = () => {
  const messages = getMessages(); // Get Messages
  const messageText = getMessageString();
  const { addMessage, updateMessage, deleteMessage, updateMessageText } = getMessageSetters();
  const classes = useStyles();

  const MessageItemComponent = (message?: IMessage) => {
    if (!message) {
      return <></>;
    }
    return (
      <div style={{ display: "flex", borderTop: "1px solid #e6e6e6" }}>
        <Checkbox
          checked={message.completed}
          onChange={() => {
            updateMessage(message.id, { completed: !message.completed });
          }}
        />
        <Text>{message.title}</Text>
        <a
          onClick={() => {
            deleteMessage(message.id);
          }}
        >
          <FontIcon
            iconName={"Delete"}
            style={{
              margin: "5px",
            }}
          />
        </a>
      </div>
    );
  };
  const fieldRef = React.createRef<ITextField>();

  function _handleTextFieldChange(e) {
    updateMessageText(e.target.value);
  }

  function _handleClick(e) {
    addMessage(messageText);
    updateMessageText("");
    e.currentTarget.value = "";
    e.preventDefault();
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
          <Material.Typography variant="h6" color="inherit" noWrap>
            Autodesk and Microsoft Hackathon
          </Material.Typography>
        </Material.Toolbar>
      </Material.AppBar>
      <main className={classes.layout}>
          <Material.Grid container spacing={1}>
            <Material.Grid item xs={12}>
              <br></br>
              <TextField
                placeholder="What needs to be done?"
                componentRef={fieldRef}
                onChange={(e, text) => {
                  if (text) {
                    updateMessageText(text);
                  }
                }}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    addMessage(messageText);
                    updateMessageText("");
                    e.currentTarget.value = "";
                    e.preventDefault();
                  }
                }}
                value={messageText}
              />
              {messages.length > 0 ? (
                <List items={messages} onRenderCell={MessageItemComponent} />
              ) : (
                <></>
              )}
            </Material.Grid>
            <Material.Grid item xs={9}>
              <Material.InputLabel htmlFor="my-input">
                Comment
              </Material.InputLabel>
              <Material.Input
                id="my-input"
                aria-describedby="my-helper-text"
                fullWidth={true}
                onChange={_handleTextFieldChange}
                value={messageText}
              />
              <Material.FormHelperText id="my-helper-text">
                Comment that will viewable by everyone in the fluid session.
              </Material.FormHelperText>
            </Material.Grid>
            <Material.Grid item xs={3}>
              <Material.Button variant="contained" color="primary" onClick={_handleClick}>
                Add Comment
              </Material.Button>
            </Material.Grid>
          </Material.Grid>
        <Material.Paper className={classes.paper}>
          <Material.Typography component="h1" variant="h4" align="center">
            Checkout
          </Material.Typography>
          <React.Fragment>
            <React.Fragment>
              <Material.Typography variant="h5" gutterBottom>
                Thank you for your order.
              </Material.Typography>
              <Material.Typography variant="subtitle1">
                Your order number is #2001539. We have emailed your order
                confirmation, and will send you an update when your order has
                shipped.
              </Material.Typography>
            </React.Fragment>
          </React.Fragment>
        </Material.Paper>
        <Copyright />
      </main>
    </React.Fragment>
  );
};
