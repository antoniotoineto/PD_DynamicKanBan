import AppBar from "@mui/material/AppBar";

const Navbar = () => {
  return (
    <AppBar
      style={{
        background:
          "linear-gradient(90deg, rgba(68,64,129,1) 12%, rgba(107,107,226,1) 90%, rgba(149,149,244,1) 100%)",
        alignItems: "center",
      }}
    >
      <h1>Greedy Weighted KanBan</h1>
    </AppBar>
  );
};

export default Navbar;
