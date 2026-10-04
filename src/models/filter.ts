import mongoose, { Schema, Document } from 'mongoose';

export interface IFilter extends Document {
  filterId: string;
  title: string;
  description: string;
  category: string;
  type: 'canvas' | 'tensorflow';
  css?: string;
  embedding: number[];
  tags: string[];
}

const FilterSchema: Schema = new Schema({
  filterId: { type: String, required: true, unique: true, index: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  type: { type: String, enum: ['canvas', 'tensorflow'], required: true },
  css: { type: String },
  // (e.g., 384 for lightweight local models, 1536 for OpenAI embeddings)
  embedding: { type: [Number], required: true },
  tags: { type: [String], index: true }
}, {
  timestamps: true
});

export default mongoose.models.Filter || mongoose.model<IFilter>('Filter', FilterSchema);