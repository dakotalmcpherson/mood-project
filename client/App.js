import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import '../public/style.scss';
// import {  loggingMyStuff } from './testSlice';
import { login } from './userSlice';
import { saveLogToState } from './logSlice';
import { toggleDash } from './dashboardSlice';
import { Bar } from 'react-chartjs-2'
import { barOptions, createData } from './BarGraph.js';

const App = (props) => {
  const { isAuthenticated } = useSelector((state) => state.user);
  const { showDash } = useSelector((state) => state.dashboard);

  //   if (!isAuthenticated) loggingMyStuff(isAuthenticated);
  const displayItems = [];
  switch (isAuthenticated) {
    case false:
      displayItems.push(<LoginDisplay />);
      break;
    case true:
      !showDash
        ? displayItems.push(<LogCreator></LogCreator>)
        : displayItems.push(<Dashboard />);
  }
  return <>{displayItems}</>;
};

const LoginDisplay = (props) => {
  const dispatch = useDispatch();
  return (
    <div className="loginDisplay">
      <h1>Welcome</h1>
      <form
        onSubmit={(e) => {
          //handle submit
          //redirect to dashboard with dashboard data saved to state
          e.preventDefault();
          //   console.log(e.target.username.value, login);
          const loginUser = login(
            e.target.username.value,
            e.target.password.value
          );
          loginUser(dispatch);
        }}
      >
        <div>
          <label htmlFor="username">Username: </label>
          <input name="username" required></input>
        </div>
        <div>
          <label htmlFor="password">Password: </label>
          <input name="password" required></input>
        </div>
        <button type="submit">Log In</button>
      </form>
    </div>
  );
};

const Dashboard = (props) => {
  const dispatch = useDispatch();
  const listItems = [];
  //   const [logCreator, setLogCreator] = useState(null);
  const { activities, avgIndex } = useSelector((state) => state.dashboard);
  console.log('here', activities);
  listItems.push(<div className="barGraph"><Bar options={Object.keys(activities)} data={createData(Object.keys(activities), Object.values(activities))} /></div>)
  // for (const [key, value] of Object.entries(activities)) {
  //   console.log(key, value);
  //   listItems.push(<Activity activity={key} correlation={value} />);
  // }
  return (
    <div className="dashboard">
      <h1>Your Dashboard</h1>
      <h3>Average Mood Index: {avgIndex}</h3>
      <ul className="activitiesList">{listItems}</ul>
      <button
        type="button"
        onClick={() => {
          //   setLogCreator(<LogCreator></LogCreator>);
          dispatch(toggleDash(false));
        }}
      >
        Create New Log?
      </button>
      {/* {logCreator} */}
    </div>
  );
};

const Activity = (props) => {
  return (
    <li className="activity">
      {props.activity}
      {props.correlation}
    </li>
  );
};

const LogCreator = (props) => {
  let didClick = false;
  const dispatch = useDispatch();
  const [activityText, setActivityText] = useState('');
  const [activityList, setActivityList] = useState([]);
  const [sliderValue, setSliderValue] = useState(50);
  return (
    <div className="logCreator">
      <h3>Create A New Log</h3>
      <form
        onSubmit={(e) => {
          //handle confirm and saving data to db
          e.preventDefault();
          dispatch(toggleDash(true));
          dispatch(saveLogToState({ activityText, sliderValue }));
        }}
      >
        <label htmlFor="newActivity">Add new activity or influence.</label>
        <input
          name="newActivity"
          onChange={(e) => {
            setActivityText(e.target.value);
          }}
        ></input>
        <button
          type="button"
          onClick={(e) => {
            dispatch(saveLogToState({ activityText, sliderValue }));
            e.target.previousElementSibling.value = '';
            !didClick
              ? (e.target.innerText = 'Add Another?')
              : (didClick = true);
            activityList.push(<Activity activity={activityText} />);
            setActivityList(activityList);
          }}
        >
          Add To List
        </button>
        <ul>{activityList}</ul>
        <label htmlFor="moodIndex">Rate your overall feeling today</label>
        <input
          type="range"
          name="moodIndex"
          onChange={(e) => {
            setSliderValue(e.target.value);
          }}
        ></input>
        <button type="submit">Save Log</button>
      </form>
    </div>
  );
};

//employ useSelector for getting things from state
//employ imports for getting actions and functions to be dispatched

const Button = (props) => {
  const dispatch = useDispatch();
  const { toLog } = props;
  const { log } = useSelector((state) => state.test);
  return (
    <button
      onClick={() => {
        dispatch(saveLogToState(toLog));
        dispatch(loggingMyStuff(toLog));
      }}
    >
      click me
    </button>
  );
};

export default App;
