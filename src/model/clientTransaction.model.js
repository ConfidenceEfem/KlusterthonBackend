// import mongoose from "mongoose";

// const UserSchema = new mongoose.Schema(
//   {
//     email: {
//       type: String,
//       required: [true, "You're required to input email"],
//     },
//     password: {
//       type: String,
//       required: [true, "You're required to input password"],
//     },
//     businessName: {
//       type: String,
//     },
//     clients: [
//       {
//         ref: "clients",
//         type: mongoose.Schema.Types.ObjectId,
//       },
//     ],
//     userWallet: {
//       type: Number,
//       default: 0,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// const userModel = new mongoose.model("user", UserSchema);

// export default userModel;
