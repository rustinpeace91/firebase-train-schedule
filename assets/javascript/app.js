  // Initialize Firebase

  var config = {
    apiKey: "AIzaSyBg3wF7Ipq81IEoG6fyH1s5_BmQNdJxBmw",
    authDomain: "trainschedule-a3f0c.firebaseapp.com",
    databaseURL: "https://trainschedule-a3f0c.firebaseio.com",
    projectId: "trainschedule-a3f0c",
    storageBucket: "trainschedule-a3f0c.appspot.com",
    messagingSenderId: "1062976683679"
  };
  firebase.initializeApp(config);
  //variable that holds the reference to the database
  var dbRef = firebase.database();

//calculates the next train time, and the minutes away. 
//returns either variables depending on the value passed to the parameter "type"
function nextTrain(freq, first, type) {
  //current time
  var now = moment();
  //parses the first train time in moment
  var first = moment(first, "HH:mm");
  var freq = freq;
  //if the current train is before the first train on the 24 hour time scale
  //returns the first trains time and minutes away
  //assumes all trains stop at midnight.  
  if(now.isBefore(moment(first, "HH:mm"))) {

    var minutesAway = first.diff(now, "minutes");
    var result = first.format("HH:mm");
  } else {
    var result = now.format("HH:mm") + " " + first.format("HH:mm");
    //calcualtes the amount of minutes that have passed between the first train time and now
    var duration = now.diff(first, "minutes") 
    //calculates the minutes away by subtracting the duration % freq from frequency
    var minutesAway = freq - (duration % freq);
    result = moment().add(minutesAway, "minutes").format("h:mm a");
  }
  if(type === "next_arrival") {
    return result;
  } else {
    return minutesAway;
  }

 
}

$(document).ready(function(){
  dbRef.ref().on("child_added", function(childSnapshot){
    var childFreq = childSnapshot.val().frequency;
    var childFirst = childSnapshot.val().first;
    //gets hte next train by running the function with the parameter "next_arrival"
    var next = nextTrain(childFreq, childFirst, "next_arrival");
    //gets the minutes away by running the same function with a different parameter 
    var minutesFrom = nextTrain(childFreq, childFirst, "minutes_away")
    //adds a table row
    var row = $("<tr>");
    row.append("<td>" + childSnapshot.val().name);
    row.append("<td>" + childSnapshot.val().destination);
    row.append("<td>" + childSnapshot.val().frequency + "</td>");
    row.append("<td>" + next);
    row.append("<td>" + minutesFrom)
    $("#train-table tbody").append(row);
  });

  //runs when the user hits the submit button. Grabs the data from the fields and pushes it into the database 
  $("#submit-data").on("click", function(event){
    event.preventDefault();
    var trainName = $("#train-name").val().trim();
    var destination = $("#destination").val().trim();
    var firstTime = $("#first-train-time").val().trim();
    var frequency = $("#frequency").val().trim();

    var trainEntry = {
      name: trainName,
      destination:destination,
      first: firstTime,
      frequency:frequency
    }
    console.log(dbRef.trainEntry);
    dbRef.ref().push(trainEntry);
    
    $("#destination").val("");
    $("#first-train-time").val("");
    $("#frequency").val("");
    $("#train-name").val("");

  });


});