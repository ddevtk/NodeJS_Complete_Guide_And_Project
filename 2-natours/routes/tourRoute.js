const express = require('express');
const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

/////////////////////
// GET ALL TOUR
const getAllTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    responseMessage: res.message,
    requestedAt: req.requestTime,
    results: tours.length,
    data: {
      tours,
    },
  });
};

/////////////////////
// GET TOUR
const getTour = (req, res) => {
  const id = +req.params.id;
  const tour = tours.find((tour) => tour.id === id);

  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'INVALID ID',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

/////////////////////
// UPDATE TOUR
const updateTour = (req, res) => {
  if (+req.params.id > tours.length - 1) {
    return res.status(404).json({
      status: 'fail',
      message: 'INVALID ID',
    });
  }
  res.status(200).json({
    status: 'success',
    data: '<Updated tour here ...>',
  });
};

/////////////////////
// DELETE TOUR
const deleteTour = (req, res) => {
  if (+req.params.id > tours.length - 1) {
    return res.status(404).json({
      status: 'fail',
      message: 'INVALID ID',
    });
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
};

//////////////////////
// CREATE NEW TOUR
const createNewTour = (req, res) => {
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

const router = express.Router();
router.route('/').get(getAllTour).post(createNewTour);
router.route('/:id').get(getTour).delete(deleteTour).patch(updateTour);

module.exports = router;
