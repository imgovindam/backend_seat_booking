// // const Seat = require("../models/Seat");

// // //**book seat & give error when the user try to book the booked seat */

// // //** i have  implemented SYSTEM DESIGN in this by blocking the RACE & implementing the Atomic Update */

// // // const bookSeat = async (req, res) => {
// // //     try {
// // //         const {seatId,userId}=req.body
// // //         const seat = await Seat.findById(seatId);
// // //         if(!seat){
// // //             return res.status(404).json({status:404,message:"Seat not found"});
// // //         }
// // //         if(seat.isBooked){
// // //             return res.status(400).json({status:400,message:"Seat already booked"});
// // //         }

// // //         seat.isBooked = true;
// // //         seat.userId = userId;
// // //         await seat.save();

// // //         res.status(200).json({status:200,message:"Seat booked successfully",seat});
// // //     }
// // //     // const { seatId, userId } = req.body;
// // // catch(err) {
// // //     console.error("Error booking seat:", err);
// // //     res.status(500).json({ status: 500, message: "Server error" });
// // // }
// // // } ;


// // //**for now */
// // // const bookSeat = async (req, res) => {
// // //   try {
// // //     const { seatId } = req.body;
// // //     // const seat = await Seat.findById(seatId);

// // //     const seat = await Seat.findOneAndUpdate(
// // //       { _id: seatId, isBooked: false }, // condition
// // //       { $set: { isBooked: true } }, // update
// // //       { new: true } // return updated doc
// // //     );
// // //     if (!seat) {
// // //       return res.status(404).json({ status: 404, message: "Seat not found" });
// // //     }
// // //     if (seat.isBooked) {
// // //       return res
// // //         .status(400)
// // //         .json({ status: 400, message: "Seat already booked" });
// // //     }

// // //     seat.isBooked = true;
// // //     // seat.userId = userId;
// // //     await seat.save();

// // //     return res.status(200).json({
// // //       status: 200,
// // //       message: "Seat booked successfully",

// // //       // res.status(200).json({status:200,message:"Seat booked successfully",seat
// // //     });
// // //   } catch (err) {
// // //     // const { seatId, userId } = req.body;
// // //     console.error("Error booking seat:", err);
// // //     res.status(500).json({ status: 500, message: "Server error" });
// // //   }
// // // };

// // // const getSeats=async (req,res)=>{
// // //     try{
// // //         const {seatId}=req.params;
// // //         const seat=await Seat.find();
// // //         if(!seat){
// // //             // return res.status(404).json({status:404,message:"Seat not found"});
// // //             return [];
// // //         }else{
// // //             // return res.status(200).json({status:200,seat});
// // //             res.status(200).json({status:200,seat});
// // //         }
// // //     }catch(err){
// // //         console.error("Error fetching seat:", err);
// // //         res.status(500).json({ status: 500, message: "Server error" });
// // //     }
// // // }


// // const LOCK_EXPIRY_MINUTES = 5;


// // const bookSeat = async (req, res) => {
// //   try {
// //     const { seatId } = req.body;

// //     const seat = await Seat.findOneAndUpdate(
// //       { _id: seatId, status: "locked" ,lockedBy: req.user.id },   // validation happens here
// //       { $set: { status: "booked" ,lockedAt:null} },      // $set: “Find the document and set its status field to "booked", without changing anything else.”
// //       { new: true }
// //     );

// //     // 🔑 This ONE check replaces all your if-statements
// //     if (!seat) {
// //       return res.status(400).json({
// //         status: 400,
// //         message: "Seat must be locked before booking",
// //       });
// //     }

// //     return res.status(200).json({
// //       status: 200,
// //       message: "Seat booked successfully",
// //       seat,
// //     });

// //   } catch (err) {
// //     console.error("Error booking seat:", err);
// //     res.status(500).json({ status: 500, message: "Server error" });
// //   }

// // };



// // // const getSeats = async (req, res) => {
// // //   try {
// // //     const seats = await Seat.find();

// // //     if (seats.length === 0) {
// // //       return res.status(404).json({ status: 404, message: "No seats found" });
// // //     }

// // //     return res.status(200).json({ status: 200, seats });
// // //   } catch (err) {
// // //     return res.status(500).json({ status: 500, message: "Server error" });
// // //   }
// // // };


// // //**updated seat api for the routing under movie ---show */

// // const getSeats = async (req, res) => {
// //   try {
// //     const { showId } = req.params;

// //     const seats = await Seat.find({ show: showId });

// //     return res.status(200).json({
// //       status: 200,
// //       seats,
// //     });
// //   } catch (err) {
// //     return res.status(500).json({
// //       status: 500,
// //       message: "Server error",
// //     });
// //   }
// // };

// // //** */

// // const lockSeat = async (req, res) => {
 

// //   try {
// //     const { seatId } = req.body;

// //     const seat = await Seat.findOneAndUpdate(
// //       {
// //         _id: seatId,
// //         status: "available", // ONLY available seats can be locked
// //       },
// //       {
// //         $set: {
// //           status: "locked",
// //           lockedAt: new Date(), // stored correctly
// //           lockedBy:req.User.id
// //         },
// //       },
// //       {
// //         new: true,
// //       }
// //     );

// //     if (!seat) {
// //       return res.status(400).json({
// //         status: 400,
// //         message: "Seat cannot be locked",
// //       });
// //     }

// //     return res.status(200).json({
// //       status: 200,
// //       message: "Seat locked successfully",
// //       seat,
// //     });

// //   } catch (err) {
// //     console.error("Error locking seat:", err);
// //     res.status(500).json({
// //       status: 500,
// //       message: "Server error",
// //     });
// //   }

// //    console.log("Trying to lock seat:", seatId);
// // };




// // const unlockExpiredSeats = async () => {
// //   const expiryTime = new Date(
// //     Date.now() - LOCK_EXPIRY_MINUTES * 60 * 1000
// //   );

// //   await Seat.updateMany(
// //     {
// //       status: "locked",
// //       lockedAt: { $lt: expiryTime },
// //     },
// //     {
// //       $set: {
// //         status: "available",
// //         lockedAt: null,
// //       },
// //     }
// //   );
// // };


// // const unbookSeat = async (req, res) => {
// //   try {
// //     const { seatId } = req.body;

// //     const seat = await Seat.findOneAndUpdate(
// //       { _id: seatId, status: "booked" ,bookedBy: req.user.id },
// //       { $set: { status: "available", lockedAt: null } },
// //       { new: true }
// //     );

// //     if (!seat) {
// //       return res.status(400).json({
// //         status: 400,
// //         message: "Seat is not booked",
// //       });
// //     }

// //     return res.status(200).json({
// //       status: 200,
// //       message: "Seat unbooked successfully",
// //       seat,
// //     });

// //   } catch (err) {
// //     res.status(500).json({ status: 500, message: "Server error" });
// //   }
// // };





// // const bookMultipleSeats = async (req, res) => {
// //   const session = await mongoose.startSession();
// //   session.startTransaction();

// //   try {
// //     const { seatIds } = req.body;

// //     for (let seatId of seatIds) {
// //       const seat = await Seat.findOneAndUpdate(
// //         { _id: seatId, status: "locked" },
// //         { $set: { status: "booked" ,lockedAt:null} },
// //         { new: true, session }
// //       );

// //       if (!seat) {
// //         throw new Error("One or more seats already booked");
// //       }
// //     }

// //     await session.commitTransaction();
// //     session.endSession();

// //     return res.status(200).json({
// //       message: "All seats booked successfully",
// //     });

// //   } catch (err) {
// //     await session.abortTransaction();
// //     session.endSession();

// //     return res.status(400).json({
// //       message: err.message,
// //     });
// //   }
// // };


// // const getShowsByMovie = async (req, res) => {
// //   try {
// //     const { movieId } = req.params;
// //     const { city } = req.query;

// //     const shows = await Show.find({
// //       movie: movieId,
// //       city: city,
// //     });

// //     res.json({ shows });
// //   } catch (err) {
// //     res.status(500).json({ message: "Server error" });
// //   }


// //   console.log("Incoming movieId:", movieId);
// // console.log("Incoming city:", city);

// // const allShows = await Show.find({});
// // console.log("ALL SHOWS:", allShows);

// // const filtered = await Show.find({
// //   movie: movieId,
// //   city: city,
// // });

// // console.log("FILTERED SHOWS:", filtered);
// // };




// // //** what is happening in the multiple seat booking function? **//
// // // start transaction
// // // ↓
// // // try booking seats one by one
// // // ↓
// // // if ANY seat fails → throw error
// // // ↓
// // // abort transaction → rollback EVERYTHING
// // // ↓
// // // return error  

// // //** */



// // module.exports = { bookSeat, getSeats, unbookSeat ,bookMultipleSeats,unlockExpiredSeats,lockSeat};





// const mongoose = require("mongoose");   // ✅ was missing — needed for bookMultipleSeats
// const Seat = require("../models/Seat");
// const Show = require("../models/Show"); // ✅ was missing — needed for getShowsByMovie

// const LOCK_EXPIRY_MINUTES = 5;
// const LOCK_EXPIRY_MS = LOCK_EXPIRY_MINUTES * 60 * 1000;

// /* ─────────────────────────────────────────────────────────────
//    GET /api/seats/:showId
// ───────────────────────────────────────────────────────────── */
// const getSeats = async (req, res) => {
//   try {
//     const { showId } = req.params;

//     // Auto-expire stale locks before returning seats
//     await Seat.updateMany(
//       {
//         show: showId,
//         status: "locked",
//         lockedAt: { $lt: new Date(Date.now() - LOCK_EXPIRY_MS) },
//       },
//       { $set: { status: "available", lockedAt: null, lockedBy: null } }
//     );

//     const seats = await Seat.find({ show: showId }).sort({ row: 1, col: 1 });

//     return res.status(200).json({ status: 200, seats });
//   } catch (err) {
//     return res.status(500).json({ status: 500, message: "Server error" });
//   }
// };

// /* ─────────────────────────────────────────────────────────────
//    PATCH /api/seats/lock
// ───────────────────────────────────────────────────────────── */
// const lockSeat = async (req, res) => {
//   try {
//     const { seatId } = req.body;

//      console.log("🔐 req.user:", req.user); // ← ADD THIS
//     console.log("🎯 seatId:", seatId);  
//     const seat = await Seat.findOneAndUpdate(
//       { _id: seatId, status: "available" },
//       {
//         $set: {
//           status: "locked",
//           lockedAt: new Date(),
//           lockedBy: req.user?.id ?? null,
//         },
//       },
//       { new: true }
//     );

//     if (!seat) {
//       return res.status(400).json({ status: 400, message: "Seat cannot be locked" });
//     }

//     // ✅ FIX: removed console.log that was placed AFTER res.json (unreachable + crash)
//     return res.status(200).json({ status: 200, message: "Seat locked successfully", seat });
//   } catch (err) {
//     console.error("Error locking seat:", err);
//     return res.status(500).json({ status: 500, message: "Server error" });
//   }
// };

// /* ─────────────────────────────────────────────────────────────
//    PATCH /api/seats/book
// ───────────────────────────────────────────────────────────── */
// const bookSeat = async (req, res) => {
//   try {
//     const { seatId } = req.body;

//     const seat = await Seat.findOneAndUpdate(
//       {
//         _id: seatId,
//         status: "locked",
//         lockedBy: req.user?.id ?? null,
//       },
//       { $set: { status: "booked", lockedAt: null, bookedBy: req.user?.id ?? null } },
//       { new: true }
//     );

//     if (!seat) {
//       return res.status(400).json({
//         status: 400,
//         message: "Seat must be locked by you before booking",
//       });
//     }

//     return res.status(200).json({ status: 200, message: "Seat booked successfully", seat });
//   } catch (err) {
//     console.error("Error booking seat:", err);
//     return res.status(500).json({ status: 500, message: "Server error" });
//   }
// };

// /* ─────────────────────────────────────────────────────────────
//    PATCH /api/seats/unbook
// ───────────────────────────────────────────────────────────── */
// const unbookSeat = async (req, res) => {
//   try {
//     const { seatId } = req.body;

//     const seat = await Seat.findOneAndUpdate(
//       {
//         _id: seatId,
//         status: { $in: ["locked", "booked"] }, // ✅ handles both cases
//         $or: [
//           { lockedBy: req.user?.id ?? null },  // releasing a locked seat
//           { bookedBy: req.user?.id ?? null },  // releasing a booked seat
//         ],
//       },
//       {
//         $set: {
//           status: "available",
//           lockedAt: null,
//           lockedBy: null,
//           bookedBy: null,
//         },
//       },
//       { new: true }
//     );

//     if (!seat) {
//       return res.status(400).json({
//         status: 400,
//         message: "Seat not found or not owned by you",
//       });
//     }

//     return res.status(200).json({
//       status: 200,
//       message: "Seat released successfully",
//       seat,
//     });
//   } catch (err) {
//     return res.status(500).json({ status: 500, message: "Server error" });
//   }
// };

// /* ─────────────────────────────────────────────────────────────
//    POST /api/seats/book-multiple  (atomic transaction)
// ───────────────────────────────────────────────────────────── */
// const bookMultipleSeats = async (req, res) => {
//   // ✅ FIX: mongoose was not imported — now it is (top of file)
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const { seatIds } = req.body;

//     for (const seatId of seatIds) {
//       const seat = await Seat.findOneAndUpdate(
//         { _id: seatId, status: "locked" },
//         { $set: { status: "booked", lockedAt: null } },
//         { new: true, session }
//       );

//       if (!seat) throw new Error("One or more seats are no longer locked");
//     }

//     await session.commitTransaction();
//     session.endSession();

//     return res.status(200).json({ message: "All seats booked successfully" });
//   } catch (err) {
//     await session.abortTransaction();
//     session.endSession();
//     return res.status(400).json({ message: err.message });
//   }
// };

// /* ─────────────────────────────────────────────────────────────
//    Cron helper — called every minute from server.js
// ───────────────────────────────────────────────────────────── */
// const unlockExpiredSeats = async () => {
//   const expiryTime = new Date(Date.now() - LOCK_EXPIRY_MS);

//   await Seat.updateMany(
//     { status: "locked", lockedAt: { $lt: expiryTime } },
//     { $set: { status: "available", lockedAt: null, lockedBy: null } }
//   );
// };

// /* ─────────────────────────────────────────────────────────────
//    GET /api/shows/:movieId?city=Delhi
//    ✅ FIX: Show was not imported; console.logs were after res.json (crash)
// ───────────────────────────────────────────────────────────── */
// const getShowsByMovie = async (req, res) => {
//   try {
//     const { movieId } = req.params;
//     const { city } = req.query;

   
//     console.log("Incoming movieId:", movieId);
//     console.log("Incoming city:", city);

//     const shows = await Show.find({ movie: movieId, ...(city && { city }) });

//     console.log("FILTERED SHOWS:", shows.length);

//     return res.json({ shows });
//   } catch (err) {
//     return res.status(500).json({ message: "Server error" });
//   }
// };

// module.exports = {
//   getSeats,
//   lockSeat,
//   bookSeat,
//   unbookSeat,
//   bookMultipleSeats,
//   unlockExpiredSeats,
//   getShowsByMovie,
// };  


const mongoose = require("mongoose");
const Seat = require("../models/Seat");
const Show = require("../models/Show");

const LOCK_EXPIRY_MINUTES = 5;
const LOCK_EXPIRY_MS = LOCK_EXPIRY_MINUTES * 60 * 1000;

/* ─────────────────────────────────────────────────────────────
   GET /api/seats/:showId
───────────────────────────────────────────────────────────── */
const getSeats = async (req, res) => {
  try {
    const { showId } = req.params;

    // Auto-expire stale locks before returning
    await Seat.updateMany(
      {
        show: showId,
        status: "locked",
        lockedAt: { $lt: new Date(Date.now() - LOCK_EXPIRY_MS) },
      },
      { $set: { status: "available", lockedAt: null, lockedBy: null } }
    );

    const seats = await Seat.find({ show: showId }).sort({ row: 1, col: 1 });
    return res.status(200).json({ status: 200, seats });
  } catch (err) {
    return res.status(500).json({ status: 500, message: "Server error" });
  }
};

/* ─────────────────────────────────────────────────────────────
   PATCH /api/seats/lock
───────────────────────────────────────────────────────────── */
const lockSeat = async (req, res) => {
  try {
    const { seatId } = req.body;

  console.log("🔐 Full req.user:", req.user);        // what does this print?
    console.log("🔐 req.user.id:", req.user?.id);      // undefined?
    console.log("🔐 req.user._id:", req.user?._id);       // debug — remove after confirming

    const seat = await Seat.findOneAndUpdate(
      { _id: seatId, status: "available" },
      {
        $set: {
          status: "locked",
          lockedAt: new Date(),
          lockedBy: req.user?.id ?? null,     // ✅ lowercase .id
        },
      },
      { new: true }
    );

    if (!seat) {
      return res.status(400).json({ status: 400, message: "Seat cannot be locked" });
    }

    return res.status(200).json({ status: 200, message: "Seat locked successfully", seat });
  } catch (err) {
    console.error("Error locking seat:", err);
    return res.status(500).json({ status: 500, message: "Server error" });
  }
};

/* ─────────────────────────────────────────────────────────────
   PATCH /api/seats/book
───────────────────────────────────────────────────────────── */
const bookSeat = async (req, res) => {
  try {
    const { seatId } = req.body;

    const seat = await Seat.findOneAndUpdate(
      {
        _id: seatId,
        status: "locked",
        lockedBy: req.user?.id ?? null,
      },
      {
        $set: {
          status: "booked",
          lockedAt: null,
          bookedBy: req.user?.id ?? null,
        },
      },
      { new: true }
    );

    if (!seat) {
      return res.status(400).json({
        status: 400,
        message: "Seat must be locked by you before booking",
      });
    }

    return res.status(200).json({ status: 200, message: "Seat booked successfully", seat });
  } catch (err) {
    console.error("Error booking seat:", err);
    return res.status(500).json({ status: 500, message: "Server error" });
  }
};

/* ─────────────────────────────────────────────────────────────
   PATCH /api/seats/unbook
   ✅ FIX: now handles BOTH locked and booked seats
   Previously only matched status:"booked" so clicking a locked
   seat to deselect it always returned 400
───────────────────────────────────────────────────────────── */
const unbookSeat = async (req, res) => {
  try {
    const { seatId } = req.body;
    const userId = req.user?.id ?? null;

    const seat = await Seat.findOneAndUpdate(
      {
        _id: seatId,
        status: { $in: ["locked", "booked"] },  // ✅ handles both
        $or: [
          { lockedBy: userId },                  // releasing a locked seat
          { bookedBy: userId },                  // releasing a booked seat
        ],
      },
      {
        $set: {
          status: "available",
          lockedAt: null,
          lockedBy: null,
          bookedBy: null,
        },
      },
      { new: true }
    );

    if (!seat) {
      return res.status(400).json({
        status: 400,
        message: "Seat not found or not owned by you",
      });
    }

    return res.status(200).json({
      status: 200,
      message: "Seat released successfully",
      seat,
    });
  } catch (err) {
    return res.status(500).json({ status: 500, message: "Server error" });
  }
};

/* ─────────────────────────────────────────────────────────────
   Cron helper — called every minute from server.js
───────────────────────────────────────────────────────────── */
const unlockExpiredSeats = async () => {
  const expiryTime = new Date(Date.now() - LOCK_EXPIRY_MS);
  await Seat.updateMany(
    { status: "locked", lockedAt: { $lt: expiryTime } },
    { $set: { status: "available", lockedAt: null, lockedBy: null } }
  );
};

module.exports = {
  getSeats,
  lockSeat,
  bookSeat,
  unbookSeat,
  unlockExpiredSeats,
};