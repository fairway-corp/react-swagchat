import * as React from 'react';
import {
  PhotoEdit,
} from '../../';

export interface IRoomEditProps {
  roomName: string;
  roomPictureUrl: string;
  roomUpdateName: (updateName: string) => void;
  roomUpdatePicture: (updatePicture: Blob) => void;
}

export class RoomEdit extends React.Component<IRoomEditProps, void> {
  private inputTextDom: HTMLInputElement;

  componentDidMount() {
    this.inputTextDom.value = this.props.roomName;
  }

  onInputTextChange = (e: any) => {
    this.props.roomUpdateName(e.target.value);
  }

  render(): JSX.Element {
    return (
      <div className="room-edit-root">
        <PhotoEdit
          src={this.props.roomPictureUrl}
          width={120}
          height={120}
          onUpdatePhoto={this.props.roomUpdatePicture}
        />
        <input
          className="room-edit-input-text"
          ref={(child) => this.inputTextDom = child}
          type="text"
          onChange={this.onInputTextChange.bind(this)}
        />
      </div>
    );
  }
}
