import React from 'react';
import {fireEvent, render, screen} from "@testing-library/react";
import Login from "./Login"
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import { Provider } from "react-redux";
import {configureStore} from "../../redux/store";

describe("Login Page", ()=>{
  it("Memastikan content sesuai saat dirender", ()=>{
    // let { getByText, getByTestId } = render(<Provider store={configureStore()}>
    // <Router>
    //     <Login />
    // </Router>
    // </Provider>);

    // expect(screen.getByText(/Kami/))
    
    const email = "bahrijar@gmail.com";
    const password = "mantaps";

    let { getByText, getByTestId } = render(<Provider store={configureStore()}>
    <Router>
        <Login />
    </Router>
    </Provider>);

    fireEvent.change(getByTestId("email"), {
      target: { value: email }
    });

    fireEvent.change(getByTestId("password"), {
      target: { value: password }
    });

    fireEvent.submit(getByTestId("form-login"));

    expect(getByTestId("email").value).toEqual(email);
  })
});