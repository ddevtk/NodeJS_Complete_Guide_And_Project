const fs = require('fs');
const express = require('express');

const app = express();
app.use(express.json()); // MIDDLEWARE

// app.get('/', (req, res) => {
//   res.status(200).json({ message: 'Hello from server side', app: 'Natour' });
// });
// app.post('/', (req, res) => {
//   res.send('You can post to this end point...');
// });

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

//////////////////////
// CREATE NEW TOUR
const createNewTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);
  console.log(tours);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
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

/////////////////////
// GET ALL TOUR
const getAllTour = (req, res) => {
  res.status(200).json({
    status: 'success',
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
// CRUD API

// app.post('/api/v1/tours', createNewTour);
// app.get('/api/v1/tours', getAllTour);
// app.get('/api/v1/tours/:id', getTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

app.route('/api/v1/tours').get(getAllTour).post(createNewTour);
app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .delete(deleteTour)
  .patch(updateTour);

const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
