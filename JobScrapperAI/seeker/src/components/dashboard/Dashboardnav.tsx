const Dashboardnav = () => {
  return (
    <nav className="sticky top-0 z-50 bg-slate-50 p-2  w-screen justify-center">
      <div className=" max-w-7xl flex items-center justify-between mx-auto p-3">
        <div>logo</div>
        <div className="flex gap-10 pr-20 capitalize text-slate-700">
          <div>Freelance</div>
          <div>Jobs</div>
          <div>Cv generator</div>
          <div>user setting</div>
        </div>
      </div>
    </nav>
  );
};

export default Dashboardnav;
