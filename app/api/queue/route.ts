import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getQueueItems, getQueueStats } from '@/services/queue.service';

export async function GET(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const includeStats = searchParams.get('includeStats') === 'true';

    const queueItems = await getQueueItems(supabase);

    if (includeStats) {
      const stats = await getQueueStats(supabase);
      return NextResponse.json({ items: queueItems, stats });
    }

    return NextResponse.json({ items: queueItems });
  } catch (error) {
    console.error('Error fetching queue:', error);
    return NextResponse.json(
      { error: 'Failed to fetch queue' },
      { status: 500 }
    );
  }
}
