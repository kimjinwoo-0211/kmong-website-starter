import mongoose from 'mongoose';


const contentSchema = new mongoose.Schema({
type: {
type: String,
enum: ['hero','about','service','portfolio','testimonial','blog'],
required: true
},
title: { type: String, required: true },
body: { type: String },
images: [{ type: String }],
published: { type: Boolean, default: true }
}, { timestamps: true });


export default mongoose.model('Content', contentSchema);