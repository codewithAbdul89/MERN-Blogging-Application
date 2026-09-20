import BlogForm from "../../components/forms/BlogForm";
function CreateBlog() {
  return (
    <div className="bg-backgroxund max-w-7xl text-text-primary sm:mt-10">
      <main>
        <section className="mt-8 mb-4 px-2 md:px-4">
          {/* Main heading */}
          <div className="mb-8 px-2">
            <h1 className="font-heading text-2xl font-bold  text-primary sm:text-3xl">
              Create Blog
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-text-secondary">
              Share your thoughts and ideas with the community.
            </p>
          </div>
          {/* Form */}
          <div>
            <BlogForm />
          </div>
        </section>
      </main>
    </div>
  );
}

export default CreateBlog;
