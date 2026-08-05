import RegisterLayout from '@/layouts/RegisterLayout/RegisterLayout';
import RegisterForm from '@/components/form/RegisterForm';
import OtpVerifyForm from '@/components/form/OtpVerifyForm';
import useRegister from '@/hooks/auth/useRegister';

export default function RegisterPage() {
  const registerState = useRegister();

  return (
    <RegisterLayout>
      {registerState.step === 'otp' ? (
        <OtpVerifyForm
          email={registerState.values.email}
          otpError={registerState.otpError}
          successMessage={registerState.successMessage}
          apiError={registerState.apiError}
          isLoading={registerState.isLoading}
          otpSecondsLeft={registerState.otpSecondsLeft}
          onVerifyOtp={registerState.onVerifyOtp}
          onResendOtp={registerState.onResendOtp}
          onBackToForm={registerState.onBackToForm}
        />
      ) : (
        <RegisterForm {...registerState} />
      )}
    </RegisterLayout>
  );
}
