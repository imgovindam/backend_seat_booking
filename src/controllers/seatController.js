const Seat = require("../models/Seat");

//**book seat & give error when the user try to book the booked seat */

//** i have  implemented SYSTEM DESIGN in this by blocking the RACE & implementing the Atomic Update */

// const bookSeat = async (req, res) => {
//     try {
//         const {seatId,userId}=req.body
//         const seat = await Seat.findById(seatId);
//         if(!seat){
//             return res.status(404).json({status:404,message:"Seat not found"});
//         }
//         if(seat.isBooked){
//             return res.status(400).json({status:400,message:"Seat already booked"});
//         }

//         seat.isBooked = true;
//         seat.userId = userId;
//         await seat.save();

//         res.status(200).json({status:200,message:"Seat booked successfully",seat});
//     }
//     // const { seatId, userId } = req.body;
// catch(err) {
//     console.error("Error booking seat:", err);
//     res.status(500).json({ status: 500, message: "Server error" });
// }
// } ;

const bookSeat = async (req, res) => {
  try {
    const { seatId } = req.body;
    // const seat = await Seat.findById(seatId);

    const seat = await Seat.findOneAndUpdate(
      { _id: seatId, isBooked: false }, // condition
      { $set: { isBooked: true } }, // update
      { new: true } // return updated doc
    );
    if (!seat) {
      return res.status(404).json({ status: 404, message: "Seat not found" });
    }
    if (seat.isBooked) {
      return res
        .status(400)
        .json({ status: 400, message: "Seat already booked" });
    }

    seat.isBooked = true;
    // seat.userId = userId;
    await seat.save();

    return res.status(200).json({
      status: 200,
      message: "Seat booked successfully",

      // res.status(200).json({status:200,message:"Seat booked successfully",seat
    });
  } catch (err) {
    // const { seatId, userId } = req.body;
    console.error("Error booking seat:", err);
    res.status(500).json({ status: 500, message: "Server error" });
  }
};

// const getSeats=async (req,res)=>{
//     try{
//         const {seatId}=req.params;
//         const seat=await Seat.find();
//         if(!seat){
//             // return res.status(404).json({status:404,message:"Seat not found"});
//             return [];
//         }else{
//             // return res.status(200).json({status:200,seat});
//             res.status(200).json({status:200,seat});
//         }
//     }catch(err){
//         console.error("Error fetching seat:", err);
//         res.status(500).json({ status: 500, message: "Server error" });
//     }
// }

const getSeats = async (req, res) => {
  try {
    const seats = await Seat.find();

    if (seats.length === 0) {
      return res.status(404).json({ status: 404, message: "No seats found" });
    }

    return res.status(200).json({ status: 200, seats });
  } catch (err) {
    return res.status(500).json({ status: 500, message: "Server error" });
  }
};

const unbookSeat = async (req, res) => {
  try {
    const { seatId } = req.body;
    // const seat = await Seat.findById(seatId);

        const seat = await Seat.findOneAndUpdate(
      { _id: seatId, isBooked: true },
      { $set: { isBooked: false } },
      { new: true }
    );
    if (!seat) {
      return res.status(404).json({ status: 404, message: "Seat not found" });
    }
    if (!seat.isBooked) {
      return res
        .status(400)
        .json({ status: 400, message: "Seat is not booked" });
    }

    seat.isBooked = false;
    await seat.save();

    res
      .status(200)
      .json({ status: 200, message: "Seat unbooked successfully", seat });
  } catch (err) {
    console.error("Error unbooking seat:", err);
    res.status(500).json({ status: 500, message: "Server error" });
  }
};




const bookMultipleSeats = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { seatIds } = req.body;

    for (let seatId of seatIds) {
      const seat = await Seat.findOneAndUpdate(
        { _id: seatId, isBooked: false },
        { $set: { isBooked: true } },
        { new: true, session }
      );

      if (!seat) {
        throw new Error("One or more seats already booked");
      }
    }

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      message: "All seats booked successfully",
    });

  } catch (err) {
    await session.abortTransaction();
    session.endSession();

    return res.status(400).json({
      message: err.message,
    });
  }
};




module.exports = { bookSeat, getSeats, unbookSeat ,bookMultipleSeats};
