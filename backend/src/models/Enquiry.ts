import { Schema, model, type HydratedDocument, type InferSchemaType } from 'mongoose'

export const ENQUIRY_STATUSES = ['New', 'Contacted', 'Closed'] as const
export type EnquiryStatus = (typeof ENQUIRY_STATUSES)[number]

const enquirySchema = new Schema(
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
      enum: ENQUIRY_STATUSES,
      default: 'New',
    },
  },
  {
    timestamps: true,
    collection: 'Enquiries',
  },
)

export type EnquiryAttrs = InferSchemaType<typeof enquirySchema>
export type EnquiryDocument = HydratedDocument<EnquiryAttrs>

export const EnquiryModel = model('Enquiry', enquirySchema)
