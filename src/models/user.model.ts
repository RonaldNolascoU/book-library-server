import bcrypt from 'bcryptjs'
import { Model, Schema, model } from 'mongoose'
import validator from 'validator'

interface UserDocument extends Document {
  email: string
  password: string
  verified: boolean
}

interface ModifiedDocument extends Document {
  isModified(path?: string): boolean
}

type UserModifiedDocument = UserDocument & ModifiedDocument

interface UserModel extends Model<UserDocument> {
  comparePasswords(password: string, hash: string): Promise<boolean>
}

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
      lowercase: true
    },

    password: {
      type: String,
      required: true,
      minlength: [8, 'Password must be more than 8 characters'],
      select: false
    }
  },

  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    versionKey: false
  }
)

userSchema.pre<UserModifiedDocument>('save', async function (next) {
  if (!this.isModified('password')) {
    return next()
  }
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

userSchema.statics.comparePasswords = async function (
  password: string,
  hash: string
) {
  return bcrypt.compare(password, hash)
}

userSchema.virtual('books', {
  ref: 'Book',
  localField: '_id',
  foreignField: 'created_by'
})

export const UserModel = model<UserDocument, UserModel>('User', userSchema)
