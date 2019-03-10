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
  var schedulerTrain = $("#train-name-input")
    .val()
    .trim();
  var schedulerDestination = $("#destination-input")
    .val()
    .trim();
  var schedulerFirstTrainTime = moment(
    $("#first-train-time-input")
      .val()
      .trim(),
    "HH:mm"
  ).format("X");
  var schedulerFrequncy = $("#frequency-input")
    .val()
    .trim();

  // Creates local "temporary" object for holding train data
  var newTrain = {
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

// 3. Create Firebase event for adding employee to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot) {
  console.log(childSnapshot.val());

  // Store everything into a variable.
  var schedulerTrain = childSnapshot.val().train;
  var schedulerDestination = childSnapshot.val().destination;
  var schedulerFirstTrainTime = childSnapshot.val().time;
  var schedulerFrequency = childSnapshot.val().frequency;

  // Train Info
  console.log(schedulerTrain);
  console.log(schedulerDestination);
  console.log(schedulerFirstTrainTime);
  console.log(schedulerFrequency);

  // Prettify the first traiin time
  var schedulerFirstTrainTimePretty = moment.unix(empStart).format("HH:mm");

  // Calculate the months worked using hardcore math
  // To calculate the months worked
  var empMonths = moment().diff(moment(empStart, "X"), "months");
  console.log(empMonths);

  // Calculate the total billed rate
  var empBilled = empMonths * empRate;
  console.log(empBilled);

  // Create the new row
  var newRow = $("<tr>").append(
    $("<td>").text(trainName),
    $("<td>").text(trainDestination),
    $("<td>").text(empStartPretty),
    $("<td>").text(empMonths),
    $("<td>").text(empRate),
    $("<td>").text(empBilled)
  );

  // Append the new row to the table
  $("#train-table > tbody").append(newRow);
});
