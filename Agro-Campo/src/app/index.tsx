import { useAccount } from '@/hooks/use-account';
import { FieldLogScreen } from '@/screens/FieldLogScreen';
import { HomeInitialScreen } from '@/screens/HomeInitialScreen';

export default function Index() {
  const account = useAccount();

  if (account.name) {
    return <FieldLogScreen name={account.name} />;
  }

  return <HomeInitialScreen account={account} />;
}
