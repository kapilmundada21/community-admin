import MiniDrawer from "./MiniDrawer";
export default function Layout({ children }) {
  return (
    <>
      <MiniDrawer>{children}</MiniDrawer>
    </>
  );
}
