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

const database = firebase.database();

//Run Clock
setInterval(function() {
  $(".current-time").html(moment().format("hh:mm:ss A"));
}, 1000);

$(".content").hide();

// Declare variables
var dataRef = firebase.database();
var editTrainKey = "";
var fbTime = moment();
var newTime;

$("#add-train-btn").on("click", function(e) {
  e.preventDefault();
  // Grab input values
  var trainName = $("#train-name-input")
    .val()
    .trim();
  var trainDestination = $("#destination-input")
    .val()
    .trim();
  // Convert to Unix
  var trainTime = moment(
    $("#first-train-time-input")
      .val()
      .trim(),
    "HH:mm"
  ).format("X");
  var trainFreq = $("#frequency-input")
    .val()
    .trim();

  if (
    trainName != "" &&
    trainDestination != "" &&
    trainTime != "" &&
    trainFreq != ""
  ) {
    // Clear form data
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#first-train-time-input").val("");
    $("#frequency-input").val("");
    $("#trainKey").val("");

    fbTime = moment().format("X");
    // Push to firebase
    if (editTrainKey == "") {
      dataRef
        .ref()
        .child("trains")
        .push({
          trainName: trainName,
          trainDestination: trainDestination,
          trainTime: trainTime,
          trainFreq: trainFreq,
          currentTime: fbTime
        });
    } else if (editTrainKey != "") {
      dataRef.ref("trains/" + editTrainKey).update({
        trainName: trainName,
        trainDestination: trainDestination,
        trainTime: trainTime,
        trainFreq: trainFreq,
        currentTime: fbTime
      });
      editTrainKey = "";
    }
    $(".help-block").removeClass("bg-danger");
  } else {
    $(".help-block").addClass("bg-danger");
  }
});

// Update minutes away by triggering change in firebase children
function timeUpdater() {
  dataRef
    .ref()
    .child("trains")
    .once("value", function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        fbTime = moment().format("X");
        dataRef.ref("trains/" + childSnapshot.key).update({
          currentTime: fbTime
        });
      });
    });
}

setInterval(timeUpdater, 10000);

// Reference Firebase when page loads and train added
dataRef
  .ref()
  .child("trains")
  .on(
    "value",
    function(snapshot) {
      $("tbody").empty();

      snapshot.forEach(function(childSnapshot) {
        var trainClass = childSnapshot.key;
        var trainId = childSnapshot.val();
        var firstTimeConverted = moment.unix(trainId.trainTime);
        var timeDiff = moment().diff(
          moment(firstTimeConverted, "HH:mm"),
          "minutes"
        );
        var timeDiffCalc = timeDiff % parseInt(trainId.trainFreq);
        var timeDiffTotal = parseInt(trainId.trainFreq) - timeDiffCalc;

        if (timeDiff >= 0) {
          newTime = null;
          newTime = moment()
            .add(timeDiffTotal, "minutes")
            .format("hh:mm A");
        } else {
          newTime = null;
          newTime = firstTimeConverted.format("hh:mm A");
          timeDiffTotal = Math.abs(timeDiff - 1);
        }

        $("tbody").append(
          "<tr class=" +
            trainClass +
            "><td>" +
            trainId.trainName +
            "</td><td>" +
            trainId.trainDestination +
            "</td><td>" +
            trainId.trainFreq +
            "</td><td>" +
            newTime +
            "</td><td>" +
            timeDiffTotal +
            "</td><td><button class='edit btn' data-train=" +
            trainClass +
            "><i class='glyphicon glyphicon-pencil'></i></button> <button class='delete btn' data-train=" +
            trainClass +
            "><i class='glyphicon glyphicon-remove'></i></button></td></tr>"
        );
      });
    },
    function(errorObject) {
      console.log("Errors handled: " + errorObject.code);
    }
  );

// Reference Firebase when children are updated
dataRef
  .ref()
  .child("trains")
  .on(
    "child_changed",
    function(childSnapshot) {
      var trainClass = childSnapshot.key;
      var trainId = childSnapshot.val();
      var firstTimeConverted = moment.unix(trainId.trainTime);
      var timeDiff = moment().diff(
        moment(firstTimeConverted, "HH:mm"),
        "minutes"
      );
      var timeDiffCalc = timeDiff % parseInt(trainId.trainFreq);
      var timeDiffTotal = parseInt(trainId.trainFreq) - timeDiffCalc;

      if (timeDiff > 0) {
        newTime = moment()
          .add(timeDiffTotal, "minutes")
          .format("hh:mm A");
      } else {
        newTime = firstTimeConverted.format("hh:mm A");
        timeDiffTotal = Math.abs(timeDiff - 1);
      }

      $("." + trainClass).html(
        "<td>" +
          trainId.trainName +
          "</td><td>" +
          trainId.trainDestination +
          "</td><td>" +
          trainId.trainFreq +
          "</td><td>" +
          newTime +
          "</td><td>" +
          timeDiffTotal +
          "</td><td><button class='edit btn' data-train=" +
          trainClass +
          "><i class='glyphicon glyphicon-pencil'></i></button><button class='delete btn' data-train=" +
          trainClass +
          "><i class='glyphicon glyphicon-remove'></i></button></td>"
      );
    },
    function(errorObject) {
      console.log("Errors handled: " + errorObject.code);
    }
  );

$(document).on("click", ".delete", function() {
  var trainKey = $(this).attr("data-train");
  dataRef.ref("trains/" + trainKey).remove();
  $("." + trainKey).remove();
});

$(document).on("click", ".edit", function() {
  editTrainKey = $(this).attr("data-train");
  dataRef
    .ref("trains/" + editTrainKey)
    .once("value")
    .then(function(childSnapshot) {
      $("#train-name-input").val(childSnapshot.val().trainName);
      $("#destination-input").val(childSnapshot.val().trainDestination);
      $("#first-train-time-input").val(
        moment.unix(childSnapshot.val().trainTime).format("HH:mm")
      );
      $("#frequency-input").val(childSnapshot.val().trainFreq);
      $("#trainKey").val(childSnapshot.key);
    });
});
