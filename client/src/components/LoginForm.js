// Since the LoginForm thwarted my last attempt at getting this challenge operational
// We'll take extra caution in getting it set up here.

// see SignupForm.js for comments
import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';

// Import useMutation from react hook and LOGIN_USER from mutations
import { useMutation } from '@apollo/react-hooks';
import { LOGIN_USER } from '../utils/mutations';

// Deleted this in my last attempt. Since we had issues logging in, do not touch this
// import { loginUser } from '../utils/API';
import Auth from '../utils/auth';

const LoginForm = () => {
  const [userFormData, setUserFormData] = useState({ email: '', password: '' });
  const [validated] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  // Like last attempt, call the loginUser and connect it to the mutation
  const [loginUser] = useMutation(LOGIN_USER);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    // check if form has everything (as per react-bootstrap docs)
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    try {
      // Replace the loginUser() functionality imported from the API file with the LOGIN_USER mutation functionality.
      // const response = await loginUser(userFormData);

      // Here's a pun from my last attempt
      // TRYing something new! Get it?
      const { data } = await loginUser ({
        variables: { ...userFormData }
      })

      // Tired of seeing something went wrong.
      //   if (!response.ok) {
      //     throw new Error('something went wrong!');
      //   }

      // Commented out last time, toggle back and forth if it needs to be removed or not
      // const { token, user } = await response.json();
      console.log(data.user);
      // Auth.login(data.login.token);
      Auth.login(data.addUser.token); 
    } catch (err) {
      console.error(err);
      setShowAlert(true);
    }

    setUserFormData({
      username: '',
      email: '',
      password: '',
    });
  };

  return (
    <>
      <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
        <Alert dismissible onClose={() => setShowAlert(false)} show={showAlert} variant='danger'>
          Something went wrong with your login credentials!
        </Alert>
        <Form.Group>
          <Form.Label htmlFor='email'>Email</Form.Label>
          <Form.Control
            type='text'
            placeholder='Your email'
            name='email'
            onChange={handleInputChange}
            value={userFormData.email}
            required
          />
          <Form.Control.Feedback type='invalid'>Email is required!</Form.Control.Feedback>
        </Form.Group>

        <Form.Group>
          <Form.Label htmlFor='password'>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Your password'
            name='password'
            onChange={handleInputChange}
            value={userFormData.password}
            required
          />
          <Form.Control.Feedback type='invalid'>Password is required!</Form.Control.Feedback>
        </Form.Group>
        <Button
          disabled={!(userFormData.email && userFormData.password)}
          type='submit'
          variant='success'>
          Submit
        </Button>
      </Form>
    </>
  );
};

export default LoginForm;
