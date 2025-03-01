"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { z } from "zod";
import SERVERURL from "../SERVERURL";

// Validation Schemas
const verificationSchema = z.object({
  email: z.string().email(),
  phone: z.string().regex(/^\d{10,}$/, { message: "Phone number must be at least 10 digits and contain only numbers" }),
});

const pinSchema = verificationSchema.extend({
  pin: z.string().length(6, { message: "PIN must be exactly 6 digits" }).regex(/^\d{6}$/, { message: "PIN must contain only numbers" }),
});

const registerSchema = pinSchema.extend({
  name: z.string()
    .min(2, { message: "Name must be at least 2 characters" })
    .regex(/^[A-Za-z][A-Za-z ]*$/, { message: "Name must start with a letter and contain only letters and spaces" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
});

// New Schema for Pre-OTP Validation (Includes Name)
const preOtpSchema = verificationSchema.extend({
  name: z.string()
    .min(2, { message: "Name must be at least 2 characters" })
    .regex(/^[A-Za-z][A-Za-z ]*$/, { message: "Name must start with a letter and contain only letters and spaces" }),
});

// API Call Function
async function apiCall(url, data, schema) {
  try {
    schema.parse(data);
    const response = await fetch(`${SERVERURL}${url}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(
        Array.isArray(result) && result[0]?.message
          ? result[0].message
          : result.error || "An unexpected error occurred."
      );
    }
    return { success: true };
  } catch (error) {
    let errorMessage = "Failed to process request.";
    if (error instanceof z.ZodError && error.errors.length > 0) {
      errorMessage = error.errors[0].message;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    return { success: false, error: errorMessage };
  }
}

// Register Form Component
function RegisterForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", password: "", pin: "" });
  const [error, setError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const navigate = useNavigate();

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // Handle Initial Submission (Validate Name Before Sending OTP)
  const handleInitialSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      preOtpSchema.parse(formData); // Validate name before sending OTP
      const result = await apiCall("/api/send-otp/", formData, verificationSchema);
      if (result.success) {
        setStep(2);
        startResendCooldown();
      } else {
        setError(result.error);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        setError(error.errors[0].message);
      }
    }
  };

  // Handle PIN Submission (Verify PIN and Register User)
  const handlePinSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const verifyResult = await apiCall("/api/verify-otp/", formData, pinSchema);
    if (verifyResult.success) {
      const registerResult = await apiCall("/api/register/", formData, registerSchema);
      if (registerResult.success) {
        navigate("/?msg=1");
      } else {
        setError(registerResult.error);
      }
    } else {
      setError(verifyResult.error);
    }
  };

  // Handle Resend PIN
  const handleResendPin = async () => {
    if (resendCooldown > 0) return;
    const result = await apiCall("/api/send-otp/", formData, verificationSchema);
    if (result.success) {
      startResendCooldown();
    } else {
      setError(result.error);
    }
  };

  // Start Resend Cooldown Timer
  const startResendCooldown = () => {
    setResendCooldown(60);
    const timer = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{step === 1 ? "Register" : "Enter Verification PIN"}</CardTitle>
      </CardHeader>
      <CardContent>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {step === 1 ? (
          <form onSubmit={handleInitialSubmit}>
            <div className="space-y-4">
              {["name", "email", "phone", "password"].map((field) => (
                <div key={field}>
                  <Label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</Label>
                  <Input id={field} type={field === "password" ? "password" : "text"} value={formData[field]} onChange={handleChange} required />
                </div>
              ))}
            </div>
            <Button type="submit" className="w-full mt-4">Send Verification</Button>
          </form>
        ) : (
          <form onSubmit={handlePinSubmit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="pin">6-Digit PIN</Label>
                <Input id="pin" value={formData.pin} onChange={handleChange} maxLength={6} required />
              </div>
            </div>
            <Button type="submit" className="w-full mt-4">Verify and Register</Button>
            <Button type="button" variant="outline" className="w-full mt-2" onClick={handleResendPin} disabled={resendCooldown > 0}>
              {resendCooldown > 0 ? `Resend PIN (${resendCooldown}s)` : "Resend PIN"}
            </Button>
          </form>
        )}
      </CardContent>
      <CardFooter>
        <p className="text-sm text-center w-full">
          Already have an account? <a href="/" className="text-blue-500 hover:underline">Login here</a>
        </p>
      </CardFooter>
    </Card>
  );
}

// Register Page Component
export default function RegisterPage() {
  return (
    <div className="container mx-auto max-w-md p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>
      <RegisterForm />
    </div>
  );
}
