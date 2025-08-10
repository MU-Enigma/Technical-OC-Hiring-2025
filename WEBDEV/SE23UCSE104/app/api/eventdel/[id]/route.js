import { NextResponse } from 'next/server';
import ConnectmongoDB from '@/lib/config/email';
import eventModel from '@/lib/models/emailrequest';
const LoadDb = async () => {
  await ConnectmongoDB();
};

LoadDb();
export async function DELETE(request,{params})
{
    const { id } = params;
    const deletedEvent = await eventModel.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Event deleted successfully' });
}