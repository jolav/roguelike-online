/* */

console.log('Loading..... client/index.js');

const index = {
  init: function () {
    const where = window.location.hostname;
    // use localhost, with 127.0.0.1 cant see cookies value
    if (where !== "localhost" && where !== "127.0.0.1") {
      //c.API.AUTOSTART = false;
      //c.API.HOST = 1;
    }
    this.landingPage();
  },
  landingPage: async function () {
    console.log('##### INIT #####');
    this.showSection("landingPage");
    document.getElementById("version").innerHTML = "version_" + "0.0";
    window.addEventListener('keydown', function pressAnyKey(ev) {
      if (ev.key === "Escape" || ev.key === "Enter") {
        window.removeEventListener("keydown", pressAnyKey);
        index.play();
      }
    });

  },
  showSection: function (section) {
    const section1 = document.getElementById("landingPage");
    const section2 = document.getElementById("playZone");
    //const section3 = document.getElementById("modal");
    section1.classList.remove("visible");
    section2.classList.remove("visible");
    //section3.classList.remove("visible");
    switch (section) {
      case "landingPage":
        section1.classList.add("visible");
        break;
      case "playZone":
        //document.getElementById("panel").style.width = c.PANEL_WIDTH + "px";
        section2.classList.add("visible");
        break;
      /*case "modal":
        section3.classList.add("visible");
        break;*/
    }
  },
  play: async function () {
    console.log('PLAY');
  },
};

export {
  index
};
