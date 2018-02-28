import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { push } from 'react-router-redux';
import { Theme, withStyles, WithStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import KeyboardArrowLeftIcon from 'material-ui-icons/KeyboardArrowLeft';
import KeyboardArrowRightIcon from 'material-ui-icons/KeyboardArrowRight';
import AddIcon from 'material-ui-icons/Add';
import NotificationsIcon from 'material-ui-icons/Notifications';
// import NotificationsOffIcon from 'material-ui-icons/NotificationsOff';
import ExitToAppIcon from 'material-ui-icons/ExitToApp';
import RemoveIcon from 'material-ui-icons/Remove';
import List, { ListItem, ListItemText, ListSubheader } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import { LinearProgress } from 'material-ui/Progress';
import {
  State, store, Client, Room, routerHistory,
  fetchRoomRequestActionCreator, FetchRoomRequestAction,
  setProfileUserIdActionCreator, SetProfileUserIdAction,
  clearProfileUserActionCreator, ClearProfileUserAction,
  RoomActions,
} from 'swagchat-sdk';
import { SwagAvatar } from '../SwagAvatar';
import {
  MIN_WIDTH,
  BORDER_COLOR,
  ICON_SIZE,
  APP_BAR_HEIGHT,
} from '../../setting';

type positionType = 'fixed';
type justifyContentType = 'space-around';
type overflowYType = 'scroll';

const styles = (theme: Theme) => ({
  root: {
    minWidth: MIN_WIDTH,
  },
  appBar: {
    width: '100%',
    height: APP_BAR_HEIGHT,
    left: 0,
    background: theme.palette.common.white,
    borderBottom: '1px solid ' + BORDER_COLOR,
  },
  toolbar: {
    minHeight: APP_BAR_HEIGHT,
    justifyContent: 'center' as justifyContentType,
    // paddingLeft: 10,
  },
  toolbarButton: {
    width: 40,
    height: 40,
  },
  toolbarIcon: {
    width: ICON_SIZE,
    margin: '0 5px',
  },
  typography: {
    flex: 1,
    textAlign: 'center',
  },
  content: {
    paddingTop: APP_BAR_HEIGHT,
    position: 'relative' as positionType,
    overflowY: 'scroll' as overflowYType,
  },
  listItemIcon: {
    color: theme.palette.primary.main,
  },
});

type ClassNames = 
  'root' |
  'appBar' |
  'toolbar' |
  'toolbarButton' |
  'toolbarIcon' |
  'typography' |
  'content' |
  'listItemIcon'
;

interface MapStateToProps {
  client: Client | null;
  room: Room | null;
  currentRoomId: string;
  currentRoomName: string;
}

interface MapDispatchToProps {
  fetchRoomRequest: (roomId: string) => FetchRoomRequestAction;
  setProfileUserId: (profileUserId: string) => SetProfileUserIdAction;
  clearProfileUser: () => ClearProfileUserAction;
}

export interface RoomSettingProps {
  width?: number;
  top?: number;
  left?: number;
  right?: number;
}

class RoomSettingComponent
    extends React.Component<WithStyles<ClassNames> & MapStateToProps & MapDispatchToProps & RoomSettingProps, {}> {

  componentDidMount() {
    if (this.props.client !== null && this.props.room === null && this.props.currentRoomId !== '') {
      this.props.fetchRoomRequest(this.props.currentRoomId);
    }
  }

  componentDidUpdate(prevProps: MapStateToProps, prevState: {}) {
    if (this.props.client !== null && this.props.room === null && this.props.currentRoomId !== '') {
      this.props.fetchRoomRequest(this.props.currentRoomId);
    }
  }

  handleBackClick = () => {
    routerHistory.goBack();
  }

  handleRemoveRoomUserClick = (e: React.MouseEvent<HTMLElement>) => {
    window.console.log('handleRemoveRoomUserClick');
    e.stopPropagation();
  }

  handleProfileClick = (profileUserId: string) => {
    this.props.clearProfileUser();
    this.props.setProfileUserId(profileUserId);
    store.dispatch(push('/profile/' + profileUserId));
  }

  render() {
    const {
      classes, width, top, left, right,
      room
    } = this.props;

    if (room === null) {
      return <LinearProgress />;
    }

    const leftVar = left !== undefined ? left : 0; 
    const rightVar = right !== undefined ? right : 0; 

    const calcWidth = width !== undefined ? width + 'px' : '100%';
    const widthStyle = width !== undefined ? {width: width} : {};
    const topStyle = top !== undefined ? {marginTop: top} : {};
    const appBarleftRightStyle = left !== undefined || right !== undefined ?
      {marginLeft: leftVar, width: `calc(${calcWidth} - ${leftVar}px - ${rightVar}px)`} : {};
    const appBarStyle = Object.assign(widthStyle, topStyle, appBarleftRightStyle);

    return (
      <div className={classes.root} style={left ? {width: `calc(100% - ${left}px)`} : {}}>
        <AppBar
          position="fixed"
          className={classes.appBar}
          style={appBarStyle}
        >
          <Toolbar className={classes.toolbar} disableGutters={true}>
            <IconButton
              className={classes.toolbarButton}
              color="primary"
              onClick={this.handleBackClick}
            >
              <KeyboardArrowLeftIcon className={classes.toolbarIcon} />
            </IconButton>
            <Typography variant="subheading" className={classes.typography}>
              ルーム設定
            </Typography>
            <IconButton
              className={classes.toolbarButton}
              color="primary"
            />
          </Toolbar>
        </AppBar>
        <div className={classes.content}>
          <ListItem
            key={room.roomId}
            button={true}
          >
            <SwagAvatar user={room} />
            <ListItemText primary={room.name} />
          </ListItem>
          <Divider />
          <List subheader={<ListSubheader component="div">メンバー管理</ListSubheader>}>
            <ListItem disableGutters={true} key="room-setting-add-room-user" button={true}>
              <IconButton className={classes.listItemIcon}><AddIcon /></IconButton>
              <ListItemText primary="メンバーを追加" />
            </ListItem>
            {room.users !== null ? Object.keys(room.users).map((key: string) => (
              <ListItem
                key={room.users![key].userId}
                button={true}
                disableGutters={true}
                onClick={() => this.handleProfileClick(room.users![key].userId)}
              >
                <IconButton
                  className={classes.listItemIcon}
                  onClick={(e: React.MouseEvent<HTMLElement>) => this.handleRemoveRoomUserClick(e)}
                >
                  <RemoveIcon />
                </IconButton>
                <SwagAvatar user={room.users![key]} />
                <ListItemText primary={room.users![key].name} />
                <IconButton
                  onClick={() => this.handleProfileClick(room.users![key].userId)}
                >
                  <KeyboardArrowRightIcon />
                </IconButton>
              </ListItem>
            )) : null }
          </List>
          <Divider />
          <List subheader={<ListSubheader component="div">設定</ListSubheader>}>
            <ListItem disableGutters={true} key="room-setting-notifications" button={true}>
              <IconButton className={classes.listItemIcon}><NotificationsIcon /></IconButton>
              <ListItemText primary="このルームの通知をオフにする" />
            </ListItem>
            <ListItem disableGutters={true} key="room-setting-exit-room" button={true}>
              <IconButton className={classes.listItemIcon}><ExitToAppIcon /></IconButton>
              <ListItemText primary="このルームから退出する" />
            </ListItem>
          </List>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: State, ownProps: RoomSettingProps) => {
  return {
    client: state.client.client,
    room: state.room.room,
    currentRoomId: state.client.currentRoomId,
    currentRoomName: state.client.currentRoomName,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<RoomActions>, ownProps: RoomSettingProps) => {
  return {
    fetchRoomRequest: (roomId: string) => dispatch(fetchRoomRequestActionCreator(roomId)),
    setProfileUserId: (profileUserId: string) => dispatch(setProfileUserIdActionCreator(profileUserId)),
    clearProfileUser: () => dispatch(clearProfileUserActionCreator()),
  };
};

export const RoomSetting = connect<MapStateToProps, MapDispatchToProps, RoomSettingProps>(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles, { withTheme: true })(RoomSettingComponent));