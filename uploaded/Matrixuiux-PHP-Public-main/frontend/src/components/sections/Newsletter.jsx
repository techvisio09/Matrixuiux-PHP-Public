import React, { useState } from "react";
import { useToast } from "../../hooks/use-toast";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const submit = (e) => {
    e.preventDefault();
    if (!email) return;
    toast({ title: "You're in!", description: "Thanks for subscribing. Check your inbox for deals." });
    setEmail("");
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-3xl lg:text-4xl font-bold text-slate-900">Join our list and save up to <span className="text-blue-700">81%</span></h2>
        <p className="mt-3 text-slate-600">Subscribe and receive exclusive weekly deals straight to your inbox!</p>
        <form onSubmit={submit} className="mt-6 max-w-md mx-auto flex gap-2">
          <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required placeholder="Enter your email" className="h-12 rounded-full px-5" />
          <Button type="submit" className="h-12 px-6 rounded-full bg-blue-600 hover:bg-blue-700 font-semibold">Join</Button>
        </form>
      </div>
    </section>
  );
};

export default Newsletter;
