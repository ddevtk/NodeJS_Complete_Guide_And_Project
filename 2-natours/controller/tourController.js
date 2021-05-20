const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

////////////////////////
/// CHECK ID IS VALID
module.exports.checkID = (req, res, next, val) => {
  console.log(`Tour ID is ${val}`);
  if (+req.params.id > tours.length - 1) {
    return res.status(404).json({
      status: 'fail',
      message: 'invalid ID',
    });
  }
  next();
};

/////////////////////
// GET ALL TOUR
module.exports.getAllTour = (req, res) =>
  res.status(200).json({
    status: 'success',
    responseMessage: res.message,
    requestedAt: req.requestTime,
    results: tours.length,
    data: {
      tours,
    },
  });
/////////////////////
// GET TOUR
module.exports.getTour = (req, res) => {
  const id = +req.params.id;
  const tour = tours.find((tour) => tour.id === id);

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

/////////////////////
// UPDATE TOUR
module.exports.updateTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: '<Updated tour here ...>',
  });
};

/////////////////////
// DELETE TOUR
module.exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null,
  });
};

//////////////////////
// CREATE NEW TOUR
module.exports.createNewTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/../dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
};
