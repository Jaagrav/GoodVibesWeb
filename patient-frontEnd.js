var messages = [""],
  vibratern = [];

document.querySelector(
  ".special-container-interface"
).onselectstart = function () {
  return 1 == 0;
};

var vibrate = false;
setInterval((e) => {
  if (vibrate) window.navigator.vibrate(100);
}, 100);
document
  .querySelector(".special-container-interface")
  .addEventListener("touchend", (e) => {
    vibrate = false;
  });

$(".special-container-interface").bind("taphold", dash);
$(".special-container-interface").bind("tap", dot);
$(".special-container-interface").on("swipeleft", next);
$(".special-container-interface").on("swiperight", send);

function dot() {
  vibrate = true;
  setTimeout(() => {
    vibrate = false;
  }, 100);
  messages[messages.length - 1] += "0";
  if (messages[messages.length - 1].length > 4)
    messages[messages.length - 1] = "0";
  update_special_frontEnd();
}
function dash() {
  vibrate = true;
  messages[messages.length - 1] += "1";
  if (messages[messages.length - 1].length > 4)
    messages[messages.length - 1] = "1";
  update_special_frontEnd();
}
function next() {
  vibrate = false;
  messages.push("");
  navigator.vibrate([100, 50, 100, 50, 100]);
  responsiveVoice.speak("Next Alphabet");
}
function update_special_frontEnd() {
  document.querySelector(".morse-message").innerHTML = "";
  for (let i = 0; i < messages.length; i++) {
    for (let j = 0; j < messages[i].length; j++) {
      document.querySelector(".morse-message").innerHTML +=
        messages[i].charAt(j) == "0"
          ? "•"
          : messages[i].charAt(j) == "1"
          ? "-"
          : " ";
    }
    document.querySelector(".morse-message").innerHTML += " ";
  }
  document.querySelector(".message .text").innerHTML = "";
  for (let i = 0; i < messages.length; i++) {
    if (MORSE_TO_NORMAL_CHARS[0][messages[i]] != undefined)
      document.querySelector(".message .text").innerHTML +=
        MORSE_TO_NORMAL_CHARS[0][messages[i]];
  }
  responsiveVoice.speak(
    document
      .querySelector(".message .text")
      .innerHTML.charAt(
        document.querySelector(".message .text").innerHTML.length - 1
      )
  );
}
function send() {
  if (document.querySelector(".message .text").innerHTML != "") {
    vibrate = false;
    firebase
      .database()
      .ref("GoodVibes/texts")
      .push({
        patient: true,
        text: document.querySelector(".message .text").innerHTML,
      });
    responsiveVoice.speak(
      "Sending " + document.querySelector(".message .text").innerHTML
    );
    messages = [""];
    document.querySelector(".message .text").innerHTML = "";
    document.querySelector(".message .morse-message").innerHTML = "";
    navigator.vibrate([100, 50, 100]);
  }
}
firebase
  .database()
  .ref("GoodVibes/texts")
  .on("child_added", (s) => {
    if (!s.val().patient) {
      console.log(s.val());
      messages = [];
      vibratern = [];
      for (let i = 0; i < s.val().text.length; i++) {
        messages.push(
          NORMAL_TO_MORSE_CHARS[0][s.val().text.toLowerCase().charAt(i) + ""]
        );
      }
      document.querySelector(".morse-message").innerHTML = "";
      for (let i = 0; i < messages.length; i++) {
        for (let j = 0; j < messages[i].length; j++) {
          document.querySelector(".morse-message").innerHTML +=
            messages[i].charAt(j) == "0"
              ? "•"
              : messages[i].charAt(j) == "1"
              ? "-"
              : " ";
          vibratern.push(
            messages[i].charAt(j) == "0"
              ? 250
              : messages[i].charAt(j) == "1"
              ? 800
              : " "
          );
          if (j == messages[i].length - 1) vibratern.push(1500);
          else vibratern.push(800);
        }
        document.querySelector(".morse-message").innerHTML += " ";
      }
      document.querySelector(".message .text").innerHTML = "";
      for (let i = 0; i < messages.length; i++) {
        if (MORSE_TO_NORMAL_CHARS[0][messages[i]] != undefined)
          document.querySelector(".message .text").innerHTML +=
            MORSE_TO_NORMAL_CHARS[0][messages[i]];
      }
      if (choice == "patient") {
        responsiveVoice.speak(
          "Received " + document.querySelector(".message .text").innerHTML
        );
        navigator.vibrate(vibratern);
      }
      messages = [""];
    }
  });
