import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FiClock, FiMail, FiMapPin, FiMessageCircle, FiSend } from "react-icons/fi";
import { useSelector } from "react-redux";

import Input from "../../components/ui/Input";
import Textarea from "../../components/ui/Textarea";
import Button from "../../components/ui/Button";
import Loader from "../../components/ui/Loader.jsx";


import { contactValidationSchema } from "../../features/contact/contactValidation";
import { useSendContactMessage } from "../../features/contact/contactMutuation.js";

function Contact() {
  const { user } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(contactValidationSchema),
    defaultValues: {
      userName: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const { mutateAsync: sendContactMessage, isPending } = useSendContactMessage();

  useEffect(() => {
    if (user) {
      reset({
        userName: user?.userName || "user",
        email: user?.email || "",
        subject: "",
        message: "",
      });
    }
  }, [user, reset]);

  const onSubmit = async (data) => {
    try {
      await sendContactMessage(data);

      reset({
        userName: user?.userName || "",
        email: user?.email || "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.log("Error in Contact ", error);
    }
  };

  if (isPending) return <Loader />;

  return (
    <div className="bg-background min-h-[calc(100vh-4rem)]">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="bg-primary/10 text-primary mx-auto flex h-12 w-12 items-center justify-center rounded-2xl">
            <FiMessageCircle size={24} />
          </div>

          <h1 className="text-text-primary mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Get in Touch
          </h1>

          <p className="text-text-secondary mt-3 text-sm leading-6 sm:text-base">
            Have a question, suggestion, or just want to say hello? Send us a message and we'll get
            back to you as soon as possible.
          </p>
        </div>

        {/* Main Content */}
        <div className="mt-10 grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
          {/* Contact Information */}
          <section className="border-border bg-surface h-fit overflow-hidden rounded-2xl border shadow-sm">
            <div className="border-border border-b px-5 py-5 sm:px-6">
              <h2 className="text-text-primary text-lg font-semibold">Contact Information</h2>

              <p className="text-text-secondary mt-1 text-sm leading-6">
                We'd love to hear from you. Feel free to reach out with anything related to the
                application.
              </p>
            </div>

            <div className="space-y-6 p-5 sm:p-6">
              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
                  <FiMail size={19} />
                </div>

                <div className="min-w-0">
                  <p className="text-text-primary text-sm font-semibold">Email</p>

                  <p className="text-text-secondary mt-1 text-sm break-all">
                   noreplyabdulsblogspace@gmail.com
                  </p>
                </div>
              </div>

              {/* Response Time */}
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
                  <FiClock size={19} />
                </div>

                <div>
                  <p className="text-text-primary text-sm font-semibold">Response Time</p>

                  <p className="text-text-secondary mt-1 text-sm leading-6">
                    We usually respond within 24–48 hours.
                  </p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
                  <FiMapPin size={19} />
                </div>

                <div>
                  <p className="text-text-primary text-sm font-semibold">Location</p>

                  <p className="text-text-secondary mt-1 text-sm">No location just online services</p>
                </div>
              </div>

              {/* Small Note */}
              <div className="border-primary/10 bg-primary/5 rounded-xl border p-4">
                <p className="text-text-secondary text-sm leading-6">
                  Whether you've found a bug, have an idea, or simply want to share your thoughts,
                  your feedback is always welcome.
                </p>
              </div>
            </div>
          </section>

          {/* Contact Form */}
          <section className="border-border bg-surface overflow-hidden rounded-2xl border shadow-sm">
            <div className="border-border border-b px-5 py-5 sm:px-6">
              <h2 className="text-text-primary text-lg font-semibold">Send Us a Message</h2>

              <p className="text-text-secondary mt-1 text-sm leading-6">
                Fill out the form below and we'll receive your message directly.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-5 sm:p-6">
              <div className="grid gap-5 sm:grid-cols-2">
                {/* Name */}
                <div>
                  <Input
                    id="userName"
                    label="Name"
                    labelClassName="text-text-primary mb-2 block text-sm font-medium"
                    type="text"
                    autoComplete="name"
                    placeholder="Enter your name"
                    {...register("userName")}
                    disabled={isPending}
                    error={errors.userName?.message}
                  />
                </div>

                {/* Email */}
                <div>
                  <Input
                    id="email"
                    labelClassName="text-text-primary mb-2 block text-sm font-medium"
                    label="Email"
                    type="email"
                    autoComplete="email"
                    placeholder="Enter your email"
                    {...register("email")}
                    disabled={isPending}
                    error={errors.email?.message}
                  />
                </div>
              </div>

              {/* Subject */}
              <div className="mt-5">
                <Input
                  id="subject"
                  type="text"
                  label="Subject"
                  labelClassName="text-text-primary mb-2 block text-sm font-medium"
                  placeholder="What would you like to talk about?"
                  {...register("subject")}
                  disabled={isPending}
                  error={errors.subject?.message}
                />
              </div>

              {/* Message */}
              <div className="mt-5">
                <label
                  htmlFor="message"
                  className="text-text-primary mb-2 block text-sm font-medium"
                >
                  Message
                </label>

                <Textarea
                  id="message"
                  rows={7}
                  placeholder="Write your message here..."
                  {...register("message")}
                  disabled={isPending}
                />

                {errors.message?.message && (
                  <p className="text-danger mt-1.5 text-sm">{errors.message.message}</p>
                )}

                <p className="text-text-muted mt-2 text-xs">Maximum 2000 characters.</p>
              </div>

              {/* Submit */}
              <div className="mt-6 flex justify-end">
                <Button
                  type="submit"
                  disabled={isPending}
                  className="bg-primary hover:bg-primary-hover px-7 text-white"
                  text={isPending ? "Sending..." : "Send Message"}
                  icon={<FiSend size={17} />}
                />
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Contact;
