import * as React from 'react';
import { Button } from '../';

export interface IModalAction {
  name: string;
  onItemTap: () => void;
}

export interface IModalActionProps {
  title?: string;
  component: React.ReactNode;
  actions: IModalAction[];
  className?: string;
  style?: Object;
}

export interface IModalState {
  isDisplayModal: boolean;
}

export class ModalAction extends React.Component<IModalActionProps, IModalState> {
  public static defaultProps: Partial<IModalActionProps> = {
    className: '',
    style: {},
  };

  constructor(props: IModalActionProps) {
    super(props);

    this.state = {isDisplayModal: false};
  }

  onModalClick() {
    this.setState({isDisplayModal: !this.state.isDisplayModal});
  }

  onWrapTap(e: any) {
    e.stopPropagation();
  }

  render(): JSX.Element {
    if (!this.state.isDisplayModal) {
      return <div />;
    }

    const { title, component, actions, className, style} = this.props;
    const classNames = require('classnames');

    return (
      <div
        className={className ? classNames(className, 'sc-modal-root') : 'sc-modal-root'}
        onClick={this.onModalClick.bind(this)}
        style={style}
      >
        <div className="sc-modal-wrap" onClick={this.onWrapTap}>
          {title ? (
            <div className="sc-modal-view-header">
              <div className="sc-modal-view-header-button" />
              <div className="sc-modal-view-title">{title}</div>
              <Button icon={<i className="material-icons">close</i>} fontColor="white" onClick={this.onModalClick.bind(this)} className="sc-modal-view-header-button" />
            </div>
          ) : null}
          <p className="sc-modal-component">{component}</p>
          <ul className="sc-modal-dialog-action">
            {actions ? actions.map((action, i) =>
              <Button
                key={'sc-modal-dialog-action-item-' + i}
                type="square-round"
                text={action.name}
                width="95%"
                onClick={action.onItemTap}
              />
            ) : null}
          </ul>
        </div>
      </div>
    );
  }
}