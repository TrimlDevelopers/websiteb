import { Schema, model, type InferSchemaType } from 'mongoose'

const contactEnquirySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    company: {
      type: String,
      trim: true,
      default: '',
    },
    service: {
      type: String,
      trim: true,
      default: '',
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['New', 'In Progress', 'Closed'],
      default: 'New',
    },
  },
  {
    timestamps: true,
  },
)

export type ContactEnquiry = InferSchemaType<typeof contactEnquirySchema> & {
  _id: Schema.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

export const ContactEnquiryModel = model('ContactEnquiry', contactEnquirySchema)
