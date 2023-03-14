const db = require('../models/dbQueries')

const infoController = {};

infoController.createLogs = async (req, res, next) => {
  //destructure data from req.body that we need to create the log entries
  const { userId, activities, mood } = req.body;

  //calculate the date
  const date = new Date().toISOString().slice(0, 10)
  
  //push the default activity to our activities list. The default activity is how we get the overall average mood across all days
  activities.push('default');

  //defining a function that will accept the data from our request body and create the logs with that data
  async function createEntries(userId, activities, mood, date) {
    //iterating over our array of daily activities
    for (let activity of activities) {
      //search if the user already has that activity connected to their record
      const result = await db.findActivity(activity, userId);
      if (result.rows.length) {
        //if they do, create a log with that activities id
        const id = result.rows[0].id;
        await db.addLog(date, mood, id, userId)
      } else {
        //if that activity is not already connected with the user, create a new activity on the db and then create the log
        const newActivity = await db.addActivity(activity, userId)
        const newId = newActivity.rows[0].id;
        await db.addLog(date, mood, newId, userId)
      }
    }
  }
  //executing function that creates logs for each activity (creating a new activity instance if necessary)
  await createEntries(userId, activities, mood, date)
  return next()
}

infoController.getCorrelationData = async (req, res, next) => {
  //destructure userID from res.locals
  const { userId }  = res.locals;
  //define an async function that will create an object where the keys are the users activities and the values are the difference
  //between the average daily mood when those activities are logged and the users overall average daily mood
  async function getCorrelation(userId) {
    //get log data from the database and store the result as a variable 'logs'
    const data = await db.getAllActivityLogsForUser(userId)
    const logs = data.rows;

    //initialize an object to store the number of times each activity has occured and the total mood points for each activity 
      //this data is used to calculate the average mood score for each activity
    const activityData = {}
    //initialize a variable to store the same information as each activity, but specificically for the 'default' activity, which 
    //will be used to calculate the overall average daily mood for the user
    let cumulativeMood = [0, 0]

    //iterate through all of our logs
    logs.forEach((log) => {
      //get the name of the activity
      const activity = log.activity
      //if the activity is our default activity
      if (activity == 'default') {
        //adjust the cumulativeMood variable
        cumulativeMood[0]++;
        cumulativeMood[1] += log.mood;
      //otherwise, initialize or update the value of that activity in our activityData object
      } else if (!activityData[activity]) {
        activityData[activity] = [1, log.mood]
      } else {
        activityData[activity][0]++;
        activityData[activity][1] += log.mood;
        }
        
      })
    
    //calculate the users overall average daily mood using the values we stored in cumulativeMood
    const avgOverallMood = cumulativeMood[1] / cumulativeMood[0]
    //initialize an object to store each activities mood variance from the overall average daily mood
    const correlations = {}
    
    //iterate through the activity data, and create a key-value pair in the correlations obj where the key is the activity name
    //and the value is the difference between that activities average mood score and the users overall average mood score
    for (let activity in activityData) {
      const moodVariance = Math.round(activityData[activity][1]/activityData[activity][0] - avgOverallMood);
      correlations[activity] = moodVariance;
    }

    //return the correlations object
    return [Math.round(avgOverallMood), correlations];
  }

  //save the output of calling the above async function to res.locals and return a call to next
  res.locals.correlations = await getCorrelation(userId);
  return next()
  
}

infoController.getUserId = async (req, res, next) => {

  const { username } = req.params;
  const user = await db.getOneUser(username)
  res.locals.userId = user.rows[0].id
  return next()
}

module.exports = infoController;