const Package = require("../Schema/packageSchema");
const { validate, fetchData, getTimeDiff } = require("./helpers");

const getPackages = async (req, res) => {
  const data = await Package.find({});

  res.render("index", { data: data });
};

const postPackages = async (req, res) => {
  const listOfTrackers = req.body.trackingNumber.split(" ");

  const validatedTrackers = listOfTrackers.filter((el) => validate(el));

  // console.log(validatedTrackers);
  for (let i = 0; i < validatedTrackers.length; i++) {
    const data = await fetchData(validatedTrackers[i]);
    try {
      Package.replaceOne(
        { tracking_number: validatedTrackers[i] },
        {
          tracking_number: data.number,
          status: data.status,
          days_ago: getTimeDiff(data.checkpoints[0].time),
          checkpoints: data.checkpoints,
        },
        { upsert: true },
        () =>
          console.log(
            `${i + 1}/${validatedTrackers.length} Saved: ${data.number}`
          )
      );
    } catch (err) {
      Package.replaceOne(
        { tracking_number: validatedTrackers[i] },
        {
          tracking_number: validatedTrackers[i],
          status: "Invalid",
          days_ago: 0,
          checkpoints: [
            {
              courier: { code: "ups", name: "UPS" },
              location: "N/A",
              message: "Invalid tracking number -- Please check for typos",
              status: "Invalid",
              time: null, //utc
            },
          ],
        },
        { upsert: true },
        () => console.log(`Error: ${validatedTrackers[i]}`)
      );
    }
  }
  res.redirect("/");
};

module.exports = {
  getPackages: getPackages,
  postPackages: postPackages,
};
