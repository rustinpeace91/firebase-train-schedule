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

  var dbRef = firebase.database();


function nextTrain(freq, first, type) {
  //var first = moment(first, "HH:mm");
  var now = moment();
  //console.log(now.format("HH:mm"));
  var first = moment(first, "HH:mm");
  var freq = freq;
  if(now.isBefore(moment(first, "HH:mm"))) {
    //will print from current time to the first
    //console.log("no way");
    var minutesAway = first.diff(now, "minutes");
    var result = first.format("HH:mm");
  } else {
    var result = now.format("HH:mm") + " " + first.format("HH:mm");
    //duration in minutes that the train runs in total
    //(24 * 60) - (first.diff(moment(0000, "HH:mm"), "minutes"));
    var duration = now.diff(first, "minutes")
    //console.log("duration = " + duration)
    //console.log("minutes away = " + (freq - (duration % freq)) )
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
    var next = nextTrain(childFreq, childFirst, "next_arrival");
    var minutesFrom = nextTrain(childFreq, childFirst, "minutes_away")
    var row = $("<tr>");
    row.append("<td>" + childSnapshot.val().name);
    row.append("<td>" + childSnapshot.val().destination);
    row.append("<td>" + childSnapshot.val().frequency + "</td>");
    row.append("<td>" + next);
    row.append("<td>" + minutesFrom)
    $("#train-table tbody").append(row);
  });


  $("#submit-data").on("click", function(event){
    console.log("running");
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
console.log("js working");