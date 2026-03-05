const https = require("https");
const fs = require("fs");

const url = "https://calendar.google.com/calendar/ical/7e16fc0dd74e89ecc00d732021bc56a7c74565bba0806da13f92e846ec9e04ba%40group.calendar.google.com/private-7f7b67376b70d34aa51024969d375eec/basic.ics";

https.get(url, res => {

  let data = "";

  res.on("data", chunk => {
    data += chunk;
  });

  res.on("end", () => {

    const eventos = [];

    const bloques = data.split("BEGIN:VEVENT");

    bloques.forEach(b => {

      const fecha = b.match(/DTSTART;VALUE=DATE:(\d+)/);
      const titulo = b.match(/SUMMARY:(.*)/);

      if(fecha && titulo){

        const f = fecha[1];

        const fechaFormateada =
          f.substring(0,4) + "-" +
          f.substring(4,6) + "-" +
          f.substring(6,8);

        eventos.push({
          fecha: fechaFormateada,
          titulo: titulo[1]
        });

      }

    });

    const json = {
      eventos
    };

    fs.writeFileSync(
      "./src/assets/eventos.json",
      JSON.stringify(json, null, 2)
    );

    console.log("Calendario actualizado");

  });

});