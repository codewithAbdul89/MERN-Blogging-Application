import { Link, useNavigate } from "react-router-dom";
import { MdDeleteSweep, MdPublish } from "react-icons/md";
import { GoPencil } from "react-icons/go";
import { BiSolidArrowToBottom } from "react-icons/bi";
import { HiDotsVertical } from "react-icons/hi";

import Dropdown from "../ui/Dropdown";

import {
  usePublishBlog,
  useUnpublishBlog,
  useDeleteBlog,
  useSendDeleteBlogOtp,
} from "../../features/blog/blogMutations";
import ConfirmDialog from "../ui/ConfirmDialog";
import { useModal } from "../../hooks/useModal";
import Loader from "../ui/Loader";

function BlogMenu({ blog }) {
  const { mutateAsync: publishBlog, isPending: isPublishPending } = usePublishBlog();

  const { mutateAsync: unpublishBlog, isPending: isUnpublishPending } = useUnpublishBlog();

  const { mutateAsync: deleteBlog, isPending: isDeletePending } = useDeleteBlog();

  const { mutateAsync: sendDeleteBlogOtp, isPending: isSendOtpPending } = useSendDeleteBlogOtp();

  const { isOpen, openModal, closeModal } = useModal();

  const navigate = useNavigate();

  const handlePublish = async () => {
    await publishBlog({ blogId: blog._id });
  };

  const handleUnpublish = async () => {
    await unpublishBlog({ blogId: blog._id });
  };

  const handleDelete = async () => {
    if (!blog?.publishedAt && blog?.status === "DRAFT") {
      await deleteBlog({ blogId: blog._id });
      localStorage.removeItem("blogId");
    } else {
      localStorage.setItem("blogId", blog?._id) || "";
      await sendDeleteBlogOtp({ blogId: blog._id });
      navigate("/dashboard/delete-blog", {
        state: {
          flow: "delete-blog",
        },
      });
    }

    closeModal();
  };

  const isPending = isPublishPending || isUnpublishPending || isDeletePending || isSendOtpPending;

  if (isPending) return <Loader />;

  return (
    <>
      <Dropdown
        icon={HiDotsVertical}
        tooltip="Menu"
        className="rounded-full bg-black/80 p-2 text-xl text-white backdrop-blur-sm"
      >
        <div className="border-border bg-surface text-text-primary absolute top-0 right-0 z-10 flex flex-col rounded-lg border p-2 text-sm font-medium">
          {/* Edit */}
          {!blog?.isUpdated && (
            <Link
              to={`/dashboard/blog/edit/${blog._id}`}
              state={{ blog }}
              className="flex w-32 items-center py-1 text-left whitespace-nowrap"
            >
              <span className="w-7 shrink-0">
                <GoPencil />
              </span>

              <span>Edit Blog</span>
            </Link>
          )}

          {/* Publish */}
          {blog.status === "DRAFT" && (
            <button
              type="button"
              disabled={isPending}
              onClick={handlePublish}
              className="flex w-32 items-center py-1 text-left whitespace-nowrap hover:cursor-pointer disabled:opacity-50"
            >
              <span className="w-7 shrink-0">
                <MdPublish />
              </span>

              <span>Publish Blog</span>
            </button>
          )}

          {/* Unpublish */}
          {blog.status === "PUBLISHED" && (
            <button
              type="button"
              disabled={isPending}
              onClick={handleUnpublish}
              className="flex w-32 items-center py-1 text-left whitespace-nowrap hover:cursor-pointer disabled:opacity-50"
            >
              <span className="w-7 shrink-0">
                <BiSolidArrowToBottom />
              </span>

              <span>Unpublish Blog</span>
            </button>
          )}

          {/* Delete */}
          <button
            type="button"
            disabled={isPending}
            onClick={openModal}
            className="text-danger flex w-32 items-center py-1 text-left whitespace-nowrap hover:cursor-pointer disabled:opacity-50"
          >
            <span className="w-7 shrink-0">
              <MdDeleteSweep />
            </span>

            <span>Delete Blog</span>
          </button>
        </div>
      </Dropdown>
      {/* Dialoge */}
      <ConfirmDialog
        isOpen={isOpen}
        onClose={closeModal}
        heading="Delete Blog"
        message="Are you sure you want to delete blog?"
        btnText="Delete"
        usePortal
        isPending={isPending}
        onBtnClick={async () => {
          try {
            handleDelete();
          } catch (error) {
            console.error("Delete Blog error:", error);
          }
        }}
      />
    </>
  );
}

export default BlogMenu;
