import { Link } from "react-router";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import { ChevronLeftIcon} from "../../icons";
import { useState } from "react";
import { useResetForm } from "../../hooks/useResetForm"; 
import LoadingSpinner from "../ui/spinner/LoadingSpinner";


export default function ResetForm() {
    
    const { email, setEmail, isLoading, handleReset } = useResetForm(); // Custom hook to handle reset logic
    if (isLoading) return <div><LoadingSpinner/></div>
    return (
        
        <div className="flex flex-col flex-1">
            <div className="w-full max-w-md pt-10 mx-auto">
            <Link
                to="/signin"
                className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
                <ChevronLeftIcon className="size-5" />
                Back
            </Link>
            </div>
            <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
            <div>
                <div className="mb-5 sm:mb-8">
                <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                    Reset Password
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Enter your email to reset your password!
                </p>
                </div>
                <div>

                <form>
                    <div className="space-y-6">
                    <div>
                        <Label>
                        Email 
                        </Label>
                        <Input 
                        placeholder="info@gmail.com" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="text" 
                        id="email" 
                        name="email"
                            />
                    </div>
                    
                    <div>
                        <Button className="w-full" size="sm" onClick={handleReset}>
                            Reset Password
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