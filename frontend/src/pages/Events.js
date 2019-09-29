import React, { Component } from 'react';

import Modal from '../components/Modal';
import Backdrop from '../components/Backdrop';

import './Events.css';

class Events extends Component {
  state = {
    creating: false
  };

  startCreateEventHandler = () => this.setState({ creating: true });

  modalConfirmHandler = () => this.setState({ creating: false });

  modalCancelHandler = () => this.setState({ creating: false });

  render() {
    return (
      <>
        {this.state.creating && (
          <>
            <Backdrop />
            <Modal
              title="Add Event"
              canCancel
              canConfirm
              onCancel={this.modalCancelHandler}
              onConfirm={this.modalConfirmHandler}
            >
              <p>Modal Content</p>
            </Modal>
          </>
        )}
        <div className="events-control">
          <p>Share your own Events!</p>
          <button className="btn" onClick={this.startCreateEventHandler}>
            Create Event
          </button>
        </div>
      </>
    );
  }
}

export default Events;
