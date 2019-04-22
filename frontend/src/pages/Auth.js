import React, { Component } from 'react';

import './Auth.css';

class Auth extends Component {
  state = {
    isLogin: true
  };
  emailEl = React.createRef();
  passwordEl = React.createRef();

  handleSubmit = async e => {
    e.preventDefault();
    const { value: email } = this.emailEl.current;
    const { value: password } = this.passwordEl.current;

    if (email.trim().length === 0 || password.trim().length === 0) {
      return;
    }

    const requestBody = {
      query: `
        query {
          login(email: "${email}", password: "${password}") {
            userId
            token
            tokenExpiration
          }
        }
      `
    };

    if (!this.state.isLogin) {
      requestBody.query = `
        mutation {
          createUser(userInput: { email: "${email}", password: "${password}" }) {
            _id
            email
          }
        }
      `;
    }

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
    } catch (err) {
      console.error(err);
    }
  };

  handleSwitchMode = () => {
    this.setState(prevState => ({
      isLogin: !prevState.isLogin
    }));
  };

  render() {
    return (
      <form className="auth-form" onSubmit={this.handleSubmit}>
        <div className="form-control">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" ref={this.emailEl} />
        </div>
        <div className="form-control">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" ref={this.passwordEl} />
        </div>
        <div className="form-actions">
          <button type="submit">Submit</button>
          <button type="button" onClick={this.handleSwitchMode}>
            Switch to {this.state.isLogin ? 'Signup' : 'Login'}
          </button>
        </div>
      </form>
    );
  }
}

export default Auth;
