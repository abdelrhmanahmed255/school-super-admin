"use client";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Mail, Lock, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { toast } from "sonner";
import { loginUser } from "@/store/slices/userSlice/thunk";
import { useAppDispatch } from "@/store/hooks";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { setIsLoggedIn } from "@/store/slices/userSlice/slice";

function LoginPage() {
  const t = useTranslations("loginPage");
  const locale = useLocale();

  const dispatch = useAppDispatch();
  const { loading } = useSelector((state: RootState) => state.user);

  const [showPassword, setShowPassword] = React.useState(false);

  const FormSchema = z.object({
    email: z.string().email({
      message: t("emailValidation"),
    }),
    password: z.string().min(6, {
      message: t("passwordValidation"),
    }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const toastId = toast.loading(t("loggingIn"), {
      duration: 3000,
      position: "top-center",
    });
    const action = await dispatch(
      loginUser({ email: data.email, password: data.password }),
    );

    dispatch(setIsLoggedIn(true));

    if (loginUser.rejected.match(action)) {
      const msg =
        typeof action.payload === "string"
          ? action.payload
          : action.error?.message || t("loginFailed");
      toast.error(msg, { id: toastId, duration: 3000, position: "top-center" });
    } else {
      toast.success(t("loginSuccess"), {
        id: toastId,
        duration: 3000,
        position: "top-center",
      });
    }
  }

  return (
    <div className="  flex flex-col items-center justify-center h-screen bg-slate-50 ">
      <div className="flex flex-col rounded-2xl   shadow-2xl w-[90%] md:w-[500px]">
        <div className="   flex flex-col gap-6 bg-white p-8  rounded-2xl rounded-b-none ">
          {/* اللوجو */}
          <h1 className="text-3xl font-bold text-center">School Super Admin</h1>
          <div className="flex flex-col gap-2 items-center">
            <p className="font-bold text-2xl">
              {locale === "en" ? "Welcome Back" : "مرحبا بعودتك"}
            </p>
            <p className="font-bold text-base text-slate-500">
              {locale === "en"
                ? "Sign in to access your unified learning dashboard"
                : "سجل الدخول للوصول للواجهة الرئيسية"}
            </p>
          </div>
          {/* <div className="flex flex-col gap-2">
            <p>{locale === "ar" ? "أنا أكون" : "I AM A"}</p>
            <div className="bg-slate-100 border rounded-xl h-12 p-1 flex items-center gap-1">
              {roles.map((role) => (
                <button
                  key={role}
                  onClick={() => setCurrentRole(role)}
                  className={`w-1/3 h-full rounded-lg transition-colors duration-200 font-medium ${
                    role === currentRole
                      ? "bg-primary text-white"
                      : "bg-transparent text-slate-500"
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div> */}

          {/* الفورم */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="email"
                render={({ field: { ...field } }) => (
                  <FormItem>
                    <FormLabel className="text-base">{t("email")}</FormLabel>
                    <div className="relative">
                      {/* أيقونة ثابتة داخل الحقل */}
                      <Mail className="w-5 h-5 text-gray-400 absolute top-1/2 -translate-y-1/2 start-3 pointer-events-none" />
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="example@example.com"
                          {...field}
                          className=" ps-10  placeholder:text-lg text-lg! h-12   focus:border-primary bg-slate-100  transition-colors duration-200 placeholder:text-slate-400"
                        />
                      </FormControl>
                    </div>
                    <FormMessage className="mt-2" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field: { ...field } }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel className="text-base">
                        {t("password")}
                      </FormLabel>
                      <Link href="forgotPassword">
                        <p className="text-base text-primary hover:underline">
                          {locale === "ar"
                            ? "نسيت كلمة المرور؟"
                            : "Forgot Password?"}
                        </p>
                      </Link>
                    </div>
                    <div className="relative">
                      {/* أيقونة ثابتة داخل الحقل */}
                      <Lock className="w-5 h-5 text-gray-400 absolute top-1/2 -translate-y-1/2 start-3 pointer-events-none" />
                      <FormControl>
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder={t("passwordPlaceholder")}
                          {...field}
                          className=" ps-10  placeholder:text-lg text-lg! h-12   focus:border-primary bg-slate-100  transition-colors duration-200 placeholder:text-slate-400"
                        />
                      </FormControl>
                      {showPassword ? (
                        <EyeOff
                          onClick={() => setShowPassword(!showPassword)}
                          className="w-5 h-5 text-gray-400 absolute top-1/2 -translate-y-1/2 end-3   cursor-pointer hover:text-primary transition-colors duration-200"
                        />
                      ) : (
                        <Eye
                          onClick={() => setShowPassword(!showPassword)}
                          className="w-5 h-5 text-gray-400 absolute top-1/2 -translate-y-1/2 end-3   cursor-pointer hover:text-primary transition-colors duration-200"
                        />
                      )}
                    </div>
                    <FormMessage className="mt-2" />
                  </FormItem>
                )}
              />

              {/* زر الدخول */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full mt-6 font-bold transition-colors duration-200 rounded-xl shadow-md shadow-primary/50"
              >
                {t("login")}
                <ArrowLeft className="w-6! h-6!" />
              </Button>
            </form>
          </Form>
        </div>
        <div className="bg-slate-100 h-12 flex items-center justify-center  rounded-2xl rounded-t-none gap-3">
          <p className="text-base text-slate-500">
            {locale === "en" ? "Don't have an account?" : "ليس لديك حساب؟"}
          </p>
          <Link href="register" className="text-primary hover:underline">
            {locale === "en" ? "Contact Administrator" : "اتصل بالمسؤول"}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
