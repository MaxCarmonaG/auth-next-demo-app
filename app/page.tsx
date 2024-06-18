import AuthForm from '@/components/AuthForm';

interface HomeProps {
  searchParams: {
    [key: string]: string | string[];
  };
}

export default function Home({ searchParams }: HomeProps) {
  const formMode = searchParams.mode || 'login';
  const mode = Array.isArray(formMode) ? formMode[0] : formMode;
  return <AuthForm mode={mode} />;
}
