import { Typography, Button } from '@libs/mui';
import Link from 'next/link';

export const DevNavBar = () => {
  return (
    <p>
      <Button>
        <Link href="/admin/user">user</Link>
      </Button>
      <Button>
        <Link href="/admin/question">question</Link>
      </Button>
      <Button>
        <Link href="/creator">creator</Link>
      </Button>
      <Button>
        <Link href="/">home</Link>
      </Button>
    </p>
  );
};
