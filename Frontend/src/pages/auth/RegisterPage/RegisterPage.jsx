import RegisterLayout from '@/layouts/RegisterLayout/RegisterLayout';
import RegisterForm from '@/components/form/RegisterForm';
import useRegister from '@/hooks/auth/useRegister';

export default function RegisterPage() {
  const registerState = useRegister();

  return (
    <RegisterLayout>
      <RegisterForm {...registerState} />
    </RegisterLayout>
  );
}
