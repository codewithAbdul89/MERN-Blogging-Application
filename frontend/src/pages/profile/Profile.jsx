import BlogContent from "../../components/blog/BlogContent";

function Profile() {
  const content = `<p> <strong>Why Small Projects Make Better Programmers</strong></p><p>Learning programming is a journey that becomes easier when you stop only watching tutorials and start building things yourself. A tutorial can teach you the syntax, but a project teaches you how to think.</p><p>When you build a project, you have to solve real problems. You need to decide how your application should work, how data should move between different parts, and how you should handle unexpected errors. These decisions improve your problem-solving skills.</p><blockquote><p>The best way to learn programming is to build something, break it, understand why it broke, and then fix it.</p></blockquote><p>Small projects are especially useful for beginners. You can start with a simple application and gradually make it more advanced. For example, you can build a notes application, a task manager, a blog, or an expense tracker.</p><p>The important thing is to <strong>finish what you start</strong>. Many developers begin several projects but leave them incomplete when they encounter a difficult problem. Finishing a project teaches you how to deal with those difficult moments.</p><p>There are a few things you should focus on while building a project:</p><ol><li><p>Understand the problem before writing code.</p></li><li><p>Start with a simple version of the application.</p></li><li><p>Test your application regularly.</p></li><li><p>Read error messages carefully.</p></li><li><p>Improve your code after the basic version works.</p></li></ol><p>One of the most valuable skills you develop through projects is debugging. When something goes wrong, don't immediately search for someone else's solution. First, try to understand what your own code is doing.</p><p>You should also remember that <strong>your first version <s>does not need to be perfect</s></strong>. Build it, test it, find problems, and improve it. Good software is usually created through many small improvements rather than one perfect attempt.</p><p>Programming requires patience. Sometimes a problem that looks very simple can take hours to solve. However, every problem you solve gives you more experience and makes the next problem easier.</p><p>In the end, building projects is not just about creating something for your portfolio. It is about becoming comfortable with problems that do not have an obvious answer. <strong>Build small, learn from your mistakes, and keep improving.</strong></p>
  `;

  return (
    <div className="max-w-lg text-c enter">
      <BlogContent content={content} />
    </div>
  );
}

export default Profile;
