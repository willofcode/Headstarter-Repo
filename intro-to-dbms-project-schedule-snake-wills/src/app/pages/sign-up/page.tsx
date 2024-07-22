"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface FormData {
  studentID: string;
  studentEmail: string;
  password: string;
}

export default function SignUp() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    studentID: "",
    studentEmail: "",
    password: "",
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const userTableCall = `/api/insertInto?table=users&category=userType&value='student'`;
      const userTableResponse = await fetch(userTableCall, {
        method: "POST",
      });
      if (!userTableResponse.ok) {
        throw new Error("Error with the users table");
      }
      const userTableResult = await userTableResponse.json();
      const userID = userTableResult.results.insertId;
      if (!userID) {
        throw new Error("Failed to retrieve the user ID");
      }


      const mainCall = `/api/insertInto?table=student&category=userID&category=studentID&category=email&category=password&value='${userID}'&value='${formData.studentID}'&value='${formData.studentEmail}'&value='${formData.password}'`;
      const studentApiCall = await fetch(mainCall, {
        method: "POST",
      });
      if (!studentApiCall.ok) {
        throw new Error("Error with the student table");
      }
      localStorage.setItem("email", formData.studentEmail);
      localStorage.setItem("password", formData.password);
      localStorage.setItem("userType", "student");
      localStorage.setItem("userID", userID);
      const result = await studentApiCall.json();
      console.log("Form submitted", result);
      router.push("/");
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } catch (error) {
      console.error("Could not complete insert into query", error);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-white">
      <form
        className="flex flex-col space-y-4 border border-gray-300 px-[24px] py-[24px] rounded-lg"
        onSubmit={handleSubmit}
      >
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Student ID
          </label>
          <input
            type="text"
            id="studentID"
            name="studentID"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Value"
            value={formData.studentID}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Student Email
          </label>
          <input
            type="text"
            id="studentEmail"
            name="studentEmail"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Value"
            value={formData.studentEmail}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Value"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button
          type="submit"
          className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Sign Up
        </button>
      </form>
      <div className="mt-4 text-[#1329E9] text-sm">
        <Link href="/pages/sign-up-prof">Click to register as a professor</Link>
      </div>
    </main>
  );
}
