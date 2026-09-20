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

    const imageItem = Array.from(items).find((item) =>
      item.type.startsWith("image/"),
    );

    if (!imageItem) return;

    event.preventDefault();

    const file = imageItem.getAsFile();

    if (!file) return;

    const extension = file.type.split("/")[1] || "png";

    const pastedFile = new File(
      [file],
      `pasted-image-${Date.now()}.${extension}`,
      {
        type: file.type,
      },
    );

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
      },
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

      navigate(
        status === "DRAFT"
          ? "/dashboard/blogs/drafts"
          : "/dashboard/blogs/published",
      );
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
      <div className="mt-6 ">
        <div className="flex items-center justify-between pr-4">
          <label
            htmlFor="tagInput"
            className="mb-2 block text-sm font-semibold text-text-primary"
          >
            Tags
          </label>
          <p
            className={`${tags.length < 4 ? "block" : "hidden"} text-right text-xs text-text-muted`}
          >
            {tagInput.length}/20
          </p>
        </div>

        <div
          className="
            flex min-h-12 w-full  items-center gap-2 rounded-lg border border-border px-3 py-2 transition-colors focus-within:border-primary flex-nowrap overflow-x-auto bg-surface 
          "
        >
          {tags.map((tag) => (
            <span
              key={tag}
              className="
                inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
            >
              #{tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="
                  ml-1
                  text-lg
                  text-primary/60
                  transition-colors
                  hover:text-danger
                "
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
            className="
              min-w-32
              flex-1
              bg-transparent
              py-1
              text-sm
              text-text-primary
              outline-none
              placeholder:text-text-muted
              disabled:cursor-not-allowed
            "
          />

          <button
            type="button"
            onClick={addTag}
            disabled={!tagInput.trim() || tags.length >= 4}
            className="
              shrink-0
              rounded-md
              px-2.5 py-1.5
              text-xs font-semibold
              text-primary
              transition-colors
              hover:bg-primary/10
              disabled:cursor-not-allowed
              disabled:opacity-40
            "
          >
            + Add tag
          </button>
        </div>

        {errors.tags ? (
          <p className="mt-1.5 text-xs text-danger">{errors.tags.message}</p>
        ) : (
          <p className="mt-1.5 text-xs text-text-muted">
            {tags.length == 4
              ? ""
              : "You can add up to 4 tags. Press Enter to add a tag."}
          </p>
        )}
      </div>
      {/* Main Area */}
      {/* Main Area */}
      <div
        className="
    mt-8 grid grid-cols-1 gap-6
    lg:grid-cols-[minmax(0,1fr)_280px]
  "
      >
        {/* Content */}
        <section
          className="
      order-3 min-w-0
      lg:order-0 lg:col-start-1
    "
        >
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-semibold text-text-primary">
              Content
            </label>
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

          {errors.content && (
            <p className="mt-1.5 text-xs text-danger">
              {errors.content.message}
            </p>
          )}
        </section>

        {/* Right Sidebar */}
        <aside
          className="
      order-1 flex h-fit flex-col gap-4
      lg:order-0 lg:col-start-2
    "
        >
          {/* Featured Image */}
          <div
            ref={featuredImageRef}
            tabIndex={0}
            onClick={() => featuredImageRef.current?.focus()}
            onPaste={handlePasteImage}
            className="
        rounded-2xl
        border border-border
        bg-surface
        p-4
        shadow-sm
        outline-none
        transition-shadow duration-200
        focus-within:border-primary
        focus-within:ring-2
        focus-within:ring-primary/20
        sm:p-5
      "
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold text-text-primary">
                  Featured Image
                </h2>

                <p className="mt-1 text-xs leading-5 text-text-muted">
                  Add an image that represents your blog.
                </p>
              </div>

              {featuredImage && (
                <span
                  className="
              shrink-0 rounded-full
              bg-primary/10 px-2.5 py-1
              text-[10px] font-semibold
              text-primary
            "
                >
                  Preview
                </span>
              )}
            </div>

            {/* Image Preview / Upload */}
            <div
              className="
          group relative mt-4
          aspect-square w-full
          overflow-hidden rounded-xl
          border border-border
          bg-background
        "
            >
              {featuredImage ? (
                <>
                  <img
                    src={URL.createObjectURL(featuredImage)}
                    alt="Featured preview"
                    className="
                h-full w-full object-cover
                transition-transform duration-500
                group-hover:scale-105
              "
                  />

                  {/* Bottom gradient */}
                  <div
                    className="
                pointer-events-none absolute inset-x-0 bottom-0
                h-20
                bg-linear-to-t from-black/50 to-transparent
                opacity-0
                transition-opacity duration-300
                group-hover:opacity-100
              "
                  />

                  {/* Remove */}
                  <button
                    type="button"
                    onClick={removeImage}
                    className="
                absolute right-2 top-2
                flex h-8 w-8
                items-center justify-center
                rounded-full
                bg-black/70
                text-lg text-white
                shadow-md
                backdrop-blur-sm
                transition-all duration-200
                hover:scale-105
                hover:bg-danger
                active:scale-95
              "
                    aria-label="Remove image"
                  >
                    ×
                  </button>

                  {/* Replace */}
                  <label
                    htmlFor="featuredImage"
                    className="
                absolute bottom-3 left-1/2
                -translate-x-1/2
                cursor-pointer
                rounded-full
                bg-black/70
                px-4 py-2
                text-xs font-semibold
                text-white
                opacity-0
                shadow-md
                backdrop-blur-sm
                transition-all duration-300
                group-hover:opacity-100
                hover:bg-primary
              "
                  >
                    Replace Image
                  </label>
                </>
              ) : (
                <label
                  htmlFor="featuredImage"
                  className="
              flex h-full
              cursor-pointer
              flex-col items-center
              justify-center
              px-4
              text-center
              transition-colors duration-200
              hover:bg-primary/5
            "
                >
                  {/* Upload icon */}
                  <span
                    className="
                mb-3 flex h-12 w-12
                items-center justify-center
                rounded-full
                bg-primary/10
                text-xl text-primary
                transition-transform duration-200
                group-hover:scale-110
              "
                  >
                    ↑
                  </span>

                  <span className="text-sm font-semibold text-primary">
                    Upload Featured Image
                  </span>

                  <span className="mt-1 text-xs text-text-muted">
                    JPG, PNG or WebP
                  </span>

                  <span
                    className="
                mt-3 rounded-full
                bg-surface px-3 py-1
                text-[10px] text-text-muted
              "
                  >
                    Click to browse
                  </span>

                  <span className="mt-1 text-[10px] text-text-muted">
                    or press Ctrl + V to paste
                  </span>
                </label>
              )}
            </div>

            {/* Filename */}
            {featuredImage && (
              <div
                className="
            mt-3 flex items-center gap-2
            rounded-lg bg-background
            px-3 py-2
          "
              >
                <span
                  className="
              min-w-0 flex-1 truncate
              text-xs text-text-secondary
            "
                  title={featuredImage.name}
                >
                  {featuredImage.name}
                </span>

                <span className="shrink-0 text-[10px] text-text-muted">
                  New
                </span>
              </div>
            )}

            {/* Replace image */}
            {featuredImage && (
              <label
                htmlFor="featuredImage"
                className="
            mt-3 block
            cursor-pointer text-center
            text-sm font-semibold
            text-primary
            transition-opacity
            hover:opacity-70
          "
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
              <p className="mt-2 text-xs text-danger">
                {errors.featuredImage.message}
              </p>
            )}
          </div>

          {/* Category */}
          <div
            className="
        h-fit rounded-2xl
        border border-border
        bg-surface
        p-4
        shadow-sm
        sm:p-5
      "
          >
            <h2 className="text-sm font-semibold text-text-primary">
              Category
            </h2>

            <p className="mt-1 text-xs leading-5 text-text-muted">
              Choose a category for your blog.
            </p>

            <div className="mt-4">
              <Select
                {...register("category")}
                options={categoryOptions}
                placeholder={
                  isCategoriesPending
                    ? "Loading categories..."
                    : "Select category"
                }
                disabled={isCategoriesPending}
              />
            </div>

            {errors.category && (
              <p className="mt-1.5 text-xs text-danger">
                {errors.category.message}
              </p>
            )}
          </div>
        </aside>
      </div>
      {/* Bottom Actions */}
      <div className=" bottom-0 z-20 mt-8 border-t border-border bg-background/90 py-4 backdrop-blur-md ">
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={handleDraft}
            className=" w-full rounded-lg border border-border bg-red-400 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:border-primary/50 active:scale-[0.98] sm:w-auto"
          >
            Save as Draft
          </button>

          <button
            type="button"
            onClick={handlePublish}
            className=" w-full rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90 active:scale-[0.98] sm:w-auto"
          >
            Publish Blog
          </button>
        </div>
      </div>
    </form>
  );
};

export default BlogForm;
