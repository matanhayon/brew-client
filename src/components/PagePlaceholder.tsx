// components/PagePlaceholder.tsx

const PagePlaceholder = ({ title }: { title: string }) => (
  <div className="text-center text-muted-foreground py-20">
    <h1 className="text-2xl font-semibold mb-2">{title}</h1>
    <p>This page is under construction.</p>
  </div>
);

export default PagePlaceholder;
