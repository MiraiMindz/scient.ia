"use client";

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useUserStore } from '@/app/zustandStores/userStore';
import { useRouter } from 'next/navigation';



function Logo(props: { className?: string }) {
    return (
        <svg className={props.className} viewBox="0 0 80 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3.63269 4.93825H80V3.56757H3.14833L0 6.14767V9.6953L2.26034 11.6304H9.445L10.8174 12.7592V14.6942L8.55701 16.6293H3.63269L1.45308 14.7749V13.4848H0V15.3393L3.06761 18H9.04137L12.1897 15.3648V12.1948L9.92936 10.2597H2.7447L1.45308 9.05028V6.79269L3.63269 4.93825Z" fill="#1F1B1B" />
            <path d="M22.5227 9.4054L23.7336 10.3784V11.5135H25.0252V9.72973L23.0878 8.10811H17.4369L15.1766 9.72973V16.3784L17.4369 18H23.0878L25.0252 16.3784V14.5946H23.7336V15.6486L22.6034 16.6216H17.8405L16.5489 15.6486V10.4595L17.8405 9.4054H22.5227Z" fill="#1F1B1B" />
            <path d="M27.2856 8.10811H28.5772V18H27.2856V8.10811Z" fill="#1F1B1B" />
            <path d="M56.5086 0H57.8002V18H56.5086V0Z" fill="#1F1B1B" />
            <path d="M65.3885 8.10811H66.6801V18H65.3885V8.10811Z" fill="#1F1B1B" />
            <path d="M61.1907 16.5405H62.4823V18H61.1907V16.5405Z" fill="#1F1B1B" />
            <path fillRule="evenodd" clipRule="evenodd" d="M41.0898 16.5405L40.1211 15.4865L38.7487 16.6216H34.1473L32.8557 15.6486V13.4595H41.2513V9.72973L39.3138 8.10811H33.663L31.4833 9.72973V16.3784L33.663 18H39.3138L41.0898 16.5405ZM39.9596 10.3784V12.1622H32.8557V10.4595L34.1473 9.4054H38.8295L39.9596 10.3784Z" fill="#1F1B1B" />
            <path d="M43.9152 18H45.2876V10.3784L46.4985 9.4054H50.4541L51.8264 10.3784V18H53.1181V9.72973L50.8577 8.10811H46.337L45.2876 9V8.10811H43.9152V18Z" fill="#1F1B1B" />
            <path fillRule="evenodd" clipRule="evenodd" d="M78.5469 7.94595H79.9193V17.8378H78.5469V17.027L77.5782 17.8378H72.0888L70.0706 16.1351V9.56757L72.0888 7.94595H77.5782L78.5469 8.91892V7.94595ZM78.5469 15.4054V10.7838L77.1746 9.32432H72.5731L71.5237 10.2162V15.5676L72.5731 16.4595H77.2553L78.5469 15.4054Z" fill="#1F1B1B" />
        </svg>
    );
}


export default function Home() {
    const [showLoginPopup, setShowLoginPopup] = useState<boolean>(false);
    const switchShowLoginPopup = () => setShowLoginPopup((prev) => !prev);
    const [showPasswordRecover, setShowPasswordRecover] = useState<boolean>(false);
    const switchShowPasswordRecover = () => setShowPasswordRecover((prev) => !prev);
    
    const token = useUserStore((state) => state.token);
    const setToken = useUserStore((state) => state.setToken);
    const clearToken = useUserStore((state) => state.clearToken);

    const router = useRouter();

    const handleOutsideClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            setShowLoginPopup(false);
        }
    };

    const handleInsideClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    const loginPopupFormSchema = z.object({
        email: z.string().email({ message: "The email must be valid." }),
        password: z.string().min(4, { message: "The password must have at least 4 characters." }).max(127, { message: "The password can't exceed 127 characters." })
    });

    const signupFormSchema = z.object({
        email: z.string().email({ message: "The email must be valid." }),
        password: z.string().min(4, { message: "The password must have at least 4 characters." }).max(127, { message: "The password can't exceed 127 characters." })
    });

    const form = useForm<z.infer<typeof loginPopupFormSchema>>({
        resolver: zodResolver(loginPopupFormSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const signupForm = useForm<z.infer<typeof signupFormSchema>>({
        resolver: zodResolver(signupFormSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof loginPopupFormSchema>) => {
        try {
            const response = await fetch("http://localhost:1323/api/v0/public/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/plaintext",
                },
                body: btoa(JSON.stringify({ email: values.email, password: values.password })),
            });

            const result: { token: string } = await response.json();
            console.log(result);
            console.log(result.token);
            setToken(result.token);
            router.push("/app");
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const onSignupSubmit = async (values: z.infer<typeof signupFormSchema>) => {
        try {
            const response = await fetch("http://localhost:1323/api/v0/public/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/plaintext",
                },
                body: btoa(JSON.stringify({ email: values.email, password: values.password })),
            });

            const result: { token: string } = await response.json();
            console.log(result);
            console.log(result.token);
            setToken(result.token);
            router.push("/app");
        } catch (error) {
            console.error("Error:", error);
        }
    }

    const loginAnimationInital = { x: "0%", filter: "blur(0px)" };
    const loginAnimationTransitional = { x: "-120%", filter: "blur(16px)" };
    const passwordAnimationInital = { x: "100%", filter: "blur(16px)" };
    const passwordAnimationTransitional = { x: "-100%", filter: "blur(0px)" };

    return (
        <main className="h-full w-full flex flex-col justify-start items-start relative font-arvo bg-neutral-50">
            <AnimatePresence>
                {showLoginPopup && (
                    <motion.div
                        onClick={handleOutsideClick}
                        className="absolute inset-0 z-10 w-screen h-screen flex justify-center items-center bg-neutral-950/25 backdrop-blur-[2px]"
                        initial={{ opacity: 0 }}
                        transition={{ duration: 0.3, scale: { type: "spring", visualDuration: 0.4, bounce: 0.5 } }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            onClick={handleInsideClick}
                            className="bg-neutral-50 rounded-2xl border-2 border-neutral-200 w-1/3 h-4/5 drop-shadow-lg p-8 flex flex-col overflow-hidden"
                            initial={{ scale: 0, filter: "blur(16px)" }}
                            transition={{ duration: 0.3, scale: { type: "spring", visualDuration: 0.4, bounce: 0.5 } }}
                            animate={{ scale: 1, filter: "blur(0px)" }}
                            exit={{ scale: 0, filter: "blur(16px)" }}
                        >
                            {/* <h1 className="text-2xl font-thin mb-8">Entrar</h1> */}
                            <Logo className="w-1/2 m-auto mt-8" />
                            <div className="flex flex-row justify-start items-start w-[200%] h-full pt-16">
                                <motion.div transition={{ duration: 0.3, scale: { type: "spring", bounce: 0.5 } }} className="w-[100%] h-full" initial={loginAnimationInital} animate={showPasswordRecover ? loginAnimationTransitional : loginAnimationInital}>
                                    <Form {...form}>
                                        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full h-full flex flex-col justify-between">
                                            <div>
                                                <FormField
                                                    control={form.control}
                                                    name="email"
                                                    render={({ field }) => (
                                                        <FormItem className="mb-8">
                                                            <FormLabel>Email</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="exemplo@email.com" {...field} />
                                                            </FormControl>
                                                            <FormDescription>
                                                                Este é o seu email de acesso.
                                                            </FormDescription>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="password"
                                                    render={({ field }) => (
                                                        <FormItem className="mt-8 mb-2">
                                                            <FormLabel>password</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="Insira sua senha" type="password" {...field} />
                                                            </FormControl>
                                                            <FormDescription className="flex flex-row justify-between items-center">
                                                                Esta é sua senha de acesso.
                                                                <button type="button" onClick={switchShowPasswordRecover} className=" hover:text-neutral-950 hover:underline underline-offset-4 transition-all">Esqueci minha senha</button>
                                                            </FormDescription>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                            <div>
                                                <Button className="w-full" type="submit">Entrar</Button>
                                                <div className="mt-8 mb-4 flex flex-row justify-between items-center">
                                                    <p className="ml-2">Não tem uma conta?</p>
                                                    <button onClick={() => setShowLoginPopup(false)} className="mr-2 hover:underline underline-offset-4 transition-all">Cadastre-se</button>
                                                </div>
                                            </div>
                                        </form>
                                    </Form>
                                </motion.div>

                                <motion.div transition={{ duration: 0.3, scale: { type: "spring", bounce: 0.5 } }} className="w-[100%] h-full" initial={passwordAnimationInital} animate={showPasswordRecover ? passwordAnimationTransitional : passwordAnimationInital}>
                                    <Form {...form}>
                                        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full h-full flex flex-col justify-between">
                                            <FormField
                                                control={form.control}
                                                name="email"
                                                render={({ field }) => (
                                                    <FormItem className="mb-8">
                                                        <FormLabel>Email</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="exemplo@email.com" {...field} />
                                                        </FormControl>
                                                        <FormDescription>
                                                            Insira seu email de acesso para recuperação da senha.
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <div>
                                                <Button className="w-full" type="submit">Recuperar</Button>
                                                <div className="mt-8 mb-4 flex flex-row justify-between items-center">
                                                    <p className="ml-2">Lembrou sua senha?</p>
                                                    <button type="button" onClick={switchShowPasswordRecover} className=" hover:text-neutral-950 hover:underline underline-offset-4 transition-all">retornar ao login</button>
                                                </div>
                                            </div>
                                        </form>
                                    </Form>
                                </motion.div>
                            </div>

                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            <header className="w-full px-8 py-4 flex flex-row justify-between items-center bg-neutral-50">
                <Link href="/"><Logo className="w-24" /></Link>
                <div>
                    <Button variant="ghost" className="mx-2" onClick={switchShowLoginPopup}>Entrar</Button>
                    <Link href="/signup"><Button variant="ghost" className="mx-2">Cadastrar-se</Button></Link>
                </div>
            </header>
            <main className="grow flex flex-row w-full h-full justify-between items-center bg-neutral-50 p-16">
                <div className="grow h-full mr-16 flex justify-center items-center">
                    <h1>animate</h1>
                </div>
                <div className="border-2 border-neutral-100 rounded-lg shadow-lg h-full w-4/12 px-8 py-4 flex flex-col justify-start items-center">
                    {/* <Logo className="w-2/5 my-8" />
                    <div className="my-8">
                        <h1>test</h1>
                    </div> */}
                    <h1>Cadastre-se</h1>
                    <Form {...signupForm}>
                        <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="w-full h-full flex flex-col justify-between">
                            <div>
                                <FormField
                                    control={signupForm.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem className="mb-8">
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input placeholder="exemplo@email.com" {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                Este é o seu email de acesso.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={signupForm.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem className="mt-8 mb-2">
                                            <FormLabel>password</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Insira sua senha" type="password" {...field} />
                                            </FormControl>
                                            <FormDescription className="flex flex-row justify-between items-center">
                                                Esta é sua senha de acesso.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div>
                                <Button className="w-full" type="submit">Cadastrar-se</Button>
                                <div className="mt-8 mb-4 flex flex-row justify-between items-center">
                                    <p className="ml-2">Já tem uma conta?</p>
                                    <button onClick={switchShowLoginPopup} className="mr-2 hover:underline underline-offset-4 transition-all">Entrar</button>
                                </div>
                            </div>
                        </form>
                    </Form>
                </div>
            </main>
        </main>
    );
}
