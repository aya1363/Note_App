import mongoose, { Schema, Types, isObjectIdOrHexString, model } from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new Schema({

    name: {
        type: String ,
        required: true, 
        trim : true
    },
    email: {
        type: String,
        unique: true,
        required:true
    },
    password: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: Number,
        required :true
    },
    phoneNumberHash: {
        type: String
    },
    age: {
        type: Number, min: 18, max: 60  
    }
}, {
    validateBeforeSave: true,
    toJSON: {
    virtuals: true,
    transform(doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
    }
},
    toObject: {
        virtuals: true,
        transform(doc, ret) {
            ret.id = ret._id.toString();
            delete ret._id;
            delete ret.__v;
        }
    }
})
userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
}

    if (this.isModified("phoneNumber")) {
        const phoneAsString = this.phoneNumber.toString();
        this.phoneNumberHash = await bcrypt.hash(phoneAsString, 10);
}
next();
});
userSchema.methods.comparePassword = function (plainPassword) {
    return bcrypt.compare(plainPassword, this.password);
};




const userModel =mongoose.models.User || model('User', userSchema)
export default userModel