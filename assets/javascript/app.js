// Steps to complete:

// 1. Initialize Firebase
// 2. Create button for adding new employees - then update the html + update the database
// 3. Create a way to retrieve employees from the employee database.
// 4. Create a way to calculate the months worked. Using difference between start and current time.
//    Then use moment.js formatting to set difference in months.
// 5. Calculate Total billed

// 1. Initialize Firebase

var config = {
  apiKey: "AIzaSyDWXQGqShAJJecPF7ZTf1Bwiwdl2tgbQW8",
  authDomain: "train-scheduler-week7.firebaseapp.com",
  databaseURL: "https://train-scheduler-week7.firebaseio.com",
  projectId: "train-scheduler-week7",
  storageBucket: "train-scheduler-week7.appspot.com",
  messagingSenderId: "976329006146"
};
firebase.initializeApp(config);

var database = firebase.database();

// 2. Button for adding Trains
$("#add-train-btn").on("click", function(event) {
  event.preventDefault();

  // Grabs user input
  let schedulerTrain = $("#train-name-input")
    .val()
    .trim();
  let schedulerDestination = $("#destination-input")
    .val()
    .trim();
  let schedulerFirstTrainTime = moment(
    $("#first-train-time-input")
      .val()
      .trim(),
    "HH:mm"
  ).format("X");
  let schedulerFrequncy = $("#frequency-input")
    .val()
    .trim();

  // Creates local "temporary" object for holding train data
  let newTrain = {
    train: schedulerTrain,
    destination: schedulerDestination,
    time: schedulerFirstTrainTime,
    frequency: schedulerFrequency
  };

  // Uploads train data to the database
  database.ref().push(newTrain);

  // Logs everything to console
  console.log(newTrain.train);
  console.log(newTrain.destination);
  console.log(newTrain.time);
  console.log(newTrain.frequency);

  alert("Train successfully added"); //change to a button that appears for a short time

  // Clears all of the text-boxes
  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#first-train-time-input").val("");
  $("#frequency-input").val("");
});

// 3. Create Firebase event for adding train to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot) {
  console.log(childSnapshot.val());

  // Store everything into a variable.
  let trainId = childSnapshot.val();
  let schedulerFirstTrainTimeConverted = moment.unix(trainId.trainTime);
  let timeDiff = moment().diff(
    moment(schedulerFirstTrainTimeConverted, "HH:mm"),
    "minutes"
  );
  let timeDiffCalc = timeDiff % parseInt(trainId.trainFreq);
  let timeDiffTotal = parseInt(trainId.trainFreq) - timeDiffCalc;

  // Train Info
  console.log(schedulerTrain);
  console.log(schedulerDestination);
  console.log(schedulerFirstTrainTime);
  console.log(schedulerFrequency);

  if (timeDiff >= 0) {
    newTime = null;
    newTime = moment()
      .add(timeDiffTotal, "minutes")
      .format("hh:mm A");
  } else {
    newTime = null;
    newTime = firstTimeConverted.format("HH:mm A");
    timeDiffTotal = Math.abs(timeDiff - 1);
  }
  // Create the new row
  let newRow = $("<tr>").append(
    $("<td>").text(trainId.trainName),
    $("<td>").text(trainId.trainDestination),
    $("<td>").text(trainId.frequency),
    $("<td>").text(newTime),
    $("<td>").text(timeDiffTotal)
  );

  // Append the new row to the table
  $("#train-table > tbody").append(newRow);
});
