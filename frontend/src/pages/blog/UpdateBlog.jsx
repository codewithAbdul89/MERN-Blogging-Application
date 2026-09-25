import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";

import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Loader from "../../components/ui/Loader";
import { updateBlogSchema } from "../../features/blog/blogValidation";
import { useCategories } from "../../features/category/categoryQueries";
import RichTextEditor from "../../pages/blog/RichTextEditor";
import { useUpdateBlog } from "../../features/blog/blogMutations";
import { showError } from "../../utils/toast";
import { useBlogForEdit } from "../../features/blog/blogQueries";
import ErrorState from "../../components/ui/ErrorState";

const BlogForm = () => {
  const navigate = useNavigate();
  const { blogId } = useParams();

  // All hooks first
  const { data, isPending, isError } = useBlogForEdit(blogId);

  const blog = data?.data?.blog;

  const { data: categoryData, isPending: isCategoriesPending } = useCategories();

  const { mutateAsync: updateBlog, isPending: isUpdatePending } = useUpdateBlog();

  // UseStates
  const [existingImage, setExistingImage] = useState(blog?.featuredImage?.url ?? "");
  const [removeExistingImage, setRemoveExistingImage] = useState(false);
  const [newImagePreview, setNewImagePreview] = useState("");
  const [tagInput, setTagInput] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, dirtyFields },
  } = useForm({
    resolver: zodResolver(updateBlogSchema),
    defaultValues: {
      title: "",
      content: "",
      category: "",
      tags: [],
      featuredImage: null,
    },
  });

  //  Fill existing blog data

  useEffect(() => {
    if (!blog || isCategoriesPending) return;

    reset({
      title: blog.title ?? "",
      content: blog.content ?? "",
      category: blog.category?._id ?? "",
      tags: blog.tags ?? [],
      featuredImage: null,
    });
    setExistingImage(blog?.featuredImage?.url ?? "");
  }, [blog, isCategoriesPending, reset]);

  const categories = categoryData?.data?.categories ?? [];

  const categoryOptions = categories.map((category) => ({
    value: category._id,
    label: category.name,
  }));

  //  New Featured Image

  const featuredImageFiles = watch("featuredImage");

  const newFeaturedImage = featuredImageFiles?.[0] ?? null;

  useEffect(() => {
    if (!newFeaturedImage) {
      setNewImagePreview("");
      return;
    }

    const objectUrl = URL.createObjectURL(newFeaturedImage);

    setNewImagePreview(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [newFeaturedImage]);

  // If a new image is selected, the old image is being replaced.

  useEffect(() => {
    if (newFeaturedImage) {
      setRemoveExistingImage(false);
    }
  }, [newFeaturedImage]);

  const featuredImageRef = useRef(null);

  const handlePasteImage = (event) => {
    const items = event.clipboardData?.items;

    if (!items) return;

    if (existingImage) return;

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

  //  Remove Image

  const removeImage = () => {
    if (newFeaturedImage) {
      setValue("featuredImage", null, {
        shouldValidate: true,
        shouldDirty: true,
      });

      return;
    }

    //   If this is the existing image, mark it as removed.

    if (existingImage) {
      setExistingImage("");
      setRemoveExistingImage(true);
    }
  };

  //  Tags

  const tags = watch("tags") ?? [];

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
    const updatedTags = tags.filter((tag) => tag !== tagToRemove);

    setValue("tags", updatedTags, {
      shouldValidate: true,
      shouldDirty: true,
    });
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

  // Submit

  const onSubmit = async (formData, status) => {
    const blogData = new FormData();

    //  Only append changed fields

    if (dirtyFields.title) {
      blogData.append("title", formData.title.trim());
    }

    if (dirtyFields.content) {
      blogData.append("content", formData.content.trim());
    }

    if (dirtyFields.category) {
      blogData.append("category", formData.category);
    }

    if (dirtyFields.tags) {
      (formData.tags ?? []).forEach((tag) => {
        blogData.append("tags", tag);
      });
    }

    if (newFeaturedImage) {
      blogData.append("featuredImage", newFeaturedImage);
    }

    if (removeExistingImage && !newFeaturedImage) {
      showError("Please select a new featured image before saving.");

      return;
    }

    if (blog?.status !== status) {
      blogData.append("status", status);
    }

    if ([...blogData.keys()].length === 0) {
      showError("No changes to update.");
      return;
    }

    try {
      console.log("BlogData", blogData);

      await updateBlog({
        blogId,
        blogData,
      });

      navigate(status === "DRAFT" ? "/dashboard/blogs/drafts" : "/dashboard/blogs/published", {
        replace: true,
      });
    } catch (error) {
      console.error("Update blog error:", error);
    }
  };

  //  Save Draft

  const handleDraft = (e) => {
    e.preventDefault();

    handleSubmit((data) => {
      onSubmit(data, "DRAFT");
    })();
  };

  // Publish

  const handlePublish = (e) => {
    e.preventDefault();

    handleSubmit((data) => {
      onSubmit(data, "PUBLISHED");
    })();
  };

  // Loading

  if (isPending || isUpdatePending) {
    return <Loader />;
  }

  if (isError || !blog) {
    return <ErrorState message="Blog not found." />;
  }

  // UI

  return (
    <div className="bg-backgroxund text-text-primary max-w-7xl sm:mt-10">
      <main>
        <section className="mt-8 mb-4 px-2 md:px-8">
          {/* Main heading */}
          <div className="mb-8 px-2">
            <h1 className="font-heading text-primary text-2xl font-bold sm:text-3xl">
              Update Blog
            </h1>

            <p className="text-text-secondary mt-2 max-w-2xl text-sm leading-6">
              Update your thoughts and ideas to keep the community informed.
            </p>
          </div>

          {/* Form */}
          <form className="w-full">
            {/* Title */}
            <div>
              <Input
                id="title"
                label="Title"
                labelClassName="mb-2 block text-sm  font-semibold text-text-primary"
                type="text"
                className="text-wrap"
                placeholder="Write your blog title..."
                {...register("title")}
                error={errors?.title?.message}
              />
            </div>

            {/* Tags */}
            <div className="mt-6">
              <div className="flex items-center justify-between pr-4">
                <label
                  htmlFor="tagInput"
                  className="text-text-primary mb-2 block text-sm font-semibold"
                >
                  Tags
                </label>

                <p
                  className={`${
                    tags.length < 4 ? "block" : "hidden"
                  } text-text-muted text-right text-xs`}
                >
                  {tagInput.length}/20
                </p>
              </div>

              <div className="border-border bg-surface focus-within:border-primary flex min-h-12 w-full flex-nowrap items-center gap-2 overflow-x-auto rounded-lg border px-3 py-2 transition-colors">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-primary/10 text-primary inline-flex shrink-0 items-center gap-1 rounded-full px-3 py-1 text-xs font-medium"
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
                  {tags.length === 4 ? "" : "You can add up to 4 tags. Press Enter to add a tag."}
                </p>
              )}
            </div>

            {/* Main Area */}
            <div className="mt-8 flex flex-col gap-6">
              {/* Right Sidebar */}
              <div className="flex w-full flex-col items-start gap-4 sm:flex-row">
                {/* Featured Image */}
                <div
                  ref={featuredImageRef}
                  tabIndex={0}
                  onClick={() => featuredImageRef.current?.focus()}
                  onPaste={handlePasteImage}
                  className="border-border bg-surface focus-within:border-primary focus-within:ring-primary/20 flex w-full flex-col rounded-2xl border p-4 shadow-sm transition-shadow duration-200 outline-none focus-within:ring-2 sm:flex-1 sm:p-5"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-text-primary text-sm font-semibold">Featured Image</h2>

                      <p className="text-text-muted mt-1 text-xs leading-5">
                        Add an image that represents your blog.
                      </p>
                    </div>

                    {(newImagePreview || existingImage) && (
                      <span className="bg-primary/10 text-primary shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold">
                        Preview
                      </span>
                    )}
                  </div>

                  {/* Image Preview / Upload */}
                  <div className="group border-border bg-background relative mt-4 aspect-[4/3] w-full overflow-hidden rounded-xl border">
                    {newImagePreview || existingImage ? (
                      <>
                        <img
                          src={newImagePreview || existingImage}
                          alt="Featured preview"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />

                        {/* Bottom Gradient */}
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

                        {/* Replace Image Overlay */}
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
                        className="hover:bg-primary/5 flex h-full cursor-pointer flex-col items-center justify-center px-4 text-center transition-colors duration-200"
                      >
                        {/* Upload Icon */}
                        <span className="bg-primary/10 text-primary mb-3 flex h-12 w-12 items-center justify-center rounded-full text-xl transition-transform duration-200 group-hover:scale-110">
                          ↑
                        </span>

                        <span className="text-primary text-sm font-semibold">
                          Upload Featured Image
                        </span>

                        <span className="text-text-muted mt-1 text-xs">JPG, PNG or WebP</span>

                        <span className="bg-background text-text-muted mt-3 rounded-full px-3 py-1 text-[10px]">
                          Click to browse
                        </span>

                        <span className="text-text-muted mt-1 text-[10px]">
                          or press Ctrl + V to paste
                        </span>
                      </label>
                    )}
                  </div>

                  {/* Filename */}
                  {newFeaturedImage && (
                    <div className="bg-background mt-3 flex items-center gap-2 rounded-lg px-3 py-2">
                      <span
                        className="text-text-secondary min-w-0 flex-1 truncate text-xs"
                        title={newFeaturedImage.name}
                      >
                        {newFeaturedImage.name}
                      </span>

                      <span className="text-text-muted shrink-0 text-[10px]">New</span>
                    </div>
                  )}

                  {/* Replace Image */}
                  {(newFeaturedImage || existingImage) && (
                    <label
                      htmlFor="featuredImage"
                      className="text-primary mt-3 block cursor-pointer text-center text-sm font-semibold transition-opacity hover:opacity-70"
                    >
                      Replace Featured Image
                    </label>
                  )}

                  {/* File Input */}
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

                  {/* Category Select */}
                  <div className="mt-4">
                    <Select
                      {...register("category")}
                      options={categoryOptions}
                      placeholder={
                        isCategoriesPending ? "Loading categories..." : "Select category"
                      }
                      disabled={isCategoriesPending}
                    />
                  </div>

                  {errors.category && (
                    <p className="text-danger mt-1.5 text-xs">{errors.category.message}</p>
                  )}

                  {/* Helpful Information */}
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
              <section className="rounded-2xl">
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-text-primary text-sm font-semibold">Content</label>
                </div>

                <div className="shrink-0">
                  <RichTextEditor
                    value={content}
                    onChange={(value) =>
                      setValue("content", value, {
                        shouldValidate: true,
                        shouldDirty: true,
                      })
                    }
                  />
                </div>

                {errors.content && (
                  <p className="text-danger mt-1.5 text-xs">{errors.content.message}</p>
                )}
              </section>
            </div>

            {/* Bottom Actions */}
            <div className="border-border sticky bg-background/90 bottom-0 z-20 mt-8 border-t py-4 backdrop-blur-md">
              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={handleDraft}
                  className="border-border hover:border-primary/50 w-full cursor-pointer rounded-lg border bg-red-400 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all active:scale-[0.98] sm:w-auto"
                >
                  Update & Save as Draft
                </button>

                <button
                  type="button"
                  onClick={handlePublish}
                  className="bg-primary w-full cursor-pointer rounded-lg px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90 active:scale-[0.98] sm:w-auto"
                >
                  Update Blog
                </button>
              </div>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
};

export default BlogForm;
