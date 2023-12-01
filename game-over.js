document.addEventListener("DOMContentLoaded", function () {
  
    const audio = new Audio('./audio/kl-peach-game-over-iii-142453.mp3');
    audio.play();
  
    // Retrieve the stored score, name, and nickname from localStorage
    var finalScore = localStorage.getItem("finalScore");
    var playerName = localStorage.getItem("name");
    var playerNickname = localStorage.getItem("nickname");
  
    // Display the score in the score div
    var scoreDiv = document.querySelector(".score");
  
    // Style the text
    scoreDiv.style.color = "#FFFFFF";
    scoreDiv.style.fontSize = "40px";
    scoreDiv.style.textAlign = "center";
  
    scoreDiv.textContent = "Score: " + finalScore;
  
    // Display the name and nickname in the name-display div
    var nameDisplayDiv = document.querySelector(".name-display");
  
    // Combine the name and nickname strings
    var nameAndNickname = "";
    if (playerName) {
      nameAndNickname += playerNickname;
    }
  
    // Set the inner HTML of the name-display div
    nameDisplayDiv.innerHTML = nameAndNickname;
  
    // Style for text in the name-display div
    nameDisplayDiv.style.color = "#FFFFFF";
    nameDisplayDiv.style.fontSize = "50px";
    nameDisplayDiv.style.textAlign = "center";
  
    // Determine the statement based on the final score
    var statementDiv = document.querySelector(".statement");
    statementDiv.style.color = "#FFFFFF";
    statementDiv.style.fontSize = "40px";
    statementDiv.style.textAlign = "center";
  
    var statement = getStatement(finalScore);
    statementDiv.textContent = statement;
  });
  
  // Function to get the statement based on the final score
  function getStatement(finalScore) {
    if (finalScore >= 120) {
      return "Congratulations, you could be spending your time better though";
    } else if (finalScore >= 60 && finalScore < 120) {
      return "Well Done";
    } else if (finalScore >= 30 && finalScore < 60) {
      return "Solid Performance";
    } else if (finalScore >= 15 && finalScore < 30) {
      return "Good effort. Keep practicing";
    } else {
      return "Not Your Best Performance";
    }
  }
  