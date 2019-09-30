import React, { Component } from 'react';

import Modal from '../components/Modal';
import Backdrop from '../components/Backdrop';
import AuthContext from '../context/auth-context';
import './Events.css';

class Events extends Component {
  state = {
    creating: false,
    events: []
  };

  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.titleElRef = React.createRef();
    this.priceElRef = React.createRef();
    this.dateElRef = React.createRef();
    this.descriptionElRef = React.createRef();
  }

  componentDidMount() {
    this.fetchEvents();
  }

  startCreateEventHandler = () => this.setState({ creating: true });

  modalConfirmHandler = async () => {
    this.setState({ creating: false });
    const title = this.titleElRef.current.value;
    const price = +this.priceElRef.current.value;
    const date = this.dateElRef.current.value;
    const description = this.descriptionElRef.current.value;

    if (!title.trim().length || price <= 0 || !date.trim().length || !description.trim().length) {
      return;
    }

    const requestBody = {
      query: `
        mutation {
          createEvent(eventInput: { title: "${title}", description: "${description}", price: ${price}, date: "${date}" }) {
            _id
            title
            description
            date
            price
            creator {
              _id
              email
            }
          }
        }
      `
    };

    const { token } = this.context;

    try {
      const res = await fetch('http://localhost:8000/graphql', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token
        }
      });

      if (res.status !== 200 && res.status !== 201) {
        throw new Error('Failed!');
      }

      const resData = await res.json();

      this.fetchEvents();

      console.log(resData);
    } catch (err) {
      console.error(err);
    }
  };

  modalCancelHandler = () => this.setState({ creating: false });

  fetchEvents = async () => {
    const requestBody = {
      query: `
        query {
          events {
            _id
            title
            description
            date
            price
            creator {
              _id
              email
            }
          }
        }
      `
    };

    try {
      const res = await fetch('http://localhost:8000/graphql', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (res.status !== 200 && res.status !== 201) {
        throw new Error('Failed!');
      }

      const resData = await res.json();

      console.log(resData);

      const { events } = resData.data;
      this.setState({ events });
    } catch (err) {
      console.error(err);
    }
  };

  render() {
    const mappedEvents = this.state.events.map(event => (
      <li key={event._id} className="events__list-item">
        {event.title}
      </li>
    ));
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
              <form>
                <div className="form-control">
                  <label htmlFor="title">Title</label>
                  <input type="text" id="title" ref={this.titleElRef} />
                </div>
                <div className="form-control">
                  <label htmlFor="price">Price</label>
                  <input type="number" id="price" ref={this.priceElRef} />
                </div>
                <div className="form-control">
                  <label htmlFor="date">Date</label>
                  <input type="datetime-local" id="date" ref={this.dateElRef} />
                </div>
                <div className="form-control">
                  <label htmlFor="description">Description</label>
                  <textarea rows="4" type="text" id="description" ref={this.descriptionElRef} />
                </div>
              </form>
            </Modal>
          </>
        )}
        {this.context.token && (
          <div className="events-control">
            <p>Share your own Events!</p>
            <button className="btn" onClick={this.startCreateEventHandler}>
              Create Event
            </button>
          </div>
        )}
        <ul className="events__list">{mappedEvents}</ul>
      </>
    );
  }
}

export default Events;
