import { useState } from 'react';
import TransactionList from './../components/TransactionList';
import TransactionForm from '@/components/TransactionForm';

export default function Home() {
  const [reload, setReload] = useState(false);

  return (
    <main>
      <TransactionForm onSuccess={() => setReload(!reload)}/>
      <TransactionList key={reload.toString()}/>
    </main>
  );
}
