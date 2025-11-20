import { Link } from "react-router";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import { ChevronLeftIcon} from "../../icons";
import OtpInput from 'react-otp-input';
import { useOTP } from "../../hooks/useOTP";
import LoadingSpinner from "../ui/spinner/LoadingSpinner";


export default function OTPForm() {
    const { otp, setOtp, handleSubmit, isLoading, isValidToken } = useOTP();
    
    if (isLoading) {
        return (
            <div className="flex flex-col flex-1 justify-center items-center">
                <LoadingSpinner />
                <p className="mt-4 text-gray-600">Validating session...</p>
            </div>
        );
    }

    if (!isValidToken) {
        return null; // Hook will handle redirect
    }

    return (
        <div className="flex flex-col flex-1">
            <div className="w-full max-w-md pt-10 mx-auto">
                <Link
                    to="/reset-password"
                    className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                    <ChevronLeftIcon className="size-5" />
                    Back
                </Link>
            </div>
            
            
            <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
            <div>
                <div className="mb-5 sm:mb-8 flex justify-center">
                <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md text-center">
                    Enter verification code
                </h1>
                </div>
                <div className="flex justify-center">
                <form className="w-full"  onSubmit={handleSubmit}>
                    <div className="space-y-6">
                    <div className="flex justify-center">
                        <OtpInput
                            value={otp}
                            onChange={setOtp}
                            numInputs={6}
                            containerStyle={"flex justify-center"}
                            renderSeparator={<span className="mx-1"> </span>}
                            onChangeOTP={(otp) => setOtp(otp)}
                            renderInput={(props) => (
                                <input
                                    {...props}
                                    name="otp"
                                    className="!w-15 !h-20 border border-gray-300 rounded-md text-center !text-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            )}
                        />
                    </div>
                    
                    <div>
                        <Button className="w-full c" size="sm" type="submit">
                        Submit
                        </Button>
                    </div>
                    </div>
                </form>
                </div>
            </div>
            </div>
        </div>
    )
}