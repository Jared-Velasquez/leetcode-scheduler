'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { QueueItem } from '@/types';
import { QueueList } from '@/components/queue-list';

interface QueueListWrapperProps {
  initialItems: QueueItem[];
}

export function QueueListWrapper({ initialItems }: QueueListWrapperProps) {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);

  const handleSolveRecorded = async () => {
    // Refresh the page data from the server
    router.refresh();

    // Optionally fetch new data client-side for immediate update
    try {
      const response = await fetch('/api/queue');
      if (response.ok) {
        const data = await response.json();
        setItems(data.items);
      }
    } catch (error) {
      console.error('Error refreshing queue:', error);
    }
  };

  return <QueueList items={items} onSolveRecorded={handleSolveRecorded} />;
}
