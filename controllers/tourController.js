import Tour from '../models/tourModel.js';
import catchAsync from '../utils/catchAsnyc.js';
import factory from './handlerFactory.js';

const getTours = factory.getAll(Tour);


const getTour = factory.getOne(Tour, { path: 'reviews' });
const createTour = factory.createOne(Tour);
const updateTour = factory.updateOne(Tour);
const deleteTour = factory.deleteOne(Tour);

const getToursStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingAverage' },
        avgRating: { $avg: '$ratingAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });

});

const alaisTopTour = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingAverage,price';
  req.query.fields = 'name,price,ratingAverage,summary,difficulty';
  next();
};
const getMonthlyPlan = catchAsync(async (req, res, next) => {

  const year = req.params.year * 1;
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTours: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: { _id: 0 },
    },
    {
      $sort: { numTours: -1 },
    },
  ]);
  res.status(200).json({
    status: 'success',
    number: plan.length,
    data: {
      plan,
    },
  });
});
export default {
  getTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  alaisTopTour,
  getToursStats,
  getMonthlyPlan,
};

// import fs from 'fs';
// const tours=JSON.parse(fs.readFileSync('./dev-data/data/tours-simple.json'));

// const checkId=(req,res,next,val)=>{
//     console.log(val);
//         if(req.params.id*1>tours.length) {
//             return res.status(404).send({
//                 status:"not found",
//                 messsage:'Invalid ID'
//             })
//         }
//         next();
// }
// const checkBody=(req,res,next)=>{
//     if(!req.body.name || !req.body.price){
//         return(
//             res.status(400).send({
//                 status:"failed",
//                 message:"name or price not found"
//             })
//         )
//     }
//     next();
// }
// const getTours=(req,res)=>{
//     res.status(200).send({
//         status:'success',
//         results: tours.length,
//         data:{
//             tours
//         }
//     });
// }
// const getTour=(req,res)=>{
//     const ide=req.params.id*1;
//     const tour=tours.find((ele)=>ele.id===ide );
// //     if(!tour){
// //         return res.status(404).send({
// //             status:"not found",
// //             messsage:'Invalid ID'
// //     })
// // }
//     res.status(200).json({
//         status:"success",
//         data:{
//             tour
//         }
//     })
// }
// const postTour=(req,res)=>{
//     const newid=tours[tours.length-1].id+1;
//     const newTour=Object.assign({id:newid},req.body);
//     tours.push(newTour);
//     fs.writeFile('./dev-data/data/tours-simple.json',JSON.stringify(tours),err=>{
//         if(err){
//             console.log(err);
//         }
//         res.status(201).send({
//             status:'success',
//             data:{
//                 newTour
//             }
//         })
//     })
// }
// const updateTour=(req, res)=>{

//     res.status(200).send({
//         status:'success',
//         data:"<updated tour here...>"
//     })

// }
// const deleteTour=(req,res)=>{

//     res.status(204).send({
//         status:'success',
//         data:null
//     })
// }
// export default{
//     getTours,
//     getTour,
//     postTour,
//     updateTour,
//     deleteTour,
//     checkId,
//     checkBody
// }
