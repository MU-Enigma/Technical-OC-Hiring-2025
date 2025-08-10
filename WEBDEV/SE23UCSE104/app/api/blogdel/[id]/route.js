import { NextResponse } from 'next/server';
import ConnectmongoDB from '@/lib/config/email';
import blogModel from '@/lib/models/BlogModel';
const LoadDb = async () => {
  await ConnectmongoDB();
};

LoadDb();
export async function DELETE(request,{params})
{
    const { id } = params;
    const deletedBlog = await blogModel.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Blog deleted successfully' });
}