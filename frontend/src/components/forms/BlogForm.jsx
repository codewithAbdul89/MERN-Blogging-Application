import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";

import Input from "../ui/Input";
import Select from "../ui/Select";
import Loader from "../../components/ui/Loader";
import { createBlogSchema } from "../../features/blog/blogValidation";
import { useCategories } from "../../features/category/categoryQueries";
import RichTextEditor from "../../pages/blog/RichTextEditor";
import { useCreateBlog } from "../../features/blog/blogMutations";

const BlogForm = () => {
  const { data, isPending: isCategoriesPending } = useCategories();
  const { mutateAsync: createBlog, isPending } = useCreateBlog();

  const categories = data?.data?.categories ?? [];

  const navigate = useNavigate();
  const categoryOptions = categories.map((category) => ({
    value: category._id,
    label: category.name,
  }));

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createBlogSchema),
    shouldFocusError: true,
    defaultValues: {
      title: "",
      content: "",
      category: "",
      tags: [],
    },
  });

  // FeaturedImage

  const featuredImageFiles = watch("featuredImage");
  const featuredImage = featuredImageFiles?.[0] ?? null;

  const featuredImageRef = useRef(null);

  const handlePasteImage = (event) => {
    const items = event.clipboardData?.items;

    if (!items) return;

    const imageItem = Array.from(items).find((item) => item.type.startsWith("image/"));

    if (!imageItem) return;

    event.preventDefault();

    const file = imageItem.getAsFile();

    if (!file) return;

    const extension = file.type.split("/")[1] || "png";

    const pastedFile = new File([file], `pasted-image-${Date.now()}.${extension}`, {
      type: file.type,
    });

    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(pastedFile);

    setValue("featuredImage", dataTransfer.files, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const removeImage = () => {
    setValue("featuredImage", null, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  // Tags

  const tags = watch("tags");

  const [tagInput, setTagInput] = useState("");

  const addTag = () => {
    const newTag = tagInput.trim().replace(/^#/, "");

    if (!newTag) return;
    if (newTag.length < 2) {
      return;
    }

    if (newTag.length > 20) {
      return;
    }

    if (tags.includes(newTag)) {
      setTagInput("");
      return;
    }

    if (tags.length >= 4) {
      return;
    }

    setValue("tags", [...tags, newTag], {
      shouldValidate: true,
      shouldDirty: true,
    });

    setTagInput("");
  };

  const removeTag = (tagToRemove) => {
    setValue(
      "tags",
      tags.filter((tag) => tag !== tagToRemove),
      {
        shouldValidate: true,
        shouldDirty: true,
      }
    );
  };

  const handleTagKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }

    if (e.key === "Backspace" && !tagInput && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };
  // Content
  const content = watch("content");

  const onSubmit = async (formData, status) => {
    const blogData = new FormData();

    blogData.append("title", formData.title);
    blogData.append("content", formData.content);
    blogData.append("category", formData.category);
    blogData.append("status", status);

    formData.tags.forEach((tag) => {
      blogData.append("tags", tag);
    });

    if (featuredImage) {
      blogData.append("featuredImage", featuredImage);
    }

    try {
      await createBlog(blogData);

      navigate(status === "DRAFT" ? "/dashboard/blogs/drafts" : "/dashboard/blogs/published");
    } catch (error) {
      console.error("Create blog error:", error);
    }
  };

  const handleDraft = (e) => {
    e.preventDefault();

    handleSubmit((data) => {
      onSubmit(data, "DRAFT");
    })();
  };

  const handlePublish = (e) => {
    e.preventDefault();

    handleSubmit((data) => onSubmit(data, "PUBLISHED"))();
  };

  if (isPending) {
    return <Loader />;
  }

  return (
    <form className="w-full">
      {/* Title */}
      <div>
        <Input
          id="title"
          label="Title"
          labelClassName="mb-2 block text-sm font-semibold text-text-primary"
          type="text"
          placeholder="Write your blog title..."
          {...register("title")}
          error={errors?.title?.message}
        />
      </div>
      {/* Tags */}
      <div className="mt-6">
        <div className="flex items-center justify-between pr-4">
          <label htmlFor="tagInput" className="text-text-primary mb-2 block text-sm font-semibold">
            Tags
          </label>
          <p
            className={`${tags.length < 4 ? "block" : "hidden"} text-text-muted text-right text-xs`}
          >
            {tagInput.length}/20
          </p>
        </div>

        <div className="border-border focus-within:border-primary bg-surface flex min-h-12 w-full flex-nowrap items-center gap-2 overflow-x-auto rounded-lg border px-3 py-2 transition-colors">
          {tags.map((tag) => (
            <span
              key={tag}
              className="bg-primary/10 text-primary inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium"
            >
              #{tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="text-primary/60 hover:text-danger ml-1 text-lg transition-colors"
                aria-label={`Remove ${tag}`}
              >
                ×
              </button>
            </span>
          ))}

          <input
            id="tagInput"
            type="text"
            maxLength={20}
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
            disabled={tags.length >= 4}
            placeholder={
              tags.length >= 4
                ? "Maximum 4 tags"
                : tags.length
                  ? "Add another tag..."
                  : "Add a tag..."
            }
            className="text-text-primary placeholder:text-text-muted min-w-32 flex-1 bg-transparent py-1 text-sm outline-none disabled:cursor-not-allowed"
          />

          <button
            type="button"
            onClick={addTag}
            disabled={!tagInput.trim() || tags.length >= 4}
            className="text-primary hover:bg-primary/10 shrink-0 rounded-md px-2.5 py-1.5 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40"
          >
            + Add tag
          </button>
        </div>

        {errors.tags ? (
          <p className="text-danger mt-1.5 text-xs">{errors.tags.message}</p>
        ) : (
          <p className="text-text-muted mt-1.5 text-xs">
            {tags.length == 4 ? "" : "You can add up to 4 tags. Press Enter to add a tag."}
          </p>
        )}
      </div>
      {/* Main Area */}
      <div className="mt-8 flex flex-col gap-6">
        <div className="flex w-full flex-col items-start gap-4 sm:flex-row">
          {/* Featured Image */}
          <div
            ref={featuredImageRef}
            tabIndex={0}
            onClick={() => featuredImageRef.current?.focus()}
            onPaste={handlePasteImage}
            className="border-border bg-surface focus-within:border-primary focus-within:ring-primary/20 flex h-fit w-full min-w-0 flex-col overflow-hidden rounded-2xl border p-4 shadow-sm transition-shadow duration-200 outline-none focus-within:ring-2 sm:flex-1 sm:p-5"
          >
            {/* Header */}
            <div className="flex min-w-0 items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="text-text-primary text-sm font-semibold">Featured Image</h2>

                <p className="text-text-muted mt-1 text-xs leading-5">
                  Add an image that represents your blog.
                </p>
              </div>

              {featuredImage && (
                <span className="bg-primary/10 text-primary shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold">
                  Preview
                </span>
              )}
            </div>

            {/* Image Preview / Upload */}
            <div className="group border-border bg-background relative mt-4 h-64 w-full min-w-0 overflow-hidden rounded-xl border sm:h-72">
              {featuredImage ? (
                <>
                  <img
                    src={URL.createObjectURL(featuredImage)}
                    alt="Featured preview"
                    className="block h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Bottom gradient */}
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-black/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  {/* Remove */}
                  <button
                    type="button"
                    onClick={removeImage}
                    className="hover:bg-danger absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-lg text-white shadow-md backdrop-blur-sm transition-all duration-200 hover:scale-105 active:scale-95"
                    aria-label="Remove image"
                  >
                    ×
                  </button>

                  {/* Replace */}
                  <label
                    htmlFor="featuredImage"
                    className="hover:bg-primary absolute bottom-3 left-1/2 -translate-x-1/2 cursor-pointer rounded-full bg-black/70 px-4 py-2 text-xs font-semibold text-white opacity-0 shadow-md backdrop-blur-sm transition-all duration-300 group-hover:opacity-100"
                  >
                    Replace Image
                  </label>
                </>
              ) : (
                <label
                  htmlFor="featuredImage"
                  className="hover:bg-primary/5 flex h-full w-full cursor-pointer flex-col items-center justify-center px-4 text-center transition-colors duration-200"
                >
                  <span className="bg-primary/10 text-primary mb-3 flex h-12 w-12 items-center justify-center rounded-full text-xl transition-transform duration-200 group-hover:scale-110">
                    ↑
                  </span>

                  <span className="text-primary text-sm font-semibold">Upload Featured Image</span>

                  <span className="text-text-muted mt-1 text-xs">JPG, PNG or WebP</span>

                  <span className="bg-surface text-text-muted mt-3 rounded-full px-3 py-1 text-[10px]">
                    Click to browse
                  </span>

                  <span className="text-text-muted mt-1 text-[10px]">
                    or press Ctrl + V to paste
                  </span>
                </label>
              )}
            </div>

            {/* Filename */}
            {featuredImage && (
              <div className="bg-background mt-3 flex min-w-0 items-center gap-2 rounded-lg px-3 py-2">
                <span
                  className="text-text-secondary min-w-0 flex-1 truncate text-xs"
                  title={featuredImage.name}
                >
                  {featuredImage.name}
                </span>

                <span className="text-text-muted shrink-0 text-[10px]">New</span>
              </div>
            )}

            {/* Replace image */}
            {featuredImage && (
              <label
                htmlFor="featuredImage"
                className="text-primary mt-3 block cursor-pointer truncate text-center text-sm font-semibold transition-opacity hover:opacity-70"
              >
                Replace Featured Image
              </label>
            )}

            {/* File input */}
            <input
              id="featuredImage"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              {...register("featuredImage")}
              className="hidden"
            />

            {errors.featuredImage?.message && (
              <p className="text-danger mt-2 text-xs">{errors.featuredImage.message}</p>
            )}
          </div>

          {/* Category */}
          <div className="border-border bg-surface flex w-full flex-col rounded-2xl border p-4 shadow-sm sm:flex-1 sm:p-5">
            {/* Header */}
            <div>
              <h2 className="text-text-primary text-sm font-semibold">Category</h2>

              <p className="text-text-muted mt-1 text-xs leading-5">
                Choose a category for your blog.
              </p>
            </div>

            {/* Select */}
            <div className="mt-4">
              <Select
                {...register("category")}
                options={categoryOptions}
                placeholder={isCategoriesPending ? "Loading categories..." : "Select category"}
                disabled={isCategoriesPending}
              />
            </div>

            {errors.category && (
              <p className="text-danger mt-1.5 text-xs">{errors.category.message}</p>
            )}

            {/* Helpful information */}
            <div className="border-border bg-background mt-5 rounded-xl border p-4">
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 text-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-lg">
                  ✓
                </div>

                <div>
                  <p className="text-text-primary text-xs font-semibold">
                    Choose the right category
                  </p>

                  <p className="text-text-muted mt-1 text-xs leading-5">
                    Select the category that best matches the main topic of your blog.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Content */}
        <section className="my-5 rounded-2xl">
          <div className="m-1 flex items-center justify-between rounded-2xl">
            <label className="text-text-primary text-sm font-semibold">Content</label>
          </div>

          <RichTextEditor
            value={content}
            onChange={(value) =>
              setValue("content", value, {
                shouldValidate: true,
                shouldDirty: true,
              })
            }
          />

          {errors.content && <p className="text-danger mt-1.5 text-xs">{errors.content.message}</p>}
        </section>
      </div>
      {/* Bottom Actions */}
      <div className="border-border bg-background/90 sticky bottom-0 z-20 mt-8 border-t py-4 backdrop-blur-md">
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={handleDraft}
            className="border-border hover:border-primary/50 w-full rounded-lg border bg-red-400 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all active:scale-[0.98] sm:w-auto"
          >
            Save as Draft
          </button>

          <button
            type="button"
            onClick={handlePublish}
            className="bg-primary w-full rounded-lg px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90 active:scale-[0.98] sm:w-auto"
          >
            Publish Blog
          </button>
        </div>
      </div>
    </form>
  );
};

export default BlogForm;
