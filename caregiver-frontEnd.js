firebase
  .database()
  .ref("GoodVibes/texts")
  .on("child_added", (s) => {
    if (!s.val().patient) {
      document.querySelector(".message-body").innerHTML +=
        "<div class='text-holder'><div class='my-text'>" +
        s.val().text +
        "</div></div>";
    } else {
      document.querySelector(".message-body").innerHTML +=
        "<div class='text-holder'><div class='their-text'>" +
        s.val().text +
        "</div></div>";
      if (choice == "caregiver") responsiveVoice.speak(s.val().text);
    }
  });
document.querySelector(".message-sendbox").addEventListener("keypress", (e) => {
  if (
    e.key == "Enter" &&
    document.querySelector(".message-sendbox").value.trim() != "" &&
    choice == "caregiver"
  ) {
    firebase
      .database()
      .ref("GoodVibes/texts")
      .push({
        patient: false,
        text: document.querySelector(".message-sendbox").value.trim(),
      });
  }
});
