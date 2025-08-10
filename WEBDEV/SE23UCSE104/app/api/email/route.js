import { NextResponse } from "next/server";
import eventModel from "@/lib/models/emailrequest";
import ConnectmongoDB from "@/lib/config/email";
import mongoose from "mongoose";
import cloudinary from '@/lib/config/cloudinary';
 const LoadDb= async()=>
    {
        await ConnectmongoDB()   
    }
    console.log(mongoose.connection.name); 
    LoadDb()
   
export async function GET(request)
{
   const event = await eventModel.find({});
  return NextResponse.json({ event });
}
export async function POST(request) {

   const formEvent=await request.formData()
   const image = formEvent.get('image');
  const arrayBuffer = await image.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
   const uploadPromise = new Promise((resolve, reject) => {
       const stream = cloudinary.uploader.upload_stream(
         { folder: 'blog_images' },
         (error, result) => {
           if (error) reject(error);
           else resolve(result);
         }
       );
       stream.end(buffer);
     });
   
   const result = await uploadPromise;
   const eventData = {
    title: formEvent.get('title'),
    description: formEvent.get('description'),
    category: formEvent.get('category'),
    author: formEvent.get('author'),
    image: result.secure_url,
    authorImg: formEvent.get('authorImg'),
  };
  await eventModel.create(eventData);
  return NextResponse.json({ success: true, msg: 'Event created' });
}
export async function DELETE(request){
 const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
}