import { Connector } from "@oceanum/datamesh";

//Instatiate the Datamesh Connector
const datamesh = new Connector(); //Get your datamesh token from your Oceanum.io account

//Define a datamesh query
const location = {
  type: "Feature",
  geometry: {
    type: "Point",
    coordinates: [2, 52],
  },
};

const query = {
  datasource: "era5_wind10m",
  geofilter: {
    type: "feature",
    geom: location,
  },
  timefilter: {
    times: ["2020-01-01T00:00:00Z", "2021-01-01T00:00:00Z"],
  },
};

//Get the data
datamesh
  .query(query)
  .then((data) => {
    //Convert the data to a dataframe
    return data.asDataframe();
  })
  .then((df) => {
    console.log(df.slice(0, 5));
  })
  .catch((error) => {
    console.error(error.message);
  });
