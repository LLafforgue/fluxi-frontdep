import { useRouter } from 'next/router';
import Protected from '@/utils/Protected';

function Index() {

  const router = useRouter()
  router.replace("/dashboard")

  return null;
}

export default Protected(Index);
