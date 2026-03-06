import { Schema, model } from 'mongoose';

const templateSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true }
});

const TemplateModel = model('Template', templateSchema);

export default TemplateModel;