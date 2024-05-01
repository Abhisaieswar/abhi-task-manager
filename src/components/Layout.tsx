import Navbar from "./Navbar";

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="max-w-7xl h-screen mx-auto px-4">
      <Navbar />
      <main> {children}</main>
    </div>
  );
}
