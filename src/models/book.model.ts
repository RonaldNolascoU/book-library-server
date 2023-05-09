import { Schema, model } from 'mongoose'

interface BookDocument extends Document {
  title: string
  slug: string
  author: string
  date: string
  collectionSection: string
  coverImage: string
  created_by: string
  rating?: number
}

const userSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },

    slug: {
      type: String,
      required: true
    },

    author: {
      type: String,
      required: true
    },

    date: {
      type: String,
      required: true
    },

    collectionSection: {
      type: String,
      required: true,
      enum: ['WANT_TO_READ', 'READING', 'READ']
    },

    coverImage: {
      type: String,
      required: true
    },

    rating: {
      type: Number,
      required: false
    },

    created_by: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  },

  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    versionKey: false
  }
)

export const BookModel = model<BookDocument>('Book', userSchema)
