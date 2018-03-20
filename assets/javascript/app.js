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


function nextArrival(freq, first) {
  //var first = moment(first, "HH:mm");
  var now = moment().format("HH:mm");
  var first = moment(first, "HH:mm").format("HH:mm");
  if(moment().isBefore(moment(first, "HH:mm"))) {
    //will print from current time to the first
    console.log("no way");
  } else {
    //will do a more complex mathematical operation 
  }
  var result = now + " " + first;
  return result;
}

$(document).ready(function(){
  dbRef.ref().on("child_added", function(childSnapshot){
    var childFreq = childSnapshot.val().frequency;
    var childFirst = childSnapshot.val().first;
    console.log(nextArrival(childFreq, childFirst));
    var row = $("<tr>");
    row.append("<td>" + childSnapshot.val().name);
    row.append("<td>" + childSnapshot.val().destination);
    row.append("<td>" + childSnapshot.val().frequency + "</td>");
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